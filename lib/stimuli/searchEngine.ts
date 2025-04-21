import { TfIdf } from "natural";
import { Question } from "../data/questionnaire";

interface SearchResult {
    id: number;
    title: string;
    url: string;
    snippet: string;
    source: string;
    type: string;            // e.g. "article", "video", "blog", …
    datePublished: string;   // free‑form, e.g. "Updated June 2023"
    citations?: number;
    hasVideo?: boolean;
    irrelevant?: boolean;
  }
  
  interface SearchSummary {
    executiveText: string;             // top‑N extractive sentences
    totalResults: number;
    byType: Record<string, number>;
    bySource: Record<string, number>;
    dateRange: { earliest: string; latest: string };
    citationRange: { min: number; max: number; avg: number };
    videoCount: number;
  }

export const searchEngineData: SearchResult[] = [
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

export function summarizeSearchResults(
    items: SearchResult[]
  ): SearchSummary {
    // A) Build TF–IDF on title + snippet
    const docs = items.map((r) => [r.title, r.snippet].join('. '));
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
  
    // B) Metadata counts
    const totalResults = items.length;
  
    const byType = items.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const bySource = items.reduce((acc, r) => {
      acc[r.source] = (acc[r.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    // C) Date range (lexical compare)
    const dates = items.map((r) => r.datePublished);
    const sortedDates = dates.slice().sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
    const dateRange = {
      earliest: sortedDates[0] || '',
      latest:   sortedDates[sortedDates.length - 1] || '',
    };
  
    // D) Citation stats
    const citations = items.map((r) => r.citations).filter((r) => r !== undefined);
    const min = Math.min(...citations);
    const max = Math.max(...citations);
    const avg =
      citations.reduce((sum, c) => sum + c, 0) / (citations.length || 1);
  
    // E) Video count
    const videoCount = items.filter((r) => r.hasVideo).length;
  
    return {
      executiveText,
      totalResults,
      byType,
      bySource,
      dateRange,
      citationRange: {
        min,
        max,
        avg: parseFloat(avg.toFixed(1)),
      },
      videoCount,
    };
  }

export const searchEngineTests: Question[] = [
    {
        id: "search_results_accuracy",
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
        id: "search_results_comprehension",
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