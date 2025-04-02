CREATE TABLE "newsletter" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME TO "admin";--> statement-breakpoint
ALTER TABLE "admin" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "username" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "admin" DROP COLUMN "updatedAt";--> statement-breakpoint
DROP TYPE "public"."role";