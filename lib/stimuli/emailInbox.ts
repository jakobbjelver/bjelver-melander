import { Question } from "../data/questionnaire";
import { TfIdf, PorterStemmer } from 'natural';

// Define the structure of an email item
interface EmailOriginal {
    id: number;
    sender: string;
    email: string;
    subject: string;
    preview: string;
    timestamp: string;
    date: string;
    read: boolean;
    folder: string;
    priority: "low" | "medium" | "high";
    hasAttachment: boolean;
    attachmentName?: string;
    irrelevant?: boolean;
}

interface EmailProgrammaticSummary {
    executiveText: string;       // Extractive summary
    totalEmails: number;
    unreadCount: number;
    priorityDistribution: {
        low: number;
        medium: number;
        high: number;
    };
    attachments: {
        totalWith: number;
        names: string[];
    };
    folders: Record<string, number>;
    dateRange: { first: string; last: string };
}

export const emailInboxData: EmailOriginal[] = [
    {
        id: 1,
        sender: "Sarah Johnson",
        email: "sarah.j@workteam.com",
        subject: "Project Deadline Extension Request",
        preview: "Hi, Due to the additional requirements from the client, I'm requesting a deadline extension for the Henderson project until...",
        timestamp: "10:24 AM",
        date: "Today",
        read: false,
        folder: "Inbox",
        priority: "high",
        hasAttachment: true,
        attachmentName: "revised_timeline.pdf"
    },
    {
        id: 2,
        sender: "HR Department",
        email: "hr@company.com",
        subject: "Mandatory Training Session Tomorrow",
        preview: "All employees are required to attend the compliance training session tomorrow at 2PM in Conference Room A. Attendance will be...",
        timestamp: "9:15 AM",
        date: "Today",
        read: true,
        folder: "Inbox",
        priority: "medium",
        hasAttachment: false
    },
    {
        id: 3,
        sender: "Michael Chen",
        email: "m.chen@client.org",
        subject: "Contract Review - URGENT",
        preview: "We need your feedback on the revised contract terms by EOD today. Our legal team is waiting for your input before we can proceed...",
        timestamp: "Yesterday",
        date: "Yesterday",
        read: false,
        folder: "Inbox",
        priority: "high",
        hasAttachment: true,
        attachmentName: "revised_contract_v3.docx"
    },
    {
        id: 4,
        sender: "Accounting System",
        email: "no-reply@accounting.company.com",
        subject: "Expense Report Approved",
        preview: "Your expense report #EXP-2023-0429 has been approved. Reimbursement will be processed with your next paycheck...",
        timestamp: "2 days ago",
        date: "Monday",
        read: true,
        folder: "Inbox",
        priority: "low",
        hasAttachment: false
    },
    {
        id: 5,
        sender: "Team Collaboration",
        email: "notifications@teamcollab.com",
        subject: "Document Updates: Q3 Marketing Strategy",
        preview: "Alex Rodriguez has made changes to 'Q3 Marketing Strategy'. Click to view the latest version and add comments...",
        timestamp: "3 days ago",
        date: "Sunday",
        read: false,
        folder: "Inbox",
        priority: "medium",
        hasAttachment: false
    },
    {
        id: 6,
        sender: "Daily News Digest",
        email: "newsletter@dailynews.com",
        subject: "Your Morning News Summary",
        preview: "Top headlines: Tech stocks surge, New climate bill introduced, Sports championship results...",
        timestamp: "6:30 AM",
        date: "Today",
        read: true,
        folder: "Updates",
        priority: "low",
        hasAttachment: false,
        irrelevant: true
    },
    {
        id: 7,
        sender: "Office Supply Store",
        email: "promotions@officesupplies.com",
        subject: "SALE: 25% Off All Office Furniture",
        preview: "Limited time offer! Shop now for incredible savings on desks, chairs, filing cabinets and more...",
        timestamp: "Yesterday",
        date: "Yesterday",
        read: true,
        folder: "Promotions",
        priority: "low",
        hasAttachment: false,
        irrelevant: true
    },
    {
        id: 8,
        sender: "Social Media",
        email: "notifications@socialnetwork.com",
        subject: "You have 5 new notifications",
        preview: "John commented on your post. Lisa tagged you in a photo. View all notifications...",
        timestamp: "2 days ago",
        date: "Monday",
        read: true,
        folder: "Social",
        priority: "low",
        hasAttachment: false,
        irrelevant: true
    },
    {
        id: 9,
        sender: "Travel Booking",
        email: "confirmation@travelsite.com",
        subject: "Your Upcoming Trip Details",
        preview: "Confirmation for your flight to Boston on August 15. Check-in opens 24 hours before departure...",
        timestamp: "3 days ago",
        date: "Sunday",
        read: true,
        folder: "Travel",
        priority: "medium",
        hasAttachment: false,
        irrelevant: true
    },
    {
        id: 10,
        sender: "Password Manager",
        email: "security@passwordapp.com",
        subject: "Security Alert: Password Change Recommended",
        preview: "Our system detected that you've been using the same password for over a year. We recommend updating your credentials...",
        timestamp: "4 days ago",
        date: "Saturday",
        read: true,
        folder: "Updates",
        priority: "low",
        hasAttachment: false,
        irrelevant: true
    }
];

export function summarizeEmails(emails: EmailOriginal[]): EmailProgrammaticSummary {
    // 1. Aggregate text
    const docs = emails
        .filter(e => !e.irrelevant)
        .map(e => [e.subject, e.preview].join('. '));

    // 2. Build TF–IDF model
    const tfidf = new TfIdf();
    docs.forEach(doc => tfidf.addDocument(doc));

    // 3. Split into sentences and score them
    const allSentences = docs
        .flatMap(doc => doc.match(/[^\.!\?]+[\.!\?]+/g) || []);
    const sentenceScores = allSentences.map(sentence => {
        let score = 0;
        tfidf.tfidfs(sentence, (i, measure) => {
            score += measure;
        });
        return { sentence: sentence.trim(), score };
    });

    // 4. Pick top‑N sentences
    const topSentences = sentenceScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(x => x.sentence);

    // 2. Metadata compilation
    const totalEmails = emails.length;
    const unreadCount = emails.filter(e => !e.read).length;
    const priorityDistribution = emails.reduce(
        (acc, e) => {
            acc[e.priority]++;
            return acc;
        },
        { low: 0, medium: 0, high: 0 }
    );
    const attachments = emails.reduce(
        (acc, e) => {
            if (e.hasAttachment && e.attachmentName) {
                acc.totalWith++;
                acc.names.push(e.attachmentName);
            }
            return acc;
        },
        { totalWith: 0, names: [] as string[] }
    );
    const folders = emails.reduce((acc, e) => {
        acc[e.folder] = (acc[e.folder] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const dates = emails.map(e => new Date(e.date));
    const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
    const dateRange = {
        first: sorted[0]?.toDateString() || '',
        last: sorted[sorted.length - 1]?.toDateString() || ''
    };

    return {
        executiveText: topSentences.join(' '),
        totalEmails,
        unreadCount,
        priorityDistribution,
        attachments,
        folders,
        dateRange
    };
}

export const emailInboxAISummarization = {
    overview: "The inbox features urgent client requests, routine operational notices, collaborative document updates, and a large volume of low‑value notifications that may be distracting.",
    themes: [
      { name: "Client Action Items", count: 2, urgency: "high" },
      { name: "Operational Notifications", count: 2, urgency: "medium" },
      { name: "Collaboration Updates", count: 1, urgency: "medium" },
      { name: "Irrelevant/Promotional", count: 5, urgency: "low" }
    ],
    keyInsights: [
      "Two high‑priority client deliverables require same‑day responses to keep projects on track.",
      "Mandatory training and expense approvals support compliance and payroll processes but are lower urgency.",
      "Team document edits need timely review to maintain marketing strategy momentum.",
      "A significant share of notifications is low‑value, increasing inbox clutter and distraction."
    ],
    actionItems: [
      "Respond to the Henderson project extension and contract review requests by EOD.",
      "Confirm attendance for tomorrow’s compliance training session.",
      "Review and comment on the updated Q3 Marketing Strategy document.",
      "Filter out or unsubscribe from promotional and irrelevant notifications."
    ]
  };

export const emailInboxTests: Question[] = [
    {
        id: "email_inbox_accuracy",
        text: "Based on your emails, which task should you prioritize to complete today?",
        type: 'multipleChoice',
        options: [
            "Extend the deadline for the Henderson project",
            "Prepare for the HR training session",
            "Review and provide feedback on the revised contract",
            "Check your approved expense report details",
            "Review the updated Q3 Marketing Strategy document"
        ],
        multipleCorrectAnswers: false,
        // correctAnswerIndex: 2  // The contract review is needed by EOD today
    },
    {
        id: "email_inbox_comprehension",
        text: "Which of the following statements are accurate based on your email inbox?",
        type: 'multipleChoice',
        options: [
            "You have a mandatory training session to attend tomorrow",
            "Sarah Johnson has requested an extension for a project deadline",
            "Your expense report has been rejected and needs revision",
            "You need to provide feedback on a contract by the end of today",
            "You have an upcoming flight to Boston",
            "All your emails have been read"
        ],
        multipleCorrectAnswers: true,
        // correctAnswerIndices: [0, 1, 3]  // Training, extension request, and contract feedback are accurate
    }
];