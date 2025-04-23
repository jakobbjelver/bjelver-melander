import {
  pgTable,
  serial, // Keep if needed elsewhere, but prefer uuid for participants
  text,
  timestamp,
  uniqueIndex,
  uuid, // Use UUID for participant IDs
  varchar, // Good for slugs or IDs with max length
  integer, // For numerical responses like Likert scales
  jsonb, // Flexible storage for test content
  pgEnum, // For defined sets of values like groups
  primaryKey, // For composite keys if needed
  foreignKey,
  boolean, // For relationships
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { enumToPgEnum } from '../utils';
import { ContentLengths, ContentSources, QuestionnaireTypes, TestSlugs } from '@/types/test';

// --- Enums for Experimental Conditions (Recommended for data integrity) ---

export const contentSourceEnum = pgEnum('content_source', enumToPgEnum(ContentSources));
export const contentLengthEnum = pgEnum('content_length', enumToPgEnum(ContentLengths));
export const testSlugEnum = pgEnum('test_slug', enumToPgEnum(TestSlugs));
export const questionnaireTypeEnum = pgEnum('questionnaire_type', enumToPgEnum(QuestionnaireTypes));

// --- Participants Table ---
// Stores information about each participant session and their assigned group

export const ParticipantsTable = pgTable('participants', {
  // Generate UUID client-side before inserting or use default server-side generation
  id: uuid('id').primaryKey().defaultRandom(),
  assignedLength: contentLengthEnum('assigned_length').notNull(),
  assignedSourceOrder: integer('assigned_source_order').notNull(),
  age: integer('age').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  // Optional: Store user agent or other non-identifying technical details
  isPilot: boolean('is_pilot'),
  isControlled: boolean('is_controlled'),
  isMobile: boolean('is_mobile'),
});

export type Participant = InferSelectModel<typeof ParticipantsTable>;
// --- Questionnaire Responses Table ---
// Stores answers to the pre and post questionnaires

export const QuestionnaireResponsesTable = pgTable('questionnaire_responses', {
  id: serial('id').primaryKey(),
  participantId: uuid('participant_id').notNull().references(() => ParticipantsTable.id, { onDelete: 'cascade' }), // Link to participant
  questionId: varchar('question_id', { length: 100 }).notNull(), // Identifier for the specific question (e.g., 'trust_q1', 'workload_q3')
  responseValue: integer('response_value').notNull(), // Assuming 7-point Likert scale (1-7)
  questionnaireType: questionnaireTypeEnum('questionnaire_type').notNull(), // 'pre' or 'post'
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export type QuestionnaireResponse = InferSelectModel<typeof QuestionnaireResponsesTable>;

// --- Test Responses Table ---
// Stores answers to questions asked immediately after each test exposure

export const TestResponsesTable = pgTable('test_responses', {
  id: serial('id').primaryKey(),
  participantId: uuid('participant_id').notNull().references(() => ParticipantsTable.id, { onDelete: 'cascade' }), // Link to participant
  testSlug: testSlugEnum('test_slug').notNull(), // Link to the specific test shown
  // Optional: Link to the specific content item shown, if needed for very fine-grained analysis
  // testContentId: integer('test_content_id').references(() => TestContentTable.id),
  questionId: varchar('question_id', { length: 100 }).notNull(), // Identifier for the question (e.g., 'recall_count', 'credibility_rating')
  // Response value might be integer, text, etc. depending on the question. Text is flexible.
  // Use integer if it's always numerical (like a rating scale). Use text if it could be free-form or categorical.
  responseValue: text('response_value'),
  contentSource: contentSourceEnum('content_source').notNull(),
  contentLength: contentLengthEnum('content_length').notNull(),
  // Optional: Store reaction time in milliseconds if measured
  reactionTimeMs: integer('reaction_time_ms'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

export type TestResponse = InferSelectModel<typeof TestResponsesTable>;