import { contentSources } from '../db/schema';
import { pushNotificationsData, pushNotificationsTests } from '../stimuli/pushNotifications';
import { Question } from './questionnaire'; // reuse Question type

export type SourceOrder = keyof typeof sourceOrderMappings; // Type: 1 | 2 | 3 | 4 | 5 | 6

export enum TestSlug {
    PUSH_NOTIFICATIONS = 'push-notifications',
    SEARCH_ENGINE = 'search-engine',
    EMAIL_INBOX = 'email-inbox',
    PRODUCT_LISTING = 'product-listing',
    MEETING_TRANSCRIPTION = 'meeting-transcription',
    PRESENTATION_SLIDE = 'presentation-slide',
}

const allTestSlugs = Object.values(TestSlug); // Your list of item slugs/IDs

const N = allTestSlugs.length;
if (N === 0 || N % 3 !== 0) {
    console.error("Warning: Ensure allTestSlugs is populated and its length is divisible by 3 for proper set division.");
    // Basic division - adjust indices if N is not perfectly divisible
}

const itemsPerSet = Math.floor(N / 3);

const testSets = {
    SetA: allTestSlugs.slice(0, itemsPerSet),
    SetB: allTestSlugs.slice(itemsPerSet, itemsPerSet * 2),
    SetC: allTestSlugs.slice(itemsPerSet * 2, N),
};

// Define the Full Latin Square mapping for 3 formats (6 orders) applied to Sets A, B, C
const sourceOrderMappings = {
    1: { SetA: contentSources.Original, SetB: contentSources.AI, SetC: contentSources.Programmatic },
    2: { SetA: contentSources.Original, SetB: contentSources.Programmatic, SetC: contentSources.AI }, 
    3: { SetA: contentSources.AI, SetB: contentSources.Original, SetC: contentSources.Programmatic },
    4: { SetA: contentSources.AI, SetB: contentSources.Programmatic, SetC: contentSources.Original }, 
    5: { SetA: contentSources.Programmatic, SetB: contentSources.Original, SetC: contentSources.AI }, 
    6: { SetA: contentSources.Programmatic, SetB: contentSources.AI, SetC: contentSources.Original },
} as const; // Use as const here too for precise keys ('1', '2', etc.)

// Function to get the assigned format for a specific item and participant order
function getAssignedSource(testSlug: TestSlug, sourceOrder: number): 'Original' | 'AI' | 'Programmatic' | undefined {
    const mapping = sourceOrderMappings[sourceOrder as SourceOrder];
    if (!mapping) return undefined; // Handle invalid order

    // Find which set the item belongs to
    if (testSets.SetA.includes(testSlug)) return mapping.SetA;
    if (testSets.SetB.includes(testSlug)) return mapping.SetB;
    if (testSets.SetC.includes(testSlug)) return mapping.SetC;

    return undefined; // Item not found in any set
}

export async function getTestContent(testSlug: TestSlug, sourceOrder: number, length: string): Promise<{ contentData: any } | null> {
    console.log(`Getting content for: test=${testSlug}, sourceOrder=${sourceOrder}, length=${length}`);

    const source = getAssignedSource(testSlug, sourceOrder)

    switch (testSlug) {
        case (TestSlug.PUSH_NOTIFICATIONS):
            return { contentData: [{}] };
        default:
            return null
    }
}

export async function getTestQuestions(testSlug: TestSlug): Promise<Question[]> {

    const specificQuestions = specificTestQuestions[testSlug];

    const commonQuestions = commonTestQuestions.map(question => ({
        ...question,
        id: `${testSlug}_${question.id}`, // Prefix the ID
    }));

    return [...(specificQuestions || []), ...commonQuestions];
}

const TEST_SEQUENCE = Object.values(TestSlug);

export function getTestSequence() {
    return TEST_SEQUENCE;
}

export function getNextTestSlug(currentSlug: TestSlug): string | null {
    const currentIndex = TEST_SEQUENCE.indexOf(currentSlug);
    if (currentIndex === -1 || currentIndex === TEST_SEQUENCE.length - 1) {
        return null; // Not found or it's the last test
    }
    return TEST_SEQUENCE[currentIndex + 1];
}

const specificTestQuestions: { [key in TestSlug]?: Question[] } = {
    [TestSlug.PUSH_NOTIFICATIONS]: pushNotificationsTests,
};

const commonTestQuestions: Question[] = [
    { id: 'confidence', text: 'How confident are you in your above answers?', type: 'likert7', options: ['Very confident', '', '', '', '', '', 'Very insecure'] },
    { id: 'satisfaction', text: 'How sufficient/satisfactory did you find the infromation presented in order to answer to the above questions?', type: 'likert7', options: ['Very sufficient', '', '', '', '', '', 'Very insufficient'] },
    { id: 'effort', text: 'How hard did you find the above questions to be?', type: 'likert7', options: ['Very hard', '', '', '', '', '', 'Very Easy'] },
];