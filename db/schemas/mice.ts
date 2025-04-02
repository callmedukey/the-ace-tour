import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const mice = pgTable("mice", {
  id: uuid().primaryKey().defaultRandom(),
  ENGtitle: text().notNull(),
  KOtitle: text().notNull(),
  firstValue: integer().notNull(),
  firstValueENGText: text().notNull(),
  firstValueKOText: text().notNull(),
  secondValue: integer().notNull(),
  secondValueENGText: text().notNull(),
  secondValueKOText: text().notNull(),
  thirdValue: integer().notNull(),
  thirdValueENGText: text().notNull(),
  thirdValueKOText: text().notNull(),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const miceRelations = relations(mice, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  ENGtitle: text().notNull(),
  KOtitle: text().notNull(),
  ENGcontent: text().notNull(),
  KOcontent: text().notNull(),
  imgPath: text().notNull(),
  imgENGAlt: text().notNull(),
  imgKOAlt: text().notNull(),
  // This is a foreign key reference to the mice table
  miceId: uuid().notNull(),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const postsRelations = relations(posts, ({ one }) => ({
  mice: one(mice, {
    fields: [posts.miceId],
    references: [mice.id],
  }),
}));

export const CreateMiceSchema = createInsertSchema(mice)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    ENGtitle: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title cannot be longer than 200 characters"),
    KOtitle: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title cannot be longer than 200 characters"),
    firstValue: z.coerce
      .number()
      .min(1, "First value is required")
      .max(100, "First value cannot be greater than 100"),
    secondValue: z.coerce
      .number()
      .min(1, "First value is required")
      .max(100, "First value cannot be greater than 100"),
    thirdValue: z.coerce
      .number()
      .min(1, "First value is required")
      .max(100, "First value cannot be greater than 100"),
    firstValueENGText: z
      .string()
      .min(1, "First value text is required")
      .max(200, "First value text cannot be longer than 200 characters"),
    firstValueKOText: z
      .string()
      .min(1, "First value text is required")
      .max(200, "First value text cannot be longer than 200 characters"),
    secondValueKOText: z
      .string()
      .min(1, "Second value text is required")
      .max(200, "Second value text cannot be longer than 200 characters"),
    secondValueENGText: z
      .string()
      .min(1, "Second value text is required")
      .max(200, "Second value text cannot be longer than 200 characters"),
    thirdValueKOText: z
      .string()
      .min(1, "Third value text is required")
      .max(200, "Third value text cannot be longer than 200 characters"),
    thirdValueENGText: z
      .string()
      .min(1, "Third value text is required")
      .max(200, "Third value text cannot be longer than 200 characters"),
  });

export const CreatePostSchema = createInsertSchema(posts)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    ENGtitle: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title cannot be longer than 200 characters"),
    KOtitle: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title cannot be longer than 200 characters"),
    ENGcontent: z
      .string()
      .min(1, "Content is required")
      .max(5000, "Content cannot be longer than 5000 characters"),
    KOcontent: z
      .string()
      .min(1, "Content is required")
      .max(5000, "Content cannot be longer than 5000 characters"),
    imgPath: z.string().min(1, "Image path is required"),
    imgKOAlt: z
      .string()
      .min(1, "Image alt text is required")
      .max(200, "Image alt text cannot be longer than 200 characters"),
    imgENGAlt: z
      .string()
      .min(1, "Image alt text is required")
      .max(200, "Image alt text cannot be longer than 200 characters"),
    miceId: z.string().uuid("Must be a valid UUID"),
  });
