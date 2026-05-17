import { pgTable, serial, text, boolean, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const templateCategoryEnum = pgEnum("template_category", [
  "business",
  "portfolio",
  "ecommerce",
  "blog",
  "restaurant",
  "agency",
  "landing",
]);

export const templatesTable = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: templateCategoryEnum("category").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  previewUrl: text("preview_url"),
  isPro: boolean("is_pro").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templatesTable).omit({ id: true, createdAt: true });
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templatesTable.$inferSelect;
