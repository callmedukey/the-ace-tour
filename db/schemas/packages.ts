import { relations } from "drizzle-orm";
import { pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const packages = pgTable("packages", {
  id: text("id").primaryKey(),
  ENGaccentText: text().notNull(),
  KOaccentText: text().notNull(),
  ENGfirstPoint: text().notNull(),
  KOfirstPoint: text().notNull(),
  ENGsecondPoint: text().notNull(),
  KOsecondPoint: text().notNull(),
  ENGthirdPoint: text().notNull(),
  KOthirdPoint: text().notNull(),
  ENGprice: text().notNull(),
  KOprice: text().notNull(),
  ENGbuttonText: text().notNull(),
  KObuttonText: text().notNull(),
  buttonLink: text().notNull(),
  mostPopular: boolean("mostPopular").notNull().default(false),
});

export const packagesRelations = relations(packages, ({ many }) => ({
  images: many(images),
}));

export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text().notNull(),
  KOalt: text().notNull(),
  ENGalt: text().notNull(),
  packageId: text().references(() => packages.id),
});

export const imagesRelations = relations(images, ({ one }) => ({
  package: one(packages, {
    fields: [images.packageId],
    references: [packages.id],
  }),
}));

export const CreatePackageSchema = createInsertSchema(packages)
  .omit({
    id: true,
  })
  .extend({
    ENGaccentText: z.string().min(1, "ENGaccentText is required"),
    KOaccentText: z.string().min(1, "KOaccentText is required"),
    ENGfirstPoint: z.string().min(1, "ENGfirstPoint is required"),
    KOfirstPoint: z.string().min(1, "KOfirstPoint is required"),
    ENGsecondPoint: z.string().min(1, "ENGsecondPoint is required"),
    KOsecondPoint: z.string().min(1, "KOsecondPoint is required"),
    ENGthirdPoint: z.string().min(1, "ENGthirdPoint is required"),
    KOthirdPoint: z.string().min(1, "KOthirdPoint is required"),
    ENGprice: z.string().min(1, "ENGprice is required"),
    KOprice: z.string().min(1, "KOprice is required"),
    ENGbuttonText: z.string().min(1, "ENGbuttonText is required"),
    KObuttonText: z.string().min(1, "KObuttonText is required"),
    buttonLink: z.string().min(1, "buttonLink is required"),
    mostPopular: z.boolean().default(false),
  });

export const CreateImageSchema = createInsertSchema(images)
  .omit({
    id: true,
    packageId: true,
  })
  .extend({
    path: z.string().min(1, "path is required"),
    KOalt: z.string().min(1, "KOalt is required"),
    ENGalt: z.string().min(1, "ENGalt is required"),
  });

export type PackageType = typeof packages.$inferSelect;
export type ImageType = typeof images.$inferSelect;
