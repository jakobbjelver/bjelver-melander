import 'server-only' // Add this at the very top

import { SentenceTokenizer, TfIdf, WordTokenizer } from "natural";
import { Question } from "../data/questionnaire";
import { NotificationAISummary, NotificationItem, NotificationProgrammaticSummary } from "@/types/stimuli";

export const pushNotificationsData: NotificationItem[] = [
  {
    id: 1,
    app: "ChatConnect",
    title: "New message from Sarah",
    message: "Are we still meeting tomorrow at 2pm?",
    timestamp: "10:24 AM",
    priority: "medium",
    category: "message",
    unread: true
  },
  {
    id: 2,
    app: "Calendar",
    title: "Meeting Reminder",
    message: "Team Weekly Sync in 15 minutes (Conference Room B)",
    timestamp: "11:45 AM",
    priority: "high",
    category: "reminder",
    unread: true
  },
  {
    id: 3,
    app: "FoodDelivery",
    title: "Your order has arrived",
    message: "Your order #4592 has been delivered to your door",
    timestamp: "12:30 PM",
    priority: "medium",
    category: "delivery",
    unread: false
  },
  {
    id: 4,
    app: "WeatherAlert",
    title: "Severe Weather Warning",
    message: "Flash flood warning in your area until 8PM tonight",
    timestamp: "2:15 PM",
    priority: "high",
    category: "alert",
    unread: true
  },
  {
    id: 5,
    app: "SocialConnect",
    title: "Birthday Reminder",
    message: "Alex's birthday is tomorrow! Don't forget to send wishes.",
    timestamp: "3:00 PM",
    priority: "low",
    category: "social",
    unread: true
  },
  {
    id: 6,
    app: "SystemUpdate",
    title: "Update Available",
    message: "System update v12.3 is available to install",
    timestamp: "9:17 AM",
    priority: "low",
    category: "system",
    irrelevant: true
  },
  {
    id: 7,
    app: "MusicStream",
    title: "New Playlist Suggestion",
    message: "We've created a new mix based on your listening history",
    timestamp: "1:45 PM",
    priority: "low",
    category: "entertainment",
    irrelevant: true
  },
  {
    id: 8,
    app: "BatteryMonitor",
    title: "Battery Low",
    message: "Your device is at 15% battery. Connect to power soon.",
    timestamp: "4:30 PM",
    priority: "medium",
    category: "system",
    irrelevant: true
  },
  {
    id: 9,
    app: "NewsApp",
    title: "Breaking News",
    message: "Stock market reaches all-time high amid economic recovery",
    timestamp: "10:05 AM",
    priority: "medium",
    category: "news",
    irrelevant: true
  },
  {
    id: 10,
    app: "FitnessTracker",
    title: "Activity Goal",
    message: "You're only 500 steps away from your daily goal!",
    timestamp: "5:45 PM",
    priority: "low",
    category: "health",
    irrelevant: true
  }
];

export const notificationProgrammaticSummary = summarizeNotifications(pushNotificationsData)

// Dynamically generated (programmatic) summary based on text extraction
function summarizeNotifications(items: NotificationItem[]): NotificationProgrammaticSummary {
  // Filter out irrelevant notifications
  const relevant = items.filter(item => !item.irrelevant);
  const unread = relevant.filter(item => item.unread);
  const high = relevant.filter(item => item.priority === 'high');

  // Count by category
  const categories: Record<string, number> = {};
  relevant.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
  });

  // Prepare documents for TF-IDF
  const docs = relevant.map(item => `${item.title}. ${item.message}.`);
  const tfidf = new TfIdf();
  docs.forEach(doc => tfidf.addDocument(doc));

  const wordTokenizer = new WordTokenizer();
  const sentenceTokenizer = new SentenceTokenizer([]);

  type ScoredSentence = { sentence: string; score: number; itemId: number };
  const scoredSentences: ScoredSentence[] = [];

  // Score each sentence
  docs.forEach((doc, idx) => {
    const sentences = sentenceTokenizer.tokenize(doc);
    sentences.forEach(sentence => {
      const tokens = wordTokenizer.tokenize(sentence.toLowerCase());
      const score = tokens.reduce((sum, term) => sum + tfidf.tfidf(term, idx), 0);
      scoredSentences.push({ sentence, score, itemId: relevant[idx].id });
    });
  });

  // Top 3 extractive sentences
  const extractive = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Helper to parse "HH:MM AM/PM" into minutes
  const parseTimestamp = (ts: string): number => {
    const [time, mod] = ts.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (mod === 'PM' && h < 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  // Sort by priority then timestamp
  const sortedRelevant = [...relevant].sort((a, b) => {
    const pMap = { high: 2, medium: 1, low: 0 };
    if (pMap[b.priority] !== pMap[a.priority]) {
      return pMap[b.priority] - pMap[a.priority];
    }
    return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
  });

  const nextItems = sortedRelevant
    .slice(0, 2)
    .map(item => `${item.title} at ${item.timestamp}`);

  // Construct an abstractive-style summary
  const parts: string[] = [];
  parts.push(`You have ${unread.length} unread notification${unread.length !== 1 ? 's' : ''} across ${Object.keys(categories).length} categories.`);
  if (high.length) {
    parts.push(`High-priority alerts: ${high.map(i => `"${i.title}"`).join(', ')}.`);
  }
  if (nextItems.length) {
    parts.push(`Up next: ${nextItems.join(', ')}.`);
  }

  return {
    summary: parts.join(' '),
    extractive,
    meta: {
      totalItems: items.length,
      relevantItems: relevant.length,
      unreadCount: unread.length,
      highPriorityCount: high.length,
      categories
    }
  };
}

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const notificationAISummary: NotificationAISummary = {
  totalItems: 10,
  unreadCount: 5,
  highPriorityCount: 2,
  relevantItems: 5,
  categoryBreakdown: {
    message: 1,
    reminder: 1,
    delivery: 1,
    alert: 1,
    social: 1,
    system: 2,
    entertainment: 1,
    news: 1,
    health: 1
  },
  keyHighlights: {
    upcomingEvents: [
      { app: "Calendar", note: "Team Weekly Sync in 15 min" },
      { app: "SocialConnect", note: "Alex’s birthday tomorrow" }
    ],
    urgentAlerts: [
      { app: "WeatherAlert", note: "Flash flood warning until 8 PM" }
    ],
    pendingMessages: [
      { app: "ChatConnect", note: "New message from Sarah" }
    ]
  },
  summaryText: "You have 10 notifications (5 unread), including 2 high‑priority alerts and reminders. Immediate attention needed for a flood warning, an upcoming team sync, and a message from Sarah. Other updates cover deliveries, birthdays, and system notices."
};

export const pushNotificationsTests: Question[] = [
  {
    id: `push-notifications_accuracy`, // Original ID kept
    text: "Based on your notifications, what requires your immediate attention and response?",
    type: 'multipleChoice',
    options: [
      "Respond to Sarah about tomorrow's meeting time",
      "Prepare for the team meeting happening in 15 minutes",
      "Check that your food delivery arrived correctly",
      "Prepare for potential flooding in your area",
      "Buy a birthday gift for Alex"
    ],
    multipleCorrectAnswers: false,
    // correctAnswerIndex: 1  // The team meeting is highest priority and most imminent
  },
  {
    id: `push-notifications_comprehension`, // Original ID kept
    text: "Which of the following statements are accurate based on your notifications?",
    type: 'multipleChoice',
    options: [
      "You have an upcoming meeting with a team member named Sarah",
      "There is a severe weather alert active in your area",
      "Your food order has been delivered",
      "You have a friend with an upcoming birthday",
      "Your phone battery is critically low",
      "You have a system update that needs to be installed"
    ],
    multipleCorrectAnswers: true,
    // correctAnswerIndices: [1, 2, 3]  // Weather alert, food delivery, and birthday are accurate
  },
];