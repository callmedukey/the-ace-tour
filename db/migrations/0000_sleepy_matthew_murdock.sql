CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"role" "role" DEFAULT 'user',
	"createdAt" text,
	"updatedAt" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"initial" text NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" text,
	"updatedAt" text
);
