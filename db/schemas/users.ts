import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique().notNull(),
  name: text().notNull(),
  password: text().notNull(),
  salt: text().notNull(),
  role: roleEnum().default("user"),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const usersSelectSchema = createSelectSchema(users);
export const userSignInSchema = createSelectSchema(users)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    salt: true,
    role: true,
    name: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });

export const userSignUpSchema = createInsertSchema(users)
  .extend({
    email: z.string().email("Please enter a valid email"),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .omit({ id: true, createdAt: true, updatedAt: true });
