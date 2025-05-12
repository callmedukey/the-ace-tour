import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const mice = pgTable("mice", {
  id: uuid().primaryKey().defaultRandom(),
  ENGtitle: text().notNull(),
  KOtitle: text().notNull(),
  ENGaccentText: text().notNull(),
  KOaccentText: text().notNull(),

  KOSuccessfulProjectsTitle: text().notNull(),
  KOSuccessfulProjectsNumber: text(),
  KOSuccessfulProjectsSuffix: text().notNull(),

  ENGsuccessfulProjectsTitle: text().notNull(),
  ENGsuccessfulProjectsNumber: text(),
  ENGsuccessfulProjectsSuffix: text().notNull(),

  KOTotalProjectsValueTitle: text().notNull(),
  KOTotalProjectsValueNumber: text(),
  KOTotalProjectsValueSuffix: text().notNull(),

  ENGtotalProjectsValueTitle: text().notNull(),
  ENGtotalProjectsValueNumber: text(),
  ENGtotalProjectsValueSuffix: text().notNull(),

  KOTotalParticipantsTitle: text().notNull(),
  KOTotalParticipantsNumber: text(),
  KOTotalParticipantsSuffix: text().notNull(),

  ENGtotalParticipantsTitle: text().notNull(),
  ENGtotalParticipantsNumber: text(),
  ENGtotalParticipantsSuffix: text().notNull(),

  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const miceRelations = relations(mice, ({ many }) => ({
  posts: many(posts),
}));

export const miceServices = pgTable("miceServices", {
  id: uuid().primaryKey().defaultRandom(),
  ENGtitle: text().notNull(),
  KOtitle: text().notNull(),
  ENGcontent: text().notNull(),
  KOcontent: text().notNull(),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  ENGtitle: text().notNull(),
  KOtitle: text().notNull(),
  ENGcontent: text().notNull(),
  KOcontent: text().notNull(),
  ENGaccentContent: text().notNull(),
  KOaccentContent: text().notNull(),
  imgPath: text().notNull(),
  imgENGAlt: text().notNull(),
  imgKOAlt: text().notNull(),

  mainKOContent: text().notNull(),
  mainENGContent: text().notNull(),

  // This is a foreign key reference to the mice table
  miceId: uuid().references(() => mice.id),
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text().$onUpdateFn(() => new Date().toISOString()),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  mice: one(mice, {
    fields: [posts.miceId],
    references: [mice.id],
  }),
  postImageImages: many(postImageImages),
}));

export const postImageImages = pgTable("postImageImages", {
  id: uuid().primaryKey().defaultRandom(),
  imgPath: text().notNull(),
  imgENGAlt: text().notNull(),
  imgKOAlt: text().notNull(),
  postId: uuid().references(() => posts.id),
});

export const postImageImagesRelations = relations(
  postImageImages,
  ({ one }) => ({
    post: one(posts, {
      fields: [postImageImages.postId],
      references: [posts.id],
    }),
  })
);

export const CreateMiceSchema = createInsertSchema(mice)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    ENGtitle: z.string().min(1, "Title is required"),
    KOtitle: z.string().min(1, "Title is required"),
    ENGaccentText: z
      .string()
      .min(1, "Accent text is required")
      .max(200, "Accent text cannot be longer than 200 characters"),
    KOaccentText: z
      .string()
      .min(1, "Accent text is required")
      .max(200, "Accent text cannot be longer than 200 characters"),

    KOSuccessfulProjectsTitle: z.string().min(1, "Title is required"),
    KOSuccessfulProjectsNumber: z.string(),
    KOSuccessfulProjectsSuffix: z.string().min(1, "Suffix is required"),

    ENGsuccessfulProjectsTitle: z.string().min(1, "Title is required"),
    ENGsuccessfulProjectsNumber: z.string(),
    ENGsuccessfulProjectsSuffix: z.string().min(1, "Suffix is required"),

    KOTotalProjectsValueTitle: z.string().min(1, "Title is required"),
    KOTotalProjectsValueNumber: z.string(),
    KOTotalProjectsValueSuffix: z.string().min(1, "Suffix is required"),

    ENGtotalProjectsValueTitle: z.string().min(1, "Title is required"),
    ENGtotalProjectsValueNumber: z.string(),
    ENGtotalProjectsValueSuffix: z.string().min(1, "Suffix is required"),

    KOTotalParticipantsTitle: z.string().min(1, "Title is required"),
    KOTotalParticipantsNumber: z.string(),
    KOTotalParticipantsSuffix: z.string().min(1, "Suffix is required"),

    ENGtotalParticipantsTitle: z.string().min(1, "Title is required"),
    ENGtotalParticipantsNumber: z.string(),
    ENGtotalParticipantsSuffix: z.string().min(1, "Suffix is required"),
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
    ENGaccentContent: z
      .string()
      .min(1, "Accent content is required")
      .max(5000, "Accent content cannot be longer than 5000 characters"),
    KOaccentContent: z
      .string()
      .min(1, "Accent content is required")
      .max(5000, "Accent content cannot be longer than 5000 characters"),
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
    postImageImages: z.array(
      z.object({
        imgPath: z.string().min(1, "Image path is required"),
        imgENGAlt: z
          .string()
          .min(1, "Image alt text is required")
          .max(200, "Image alt text cannot be longer than 200 characters"),
        imgKOAlt: z
          .string()
          .min(1, "Image alt text is required")
          .max(200, "Image alt text cannot be longer than 200 characters"),
      })
    ),
  });
