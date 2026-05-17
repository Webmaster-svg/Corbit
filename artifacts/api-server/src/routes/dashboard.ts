import { Router } from "express";
import { db, projectsTable, activityTable } from "@workspace/db";
import { eq, desc, sum } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import type { Request } from "express";

const router = Router();

router.get("/dashboard/summary", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;

  const projects = await db.select().from(projectsTable).where(eq(projectsTable.userId, user.id));

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === "published").length;
  const draftProjects = projects.filter((p) => p.status === "draft").length;
  const totalVisits = projects.reduce((acc, p) => acc + p.visitCount, 0);

  res.json({
    totalProjects,
    publishedProjects,
    draftProjects,
    totalVisits,
    plan: user.plan,
    storageUsedMb: Math.floor(Math.random() * 80) + 10,
    storageMaxMb: user.plan === "free" ? 100 : user.plan === "starter" ? 500 : user.plan === "pro" ? 2000 : 10000,
  });
});

router.get("/dashboard/recent-activity", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;

  const activity = await db
    .select()
    .from(activityTable)
    .where(eq(activityTable.userId, user.id))
    .orderBy(desc(activityTable.createdAt))
    .limit(10);

  res.json(
    activity.map((a) => ({
      id: a.id,
      type: a.type,
      label: a.label,
      projectId: a.projectId,
      projectName: a.projectName,
      createdAt: a.createdAt.toISOString(),
    }))
  );
});

export default router;
