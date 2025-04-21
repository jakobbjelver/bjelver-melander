import postgres from "postgres";
import { ParticipantsTable, QuestionnaireResponsesTable, TestContentTable, TestResponsesTable, TestsTable } from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";

// --- Database Connection (Keep your existing setup) ---
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// Include all tables in the schema object passed to drizzle
export const db = drizzle(sql, { schema: {
  ParticipantsTable,
  TestsTable,
  TestContentTable,
  QuestionnaireResponsesTable,
  TestResponsesTable,
  // Include enums if you need to reference them directly, though often not necessary here
} });