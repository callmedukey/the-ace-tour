ALTER TABLE "faqs" RENAME COLUMN "question" TO "ENGquestion";--> statement-breakpoint
ALTER TABLE "faqs" RENAME COLUMN "answer" TO "ENGanswer";--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "KOquestion" text NOT NULL;--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "KOanswer" text NOT NULL;