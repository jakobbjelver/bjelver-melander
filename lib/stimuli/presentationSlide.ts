import { SentenceTokenizer, TfIdf, WordTokenizer } from "natural";
import { Question } from "../data/questionnaire";
import { SlideAISummary, SlideItem, SlideProgrammaticSummary } from "@/types/stimuli";

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

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const presentationAISummary: SlideAISummary = {
    period: 'Q2 2023',
  company: 'TechInnovate Corporation',
  performance: {
    totalRevenue: 78.5,
    currencyUnit: 'USD Millions',
    yoyGrowthPercent: 15,
    operatingMarginPercent: 23.4,
    newEnterpriseCustomers: 42,
    cloudDivisionGrowthPercent: 28,
    aiPlatformLaunchMonth: 'May 2023'
  },
  revenueByDivision: {
    cloudServices: 42,
    enterpriseSolutions: 30,
    consumerProducts: 18,
    professionalServices: 10,
    unit: '%'
  },
  strategicInitiatives: [
    'Expand AI Platform capabilities by Q4 2023',
    'Grow APAC presence by 15% year‑end',
    'Complete DataSecure Inc. acquisition in September',
    'Launch next‑gen Enterprise suite in November',
    'Raise operating margin to 25% by Q4 2023'
  ],
  forecast: {
    Q3: 85.3,
    Q4: 94.7,
    currencyUnit: 'USD Millions',
    keyDrivers: ['Holiday season demand', 'Enterprise year‑end spending']
  }
};

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeSlides(
    items: SlideItem[]
): SlideProgrammaticSummary {
    // 1. Filter out irrelevant slides
    const relevant = items.filter(s => !s.irrelevant);
    const total = items.length;
    const count = relevant.length;

    // 2. Count slides by type & chart slides
    const slideTypeCounts: Record<string, number> = {};
    relevant.forEach(s => {
        slideTypeCounts[s.type] = (slideTypeCounts[s.type] || 0) + 1;
    });
    const chartSlides = relevant.filter(s => !!s.chartType).length;

    // 3. Compute average bullets for bullet-point slides
    const bulletSlides = relevant.filter(
        s => s.type === 'bullet points' && Array.isArray(s.content)
    );
    const avgBullets =
        bulletSlides.length > 0
            ? bulletSlides.reduce((sum, s) => sum + (s.content as string[]).length, 0) /
            bulletSlides.length
            : 0;

    // 4. Prepare docs for TF–IDF
    const docs = relevant.map(s => {
        let text = s.title + '. ';
        if (typeof s.content === 'string') text += s.content + '. ';
        else if (Array.isArray(s.content)) text += (s.content as string[]).join('. ') + '. ';
        else return ''; // Do not count in structured data for charts
        text += s.notes;
        return text;
    });

    const tfidf = new TfIdf();
    docs.forEach(d => tfidf.addDocument(d));
    const wtok = new WordTokenizer();
    const stok = new SentenceTokenizer([]);

    type Scored = { sentence: string; score: number; title: string };
    const scored: Scored[] = [];
    docs.forEach((doc, idx) => {
        stok.tokenize(doc).forEach(sent => {
            const tokens = wtok.tokenize(sent.toLowerCase());
            const score = tokens.reduce((sum, t) => sum + tfidf.tfidf(t, idx), 0);
            scored.push({ sentence: sent, score, title: relevant[idx].title });
        });
    });

    // 5. Select top-3 extractive sentences
    const extractive = scored.sort((a, b) => b.score - a.score).slice(0, 3);

    // 6. Identify key bullet sections
    const topBullet = bulletSlides
        .sort(
            (a, b) =>
                (b.content as string[]).length - (a.content as string[]).length
        )
        .slice(0, 2)
        .map(s => `"${s.title}"`);

    // 7. Build an abstractive-style summary
    const parts: string[] = [];
    parts.push(`This deck has ${count} slides (of ${total}) focused on Q2 results.`);
    parts.push(
        `Includes ${chartSlides} chart slide${chartSlides !== 1 ? 's' : ''} and bullet slides averaging ${avgBullets.toFixed(
            1
        )} items.`
    );
    if (topBullet.length) parts.push(`Key sections include ${topBullet.join(' and ')}.`);

    return {
        summary: parts.join(' '),
        extractive,
        meta: {
            totalSlides: total,
            relevantSlides: count,
            slideTypeCounts,
            chartSlides,
            averageBulletPoints: parseFloat(avgBullets.toFixed(1)),
        },
    };
}

export const presentationSlideTests: Question[] = [
    {
        id: "presentation-slide_accuracy",
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
        id: "presentation-slide_comprehension",
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