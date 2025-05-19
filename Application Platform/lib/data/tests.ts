import 'server-only'

import { Stimuli, stimuli } from '../stimuli';
import { pushNotificationsTests } from '../stimuli/pushNotifications';
import { Question } from './questionnaire'; // reuse Question type
import { ContentLengths, ContentSources, TestSlugs } from '@/types/test';
import { meetingTranscriptTests } from '../stimuli/meetingTranscription';
import { presentationSlideTests } from '../stimuli/presentationSlide';
import { productListingTests } from '../stimuli/productListing';
import { searchEngineTests } from '../stimuli/searchEngine';
import { practiceTests } from '../stimuli/practice';
import { emailInboxTests } from '../stimuli/emailInbox';

export type SourceOrder = keyof typeof sourceOrderMappings; // Type: 1 | 2 | 3 | 4 | 5 | 6

const allTestSlugs = Object.values(TestSlugs).filter(ts => ts !== TestSlugs.PRACTICE); // Your list of item slugs/IDs

const N = allTestSlugs.length;
if (N === 0 || N % 3 !== 0) {
    console.error("Warning: Ensure allTestSlugss is populated and its length is divisible by 3 for proper set division.");
    // Basic division
}

const itemsPerSet = Math.floor(N / 3);

const testSets = {
    SetA: allTestSlugs.slice(0, itemsPerSet),
    SetB: allTestSlugs.slice(itemsPerSet, itemsPerSet * 2),
    SetC: allTestSlugs.slice(itemsPerSet * 2, N),
};

// Define the Full Latin Square mapping for 3 formats (6 orders) applied to Sets A, B, C
const sourceOrderMappings = {
    1: { SetA: ContentSources.Original, SetB: ContentSources.AI, SetC: ContentSources.Programmatic },
    2: { SetA: ContentSources.Original, SetB: ContentSources.Programmatic, SetC: ContentSources.AI },
    3: { SetA: ContentSources.AI, SetB: ContentSources.Original, SetC: ContentSources.Programmatic },
    4: { SetA: ContentSources.AI, SetB: ContentSources.Programmatic, SetC: ContentSources.Original },
    5: { SetA: ContentSources.Programmatic, SetB: ContentSources.Original, SetC: ContentSources.AI },
    6: { SetA: ContentSources.Programmatic, SetB: ContentSources.AI, SetC: ContentSources.Original },
} as const; // Use as const here too for precise keys ('1', '2', etc.)

// Function to get the assigned format for a specific item and participant order
export function getAssignedSource(testSlug: TestSlugs, sourceOrder: number): ContentSources | undefined {
    const mapping = sourceOrderMappings[sourceOrder as SourceOrder];
    if (!mapping || testSlug === TestSlugs.PRACTICE) return ContentSources.Original; // Handle invalid order or practice

    // Find which set the item belongs to
    if (testSets.SetA.includes(testSlug)) return mapping.SetA;
    if (testSets.SetB.includes(testSlug)) return mapping.SetB;
    if (testSets.SetC.includes(testSlug)) return mapping.SetC;

    return undefined; // Item not found in any set
}

export function getTestContent(testSlug: TestSlugs, source: ContentSources, length: ContentLengths): Stimuli | null {
    console.log(`Getting content for: test=${testSlug}, sourceOrder=${source}, length=${length}`);

    if (!source || !testSlug || !length) {
        console.error("")
        return null
    }

    return stimuli[testSlug][source][length]
}

export function getTestQuestions(testSlug: TestSlugs): Question[] {

    const specificQuestions = specificTestQuestions[testSlug];

    const commonQuestions = commonTestQuestions.map(question => ({
        ...question,
        id: `${testSlug}_${question.id}`, // Prefix the ID
    }));

    return [...(specificQuestions || []), ...commonQuestions];
}

const TEST_SEQUENCE = Object.values(TestSlugs);

export function getTestSequence() {
    return TEST_SEQUENCE;
}

export function getNextTestSlug(currentSlug: TestSlugs): string | null {
    const currentIndex = TEST_SEQUENCE.indexOf(currentSlug);
    if (currentIndex === -1 || currentIndex === TEST_SEQUENCE.length - 1) {
        return null; // Not found or it's the last test
    }
    return TEST_SEQUENCE[currentIndex + 1];
}

// Random helper
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/** 
 * Returns a randomly chosen sourceOrder (1–6) and contentLength.
 */
export function assignContentLengthAndSourceOrder(): {
    sourceOrder: SourceOrder
    contentLength: ContentLengths
} {
    // all valid sourceOrder keys come from your mapping
    const sourceOrders = Object.keys(sourceOrderMappings)
        .map(o => Number(o) as SourceOrder);

    // all possible content lengths from your enum
    const lengths = Object.values(ContentLengths) as ContentLengths[];

    return {
        sourceOrder: getRandomElement(sourceOrders),
        contentLength: getRandomElement(lengths),
    };
}

const specificTestQuestions: { [key in TestSlugs]: Question[] } = {
    [TestSlugs.PUSH_NOTIFICATIONS]: pushNotificationsTests,
    [TestSlugs.EMAIL_INBOX]: emailInboxTests,
    [TestSlugs.MEETING_TRANSCRIPTION]: meetingTranscriptTests,
    [TestSlugs.PRESENTATION_SLIDE]: presentationSlideTests,
    [TestSlugs.PRODUCT_LISTING]: productListingTests,
    [TestSlugs.SEARCH_ENGINE]: searchEngineTests,
    [TestSlugs.PRACTICE]: practiceTests,

};

const commonTestQuestions: Question[] = [
    { id: 'confidence', text: 'How confident are you in your above answers?', type: 'likert7', options: ['Very confident', '', '', '', '', '', 'Very insecure'] },
    { id: 'satisfaction', text: 'How sufficient did you find the information presented in order to answer to the above questions?', type: 'likert7', options: ['Very sufficient', '', '', '', '', '', 'Very insufficient'] },
    { id: 'effort', text: 'How mentally demanding did you find answering the above questions to be?', type: 'likert7', options: ['Very demanding', '', '', '', '', '', 'Very effortless'] },
];