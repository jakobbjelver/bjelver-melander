CREATE TYPE "public"."test_slug" AS ENUM('practice', 'push-notifications', 'search-engine', 'email-inbox', 'product-listing', 'meeting-transcription', 'presentation-slide');--> statement-breakpoint
ALTER TABLE "test_responses" ALTER COLUMN "test_slug" SET DATA TYPE test_slug;--> statement-breakpoint
ALTER TABLE "public"."participants" ALTER COLUMN "assigned_length" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."test_responses" ALTER COLUMN "content_length" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."content_length";--> statement-breakpoint
CREATE TYPE "public"."content_length" AS ENUM('longer', 'shorter');--> statement-breakpoint
ALTER TABLE "public"."participants" ALTER COLUMN "assigned_length" SET DATA TYPE "public"."content_length" USING "assigned_length"::"public"."content_length";--> statement-breakpoint
ALTER TABLE "public"."test_responses" ALTER COLUMN "content_length" SET DATA TYPE "public"."content_length" USING "content_length"::"public"."content_length";--> statement-breakpoint
ALTER TABLE "public"."test_responses" ALTER COLUMN "content_source" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."content_source";--> statement-breakpoint
CREATE TYPE "public"."content_source" AS ENUM('ai', 'original', 'programmatic');--> statement-breakpoint
ALTER TABLE "public"."test_responses" ALTER COLUMN "content_source" SET DATA TYPE "public"."content_source" USING "content_source"::"public"."content_source";