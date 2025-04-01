import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const reviews = pgTable("reviews", {
  id: serial().primaryKey().notNull(),
  initial: text().notNull(),
  name: text().notNull(),
  content: text().notNull(),

  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const CreateReviewSchema = createInsertSchema(reviews)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    initial: z
      .string()
      .min(1, { message: "Initial must be 1 character" })
      .max(10, { message: "Initial must be 1 character" }),
    name: z
      .string()
      .min(3, { message: "Name must be atleast 3 characters" })
      .max(10, { message: "Name must be less than 10 characters" }),
    content: z
      .string()
      .min(3, { message: "Content must be atleast 3 characters" })
      .max(200, { message: "Content must be less than 200 characters" }),
  });

export const SelectReviewSchema = createSelectSchema(reviews);

export type ReviewType = z.infer<typeof SelectReviewSchema>;
export type ReviewTypeNoDate = Omit<ReviewType, "createdAt" | "updatedAt">;
