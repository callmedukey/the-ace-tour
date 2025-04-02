import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const inquiryTypeEnum = pgEnum("inquiry_type", [
  "Travel Consultion",
  "MICE Service",
  "Shuttle Service",
]);

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "Pending",
  "Resolved",
  "Closed",
]);

export const inquiries = pgTable("inquiries", {
  id: serial().primaryKey().notNull(),
  email: text().notNull(),
  name: text().notNull(),
  message: text().notNull(),
  type: inquiryTypeEnum().default("Travel Consultion"),
  status: inquiryStatusEnum().default("Pending"),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const CreateInquirySchema = createInsertSchema(inquiries)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email"),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    message: z.string().min(1, { message: "Message is required" }),
    type: z.enum(inquiryTypeEnum.enumValues).default("Travel Consultion"),
  });

export type CreateInquiryType = z.infer<typeof CreateInquirySchema>;
