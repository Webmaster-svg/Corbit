import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { db, masterThemesTable, userWorkspacesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_ROOT = (() => {
  let dir = __dirname;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8"));
        if (pkg.name === "workspace") return dir;
      } catch {}
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(__dirname, "../../../");
})();

const DB_FOLDERS_ROOT = path.join(WORKSPACE_ROOT, "Database", "Accounts");

function dbg(m: string) {
  try { fs.appendFileSync(path.join(WORKSPACE_ROOT, "Database", "debug.log"), `[${new Date().toISOString()}] [workspace] ${m}\n`); } catch {}
}

const router = Router();

/* ── Helper: resolve user DB folder path ── */
function userDbFolder(user: { id: number; name: string }): string {
  return path.join(DB_FOLDERS_ROOT, `user_${user.id}`);
}

/* ── Helper: ensure a directory exists ── */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/* ── Helper: check if a directory is 100% empty (ghost file check) ── */
function isDirEmpty(dir: string): boolean {
  if (!fs.existsSync(dir)) return true;
  const items = fs.readdirSync(dir);
  if (items.length === 0) return true;
  // Filter out known safe lock/hidden files
  const realFiles = items.filter(f => f !== ".gitkeep" && f !== "thumbs.db" && f !== ".DS_Store");
  return realFiles.length === 0;
}

/* ── Helper: copy template source file to user folder ── */
function copyTemplateAssets(theme: { sourceFolderPath: string; name: string }, userFolder: string) {
  const sourcePath = path.join(WORKSPACE_ROOT, theme.sourceFolderPath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Master theme source not found at: ${sourcePath}`);
  }
  const destPath = path.join(userFolder, "theme.tsx");
  let tContent = fs.readFileSync(sourcePath, "utf-8");
  // Rewrite import paths for the copied file
  tContent = tContent.replace(/"\.\/shared\//g, '"../../../../../artifacts/sitecraft/templates/shared/');
  tContent = tContent.replace(/"\.\/types"/g, '"../../../../../artifacts/sitecraft/templates/types"');
  fs.writeFileSync(destPath, tContent);
  dbg(`fork: copied ${theme.name} assets to ${destPath}`);
}

/* ═══════════════════════════════════════════════════════════════
   Phase 1 Endpoints
   ═══════════════════════════════════════════════════════════════ */

/* ── GET /api/workspace ──
   Returns the current user's workspace if it exists.         */
router.get(["/", ""], requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const [workspace] = await db
      .select()
      .from(userWorkspacesTable)
      .where(eq(userWorkspacesTable.userId, user.id))
      .limit(1);

    if (!workspace) {
      res.json({ workspace: null });
      return;
    }

    // Include the active theme details
    let theme = null;
    if (workspace.activeThemeId) {
      [theme] = await db
        .select()
        .from(masterThemesTable)
        .where(eq(masterThemesTable.id, workspace.activeThemeId))
        .limit(1);
    }

    res.json({ workspace, activeTheme: theme });
  } catch (e: any) {
    dbg(`GET /workspace ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ── POST /api/workspace/init ──
   Creates a user workspace + folder on first registration/setup.
   Called when a user first opens the editor for any project.  */
router.post("/init", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const folderPath = userDbFolder(user);

    // Check if workspace already exists
    const [existing] = await db
      .select()
      .from(userWorkspacesTable)
      .where(eq(userWorkspacesTable.userId, user.id))
      .limit(1);

    if (existing) {
      res.json({ workspace: existing, created: false });
      return;
    }

    // Create the user's DB folder
    ensureDir(folderPath);

    // Insert workspace record
    const [newWs] = await db
      .insert(userWorkspacesTable)
      .values({
        userId: user.id,
        activeThemeId: null,
        dbFolderPath: folderPath,
        pageJson: null,
      })
      .returning();

    dbg(`init: created workspace for user ${user.id} at ${folderPath}`);
    res.json({ workspace: newWs, created: true });
  } catch (e: any) {
    dbg(`POST /workspace/init ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ═══════════════════════════════════════════════════════════════
   Phase 2: Theme Gatekeeper
   ═══════════════════════════════════════════════════════════════ */

/* ── GET /api/workspace/ghost-check ──
   Phase 4: before forking, verify target user folder is truly empty.
   Returns clean JSON — never HTML.                                     */
router.get("/ghost-check", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const folderPath = userDbFolder(user);

    if (!fs.existsSync(folderPath)) {
      res.json({ isEmpty: true, exists: false, files: [] });
      return;
    }

    const empty = isDirEmpty(folderPath);
    res.json({
      isEmpty: empty,
      exists: true,
      files: empty ? [] : fs.readdirSync(folderPath),
    });
  } catch (e: any) {
    dbg(`GET /workspace/ghost-check ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: "Directory check failed" });
  }
});

/* ── POST /api/workspace/ghost-check ──
   Alternative that accepts explicit user reference for non-auth callers. */
router.post("/ghost-check", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const folderPath = userDbFolder(user);

    if (!fs.existsSync(folderPath)) {
      res.json({ isEmpty: true, exists: false, files: [] });
      return;
    }

    const empty = isDirEmpty(folderPath);
    res.json({
      isEmpty: empty,
      exists: true,
      files: empty ? [] : fs.readdirSync(folderPath),
    });
  } catch (e: any) {
    dbg(`POST /workspace/ghost-check ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: "Directory check failed" });
  }
});

/* ── POST /api/workspace/apply-theme ──
   Strict sequence:
   1. Check if active_theme_id exists
   2. If yes: wipe old data → DELETE page_json + empty folder
   3. Ghost-file check to confirm folder is empty
   4. Fork new theme: copy template assets into user folder
   5. Update workspace with new theme_id + initialize empty JSON array
*/
router.post("/apply-theme", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const { themeId } = req.body;

    if (!themeId) {
      res.status(400).json({ error: "themeId is required" });
      return;
    }

    // Validate the theme exists in master_themes
    const [theme] = await db
      .select()
      .from(masterThemesTable)
      .where(eq(masterThemesTable.id, Number(themeId)))
      .limit(1);

    if (!theme) {
      res.status(404).json({ error: `Master theme with id ${themeId} not found` });
      return;
    }

    // Step 1: Get or create workspace
    let [workspace] = await db
      .select()
      .from(userWorkspacesTable)
      .where(eq(userWorkspacesTable.userId, user.id))
      .limit(1);

    const folderPath = userDbFolder(user);

    if (!workspace) {
      // First-time setup
      ensureDir(folderPath);
      [workspace] = await db
        .insert(userWorkspacesTable)
        .values({
          userId: user.id,
          activeThemeId: null,
          dbFolderPath: folderPath,
          pageJson: null,
        })
        .returning();
    }

    let didWipe = false;
    // Step 2: If an active theme exists, wipe old data
    if (workspace.activeThemeId) {
      dbg(`apply-theme: wiping old theme ${workspace.activeThemeId} for user ${user.id}`);

      // Wipe the user folder contents (but keep the folder itself)
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
          const fp = path.join(folderPath, file);
          try {
            if (fs.lstatSync(fp).isDirectory()) {
              fs.rmSync(fp, { recursive: true, force: true });
            } else {
              fs.unlinkSync(fp);
            }
          } catch (e) {
            dbg(`apply-theme: failed to delete ${fp}: ${e}`);
          }
        }
      }
      didWipe = true;
    }

    // Step 3: Ghost file check — verify folder is 100% empty
    if (!isDirEmpty(folderPath)) {
      res.status(409).json({
        error: "User folder is not empty after wipe. Cannot fork safely.",
        files: fs.readdirSync(folderPath),
      });
      return;
    }

    // Step 4: Fork the new theme — copy template assets
    copyTemplateAssets(theme, folderPath);

    // Step 5: Update workspace — set new theme_id + initialize empty JSON array
    const emptySectionsArray: any[] = [];
    await db
      .update(userWorkspacesTable)
      .set({
        activeThemeId: Number(themeId),
        pageJson: JSON.stringify(emptySectionsArray),
        updatedAt: new Date(),
      })
      .where(eq(userWorkspacesTable.userId, user.id));

    // Fetch the updated workspace to return
    [workspace] = await db
      .select()
      .from(userWorkspacesTable)
      .where(eq(userWorkspacesTable.userId, user.id))
      .limit(1);

    dbg(`apply-theme: user ${user.id} → theme ${theme.name} (id=${themeId}) applied successfully`);
    res.json({
      success: true,
      workspace,
      theme,
      wiped: didWipe,
      ghostCheck: { passed: true },
    });
  } catch (e: any) {
    dbg(`POST /workspace/apply-theme ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ── DELETE /api/workspace/theme ──
   Wipes the user's current theme data:
   - Clears page_json in database
   - Empties the user's DB folder
   - Resets active_theme_id to null
*/
router.delete("/theme", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const folderPath = userDbFolder(user);

    // Clear page_json and active_theme_id
    await db
      .update(userWorkspacesTable)
      .set({
        activeThemeId: null,
        pageJson: null,
        updatedAt: new Date(),
      })
      .where(eq(userWorkspacesTable.userId, user.id));

    // Empty the user folder
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        try {
          const fp = path.join(folderPath, file);
          if (fs.lstatSync(fp).isDirectory()) {
            fs.rmSync(fp, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fp);
          }
        } catch {}
      }
    }

    dbg(`delete-theme: wiped theme data for user ${user.id}`);
    res.json({ success: true });
  } catch (e: any) {
    dbg(`DELETE /workspace/theme ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ═══════════════════════════════════════════════════════════════
   Phase 3: JSON Section Persistence
   ═══════════════════════════════════════════════════════════════ */

/* ── POST /api/workspace/save-sections ──
   Saves the single JSON array of sections to user_workspaces.page_json.
*/
router.post("/save-sections", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const { sections, language, scheme, dark, themeId } = req.body;

    if (!sections || !Array.isArray(sections)) {
      res.status(400).json({ error: "sections must be a JSON array" });
      return;
    }

    const payload = {
      language: language || "en",
      scheme: scheme || null,
      dark: dark || false,
      sections,
      themeId: themeId || null,
    };

    await db
      .update(userWorkspacesTable)
      .set({
        pageJson: JSON.stringify(payload),
        updatedAt: new Date(),
      })
      .where(eq(userWorkspacesTable.userId, user.id));

    dbg(`save-sections: user ${user.id} saved ${sections.length} sections`);
    res.json({ success: true, sectionCount: sections.length });
  } catch (e: any) {
    dbg(`POST /workspace/save-sections ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ── GET /api/workspace/load-sections ──
   Loads the JSON sections array from user_workspaces.page_json.
*/
router.get("/load-sections", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const [workspace] = await db
      .select()
      .from(userWorkspacesTable)
      .where(eq(userWorkspacesTable.userId, user.id))
      .limit(1);

    if (!workspace || !workspace.pageJson) {
      res.json({ sections: null });
      return;
    }

    let parsed: any;
    try {
      parsed = typeof workspace.pageJson === "string"
        ? JSON.parse(workspace.pageJson)
        : workspace.pageJson;
    } catch {
      res.json({ sections: null });
      return;
    }

    res.json({
      sections: parsed.sections || [],
      language: parsed.language || "en",
      scheme: parsed.scheme || null,
      dark: parsed.dark || false,
      themeId: parsed.themeId || null,
    });
  } catch (e: any) {
    dbg(`GET /workspace/load-sections ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ── GET /api/workspace/master-themes ──
   Lists all master themes (uneditable originals).
*/
router.get("/master-themes", requireAuth, async (req, res) => {
  try {
    const themes = await db.select().from(masterThemesTable);
    res.json({ themes });
  } catch (e: any) {
    dbg(`GET /workspace/master-themes ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ── GET /api/workspace/debug ──
   Quick health-check to confirm workspace routes are mounted.
*/
router.get("/debug", requireAuth, async (_req, res) => {
  res.json({ success: true, message: "workspace routes are mounted" });
});

export default router;
