CREATE TYPE "public"."content_length" AS ENUM('Short', 'Medium', 'Long');--> statement-breakpoint
CREATE TYPE "public"."content_source" AS ENUM('AI', 'Original', 'Programmatic');--> statement-breakpoint
CREATE TYPE "public"."questionnaire_type" AS ENUM('pre', 'post');--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assigned_source" "content_source" NOT NULL,
	"assigned_length" "content_length" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_mobile" boolean
);
--> statement-breakpoint
CREATE TABLE "questionnaire_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_id" uuid NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"response_value" integer NOT NULL,
	"questionnaire_type" "questionnaire_type" NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_slug" varchar(50) NOT NULL,
	"content_source" "content_source" NOT NULL,
	"content_length" "content_length" NOT NULL,
	"content_data" jsonb NOT NULL,
	"version" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "test_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_id" uuid NOT NULL,
	"test_slug" varchar(50) NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"response_value" text,
	"reaction_time_ms" integer,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"slug" varchar(50) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sequence_order" integer,
	CONSTRAINT "tests_sequence_order_unique" UNIQUE("sequence_order")
);
--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_content" ADD CONSTRAINT "test_content_test_slug_tests_slug_fk" FOREIGN KEY ("test_slug") REFERENCES "public"."tests"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_test_slug_tests_slug_fk" FOREIGN KEY ("test_slug") REFERENCES "public"."tests"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_content_idx" ON "test_content" USING btree ("test_slug","content_source","content_length","version");