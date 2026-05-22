import { Router } from "express";
import { db, projectsTable, activityTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import dns from "dns";
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
  let domain = p.domain;
  let customDomain: string | null = null;
  let customDomainStatus: string | null = null;

  if (domain && typeof domain === "string" && domain.includes("|")) {
    const parts = domain.split("|");
    domain = parts[0] || null;
    customDomain = parts[1] || null;
    customDomainStatus = parts[2] || null;
  }

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    status: p.status,
    templateId: p.templateId,
    templateConfig: p.templateConfig,
    thumbnailUrl: p.thumbnailUrl,
    domain: domain,
    customDomain: customDomain,
    customDomainStatus: customDomainStatus,
    userId: p.userId,
    pageCount: p.pageCount,
    visitCount: p.visitCount,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    dnsConfig: {
      cname: process.env["PLATFORM_CNAME"] || "domains.getcorbit.com",
      ip: process.env["PLATFORM_PROXY_IP"] && 
          process.env["PLATFORM_PROXY_IP"].trim() !== "" && 
          process.env["PLATFORM_PROXY_IP"].trim() !== "YOUR_SERVER_IP"
        ? process.env["PLATFORM_PROXY_IP"].trim()
        : `172.18.0.${10 + p.id}`
    }
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
      status: bodyParsed.data.status as any,
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
  const domain = newStatus === "published" ? `${existing.name.toLowerCase().replace(/\s+/g, "-")}.getcorbit.com` : null;

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

// Dynamic Public Secure 'Ask' check endpoint for Docker + Caddy
router.get("/domains/check", async (req, res) => {
  const domainToCheck = req.query.domain;
  if (!domainToCheck || typeof domainToCheck !== "string") {
    res.status(400).send("Invalid domain");
    return;
  }

  const cleanDomain = domainToCheck.trim().toLowerCase();

  try {
    const projects = await db.select().from(projectsTable);
    
    // 1. Check if the cleanDomain is a bound active custom domain
    const customFound = projects.find(p => {
      if (p.domain && p.domain.includes("|")) {
        const parts = p.domain.split("|");
        const customDomain = parts[1];
        const status = parts[2];
        return customDomain === cleanDomain && status === "active";
      }
      return false;
    });

    if (customFound) {
      res.status(200).send("OK");
      return;
    }

    // 2. Check if cleanDomain is the default subdomain (e.g. sitename.getcorbit.com)
    // If it is, we only serve it if there is no active custom domain bound to the project.
    const subdomainFound = projects.find(p => {
      if (!p.domain) return false;
      
      if (p.domain.includes("|")) {
        const parts = p.domain.split("|");
        const subdomain = parts[0];
        const status = parts[2];
        
        if (subdomain === cleanDomain) {
          // If the custom domain is already active, we STOP servicing the subdomain!
          if (status === "active") {
            return false;
          }
          return true; // Keep subdomain open while custom domain is pending
        }
      } else {
        return p.domain === cleanDomain;
      }
      return false;
    });

    if (subdomainFound) {
      res.status(200).send("OK");
    } else {
      res.status(404).send("Not Found");
    }
  } catch (e) {
    res.status(500).send("Internal database check error");
  }
});

// Bind Custom Domain
router.post("/projects/:id/domain", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const id = Number(req.params.id);
  const { customDomain } = req.body;

  if (!customDomain || typeof customDomain !== "string") {
    res.status(400).json({ error: "Invalid custom domain" });
    return;
  }

  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, user.id)))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  let subdomain = project.domain || `${project.name.toLowerCase().replace(/\s+/g, "-")}.getcorbit.com`;
  if (subdomain.includes("|")) {
    subdomain = subdomain.split("|")[0];
  }

  const serialized = `${subdomain}|${customDomain.trim().toLowerCase()}|pending`;

  const [updated] = await db.update(projectsTable)
    .set({ domain: serialized, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();

  res.json(formatProject(updated));
});

// Verify Custom Domain DNS (Mock/Real resolution)
router.post("/projects/:id/domain/verify", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const id = Number(req.params.id);

  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, user.id)))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  if (!project.domain || !project.domain.includes("|")) {
    res.status(400).json({ error: "No custom domain bound to this project" });
    return;
  }

  const parts = project.domain.split("|");
  const subdomain = parts[0];
  const customDomain = parts[1];

  let dnsVerified = false;
  const isMockMode = !process.env.DATABASE_URL || process.env.DATABASE_URL === "mock";

  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    dnsVerified = !customDomain.includes("fail");
  } else {
    try {
      const addresses = await dns.promises.resolve4(customDomain);
      dnsVerified = addresses.length > 0;
    } catch (e) {
      dnsVerified = false;
    }
  }

  const status = dnsVerified ? "active" : "failed";
  const serialized = `${subdomain}|${customDomain}|${status}`;

  const [updated] = await db.update(projectsTable)
    .set({ domain: serialized, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();

  res.json({
    ...formatProject(updated),
    dnsVerified
  });
});

// Unbind Custom Domain
router.delete("/projects/:id/domain", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const id = Number(req.params.id);

  const [project] = await db.select().from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, user.id)))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  if (!project.domain) {
    res.status(400).json({ error: "No domain configured" });
    return;
  }

  let subdomain = project.domain;
  if (subdomain.includes("|")) {
    subdomain = subdomain.split("|")[0];
  }

  const [updated] = await db.update(projectsTable)
    .set({ domain: subdomain, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();

  res.json(formatProject(updated));
});

export default router;
