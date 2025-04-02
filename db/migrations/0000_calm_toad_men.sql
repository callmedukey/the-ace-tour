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
	"miceId" uuid NOT NULL,
	"createdAt" text,
	"updatedAt" text
);
