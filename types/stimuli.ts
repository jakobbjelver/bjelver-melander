export type StimuliItem = EmailItem[] | TranscriptItem[] | PracticeItem[] | SlideItem[] | ProductItem[] | SearchResultItem[] | NotificationItem[]

export type EmailInbox = EmailItem[] | EmailProgrammaticSummary | EmailAISummary

export interface EmailAISummary {
  overview: string;
  pendingRequests: {
    count: number;
    items: Array<{
      subject: string;
      sender: string;
      deadline?: string;
    }>;
  };
  upcomingCommitments: {
    trainingSession: boolean;
    tripConfirmation: boolean;
  };
  statusUpdates: string[];
  irrelevantCount: number;
}

// Define the structure of an email item
export interface EmailItem {
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

export interface EmailProgrammaticSummary {
  summary: string;
  extractive: Array<{ sentence: string; score: number; itemId: number }>;
  meta: {
    totalItems: number;
    relevantItems: number;
    unreadCount: number;
    highPriorityCount: number;
    attachmentCount: number;
    folderCounts: { [folder: string]: number };
  };
}

export type MeetingTranscript = TranscriptItem[] | TranscriptProgrammaticSummary | TranscriptAISummary

export type TranscriptAISummary = {
  topic: string;
  goals: string[];
  decisions: string[];
  priorities: string[];
  actionItems: {
    owner: string;
    task: string;
  }[];
  targetRelease: string;
  nextMeeting: string;
}

export interface TranscriptItem {
  id: number;
  time: string;         // e.g. "00:00:23"
  speaker: string;      // e.g. "Marcus Chen (Project Manager)"
  content: string;
  irrelevant?: boolean;
}

export interface TranscriptProgrammaticSummary {
  summary: string;
  extractive: Array<{ sentence: string; score: number; time: string, speaker: string }>;
  meta: {
    totalItems: number;
    relevantItems: number;
    speakerCounts: { [speaker: string]: number };
    earliestTime: string;
    latestTime: string;
  };
}

export type PresentationSlide = SlideItem[] | SlideProgrammaticSummary | SlideAISummary

export type SlideAISummary = {
  period: string
  company: string
  performance: {
    totalRevenue: number
    currencyUnit: string
    yoyGrowthPercent: number
    operatingMarginPercent: number
    newEnterpriseCustomers: number
    cloudDivisionGrowthPercent: number
    aiPlatformLaunchMonth: string
  }
  revenueByDivision: {
    cloudServices: number
    enterpriseSolutions: number
    consumerProducts: number
    professionalServices: number
    unit: string
  }
  strategicInitiatives: string[]
  forecast: {
    Q3: number
    Q4: number
    currencyUnit: string
    keyDrivers: string[]
  }
}

type SlideType = 'title slide' | 'bullet points' | 'chart' | 'timeline' | 'profiles' | 'map' | 'diagram';
type ChartType = 'pie chart' | 'line chart';

export interface ChartContent {
  labels: string[];
  values: number[];
  unit: string;
}

export interface SlideItem {
  id: number;
  title: string;
  type: SlideType;
  chartType?: ChartType;
  content: string | string[] | ChartContent;
  notes: string;
  irrelevant?: boolean;
}

export interface SlideProgrammaticSummary {
  summary: string;
  extractive: Array<{ sentence: string; score: number; title: string }>;
  meta: {
    totalSlides: number;
    relevantSlides: number;
    slideTypeCounts: { [type: string]: number };
    chartSlides: number;
    averageBulletPoints: number;
  };
}

export type ProductListing = ProductItem[] | ProductProgrammaticSummary | ProductAISummary

export interface ProductAISummary {
  itemCount: number;
  brands: string[];
  categories: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  averageRating: number;
  discountRange: {
    min: number;
    max: number;
    unit: string;
  };
  batteryLifeHours: {
        min: number;
        max: number;
  };
  keyFeatures: string[];
  shippingOptions: {
        free: number;
        paid: number;
        typicalEstimate: string;
  };
}

// You can then use this type like this:
// export const productAISummary: ProductAISummary = { ... };

export interface ProductItem {
  id: number;
  productName: string;
  brand: string;
  price: string;            // e.g. "$39.99"
  originalPrice: string;    // e.g. "$49.99"
  discount?: string;        // e.g. "20% off"
  description: string;
  rating: number;           // 0–5
  reviewCount: number;
  inStock: boolean;
  freeShipping: boolean;
  deliveryEstimate: string; // e.g. "2-3 business days"
  irrelevant?: boolean;
}

export interface ProductProgrammaticSummary {
  summary: string;
  extractive: Array<{ sentence: string; score: number; itemId: number }>;
  meta: {
    totalItems: number;
    relevantItems: number;
    inStockCount: number;
    freeShippingCount: number;
    averageRating: number;
    brandCounts: { [brand: string]: number };
  };
}

export type PushNotifications = NotificationItem[] | NotificationProgrammaticSummary | NotificationAISummary

export interface NotificationAISummary {
  totalItems: number
  unreadCount: number
  highPriorityCount: number
  relevantItems: number
  categoryBreakdown: {
    message: number
    reminder: number
    delivery: number
    alert: number
    social: number
    system: number
    entertainment: number
    news: number
    health: number
  }
  keyHighlights: {
    upcomingEvents: Array<{ app: string; note: string }>
    urgentAlerts: Array<{ app: string; note: string }>
    pendingMessages: Array<{ app: string; note: string }>
  }
  summaryText: string
}



// You can then use this type like this:
// export const notificationAISummary: NotificationAISummary = { ... };
export interface NotificationItem {
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

export interface NotificationProgrammaticSummary {
  summary: string;
  extractive: Array<{ sentence: string; score: number; itemId: number }>;
  meta: {
    totalItems: number;
    relevantItems: number;
    unreadCount: number;
    highPriorityCount: number;
    categories: { [category: string]: number };
  };
}

export type SearchEngine = SearchResultItem[] | SearchProgrammaticSummary | SearchAISummary

export interface SearchAISummary {
  topic: string;
  overview: string;
  keyThemes: string[];
  formatCounts: {
    article: number;
    interactive: number;
    report: number;
    video: number;
  };
  sources: string[];
  latestUpdate: string;
  citationStats: {
    totalItems: number;
    average: number;
    range: [number, number];
  };
  multimediaIncluded: boolean;
}

// You can then use this type like this:
// export const searchResultsAISummary: SearchResultsAISummary = { ... };
export interface SearchResultItem {
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

export interface SearchProgrammaticSummary {
  summary: string;
  extractive: Array<{ sentence: string; score: number; itemId: number }>;
  meta: {
    totalItems: number;
    relevantItems: number;
    hasVideoCount: number;
    averageCitations: number;
    typeCounts: { [type: string]: number };
    topSources: string[];
  };
}

export enum BoxColors {
  RED = 'red',
  BLUE = 'blue',
  ORANGE = 'orange',
  GREEN = 'green'
}

export interface PracticeItem {
  color: BoxColors;
  opacity: number;
  irrelevant?: boolean;
}

export type Practice = PracticeItem[]