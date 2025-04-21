import { TfIdf } from "natural";
import { Question } from "../data/questionnaire";

type SlideType = 'title slide' | 'bullet points' | 'chart' | 'timeline' | 'profiles' | 'map' | 'diagram';
type ChartType = 'pie chart' | 'line chart';

interface ChartContent {
    labels: string[];
    values: number[];
    unit: string;
}

interface SlideItem {
    id: number;
    title: string;
    type: SlideType;
    chartType?: ChartType;
    content: string | string[] | ChartContent;
    notes: string;
    irrelevant?: boolean;
}

interface SlideSummary {
    executiveText: string;              // top‐N extractive sentences
    totalSlides: number;
    byType: Record<SlideType, number>;
    keyTitles: string[];                // top titles or themes
    chartSummaries: {
        title: string;
        trend: string;                    // e.g. “upward”/“flat”/“mixed”
        peak: { label: string; value: number };
    }[];
}

export const presentationSlideData: SlideItem[] = [
    {
        id: 1,
        title: "Q2 2023 Financial Results",
        type: "title slide",
        content: "TechInnovate Corporation\nQuarterly Performance Review\nJuly 15, 2023\nPresented by: Sarah Chen, CFO",
        notes: "Welcome everyone to our Q2 2023 financial results presentation. Today we'll cover our performance highlights, key metrics, and outlook for the remainder of the year."
    },
    {
        id: 2,
        title: "Q2 2023 Highlights",
        type: "bullet points",
        content: [
            "Revenue: $78.5M (↑15% YoY)",
            "Operating Margin: 23.4% (↑2.1% from Q1)",
            "New Enterprise Customers: 42",
            "Cloud Division Growth: 28%",
            "Successfully launched TechInnovate AI Platform in May"
        ],
        notes: "Our Q2 results exceeded expectations across all major metrics. The launch of our AI Platform contributed significantly to the Cloud Division's growth this quarter."
    },
    {
        id: 3,
        title: "Revenue Breakdown by Division",
        type: "chart",
        chartType: "pie chart",
        content: {
            labels: ["Cloud Services", "Enterprise Solutions", "Consumer Products", "Professional Services"],
            values: [42, 30, 18, 10],
            unit: "%"
        },
        notes: "Cloud Services continues to be our strongest division at 42% of total revenue. Enterprise Solutions remains solid at 30%, while Consumer Products showed improvement at 18% compared to 15% last quarter."
    },
    {
        id: 4,
        title: "Key Strategic Initiatives",
        type: "bullet points",
        content: [
            "Expand AI Platform capabilities by Q4",
            "Increase APAC market presence - target 15% growth by EOY",
            "Complete acquisition of DataSecure Inc. (September)",
            "Launch next-gen Enterprise Solution suite (November)",
            "Improve operating margin to 25% by Q4"
        ],
        notes: "These five initiatives are our primary focus for the second half of 2023. The DataSecure acquisition is particularly strategic as it will enhance our security offerings."
    },
    {
        id: 5,
        title: "Q3-Q4 Revenue Forecast",
        type: "chart",
        chartType: "line chart",
        content: {
            labels: ["Q1", "Q2", "Q3 (Projected)", "Q4 (Projected)"],
            values: [68.2, 78.5, 85.3, 94.7],
            unit: "$ Millions"
        },
        notes: "We're projecting continued growth for Q3 and Q4, with Q4 expected to be particularly strong due to the holiday season and enterprise year-end budget spending."
    },
    {
        id: 6,
        title: "Company History",
        type: "timeline",
        content: [
            "2005: Founded in San Francisco",
            "2008: First enterprise product launched",
            "2012: IPO",
            "2015: Expansion to European markets",
            "2019: Launch of Cloud Services division",
            "2022: 1000th employee hired"
        ],
        notes: "This slide provides background context but isn't directly relevant to the Q2 results discussion.",
        irrelevant: true
    },
    {
        id: 7,
        title: "Our Leadership Team",
        type: "profiles",
        content: [
            "Michael Rodriguez - CEO (15 years at company)",
            "Sarah Chen - CFO (8 years at company)",
            "Raj Patel - CTO (10 years at company)",
            "Elena Gomez - CMO (5 years at company)",
            "David Kim - COO (7 years at company)"
        ],
        notes: "Introducing our executive team for new investors, not directly relevant to quarterly results.",
        irrelevant: true
    },
    {
        id: 8,
        title: "Office Locations",
        type: "map",
        content: "Map showing headquarters in San Francisco with additional offices in New York, London, Singapore, and Sydney. New Tokyo office opening in 2024.",
        notes: "Our global presence continues to expand, though this isn't directly related to Q2 performance.",
        irrelevant: true
    },
    {
        id: 9,
        title: "Corporate Social Responsibility",
        type: "bullet points",
        content: [
            "Carbon neutral operations since 2021",
            "STEM education initiative reached 5,000 students",
            "Employee volunteer program - 5,000+ hours contributed",
            "Diversity & inclusion benchmarks exceeded"
        ],
        notes: "While important to our overall corporate identity, these CSR initiatives aren't directly tied to the financial results.",
        irrelevant: true
    },
    {
        id: 10,
        title: "Technology Stack Overview",
        type: "diagram",
        content: "Technical architecture diagram showing our product ecosystem, including Cloud Infrastructure, AI Components, Enterprise Solutions, API Integration Layer, and Security Framework.",
        notes: "This technical overview is more appropriate for product-focused meetings rather than financial results.",
        irrelevant: true
    }
];

export function summarizeSlides(
    slides: SlideItem[]
): SlideSummary {
    // A) Extractive text from notes + title
    const docs = slides.map(
        (s) => [s.title, typeof s.content === 'string' ? s.content : '', s.notes].join('. ')
    );
    const tfidf = new TfIdf();
    docs.forEach((d) => tfidf.addDocument(d));

    const sentences = docs.flatMap((d) => d.match(/[^\.!\?]+[\.!\?]+/g) || []);
    const scored = sentences.map((s) => {
        let score = 0;
        tfidf.tfidfs(s, (_, m) => (score += m));
        return { sentence: s.trim(), score };
    });
    const executiveText = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.sentence)
        .join(' ');

    // B) Count slides by type
    const byType = slides.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
    }, {} as Record<SlideType, number>);

    // C) Key titles (top‑3 longest / most content‑rich)
    const keyTitles = slides
        .sort((a, b) => b.notes.length + String(a.content).length - (a.notes.length + String(b.content).length))
        .slice(0, 3)
        .map((s) => s.title);

    // D) Chart analyses
    const chartSummaries = slides
        .filter((s): s is SlideItem & { content: ChartContent } => s.type === 'chart')
        .map((s) => {
            const { labels, values, unit } = s.content;
            const min = Math.min(...values),
                max = Math.max(...values);
            const trend =
                values.every((v, i, arr) => i === 0 || v >= arr[i - 1])
                    ? 'upward'
                    : values.every((v, i, arr) => i === 0 || v <= arr[i - 1])
                        ? 'downward'
                        : 'mixed';
            const peakIndex = values.indexOf(max);
            return {
                title: s.title,
                trend,
                peak: { label: labels[peakIndex], value: max },
            };
        });

    return {
        executiveText,
        totalSlides: slides.length,
        byType,
        keyTitles,
        chartSummaries,
    };
}

export const presentationSlideTests: Question[] = [
    {
        id: "presentation_slide_accuracy",
        text: "Based on this presentation, which strategic action should investors expect to impact the company's security offerings most directly in the near future?",
        type: 'multipleChoice',
        options: [
            "The expansion of the AI Platform capabilities",
            "Increasing presence in the APAC market",
            "The acquisition of DataSecure Inc.",
            "Launching the next generation of Enterprise Solution suite",
            "Improving the operating margin to 25%"
        ],
        multipleCorrectAnswers: false,
        // correctAnswerIndex: 2  // The DataSecure acquisition is specifically noted to enhance security offerings
    },
    {
        id: "presentation_slide_comprehension",
        text: "Which of the following statements are accurate based on the presentation slides?",
        type: 'multipleChoice',
        options: [
            "The company's revenue increased by 15% compared to the same quarter last year",
            "Cloud Services represents less than 40% of the company's revenue",
            "The company expects Q4 revenue to exceed $90 million",
            "The AI Platform was launched in the previous quarter (Q1)",
            "The company added more than 40 new enterprise customers in Q2",
            "The operating margin decreased compared to Q1"
        ],
        multipleCorrectAnswers: true,
        // correctAnswerIndices: [0, 2, 4]  // 15% YoY increase, Q4 projection >$90M, and >40 new enterprise customers
    }
];