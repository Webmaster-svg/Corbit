import { Router } from "express";
import { db, templatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetTemplateParams } from "@workspace/api-zod";

const router = Router();

function formatTemplate(t: typeof templatesTable.$inferSelect) {
  return {
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    thumbnailUrl: t.thumbnailUrl,
    previewUrl: t.previewUrl,
    isPro: t.isPro,
    tags: t.tags,
  };
}

router.get("/templates", async (_req, res) => {
  const templates = await db.select().from(templatesTable);
  res.json(templates.map(formatTemplate));
});

router.get("/templates/:id", async (req, res) => {
  const parsed = GetTemplateParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [template] = await db.select().from(templatesTable).where(eq(templatesTable.id, parsed.data.id)).limit(1);
  if (!template) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  res.json(formatTemplate(template));
});

export default router;
