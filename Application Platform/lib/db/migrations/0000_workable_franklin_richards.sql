CREATE TYPE "public"."content_length" AS ENUM('Longer', 'Shorter');--> statement-breakpoint
CREATE TYPE "public"."content_source" AS ENUM('AI', 'Original', 'Programmatic');--> statement-breakpoint
CREATE TYPE "public"."questionnaire_type" AS ENUM('pre', 'post');--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assigned_length" "content_length" NOT NULL,
	"assigned_source_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"is_mobile" boolean
);
--> statement-breakpoint
CREATE TABLE "questionnaire_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_id" uuid NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"response_value" integer NOT NULL,
	"questionnaire_type" "questionnaire_type" NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_id" uuid NOT NULL,
	"test_slug" varchar(50) NOT NULL,
	"question_id" varchar(100) NOT NULL,
	"response_value" text,
	"content_source" "content_source" NOT NULL,
	"content_length" "content_length" NOT NULL,
	"reaction_time_ms" integer,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;