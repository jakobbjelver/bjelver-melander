'use server';
import { Participant, ParticipantsTable } from '@/lib/db/schema'; // Your schema
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { cookies } from 'next/headers'; // Import cookies
import { eq } from 'drizzle-orm';
import { ContentLengths } from '@/types/test';

// Basic random assignment (improve with better randomization if needed)
const lengths = Object.values(ContentLengths);

const sourceOrders: number[] = [1, 2, 3]; // Example: Define 3 counterbalancing orders

const CONTROLLED_CODE = 'experimentLUSEM2025'

const PILOT_CODE = 'pilotLUSEM2025'

export async function createParticipant(age: number, controlledCode: string, pilotCode: string, participant?: Partial<Participant>): Promise<{ participantId?: string; error?: string }> {
  const cookieStore = await cookies();

  if(controlledCode && controlledCode !== CONTROLLED_CODE) {
    return { error: 'The instructor code you entered is incorrect.' };
  }

  if(pilotCode && pilotCode !== PILOT_CODE) {
    return { error: 'The pilot code you entered is incorrect.' };
  }

  const isControlled = controlledCode === CONTROLLED_CODE
  const isPilot = pilotCode === PILOT_CODE

  const existingParticipantId = cookieStore.get('participantId')?.value;

  /* 
  // Enable in prod
  if (existingParticipantId) {
    console.log(`Participant already exists with id: ${existingParticipantId}`);
    return { participantId: existingParticipantId }; // Or redirect, or return an error
  }
  */

  try {
    const participantId = uuidv4();

    // Assign Length BETWEEN subjects
    const assignedLength = lengths[Math.floor(Math.random() * lengths.length)];
    // Assign Format Order BETWEEN subjects (for within-subjects counterbalancing)
    const assignedSourceOrder = sourceOrders[Math.floor(Math.random() * sourceOrders.length)];

    // --- Drizzle Insert ---
    await db.insert(ParticipantsTable).values({
      id: participantId,
      assignedLength,
      assignedSourceOrder,
      isControlled,
      isPilot,
      age,
      ...participant
      // createdAt will be handled by defaultNow() in the schema
    });
    // --- End Drizzle Insert ---

    // Set the cookie
    cookieStore.set('participantId', participantId);

    console.log(`DB Insert Success: id=${participantId}, sourceOrder=${assignedSourceOrder}, length=${assignedLength}`);

    // Return ID for client-side redirect (more flexible than server-side redirect here)
    return { participantId: participantId };

  } catch (error) {
    console.error("Error creating participant:", error);
    return { error: 'Failed to initialize participant session.' };
  }
  // Server-side redirect (alternative)
  // redirect(`/participant/${participantId}/pre`);
}

export async function getParticipantAction(participantId: string): Promise<Participant | null> {
  try {
    // --- Drizzle DB Fetch Logic using your schema ---
    const participants = await db
      .select() // Select only the assignedLength column
      .from(ParticipantsTable)
      .where(eq(ParticipantsTable.id, participantId)) // Find by participant ID
      .limit(1); // Expecting at most one participant per ID

    if (participants.length > 0) {
      return participants[0] as Participant;
    } else {
      console.log(`Participant ${participantId} not found in DB.`);
      return null;
    }

  } catch (error) {
    console.error(`Database error fetching participant group for ${participantId}:`, error);
    // Depending on how you handle errors, you might re-throw or return null/specific error object
    return null;
  }
}