CREATE TYPE "public"."booking_status" AS ENUM('CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."booking_type" AS ENUM('One Way', 'Round Trip');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PAID');--> statement-breakpoint
CREATE TABLE "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripeId" text NOT NULL,
	"customerEmail" text NOT NULL,
	"customerName" text NOT NULL,
	"tripType" "booking_type" NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"departingDate" date NOT NULL,
	"returningDate" date,
	"departureTime" text NOT NULL,
	"returnTime" text,
	"passengers" integer NOT NULL,
	"address" text,
	"price" double precision NOT NULL,
	"status" "booking_status" NOT NULL,
	"paymentStatus" "payment_status" NOT NULL,
	"paymentId" text,
	"paymentMethod" text,
	"paidAt" date,
	"refundedAt" date,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
