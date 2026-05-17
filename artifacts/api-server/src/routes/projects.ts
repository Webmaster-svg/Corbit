import { Router } from "express";
import { db, projectsTable, activityTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import {
  CreateProjectBody,
  GetProjectParams,
  UpdateProjectParams,
  UpdateProjectBody,
  DeleteProjectParams,
  PublishProjectParams,
} from "@workspace/api-zod";
import type { Request } from "express";

const router = Router();

function formatProject(p: typeof projectsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    status: p.status,
    templateId: p.templateId,
    thumbnailUrl: p.thumbnailUrl,
    domain: p.domain,
    userId: p.userId,
    pageCount: p.pageCount,
    visitCount: p.visitCount,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/projects", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const projects = await db.select().from(projectsTable).where(eq(projectsTable.userId, user.id));
  res.json(projects.map(formatProject));
});

router.post("/projects", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const [project] = await db.insert(projectsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    templateId: parsed.data.templateId ?? null,
    userId: user.id,
    status: "draft",
    thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/800/500`,
  }).returning();

  await db.insert(activityTable).values({
    userId: user.id,
    type: "project_created",
    label: `Created project "${project.name}"`,
    projectId: project.id,
    projectName: project.name,
  });

  if (parsed.data.templateId) {
    await db.insert(activityTable).values({
      userId: user.id,
      type: "template_used",
      label: `Used a template for "${project.name}"`,
      projectId: project.id,
      projectName: project.name,
    });
  }

  res.status(201).json(formatProject(project));
});

router.get("/projects/:id", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const parsed = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, parsed.data.id), eq(projectsTable.userId, user.id)))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(formatProject(project));
});

router.patch("/projects/:id", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const paramsParsed = UpdateProjectParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateProjectBody.safeParse(req.body);

  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const [project] = await db.update(projectsTable)
    .set({
      ...bodyParsed.data,
      updatedAt: new Date(),
    })
    .where(and(eq(projectsTable.id, paramsParsed.data.id), eq(projectsTable.userId, user.id)))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  await db.insert(activityTable).values({
    userId: user.id,
    type: "project_updated",
    label: `Updated project "${project.name}"`,
    projectId: project.id,
    projectName: project.name,
  });

  res.json(formatProject(project));
});

router.delete("/projects/:id", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const parsed = DeleteProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, parsed.data.id), eq(projectsTable.userId, user.id)))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  await db.insert(activityTable).values({
    userId: user.id,
    type: "project_deleted",
    label: `Deleted project "${project.name}"`,
    projectName: project.name,
  });

  await db.delete(projectsTable).where(eq(projectsTable.id, project.id));
  res.json({ ok: true });
});

router.post("/projects/:id/publish", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const parsed = PublishProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [existing] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, parsed.data.id), eq(projectsTable.userId, user.id)))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const newStatus = existing.status === "published" ? "draft" : "published";
  const domain = newStatus === "published" ? `${existing.name.toLowerCase().replace(/\s+/g, "-")}.sitecraft.dz` : null;

  const [project] = await db.update(projectsTable)
    .set({ status: newStatus, domain, updatedAt: new Date() })
    .where(eq(projectsTable.id, existing.id))
    .returning();

  if (newStatus === "published") {
    await db.insert(activityTable).values({
      userId: user.id,
      type: "project_published",
      label: `Published "${project.name}"`,
      projectId: project.id,
      projectName: project.name,
    });
  }

  res.json(formatProject(project));
});

export default router;
