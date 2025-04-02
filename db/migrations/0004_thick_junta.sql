ALTER TABLE "public"."booking" ALTER COLUMN "paymentStatus" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_status";--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('Pending', 'Paid');--> statement-breakpoint
ALTER TABLE "public"."booking" ALTER COLUMN "paymentStatus" SET DATA TYPE "public"."payment_status" USING "paymentStatus"::"public"."payment_status";