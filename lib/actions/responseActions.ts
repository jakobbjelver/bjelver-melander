
'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache'; // May not be needed if just redirecting
import { redirect } from 'next/navigation';
import { getNextTestSlug, getTestSequence, TestSlug } from '../data/tests';
import { contentLengths, contentSources, QuestionnaireResponse, QuestionnaireResponsesTable, questionnaireTypes, TestResponse, TestResponsesTable } from '../db/schema';

export async function saveQuestionnaireResponses(
  formData: FormData
): Promise<{ error?: string; nextPath?: string }> {
  const participantId = formData.get('participantId') as string;
  const questionnaireType = formData.get('questionnaireType') as questionnaireTypes;

  // Validate input early
  if (!participantId || !['pre', 'post'].includes(questionnaireType)) {
    return { error: 'Invalid participant or questionnaire type provided.' };
  }

  // Use a typed array matching the insert schema
  const responsesToInsert = [];

  // Extract responses from FormData
  let hasResponses = false;
  for (const [key, value] of formData.entries()) {
    // Skip the metadata fields
    if (key === 'participantId' || key === 'questionnaireType') {
      continue;
    }
    hasResponses = true; // Mark that we found at least one potential question response

    const responseValue = parseInt(value as string, 10);
    if (isNaN(responseValue)) {
      // Handle non-integer responses gracefully
      console.warn(`Invalid integer value for question ${key}: '${value}'`);
      // Option 1: Return error immediately
      // return { error: `Invalid response value for question ${key}. Please enter a number.` };
      // Option 2: Skip this question (might be preferable for robustness)
      continue;
    }
    responsesToInsert.push({
      participantId,
      questionId: key,
      responseValue,
      questionnaireType,
    });
  }

  // Check if any valid responses were actually processed
  if (!hasResponses) {
    return { error: 'No questionnaire responses submitted.' };
  }
  if (responsesToInsert.length === 0 && hasResponses) {
    return { error: 'Submitted responses were not in the expected format.' };
  }


  try {
    // --- Drizzle Bulk Insert ---
    if (responsesToInsert.length > 0) {
      await db.insert(QuestionnaireResponsesTable).values(responsesToInsert);
      console.log(`DB Insert Success: ${responsesToInsert.length} ${questionnaireType} responses for participant ${participantId}`);
    } else {
      console.log(`No valid ${questionnaireType} responses to insert for participant ${participantId}`);
      // Decide if this should be an error or just proceed
      // return { error: 'No valid responses were provided.' };
    }
    // --- End Drizzle Bulk Insert ---


    // Determine next step (same logic as before)
    let nextPath: string;
    if (questionnaireType === 'pre') {
      const testSequence = getTestSequence();
      const firstTestSlug = testSequence[0];
      if (!firstTestSlug) throw new Error("Test sequence is empty or could not be retrieved.");
      nextPath = `/participant/${participantId}/test/${firstTestSlug}/content`;
    } else { // 'post'
      nextPath = `/participant/${participantId}/complete`;
    }
    return { nextPath }; // Return path for client-side navigation

  } catch (error) {
    console.error(`Error saving ${questionnaireType} responses to DB:`, error);
    return { error: `Failed to save ${questionnaireType} responses due to a database error.` };
  }
}

// Define the expected signature for the server action
export type TestResponseAction = (
    formData: FormData,
) => Promise<{ error?: string; nextPath?: string }>;

// --- Action 3: Save Test Responses ---
export async function saveTestResponses(
  startTime: number,
  contentSource: contentSources,
  contentLength: contentLengths,
  formData: FormData
): Promise<{ error?: string; nextPath?: string }> {
  const participantId = formData.get('participantId') as string;
  const testSlug = formData.get('testSlug') as TestSlug;

  if (!participantId || !testSlug) {
    return { error: 'Missing required participant or test information.' };
  }

  const reactionTimeMs = new Date().getTime() - startTime

  // Use a typed array matching the insert schema
  const responsesToInsert = [];

  let hasResponses = false;
  // Extract responses from FormData
  for (const [key, value] of formData.entries()) {
    if (key === 'participantId' || key === 'testSlug') {
      continue;
    }
    hasResponses = true;

    // Basic validation: ensure value is a non-empty string
    if (typeof value !== 'string' || value.trim() === '') {
      console.warn(`Missing response value for question ${key} in test ${testSlug}`);
      // Option 1: Error out
      // return { error: `Missing response value for question ${key}.` };
      // Option 2: Skip
      continue;
    }
    responsesToInsert.push({
      participantId,
      testSlug,
      questionId: key,
      responseValue: value, // Store raw string value
      reactionTimeMs,
      contentSource,
      contentLength
    });
  }

  if (!hasResponses) {
    return { error: 'No test responses submitted.' };
  }
  if (responsesToInsert.length === 0 && hasResponses) {
    return { error: 'Submitted responses were not in the expected format.' };
  }


  try {
    // --- Drizzle Bulk Insert ---
    if (responsesToInsert.length > 0) {
      await db.insert(TestResponsesTable).values(responsesToInsert);
      console.log(`DB Insert Success: ${responsesToInsert.length} responses for test ${testSlug}, participant ${participantId}`);
    } else {
      console.log(`No valid responses to insert for test ${testSlug}, participant ${participantId}`);
      // return { error: 'No valid responses were provided for this test.' };
    }
    // --- End Drizzle Bulk Insert ---

    // Optional: Revalidate paths if needed
    // revalidatePath(`/participant/${participantId}/results`);

    // Success - proceed

      // 4. Determine the next step (next test slug or post-questionnaire)
  const nextSlug = getNextTestSlug(testSlug);
  const nextPath = nextSlug
    ? `/participant/${participantId}/test/${nextSlug}/content`
    : `/participant/${participantId}/post`;
  // --- End Server-Side Data Fetching ---

  return { nextPath };

  } catch (error) {
    console.error(`Error saving test responses for ${testSlug} to DB:`, error);
    return { error: `Failed to save responses for this test due to a database error.` };
  }

}