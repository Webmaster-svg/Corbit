import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const activityTypeEnum = pgEnum("activity_type", [
  "project_created",
  "project_published",
  "project_updated",
  "project_deleted",
  "template_used",
]);

export const activityTable = pgTable("activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: activityTypeEnum("type").notNull(),
  label: text("label").notNull(),
  projectId: integer("project_id"),
  projectName: text("project_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Activity = typeof activityTable.$inferSelect;
