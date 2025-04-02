CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('Pending', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."inquiry_type" AS ENUM('Travel Consultion', 'MICE Service', 'Shuttle Service');--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"KOquestion" text NOT NULL,
	"ENGquestion" text NOT NULL,
	"KOanswer" text NOT NULL,
	"ENGanswer" text NOT NULL,
	"createdAt" text,
	"updatedAt" text
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "mice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ENGtitle" text NOT NULL,
	"KOtitle" text NOT NULL,
	"firstValue" integer NOT NULL,
	"firstValueENGText" text NOT NULL,
	"firstValueKOText" text NOT NULL,
	"secondValue" integer NOT NULL,
	"secondValueENGText" text NOT NULL,
	"secondValueKOText" text NOT NULL,
	"thirdValue" integer NOT NULL,
	"thirdValueENGText" text NOT NULL,
	"thirdValueKOText" text NOT NULL,
	"createdAt" text,
	"updatedAt" text
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ENGtitle" text NOT NULL,
	"KOtitle" text NOT NULL,
	"ENGcontent" text NOT NULL,
	"KOcontent" text NOT NULL,
	"imgPath" text NOT NULL,
	"imgENGAlt" text NOT NULL,
	"imgKOAlt" text NOT NULL,
	"miceId" uuid,
	"createdAt" text,
	"updatedAt" text
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"message" text NOT NULL,
	"type" "inquiry_type" DEFAULT 'Travel Consultion',
	"status" "inquiry_status" DEFAULT 'Pending',
	"createdAt" text,
	"updatedAt" text
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"KOalt" text NOT NULL,
	"ENGalt" text NOT NULL,
	"packageId" text
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" text PRIMARY KEY NOT NULL,
	"ENGaccentText" text NOT NULL,
	"KOaccentText" text NOT NULL,
	"ENGfirstPoint" text NOT NULL,
	"KOfirstPoint" text NOT NULL,
	"ENGsecondPoint" text NOT NULL,
	"KOsecondPoint" text NOT NULL,
	"ENGthirdPoint" text NOT NULL,
	"KOthirdPoint" text NOT NULL,
	"ENGprice" text NOT NULL,
	"KOprice" text NOT NULL,
	"ENGbuttonText" text NOT NULL,
	"KObuttonText" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_miceId_mice_id_fk" FOREIGN KEY ("miceId") REFERENCES "public"."mice"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_packageId_packages_id_fk" FOREIGN KEY ("packageId") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;