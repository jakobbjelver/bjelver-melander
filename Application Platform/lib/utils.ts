import { StimuliItem } from "@/types/stimuli";
import { ContentLengths } from "@/types/test";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function enumToPgEnum<T extends Record<string, any>>(
    myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
    return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export function filterStimuliByLength(
    items: StimuliItem,
    contentLength: ContentLengths
) {
    if (contentLength === ContentLengths.Shorter) {
        // Filter out items marked as irrelevant
        const relevantItems = items.filter(item => !item.irrelevant);

        // If the number of relevant items is less than 5,
        // add back irrelevant items until we reach 5.
        if (relevantItems.length < 5) {
            const itemsNeeded = 5 - relevantItems.length;
            const irrelevantItems = items.filter(item => item.irrelevant);

            // Add back the first 'itemsNeeded' irrelevant items
            const itemsToAddToReachMin = irrelevantItems.slice(0, itemsNeeded);

            return [...relevantItems, ...itemsToAddToReachMin];
        } else {
            // If 5 or more relevant items exist, return only the relevant ones
            return relevantItems;
        }
    } else if (contentLength === ContentLengths.Longer) {
        // Find the index of the first irrelevant item
        const irrelevantIndex = items.findIndex(item => item.irrelevant);

        // For 'Longer' content, the requirement is to remove an irrelevant item.
        // If none exists, we cannot fulfill the requirement.
        if (irrelevantIndex === -1) {
            // Throw an error because the input data does not meet the function's
            // contract for 'Longer' content (expected at least one irrelevant item).
            throw new Error("Cannot filter for 'Longer' content: No irrelevant item found to remove.");
        } else {
            // Create a copy of the array to avoid modifying the original
            const longerArray = [...items];
            // Remove exactly one item at the found index (which is guaranteed irrelevant)
            longerArray.splice(irrelevantIndex, 1);

            // Assuming the original array was 10 items long, the result will be 9.
            // No explicit check for input length 10 or output length 9 is strictly
            // necessary within the function logic itself, as the requirement
            // is primarily about removing an irrelevant item and getting 9 results
            // from an assumed 10-item input.
            return longerArray;
        }
    } else {
        // This case should ideally not be reachable if using the ContentLengths enum
        throw new Error(`Invalid contentLength: ${contentLength}`);
    }
}

export function formatString(inputString: string): string {

    if(inputString === 'ai') return 'AI' // Special case

    // Replace all dashes with spaces
    const stringWithSpaces = inputString.replace(/-/g, ' ');

    // Split the string into words
    const words = stringWithSpaces.split(' ');

    // Process each word: capitalize the first letter and lowercase the rest
    const processedWords = words.map(word => {
        if (word.length === 0) {
            return ''; // Handle empty strings that might result from multiple spaces
        }
        // Capitalize the first letter and make the rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Join the processed words back into a single string with spaces
    return processedWords.join(' ');
}
