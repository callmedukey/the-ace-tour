import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const CreateNewsletterSchema = createInsertSchema(newsletter)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    email: z.string().email("Email is required"),
  });


  