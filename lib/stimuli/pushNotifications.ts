import { TfIdf } from "natural";
import { Question } from "../data/questionnaire";
import { TestSlug } from "../data/tests";

export type PushNotifications = NotificationItem[] | NotificationSummary | typeof notificationAISummary

interface NotificationItem {
  id: number;
  app: string;               // e.g. "ChatConnect"
  title: string;
  message: string;
  timestamp: string;         // e.g. "10:24 AM"
  priority: 'low' | 'medium' | 'high';
  category: string;          // e.g. "message", "alert", etc.
  unread?: boolean;
  irrelevant?: boolean;
}

interface NotificationSummary {
  executiveText: string;               // top-N extractive sentences
  totalNotifications: number;
  unreadCount: number;
  byPriority: Record<'low' | 'medium' | 'high', number>;
  byCategory: Record<string, number>;
  byApp: Record<string, number>;
  timeRange: { earliest: string; latest: string };
}

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

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeNotifications(
  items: NotificationItem[]
): NotificationSummary {
  // A) Build TF–IDF on title + message
  const docs = items.map((n) => [n.title, n.message].join('. '));
  const tfidf = new TfIdf();
  docs.forEach((d) => tfidf.addDocument(d));

  // Split into sentences & score
  const sentences = docs.flatMap((d) => d.match(/[^\.!\?]+[\.!\?]+/g) || []);
  const scored = sentences.map((s) => {
    let score = 0;
    tfidf.tfidfs(s, (_, w) => (score += w));
    return { sentence: s.trim(), score };
  });
  const executiveText = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.sentence)
    .join(' ');

  // B) Metadata
  const totalNotifications = items.length;
  const unreadCount = items.filter((n) => n.unread).length;

  const byPriority = items.reduce(
    (acc, n) => {
      acc[n.priority]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const byCategory = items.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byApp = items.reduce((acc, n) => {
    acc[n.app] = (acc[n.app] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // C) Time range (assumes same-day or AM/PM formatting)
  const toMinutes = (t: string) => {
    const [hms, period] = t.split(' ');
    let [h, m] = hms.split(':').map(Number);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };
  const mins = items.map((n) => toMinutes(n.timestamp));
  const minM = Math.min(...mins),
    maxM = Math.max(...mins);
  const fmt = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = (m % 60).toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${mm} ${period}`;
  };
  const timeRange = { earliest: fmt(minM), latest: fmt(maxM) };

  return {
    executiveText,
    totalNotifications,
    unreadCount,
    byPriority,
    byCategory,
    byApp,
    timeRange,
  };
}

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const notificationAISummary = {
  overview: "Today's notification feed includes critical meeting and weather alerts, timely personal messages and delivery updates, a low‐priority birthday prompt, and several non‐essential system/entertainment alerts contributing to noise.",
  categories: [
    {
      category: "Immediate Alerts & Reminders",
      count: 2,
      items: [
        { id: 2, app: "Calendar", title: "Team Weekly Sync", priority: "high" },
        { id: 4, app: "WeatherAlert", title: "Flash flood warning", priority: "high" }
      ]
    },
    {
      category: "Personal Messages & Updates",
      count: 2,
      items: [
        { id: 1, app: "ChatConnect", title: "New message from Sarah", priority: "medium" },
        { id: 3, app: "FoodDelivery", title: "Order delivered", priority: "medium" }
      ]
    },
    {
      category: "Low‑Priority Social",
      count: 1,
      items: [
        { id: 5, app: "SocialConnect", title: "Birthday Reminder", priority: "low" }
      ]
    },
    {
      category: "Non‑Essential/Noise",
      count: 5
    }
  ],
  priorityBreakdown: { high: 2, medium: 2, low: 1, irrelevant: 5 },
  keyInsights: [
    "High‑priority items demand immediate action: upcoming sync meeting and local flood warning.",
    "Personal notifications require moderate attention but can wait momentarily.",
    "Social reminders add context but low urgency.",
    "Half of the feed is non‑essential noise, diluting focus."
  ],
  actionItems: [
    "Join the 11:45 AM team sync in Conference Room B.",
    "Heed the flash flood warning until 8 PM.",
    "Confirm with Sarah about tomorrow’s 2 PM meeting.",
    "Acknowledge delivery arrival if needed.",
    "Send birthday wishes to Alex tomorrow.",
    "Mute or filter non‑essential notifications to reduce clutter."
  ]
};

export const pushNotificationsTests: Question[] = [
  {
    id: `${TestSlug.PUSH_NOTIFICATIONS}_accuracy`, // Original ID kept
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
    id: `${TestSlug.PUSH_NOTIFICATIONS}_comprehension`, // Original ID kept
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