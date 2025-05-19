import { EmailAISummary, EmailItem, EmailProgrammaticSummary } from "@/types/stimuli";
import { Question } from "../data/questionnaire";
import { TfIdf, WordTokenizer, SentenceTokenizer } from 'natural';
import { ContentLengths } from "@/types/test";
import { filterStimuliByLength } from "../utils";

export const emailInboxContextText = 'This content is supposed to resemble an email inbox (e.g. Gmail, Outlook).'

const emailInboxData: EmailItem[] = [
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

export const emailInboxDataShorter: EmailItem[] = filterStimuliByLength(emailInboxData, ContentLengths.Shorter) as EmailItem[]
export const emailInboxDataLonger: EmailItem[] = filterStimuliByLength(emailInboxData, ContentLengths.Longer) as EmailItem[]

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeEmails(items: EmailItem[]): EmailProgrammaticSummary {
    const totalItems = items.length;

    // 2. Compute simple stats
    const unread = items.filter(e => !e.read);
    const highPriority = items.filter(e => e.priority === 'high');
    const withAttachment = items.filter(e => e.hasAttachment);

    // 3. Count by folder
    const folderCounts: Record<string, number> = {};
    items.forEach(e => {
        folderCounts[e.folder] = (folderCounts[e.folder] || 0) + 1;
    });

    // 4. Build TF–IDF on subject + preview
    const docs = items.map(e => `${e.subject}. ${e.preview}`);
    const tfidf = new TfIdf();
    docs.forEach(d => tfidf.addDocument(d));
    const wtok = new WordTokenizer();
    const stok = new SentenceTokenizer([]);

    type Scored = { sentence: string; score: number; itemId: number };
    const allSentences: Scored[] = [];
    docs.forEach((doc, idx) => {
        stok.tokenize(doc).forEach(sentence => {
            const tokens = wtok.tokenize(sentence.toLowerCase());
            const score = tokens.reduce((sum, t) => sum + tfidf.tfidf(t, idx), 0);
            allSentences.push({ sentence, score, itemId: items[idx].id });
        });
    });

    // 5. Pick top-3 extractive sentences
    const extractive = allSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    // 6. Identify next items to review
    const nextToReview = unread
        .slice(0, 2)
        .map(e => `"${e.subject}" from ${e.sender}`);

    // 7. Compose an abstractive-style summary
    const parts: string[] = [];
    parts.push(
        `You have ${unread.length} unread email${unread.length !== 1 ? 's' : ''} across ${Object.keys(folderCounts).length} folders.`
    );
    if (highPriority.length > 0) {
        parts.push(
            `High-priority messages from ${highPriority
                .map(e => e.sender)
                .join(', ')} need your attention.`
        );
    }
    if (withAttachment.length > 0) {
        parts.push(`There ${withAttachment.length === 1 ? 'is' : 'are'} ${withAttachment.length} attachment${withAttachment.length !== 1 ? 's' : ''} to review.`);
    }
    if (nextToReview.length) {
        parts.push(`Next to review: ${nextToReview.join(' and ')}.`);
    }

    return {
        summary: parts.join(' '),
        extractive,
        meta: {
            totalItems,
            unreadCount: unread.length,
            highPriorityCount: highPriority.length,
            attachmentCount: withAttachment.length,
            folderCounts,
        },
    };
}

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const emailInboxAISummarization: EmailAISummary = {
    overview: "You have several high‑priority items awaiting your attention, a few informational notices, and a handful of non–work‑related messages.",
    pendingRequests: {
        count: 3,
        items: [
            {
                subject: "Project Deadline Extension Request",
                sender: "Sarah Johnson",
                deadline: "End of today"
            },
            {
                subject: "Contract Review - URGENT",
                sender: "Michael Chen",
                deadline: "End of today"
            },
            {
                subject: "Document Updates: Q3 Marketing Strategy",
                sender: "Team Collaboration"
            }
        ]
    },
    upcomingCommitments: {
        trainingSession: true,
        tripConfirmation: true
    },
    statusUpdates: [
        "Expense report #EXP-2023-0429 approved; reimbursement pending.",
    ],
    irrelevantCount: 4
};

export const emailAISummaryLonger: EmailAISummary = {
    overview: "**2 urgent action items** await your attention, alongside scheduled commitments and a variety of status updates.",
    pendingRequests: {
        count: 2,
        items: [
            {
                subject: "Project Deadline Extension Request",
                sender: "Sarah Johnson"
            },
            {
                subject: "Contract Review – URGENT",
                sender: "Michael Chen",
                deadline: "EOD today"
            }
        ]
    },
    upcomingCommitments: {
        trainingSession: true,
        tripConfirmation: true
    },
    statusUpdates: [
        "Expense report #EXP-2023-0429 approved; reimbursement will arrive with your next paycheck.",
        "Q3 Marketing Strategy document updated by Alex Rodriguez.",
        "Morning news digest delivered with today’s top headlines.",
        "Security alert: please update your password after one year of use."
    ],
    irrelevantCount: 2
}

export const emailAISummaryShorter: EmailAISummary = {
    overview: "**2 high-priority requests** for a project deadline extension and urgent contract review. A **mandatory training session** is scheduled for tomorrow. You also have notifications about an approved expense report and updates to the Q3 marketing strategy document.",
    pendingRequests: {
        count: 2,
        items: [
            {
                subject: "Project Deadline Extension Request",
                sender: "Sarah Johnson"
            },
            {
                subject: "Contract Review - URGENT",
                sender: "Michael Chen",
                deadline: "EOD today"
            }
        ]
    },
    upcomingCommitments: {
        trainingSession: true,
        tripConfirmation: false
    },
    statusUpdates: [
        "Expense report #EXP-2023-0429 has been approved for reimbursement.",
        "Q3 Marketing Strategy document has been updated with new edits."
    ],
    irrelevantCount: 1
}

export const emailInboxTests: Question[] = [
    {
        id: "email-inbox_accuracy",
        text: "Looking at these messages, what action should be the most prioritized?",
        type: "multipleChoice",
        options: [
            "Review and give feedback on the legal team's contract", // Correct because data shows some messages require a response by specific dates
            "Approve or decline the deadline extension request", // Incorrect because it ignores pending action items
            "Send the expense report to your colleague", // Incorrect because it’s unrelated to current tasks (made up)
            "Allocate time for the mandatory compliance training session", // Incorrect because not indicated in the data
            "None of the above", // Incorrect
            "I don't know" // Incorrect
        ],
        multipleCorrectAnswers: false
    },
    {
        id: "email-inbox_comprehension",
        text: "Which of the following statements are accurate based on your email inbox?",
        type: 'multipleChoice',
        options: [
            "You have a mandatory training session to attend tomorrow", // Correct
            "Sarah Johnson has requested an extension for a project deadline", // Correct
            "Your expense report has been rejected and needs revision", // Incorrect
            "You need to provide feedback on a contract by the end of today", // Correct
            "You have an upcoming flight to Boston", // Incorrect
            "All your emails have been read", // Incorrect
            "None of the above", // Incorrect
            "I don't know" // Incorrect
        ],
        multipleCorrectAnswers: true,
    }
];