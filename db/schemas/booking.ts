import {
  pgTable,
  pgEnum,
  date,
  integer,
  uuid,
  text,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const bookingStatus = pgEnum("booking_status", [
  "CONFIRMED",
  "CANCELLED",
]);

export const paymentStatus = pgEnum("payment_status", ["Pending", "Paid"]);

export const bookingType = pgEnum("booking_type", ["One Way", "Round Trip"]);

export const booking = pgTable("booking", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeId: text().notNull(),
  customerEmail: text().notNull(),
  customerName: text().notNull(),
  tripType: bookingType().notNull(),
  from: text().notNull(),
  to: text().notNull(),
  departingDate: date().notNull(),
  returningDate: date(),
  departureTime: text().notNull(),
  returnTime: text(),
  passengers: integer().notNull(),
  pickUpaddress: text().notNull(),
  dropOffaddress: text().notNull(),
  price: doublePrecision().notNull(),
  status: bookingStatus().notNull(),
  paymentStatus: paymentStatus().notNull(),
  paymentId: text(),
  paymentMethod: text(),
  paidAt: date(),
  luggage: integer(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const CreateBooking = createInsertSchema(booking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
