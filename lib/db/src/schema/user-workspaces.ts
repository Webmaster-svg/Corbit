import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userWorkspacesTable = pgTable("user_workspaces", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activeThemeId: integer("active_theme_id"),
  dbFolderPath: text("db_folder_path").notNull().unique(),
  pageJson: jsonb("page_json"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserWorkspaceSchema = createInsertSchema(userWorkspacesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserWorkspace = z.infer<typeof insertUserWorkspaceSchema>;
export type UserWorkspace = typeof userWorkspacesTable.$inferSelect;
