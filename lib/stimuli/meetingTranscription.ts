import { TfIdf } from "natural";

export type MeetingTranscript = TranscriptItem[] | TranscriptSummary | typeof meetingAISummary


interface TranscriptItem {
    id: number;
    time: string;         // e.g. "00:00:23"
    speaker: string;      // e.g. "Marcus Chen (Project Manager)"
    content: string;
    irrelevant?: boolean;
}

interface TranscriptSummary {
    executiveText: string;               // top‑N extracted sentences
    totalTurns: number;                  // count of items
    uniqueSpeakers: number;              // distinct speaker count
    speakerDistribution: Record<string, number>;
    timeRange: { start: string; end: string };
}

export const meetingTranscriptData: TranscriptItem[] = [
    {
        id: 1,
        time: "00:00:23",
        speaker: "Marcus Chen (Project Manager)",
        content: "Good morning everyone, let's get started with our weekly product development meeting. Today we need to finalize the feature list for the Q3 release, address the performance issues reported by beta testers, and determine if we're still on track for our July 30th release date."
    },
    {
        id: 2,
        time: "00:01:15",
        speaker: "Emma Rodriguez (Lead Developer)",
        content: "I've completed the analysis of the performance issues. There are three primary bottlenecks: database query optimization, image processing in the mobile app, and third-party API integration delays. My team can address the database and image processing issues this sprint, but the API integration will require coordination with the external vendor.",
        irrelevant: true // Specific technical details not needed for summary/tests
    },
    {
        id: 3,
        time: "00:03:42",
        speaker: "Alex Kim (UX Designer)",
        content: "Regarding the feature list, user testing strongly indicates we should prioritize the redesigned dashboard and notification system. The collaborative editing feature is getting mixed feedback - users like the concept but found our current implementation confusing. I recommend we simplify it significantly or postpone to Q4."
    },
    {
        id: 4,
        time: "00:06:58",
        speaker: "Priya Patel (Product Owner)",
        content: "I agree with Alex on postponing the collaborative editing feature. If we try to rush it for Q3, we risk negative user reception. Let's focus on perfecting the dashboard redesign, fixing the performance issues Emma mentioned, and adding the enhanced notification system. These improvements alone should increase our user satisfaction metrics significantly."
    },
    {
        id: 5,
        time: "00:09:27",
        speaker: "Marcus Chen (Project Manager)",
        content: "So the consensus is to postpone collaborative editing to Q4. Emma, how will addressing those performance issues impact our timeline? Can we still hit the July 30th release with these changes?"
    },
    {
        id: 6,
        time: "00:11:03",
        speaker: "Sarah Johnson (Marketing)",
        content: "Before we continue, I just want to remind everyone that the air conditioning will be under maintenance tomorrow, so you might want to dress accordingly or consider working from home. The facilities team said it should be fixed by Thursday.",
        irrelevant: true // Off-topic announcement
    },
    {
        id: 7,
        time: "00:12:18",
        speaker: "David Wilson (QA Lead)",
        content: "Sorry, my connection dropped for a minute there. Can someone please repeat the last point? My internet has been unstable all morning.",
        irrelevant: true // Interruption/technical issue noise
    },
    {
        id: 8,
        time: "00:13:05",
        speaker: "Marcus Chen (Project Manager)",
        content: "No problem, David. We were discussing postponing the collaborative editing feature to Q4 and focusing on performance issues, dashboard redesign, and the notification system for Q3. Did everyone get the calendar invite for next week's meeting? I've moved it to Tuesday instead of Monday due to the holiday.",
        irrelevant: true // Repeating previous info and administrative detail (calendar invite)
    },
    {
        id: 9,
        time: "00:14:30",
        speaker: "Emma Rodriguez (Lead Developer)",
        content: "To answer your earlier question, Marcus - if we focus only on these priorities, my team can resolve the performance issues within two weeks. We would still need another week for thorough QA, but a July 30th release is feasible. However, this assumes we get a response from the third-party API vendor within the next three days.",
        irrelevant: true // Specific timeline details and dependencies not needed for summary/tests
    },
    {
        id: 10,
        time: "00:17:42",
        speaker: "Marcus Chen (Project Manager)",
        content: "Great. So our action items are: Emma will address the performance bottlenecks and contact the API vendor, Alex will finalize the dashboard redesign, Priya will update the Q3 roadmap to reflect these changes, and David's team will prepare for extended QA on these features. Let's reconvene next Tuesday to check progress. Does anyone have any questions before we wrap up?"
    }
];

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const meetingAISummary = {
    overview: "During the weekly product development meeting, the team confirmed Q3 priorities—dashboard redesign and enhanced notifications—postponed the collaborative editing feature to Q4, and committed to resolving performance bottlenecks to stay on track for a July 30 release.",
    themes: [
        {
            category: "Feature Prioritization",
            focus: ["Dashboard redesign", "Notification system", "Deferring collaborative editing to Q4"]
        },
        {
            category: "Performance Optimization",
            focus: ["Database query tuning", "Mobile image processing improvements"]
        },
        {
            category: "Release Planning",
            focus: ["Assessing impact on July 30 timeline", "Dependency on API vendor response"]
        }
    ],
    keyInsights: [
        "User feedback strongly favors dashboard and notification enhancements over rushed collaboration features.",
        "Postponing complex features reduces risk of negative reception.",
        "Core performance fixes are achievable within two weeks plus one week of QA."
    ],
    actionItems: [
        { owner: "Emma Rodriguez", task: "Resolve performance bottlenecks and liaise with external API vendor" },
        { owner: "Alex Kim", task: "Complete and hand off dashboard redesign" },
        { owner: "Priya Patel", task: "Revise Q3 roadmap to reflect updated priorities" },
        { owner: "David Wilson", task: "Prepare extended QA plan for new features" }
    ],
    nextMeeting: {
        date: "Next Tuesday",
        goal: "Review progress on performance fixes, dashboard redesign, and notification rollout"
    }
};

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeTranscripts(
    items: TranscriptItem[]
): TranscriptSummary {
    // -- Build TF–IDF on all content
    const docs = items.map((t) => t.content);
    const tfidf = new TfIdf();
    docs.forEach((d) => tfidf.addDocument(d));

    // -- Split each doc into sentences and score
    const sentences = docs.flatMap((doc) =>
        doc.match(/[^\.!\?]+[\.!\?]+/g) || []
    );
    const scored = sentences.map((s) => {
        let score = 0;
        tfidf.tfidfs(s, (_, m) => (score += m));
        return { sentence: s.trim(), score };
    });

    // -- Top 3 for executiveText
    const executiveText = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.sentence)
        .join(" ");

    // -- Metadata
    const totalTurns = items.length;
    const speakerDistribution = items.reduce((acc, t) => {
        acc[t.speaker] = (acc[t.speaker] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const uniqueSpeakers = Object.keys(speakerDistribution).length;

    // -- Time range
    const times = items.map((t) => {
        const [h, m, s] = t.time.split(":").map(Number);
        return h * 3600 + m * 60 + s;
    });
    const minSec = Math.min(...times);
    const maxSec = Math.max(...times);
    const fmt = (sec: number) => {
        const h = Math.floor(sec / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((sec % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = Math.floor(sec % 60)
            .toString()
            .padStart(2, "0");
        return `${h}:${m}:${s}`;
    };
    const timeRange = { start: fmt(minSec), end: fmt(maxSec) };

    return {
        executiveText,
        totalTurns,
        uniqueSpeakers,
        speakerDistribution,
        timeRange,
    };
}

export const meetingTranscriptTests = [
    {
        id: "meeting_transcript_accuracy",
        text: "Based *only* on the relevant parts of this meeting transcript, what action was decided regarding the collaborative editing feature?",
        type: 'multipleChoice',
        options: [
            "Prioritize it for the Q3 release",
            "Simplify its implementation for Q3",
            "Start more user testing on it",
            "Postpone it to the Q4 release",
            "Redesign it completely based on user feedback"
        ],
        multipleCorrectAnswers: false,
        // correctAnswerIndex: 3  // Postpone to Q4 was the consensus decision mentioned multiple times in relevant sections (IDs 3, 4, 5, 10).
    },
    {
        id: "meeting_transcript_comprehension",
        text: "Which of the following statements are accurate based *only* on the relevant parts of the meeting transcript?",
        type: 'multipleChoice',
        options: [
            "The team agreed to postpone the collaborative editing feature.", // Accurate (IDs 4, 5, 10)
            "The redesigned dashboard is a planned feature for the upcoming release.", // Accurate (IDs 3, 4, 10)
            "Performance issues were discussed as a key topic for the meeting.", // Accurate (IDs 1, 4, 5, 10)
            "User testing provided feedback on potential feature improvements.", // Accurate (ID 3)
            "A target release date of July 30th was mentioned.", // Accurate (IDs 1, 5)
            "The project manager confirmed the July 30th release date is definite." // Inaccurate - only mentioned as a target date, not confirmed as definite in relevant sections (ID 1, 5)
        ],
        multipleCorrectAnswers: true,
        // correctAnswerIndices: [0, 1, 2, 3, 4]
    }
];