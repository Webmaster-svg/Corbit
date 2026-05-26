import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const masterThemesTable = pgTable("master_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  sourceFolderPath: text("source_folder_path").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPro: boolean("is_pro").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMasterThemeSchema = createInsertSchema(masterThemesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMasterTheme = z.infer<typeof insertMasterThemeSchema>;
export type MasterTheme = typeof masterThemesTable.$inferSelect;
