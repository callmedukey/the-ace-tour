import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const admin = pgTable("admin", {
  username: text().primaryKey().notNull(),
  password: text().notNull(),
  salt: text().notNull(),
});

export const adminSelectSchema = createSelectSchema(admin);
export const adminSignInSchema = createSelectSchema(admin)
  .omit({
    salt: true,
  })
  .extend({
    username: z.string().min(1, { message: "Please enter a valid username" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });

export const AdminSignUpSchema = createInsertSchema(admin)
  .extend({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .omit({ salt: true });
