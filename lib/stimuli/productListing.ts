import { SentenceTokenizer, TfIdf, WordTokenizer } from "natural";
import { Question } from "../data/questionnaire";
import { ProductAISummary, ProductItem, ProductProgrammaticSummary } from "@/types/stimuli";

export const productListingData: ProductItem[] = [
  {
    id: 1,
    productName: "SoundWave Pro Wireless Headphones",
    brand: "AudioTech",
    price: "$129.99",
    originalPrice: "$179.99",
    discount: "28% off",
    description: "Premium noise-canceling wireless headphones with 30-hour battery life. Features include Bluetooth 5.0, built-in microphone, and comfortable over-ear design. Available in Black, Silver, and Navy Blue.",
    rating: 4.7,
    reviewCount: 2453,
    inStock: true,
    freeShipping: true,
    deliveryEstimate: "2-3 business days"
  },
  {
    id: 2,
    productName: "UltraBass Wireless Earbuds",
    brand: "BassKing",
    price: "$89.95",
    originalPrice: "$99.95",
    discount: "10% off",
    description: "Water-resistant earbuds with enhanced bass technology. 24-hour battery with charging case, touch controls, and voice assistant support. Includes 3 sizes of silicone tips for perfect fit. Available in Black only.",
    rating: 4.5,
    reviewCount: 1876,
    inStock: true,
    freeShipping: true,
    deliveryEstimate: "1-2 business days"
  },
  {
    id: 3,
    productName: "AirFlex Studio Headphones",
    brand: "SoundMaster",
    price: "$199.99",
    originalPrice: "$249.99",
    discount: "20% off",
    description: "Professional-grade studio headphones with advanced active noise cancellation and Hi-Res audio certification. Features include foldable design, detachable cable option, and premium leather ear cushions. Available in Matte Black and White.",
    rating: 4.8,
    reviewCount: 1203,
    inStock: true,
    freeShipping: true,
    deliveryEstimate: "3-5 business days"
  },
  {
    id: 4,
    productName: "SportFit Wireless Earbuds",
    brand: "FitTech",
    price: "$59.99",
    originalPrice: "$79.99",
    discount: "25% off",
    description: "Designed for athletes with secure ear hooks and IPX7 waterproof rating. 8-hour battery life, quick charge feature (15 min for 2 hours), and built-in heart rate monitor. Available in Black/Red, Neon Yellow, and Teal.",
    rating: 4.3,
    reviewCount: 3542,
    inStock: true,
    freeShipping: false,
    deliveryEstimate: "2-3 business days"
  },
  {
    id: 5,
    productName: "KidSafe Wireless Headphones",
    brand: "SafeSound",
    price: "$49.99",
    originalPrice: "$59.99",
    discount: "17% off",
    description: "Volume-limiting headphones designed for children ages 3-12. Durable, flexible design with 85dB volume limit for hearing protection. 20-hour battery life and fun sticker pack included. Available in Blue, Pink, and Green.",
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    freeShipping: true,
    deliveryEstimate: "2-4 business days"
  },
  {
    id: 6,
    productName: "Smartphone Charging Cable (6ft)",
    brand: "PowerConnect",
    price: "$14.99",
    originalPrice: "$19.99",
    discount: "25% off",
    description: "Durable braided charging cable with fast-charge capability. Compatible with all PowerConnect devices and adapters. Tangle-free design with reinforced connectors.",
    rating: 4.4,
    reviewCount: 5621,
    inStock: true,
    freeShipping: false,
    deliveryEstimate: "1-2 business days",
    irrelevant: true
  },
  {
    id: 7,
    productName: "Bluetooth Speaker Portable",
    brand: "SoundMaster",
    price: "$39.99",
    originalPrice: "$49.99",
    discount: "20% off",
    description: "Compact bluetooth speaker with 12-hour battery life. IPX5 water resistance and built-in microphone for calls. Available in Black, Blue, and Red.",
    rating: 4.2,
    reviewCount: 1843,
    inStock: true,
    freeShipping: false,
    deliveryEstimate: "2-3 business days",
    irrelevant: true
  },
  {
    id: 8,
    productName: "Wireless Charging Pad",
    brand: "PowerConnect",
    price: "$29.99",
    originalPrice: "$34.99",
    discount: "14% off",
    description: "Fast wireless charging for compatible smartphones and earbuds. Sleek, slim design with LED indicator and non-slip surface. Available in Black only.",
    rating: 4.5,
    reviewCount: 2134,
    inStock: true,
    freeShipping: true,
    deliveryEstimate: "2-3 business days",
    irrelevant: true
  },
  {
    id: 9,
    productName: "Smartphone Camera Lens Kit",
    brand: "OptixPro",
    price: "$24.99",
    originalPrice: "$34.99",
    discount: "29% off",
    description: "3-in-1 smartphone lens kit including wide angle, macro, and fisheye lenses. Universal clip-on design fits most smartphones. Includes carrying pouch and lens cloth.",
    rating: 4.0,
    reviewCount: 967,
    inStock: true,
    freeShipping: false,
    deliveryEstimate: "3-5 business days",
    irrelevant: true
  },
  {
    id: 10,
    productName: "Laptop Sleeve Case 15-inch",
    brand: "TechProtect",
    price: "$19.99",
    originalPrice: "$24.99",
    discount: "20% off",
    description: "Padded neoprene sleeve with water-resistant exterior. Fits most 15-inch laptops and has additional pocket for accessories. Available in Gray, Black, and Navy.",
    rating: 4.6,
    reviewCount: 1425,
    inStock: true,
    freeShipping: true,
    deliveryEstimate: "2-4 business days",
    irrelevant: true
  }
];

// Pre-generated and statically delivered
// Model: OpenAI o4-mini (standard parameters + low reasoning effort)
export const productAISummary: ProductAISummary = {
  overview: "Five in‑stock wireless audio products span premium over‑ear, studio, sport, bass‑enhanced earbuds, and kid‑safe headphones—offering 10–28% discounts, strong ratings, and fast delivery options.",
  themes: [
    {
      category: "Over‑Ear Headphones",
      items: [
        { id: 1, name: "SoundWave Pro", focus: "Noise‑canceling, 30h battery" },
        { id: 3, name: "AirFlex Studio", focus: "Hi‑Res audio, ANC, studio grade" }
      ]
    },
    {
      category: "Wireless Earbuds",
      items: [
        { id: 2, name: "UltraBass", focus: "Enhanced bass, 24h battery" },
        { id: 4, name: "SportFit", focus: "IPX7 waterproof, heart‑rate monitor" }
      ]
    },
    {
      category: "Kids Headphones",
      items: [
        { id: 5, name: "KidSafe", focus: "85 dB limit, durable, 20h battery" }
      ]
    }
  ],
  pricingInsights: {
    averageDiscount: "20%",
    maxDiscount: { id: 1, discount: "28% off" },
    priceRange: { min: "$49.99", max: "$199.99" }
  },
  ratingsOverview: {
    averageRating: 4.58,
    highestRated: { id: 3, rating: 4.8 },
    mostReviewed: { id: 4, reviews: 3542 }
  },
  shippingDelivery: {
    freeShippingOn: [1, 2, 3, 5],
    deliveryWindows: {
      fastest: { id: 2, eta: "1–2 business days" },
      longest: { id: 3, eta: "3–5 business days" }
    }
  },
  keyInsights: [
    "Premium models (IDs 1 & 3) command top ratings and feature advanced ANC/Hi‑Res audio.",
    "SportFit earbuds (ID 4) drive highest engagement but trail on overall rating.",
    "Average discount of 20% makes mid‑range and kid‑safe options very affordable.",
    "Free shipping applies to 4 of 5 items, boosting purchase appeal."
  ],
  recommendations: [
    { useCase: "Immersive Listening", pick: { id: 3, name: "AirFlex Studio" } },
    { useCase: "Travel & Commute", pick: { id: 1, name: "SoundWave Pro" } },
    { useCase: "Workout & Sports", pick: { id: 4, name: "SportFit" } },
    { useCase: "Budget Bass", pick: { id: 2, name: "UltraBass" } },
    { useCase: "Kids Safety", pick: { id: 5, name: "KidSafe" } }
  ]
};

// Dynamically generated (programmatic) summary based on text extraction
export function summarizeProducts(items: ProductItem[]): ProductProgrammaticSummary {
  // 1. Filter out irrelevant products
  const relevant = items.filter(item => !item.irrelevant);
  const inStockCount = relevant.filter(item => item.inStock).length;
  const freeShippingCount = relevant.filter(item => item.freeShipping).length;
  const averageRating = parseFloat(
    (relevant.reduce((sum, i) => sum + i.rating, 0) / relevant.length).toFixed(2)
  );

  // 2. Count by brand
  const brandCounts: Record<string, number> = {};
  relevant.forEach(i => {
    brandCounts[i.brand] = (brandCounts[i.brand] || 0) + 1;
  });

  // 3. Build TF–IDF over "productName + description"
  const docs = relevant.map(i => `${i.productName}. ${i.description}`);
  const tfidf = new TfIdf();
  docs.forEach(d => tfidf.addDocument(d));

  const wordTokenizer = new WordTokenizer();
  const sentenceTokenizer = new SentenceTokenizer([]);

  type ScoredSentence = { sentence: string; score: number; itemId: number };
  const scoredSentences: ScoredSentence[] = [];
  docs.forEach((doc, idx) => {
    sentenceTokenizer.tokenize(doc).forEach(sentence => {
      const tokens = wordTokenizer.tokenize(sentence.toLowerCase());
      const score = tokens.reduce((s, term) => s + tfidf.tfidf(term, idx), 0);
      scoredSentences.push({ sentence, score, itemId: relevant[idx].id });
    });
  });

  // 4. Pick top 3 extractive sentences
  const extractive = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 5. Identify top deals by discount & rating
  const parseDiscount = (d: string = "0% off") => parseInt(d.replace("% off", ""), 10);
  const sortedDeals = [...relevant].sort((a, b) =>
    parseDiscount(b.discount!) - parseDiscount(a.discount!) || b.rating - a.rating
  );
  const topDeals = sortedDeals.slice(0, 2).map(i => `${i.productName} (${i.discount})`);

  // 6. Build an abstractive-style summary
  const parts: string[] = [];
  parts.push(
    `We found ${relevant.length} active products with an average rating of ${averageRating}.`
  );
  parts.push(`Top deals: ${topDeals.join(" and ")}.`);
  parts.push(`Accessories and low-priority items are filtered out for clarity.`);

  return {
    summary: parts.join(" "),
    extractive,
    meta: {
      totalItems: items.length,
      relevantItems: relevant.length,
      inStockCount,
      freeShippingCount,
      averageRating,
      brandCounts,
    },
  };
}

export const productListingTests: Question[] = [
  {
    id: "product-listing_accuracy",
    text: "Based on these products, which should you purchase if you need headphones for intense workout sessions that can withstand sweat and rain?",
    type: 'multipleChoice',
    options: [
      "SoundWave Pro Wireless Headphones",
      "UltraBass Wireless Earbuds",
      "AirFlex Studio Headphones",
      "SportFit Wireless Earbuds",
      "KidSafe Wireless Headphones"
    ],
    multipleCorrectAnswers: false,
    // correctAnswerIndex: 3  // SportFit has IPX7 waterproof rating and is designed for athletes
  },
  {
    id: "product-listing_comprehension",
    text: "Which of the following statements are accurate based on the product listings?",
    type: 'multipleChoice',
    options: [
      "All the headphone products offer some form of discount from their original price",
      "The AirFlex Studio Headphones have the highest customer rating",
      "Free shipping is available for all wireless headphone products",
      "The UltraBass Wireless Earbuds come in multiple color options",
      "The KidSafe headphones feature technology specifically designed for child safety",
      "The SportFit Wireless Earbuds include a heart rate monitoring feature"
    ],
    multipleCorrectAnswers: true,
    // correctAnswerIndices: [0, 1, 4, 5]  // All discounted, AirFlex highest rating, KidSafe child safety, SportFit heart monitor
  }
];