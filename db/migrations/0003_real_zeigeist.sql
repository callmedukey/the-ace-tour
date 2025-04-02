CREATE TYPE "public"."inquiry_status" AS ENUM('Pending', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."inquiry_type" AS ENUM('Travel Consultion', 'MICE Service', 'Shuttle Service');--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"message" text NOT NULL,
	"type" "inquiry_type" DEFAULT 'Travel Consultion',
	"status" "inquiry_status" DEFAULT 'Pending',
	"createdAt" text,
	"updatedAt" text,
	CONSTRAINT "inquiries_email_unique" UNIQUE("email")
);
