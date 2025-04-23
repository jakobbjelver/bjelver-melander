import { SentenceTokenizer, TfIdf, WordTokenizer } from "natural";
import { Question } from "../data/questionnaire";
import { SearchAISummary, SearchProgrammaticSummary, SearchResultItem } from "@/types/stimuli";

export const searchEngineQuery = "what is climate change";


export const searchEngineData: SearchResultItem[] = [
  {
    id: 1,
    title: "Understanding Climate Change: A Comprehensive Guide",
    url: "www.climatescienceorg.edu/comprehensive-guide",
    snippet: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels...",
    source: "Climate Science Organization",
    type: "article",
    datePublished: "Updated June 2023",
    citations: 1240,
    hasVideo: false
  },
  {
    id: 2,
    title: "The Effects of Climate Change: Interactive Data Visualization",
    url: "www.globaldata.org/climate/interactive-map",
    snippet: "Explore our interactive maps showing rising sea levels, temperature changes, and extreme weather events over the past century. Data sourced from NOAA, NASA, and international meteorological organizations...",
    source: "Global Data Institute",
    type: "interactive",
    datePublished: "Updated monthly",
    citations: 856,
    hasVideo: false
  },
  {
    id: 3,
    title: "Climate Change Mitigation Strategies for Governments and Individuals",
    url: "www.environmentalaction.org/mitigation-strategies",
    snippet: "Learn about effective strategies to combat climate change at both policy and personal levels. Includes analysis of carbon pricing, renewable energy transitions, and lifestyle changes that make the biggest impact...",
    source: "Environmental Action Network",
    type: "article",
    datePublished: "April 2023",
    citations: 521,
    hasVideo: true
  },
  {
    id: 4,
    title: "Latest IPCC Report on Climate Change (Summary)",
    url: "www.ipcc.int/reports/2023-summary",
    snippet: "The Intergovernmental Panel on Climate Change's latest assessment provides updated projections on global warming scenarios, environmental impacts, and critical thresholds. This summary breaks down key findings for policymakers...",
    source: "IPCC - Official Site",
    type: "report",
    datePublished: "February 2023",
    citations: 1872,
    hasVideo: false
  },
  {
    id: 5,
    title: "Climate Change: Separating Facts from Myths | Video Lecture",
    url: "www.edustream.com/watch/climate-lecture-series",
    snippet: "In this acclaimed lecture series, Dr. Miranda Chen addresses common misconceptions about climate science while explaining complex climate systems in accessible terms. Includes visual models and the latest research findings...",
    source: "EduStream",
    type: "video",
    datePublished: "December 2022",
    citations: 423,
    hasVideo: true
  },
  {
    id: 6,
    title: "10 Best Weather Apps for Your Smartphone in 2023",
    url: "www.techreview.com/best-weather-apps-2023",
    snippet: "Stay prepared with these top-rated weather applications offering real-time forecasts, radar imagery, and severe weather alerts. Our comprehensive comparison includes free and premium options...",
    source: "Tech Review Magazine",
    type: "list article",
    datePublished: "May 2023",
    irrelevant: true
  },
  {
    id: 7,
    title: "History of Meteorology: From Ancient Times to Modern Forecasting",
    url: "www.sciencehistory.edu/meteorology-timeline",
    snippet: "Trace the fascinating evolution of weather prediction from ancient observation techniques to modern supercomputer models. Learn how weather forecasting has transformed throughout human civilization...",
    source: "Science History Institute",
    type: "article",
    datePublished: "January 2023",
    irrelevant: true
  },
  {
    id: 8,
    title: "Summer Travel: Best Destinations for Climate Tourism",
    url: "www.travelmagazine.com/climate-tourism-destinations",
    snippet: "Discover locations where you can witness unique climate zones, from rainforests to deserts, glaciers to coral reefs. Our guide includes sustainability ratings and conservation information for each destination...",
    source: "Travel Magazine",
    type: "travel guide",
    datePublished: "April 2023",
    irrelevant: true
  },
  {
    id: 9,
    title: "Environmental Science Degrees: Career Prospects and Top Programs",
    url: "www.educationguide.com/environmental-science-degrees",
    snippet: "Considering a career in environmental science? This guide outlines degree requirements, job opportunities, salary expectations, and ranks the top university programs in climate and environmental studies...",
    source: "Education Guide",
    type: "education article",
    datePublished: "March 2023",
    irrelevant: true
  },
  {
    id: 10,
    title: "Climate Fiction: How Literature Imagines Our Warming Future",
    url: "www.literaryjournal.com/climate-fiction-analysis",
    snippet: "Explore how novelists and writers are creating narratives around climate change. This literary analysis examines emerging trends in 'cli-fi' and how the genre influences public perception of environmental issues...",
    source: "Literary Journal Quarterly",
    type: "literary analysis",
    datePublished: "February 2023",
    irrelevant: true
  }
];

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeSearchResults(
  items: SearchResultItem[]
): SearchProgrammaticSummary {
  // 1. Filter out irrelevant results
  const relevant = items.filter(i => !i.irrelevant);
  const totalItems = items.length;
  const relevantItems = relevant.length;

  // 2. Video count and citation stats
  const hasVideoCount = relevant.filter(i => i.hasVideo).length;
  const citationValues = relevant.map(i => i.citations || 0);
  const averageCitations = relevantItems
    ? parseFloat(
        (citationValues.reduce((sum, c) => sum + c, 0) / relevantItems).toFixed(1)
      )
    : 0;

  // 3. Count by type
  const typeCounts: Record<string, number> = {};
  relevant.forEach(i => {
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
  });

  // 4. Top sources by citations
  const topSources = [...relevant]
    .sort((a, b) => (b.citations || 0) - (a.citations || 0))
    .slice(0, 2)
    .map(i => i.source);

  // 5. Build TF–IDF on title + snippet
  const docs = relevant.map(i => `${i.title}. ${i.snippet}`);
  const tfidf = new TfIdf();
  docs.forEach(d => tfidf.addDocument(d));
  const wtok = new WordTokenizer();
  const stok = new SentenceTokenizer([]);
  const scored: { sentence: string; score: number; itemId: number }[] = [];

  docs.forEach((doc, idx) => {
    stok.tokenize(doc).forEach(sentence => {
      const tokens = wtok.tokenize(sentence.toLowerCase());
      const score = tokens.reduce((s, t) => s + tfidf.tfidf(t, idx), 0);
      scored.push({ sentence, score, itemId: relevant[idx].id });
    });
  });

  // 6. Extract top-3 sentences
  const extractive = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 7. Compose an abstractive summary
  const parts: string[] = [];
  parts.push(
    `Found ${relevantItems} relevant search result${
      relevantItems !== 1 ? 's' : ''
    } across ${Object.keys(typeCounts).length} content types.`
  );
  parts.push(
    `${hasVideoCount} result${
      hasVideoCount !== 1 ? 's' : ''
    } include video; average citations per item: ${averageCitations}.`
  );
  if (topSources.length)
    parts.push(`Top sources by citations: ${topSources.join(' and ')}.`);
  parts.push(`Other less relevant entries are filtered out for focus.`);

  return {
    summary: parts.join(' '),
    extractive,
    meta: {
      totalItems,
      relevantItems,
      hasVideoCount,
      averageCitations,
      typeCounts,
      topSources,
    },
  };
}

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const searchResultsAISummary: SearchAISummary = {
  overview: "Top search results offer a multi‑format deep dive into climate change: foundational science, interactive data trends, mitigation tactics, IPCC consensus, and myth‑busting video content.",
  themes: [
    { theme: "Foundational Science", ids: [1] },
    { theme: "Data & Visualization", ids: [2] },
    { theme: "Mitigation Strategies", ids: [3] },
    { theme: "Official Assessments", ids: [4] },
    { theme: "Educational Video", ids: [5] }
  ],
  resourceMetrics: {
    totalResults: 5,
    types: { article: 2, interactive: 1, report: 1, video: 1 },
    citations: { max: 1872, min: 423, avg: 982 }
  },
  keyInsights: [
    "Since the 1800s, fossil‑fuel combustion has been the primary driver of long‑term climate shifts.",
    "Interactive maps illustrate accelerating sea‑level rise and extreme weather trends.",
    "Effective mitigation blends policy measures (carbon pricing, renewables) with individual lifestyle changes.",
    "IPCC summary distills critical warming scenarios and policy roadmaps for decision‑makers.",
    "Video lecture demystifies climate science and counters common misconceptions."
  ],
  actionRecommendations: [
    "Use the interactive visualization to demonstrate urgent climate trends.",
    "Base policy or corporate strategies on the latest IPCC findings.",
    "Adopt and promote mitigation tactics at both organizational and personal levels.",
    "Incorporate the comprehensive guide and video into educational programs."
  ],
  topResource: {
    id: 4,
    title: "Latest IPCC Report on Climate Change (Summary)",
    citations: 1872
  }
};

export const searchEngineTests: Question[] = [
  {
    id: "search-engine_accuracy",
    text: "Based on these search results, what should you consult if you need the most authoritative and up-to-date scientific information to cite in a policy paper about climate change impacts?",
    type: 'multipleChoice',
    options: [
      "The comprehensive guide from Climate Science Organization",
      "The interactive data visualization from Global Data Institute",
      "The mitigation strategies article from Environmental Action Network",
      "The latest IPCC report summary",
      "The video lecture series by Dr. Miranda Chen"
    ],
    multipleCorrectAnswers: false,
    // correctAnswerIndex: 3  // The IPCC report is the most authoritative source with the highest citation count
  },
  {
    id: "search-engine_comprehension",
    text: "Which of the following statements are accurate based on the search results provided?",
    type: 'multipleChoice',
    options: [
      "There are resources that include visual representations of climate data",
      "Human activities have been identified as the main driver of climate change since the 1800s",
      "The most recent IPCC report was published in February 2023",
      "There are resources specifically addressing climate change mitigation strategies",
      "All the search results focus exclusively on scientific aspects of climate change",
      "The search results include content published more than 5 years ago"
    ],
    multipleCorrectAnswers: true,
    // correctAnswerIndices: [0, 1, 2, 3]  // Visual data, human activities as drivers, IPCC date, and mitigation strategies are accurate
  }
];