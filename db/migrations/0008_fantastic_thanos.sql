ALTER TABLE "booking" RENAME COLUMN "address" TO "pickUpaddress";--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "dropOffaddress" text NOT NULL;