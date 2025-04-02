import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const faqs = pgTable("faqs", {
  id: serial().primaryKey().notNull(),
  KOquestion: text().notNull(),
  ENGquestion: text().notNull(),
  KOanswer: text().notNull(),
  ENGanswer: text().notNull(),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const CreateFaqSchema = createInsertSchema(faqs)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    KOquestion: z.string().min(1, { message: "Question is required" }),
    ENGquestion: z.string().min(1, { message: "Question is required" }),
    KOanswer: z.string().min(1, { message: "Answer is required" }),
    ENGanswer: z.string().min(1, { message: "Answer is required" }),
  });
