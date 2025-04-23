import { TranscriptAISummary, TranscriptItem, TranscriptProgrammaticSummary } from "@/types/stimuli";
import { SentenceTokenizer, TfIdf, WordTokenizer } from "natural";
import { Question } from "../data/questionnaire";
import { ContentLengths } from "@/types/test";
import { filterStimuliByLength } from "../utils";

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

export const meetingTranscriptDataShorter: TranscriptItem[] = filterStimuliByLength(meetingTranscriptData, ContentLengths.Shorter) as TranscriptItem[]
export const meetingTranscriptDataLonger: TranscriptItem[] = filterStimuliByLength(meetingTranscriptData, ContentLengths.Longer) as TranscriptItem[]

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const meetingAISummaryLonger: TranscriptAISummary = {
    topic: "Weekly Product Development Meeting: Q3 Release Planning & Performance Review",
    goals: [
        "Finalize the feature list for the Q3 release.",
        "Address performance issues reported by beta testers.",
        "Assess impact on the July 30th release date."
    ],
    decisions: [
        "Postpone the collaborative editing feature to Q4.",
        "Prioritize the redesigned dashboard, enhanced notification system, and performance fixes for the Q3 release."
    ],
    priorities: [
        "Redesigned Dashboard",
        "Enhanced Notification System",
        "Performance Issues (Database Queries, Image Processing, Third-Party API)"
    ],
    actionItems: [
        {
            owner: "Emma Rodriguez",
            task: "Address performance bottlenecks and contact the third-party API vendor."
        },
        {
            owner: "Alex Kim",
            task: "Finalize the dashboard redesign."
        },
        {
            owner: "Priya Patel",
            task: "Update the Q3 roadmap to reflect the revised priorities."
        },
        {
            owner: "David Wilson",
            task: "Prepare for extended QA testing on the prioritized features."
        }
    ],
    targetRelease: "July 30th",
    nextMeeting: "Next Tuesday"
};

export const meetingAISummaryShorter: TranscriptAISummary = {
    topic: "Weekly Product Development Meeting",
    goals: [
        "Finalize feature list for the Q3 release",
        "Address performance issues reported by beta testers",
        "Determine if still on track for July 30th release date"
    ],
    decisions: [
        "Postpone collaborative editing feature to Q4 due to mixed user feedback and implementation complexity.",
        "Prioritize the redesigned dashboard and enhanced notification system for the Q3 release.",
        "Focus on fixing reported performance issues as part of the Q3 scope."
    ],
    priorities: [
        "Redesigned dashboard",
        "Enhanced notification system",
        "Performance issue resolution"
    ],
    actionItems: [
        {
            owner: "Emma",
            task: "Address performance bottlenecks and contact the API vendor."
        },
        {
            owner: "Alex Kim",
            task: "Finalize the dashboard redesign."
        },
        {
            owner: "Priya Patel",
            task: "Update the Q3 roadmap to reflect the changes."
        },
        {
            owner: "David's team",
            task: "Prepare for extended QA on the prioritized Q3 features."
        }
    ],
    targetRelease: "July 30th",
    nextMeeting: "Next Tuesday"
};

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeTranscripts(
    items: TranscriptItem[]
): TranscriptProgrammaticSummary {
    // 1. Filter out irrelevant utterances - NOPE
    const relevant = items;
    const totalItems = items.length;
    const relevantItems = relevant.length;

    // 2. Count utterances per speaker
    const speakerCounts: Record<string, number> = {};
    relevant.forEach(i => {
        speakerCounts[i.speaker] = (speakerCounts[i.speaker] || 0) + 1;
    });

    // 3. Determine earliest and latest timestamps
    const parseTime = (ts: string) => {
        const [h, m, s] = ts.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    };
    const sortedByTime = [...relevant].sort(
        (a, b) => parseTime(a.time) - parseTime(b.time)
    );
    const earliestTime = sortedByTime[0]?.time || '';
    const latestTime = sortedByTime[sortedByTime.length - 1]?.time || '';

    // 4. Build TF–IDF over speaker + content
    const docs = relevant.map(i => `${i.speaker}: ${i.content}`);
    const tfidf = new TfIdf();
    docs.forEach(d => tfidf.addDocument(d));

    const wtok = new WordTokenizer();
    const stok = new SentenceTokenizer([]);
    const scoredSentences: { sentence: string; score: number, speaker: string; time: string }[] = [];

    docs.forEach((doc, idx) => {
        stok.tokenize(doc).forEach(sentence => {
            const tokens = wtok.tokenize(sentence.toLowerCase());
            const score = tokens.reduce((sum, t) => sum + tfidf.tfidf(t, idx), 0);
            scoredSentences.push({ sentence, score, speaker: relevant[idx].speaker, time: relevant[idx].time });
        });
    });

    // 5. Extract top-3 key sentences
    const extractive = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    // 6. Compose an abstractive summary from your stats + extractive sentences
    const numSpeakers = Object.keys(speakerCounts).length;
    const sortedSpeakers = Object
        .entries(speakerCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([speaker]) => speaker);
    const [top1, top2] = sortedSpeakers;

    const parts: string[] = [];
    parts.push(
        `Found ${totalItems} utterances, of which ${relevantItems} ` +
        `were relevant, spread across ${numSpeakers} speaker${numSpeakers > 1 ? 's' : ''}.`
    );
    if (top1)
        parts.push(
            `Most active: ${top1}` +
            (top2 ? ` and ${top2}` : ``)
            + `.`
        );
    parts.push(`Discussion ran from ${earliestTime} to ${latestTime}.`);

    return {
        summary: parts.join(' '),
        extractive,
        meta: {
            totalItems,
            relevantItems,
            speakerCounts,
            earliestTime,
            latestTime
        }
    };
}

export const meetingTranscriptTests: Question[] = [
    {
        id: "meeting-transcription_accuracy",
        text: "What primary course of action did the team agree on during the meeting?",
        type: 'multipleChoice',
        options: [
            "Develop and test new experimental features",
            "Extend the project timeline significantly",
            "Prioritize core functionality and performance improvements",
            "Outsource development to third-party vendors",
            "None of the above"
        ],
        multipleCorrectAnswers: false,
        // correctAnswerIndex: 2
    },
    {
        id: "meeting-transcription_comprehension",
        text: "Which of the following statements accurately reflect the discussion's outcomes?",
        type: 'multipleChoice',
        options: [
            "The team decided to delay less critical features",
            "They chose to focus on performance and core functionality",
            "Responsibilities for follow-up tasks were assigned to team members",
            "A target timeframe for the next release was mentioned",
            "A complete overhaul of the project plan was agreed upon",
            "None of the above"
        ],
        multipleCorrectAnswers: true,
        // correctAnswerIndices: [0, 1, 2, 3]
    }
];