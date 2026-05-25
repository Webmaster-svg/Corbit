import { Router } from "express";
import { requireAuth } from "../lib/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Resolve to workspace root (Corbit/) — walk up from the built dist/ directory */
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
const ACCOUNTS_DIR = path.join(WORKSPACE_ROOT, "Database", "Accounts");
const LOG = path.join(WORKSPACE_ROOT, "Database", "debug.log");
function dbg(m: string) { try { fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${m}\n`); } catch {} }

const router = Router();

function userDir(user: { name: string; id: number }): string {
  return `${user.name}+${user.id}`;
}

function projectDir(projectName: string, projectId: number): string {
  return `${projectName}+${projectId}`;
}

function settingsPath(user: { name: string; id: number }, projectName: string, projectId: number): string {
  return path.join(ACCOUNTS_DIR, userDir(user), projectDir(projectName, projectId), "settings.json");
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/* ── Save settings.json ── */
router.post("/local/save", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    dbg(`save: user=${JSON.stringify({name:user?.name,id:user?.id})}`);
    const { projectName, projectId, templateConfig } = req.body;
    dbg(`save: body=${JSON.stringify({projectName,projectId,hasConfig:!!templateConfig})}`);
    if (!projectName || !projectId) {
      res.status(400).json({ error: "projectName and projectId are required" });
      return;
    }
    // Determine project directory (where theme.tsx resides) without persisting settings.json
    const projectDirPath = path.dirname(settingsPath(user, projectName, projectId));
    ensureDir(projectDirPath);
    // Delete any existing settings.json to ensure edits are only in theme.tsx
    const sp = settingsPath(user, projectName, projectId);
    if (fs.existsSync(sp)) {
      try { fs.unlinkSync(sp); dbg('save: removed existing settings.json'); } catch {}
    }
    dbg(`save: skipping settings.json write, will update theme.tsx only`);
    
    // Also embed edits into the theme.tsx file
    const themePath = path.join(projectDirPath, "theme.tsx");
    
    if (!fs.existsSync(themePath) && templateConfig._templateId) {
      // If the file is missing (e.g. older project), try to copy it now
      const TEMPLATES_MAP: Record<number, string> = {
        1: "Luxuria.tsx", 2: "FreshMart.tsx", 3: "TechZone.tsx", 4: "Artisan.tsx",
        5: "SportsPro.tsx", 6: "BeautyGlow.tsx", 7: "HomeNest.tsx", 8: "KidsWorld.tsx",
        9: "Gourmet.tsx", 10: "DigitalShop.tsx"
      };
      const templateFilename = TEMPLATES_MAP[Number(templateConfig._templateId)];
      if (templateFilename) {
        const sourcePath = path.join(WORKSPACE_ROOT, "artifacts", "sitecraft", "templates", templateFilename);
        if (fs.existsSync(sourcePath)) {
          let tContent = fs.readFileSync(sourcePath, "utf-8");
          tContent = tContent.replace(/"\.\/shared\//g, '"../../../../../artifacts/sitecraft/templates/shared/');
          tContent = tContent.replace(/"\.\/types"/g, '"../../../../../artifacts/sitecraft/templates/types"');
          fs.writeFileSync(themePath, tContent);
        }
      }
    }

    if (fs.existsSync(themePath)) {
      try {
        let content = fs.readFileSync(themePath, "utf-8");
        // Remove old edits block if exists
        content = content.replace(/\/\* --- CORBIT EDITS ---[\s\S]*?--- END CORBIT EDITS --- \*\/\n?/g, "");
        const editsBlock = `/* --- CORBIT EDITS ---\n${JSON.stringify(templateConfig, null, 2)}\n--- END CORBIT EDITS --- */\n`;
        fs.writeFileSync(themePath, content + "\n" + editsBlock);
        dbg(`save: updated theme.tsx with latest edits`);
      } catch (err) {
        dbg(`save ERROR updating theme.tsx: ${err}`);
      }
    }

    res.json({ success: true, themePath });
  } catch (e: any) {
    const msg = e?.stack || String(e);
    dbg(`save ERROR: ${msg}`);
    res.status(500).json({ error: msg });
  }
});

/* ── Load settings.json ── */
router.get("/local/load/:projectName/:projectId", requireAuth, async (req, res) => {
    const user = (req as Request & { user: any }).user;
    const { projectName, projectId } = req.params as { projectName: string; projectId: string };
    const projectDirPath = path.dirname(settingsPath(user, projectName, Number(projectId)));
    const themePath = path.join(projectDirPath, "theme.tsx");
    if (!fs.existsSync(themePath)) {
        // No theme file; return empty config
        res.json({ templateConfig: null });
        return;
    }
    try {
        const content = fs.readFileSync(themePath, "utf-8");
        const match = content.match(/\/\* --- CORBIT EDITS ---\n([\s\S]*?)\n--- END CORBIT EDITS --- \*\//);
        if (match) {
            const parsed = JSON.parse(match[1]);
            res.json({ templateConfig: parsed });
        } else {
            res.json({ templateConfig: null });
        }
    } catch {
        res.json({ templateConfig: null });
    }
});

/* ── Load config from theme.tsx (parse CORBIT EDITS comment block) ── */
router.get("/local/load-from-theme/:projectName/:projectId", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const { projectName, projectId } = req.params as { projectName: string; projectId: string };
  const projectDirPath = path.dirname(settingsPath(user, projectName, Number(projectId)));
  const themePath = path.join(projectDirPath, "theme.tsx");
  if (!fs.existsSync(themePath)) {
    res.json({ templateConfig: null });
    return;
  }
  try {
    const content = fs.readFileSync(themePath, "utf-8");
    const match = content.match(/\/\* --- CORBIT EDITS ---\n([\s\S]*?)\n--- END CORBIT EDITS --- \*\//);
    if (match) {
      const parsed = JSON.parse(match[1]);
      res.json({ templateConfig: parsed });
    } else {
      res.json({ templateConfig: null });
    }
  } catch {
    res.json({ templateConfig: null });
  }
});

/* ── Fork template: copy the template source + embed default config in theme.tsx ── */
router.post("/local/fork-template", requireAuth, async (req, res) => {
  const user = (req as Request & { user: any }).user;
  const { projectName, projectId, templateConfig } = req.body;
  if (!projectName || !projectId || !templateConfig) {
    res.status(400).json({ error: "projectName, projectId and templateConfig are required" });
    return;
  }
  const projectDirPath = path.dirname(settingsPath(user, projectName, projectId));
  const destPath = path.join(projectDirPath, "theme.tsx");
  /* Don't overwrite if already exists */
  if (fs.existsSync(destPath)) {
    res.json({ success: true, forked: false });
    return;
  }
  ensureDir(projectDirPath);

  // Fork (Copy) the physical template .tsx file to the project folder
  const TEMPLATES_MAP: Record<number, string> = {
    1: "Luxuria.tsx", 2: "FreshMart.tsx", 3: "TechZone.tsx", 4: "Artisan.tsx",
    5: "SportsPro.tsx", 6: "BeautyGlow.tsx", 7: "HomeNest.tsx", 8: "KidsWorld.tsx",
    9: "Gourmet.tsx", 10: "DigitalShop.tsx"
  };
  const templateId = templateConfig._templateId;
  const templateFilename = TEMPLATES_MAP[Number(templateId)];
  if (templateFilename) {
    const sourcePath = path.join(WORKSPACE_ROOT, "artifacts", "sitecraft", "templates", templateFilename);
    if (fs.existsSync(sourcePath)) {
      try {
        let tContent = fs.readFileSync(sourcePath, "utf-8");
        tContent = tContent.replace(/"\.\/shared\//g, '"../../../../../artifacts/sitecraft/templates/shared/');
        tContent = tContent.replace(/"\.\/types"/g, '"../../../../../artifacts/sitecraft/templates/types"');
        // Embed the default config as a CORBIT EDITS block so load-from-theme can find it
        const editsBlock = `/* --- CORBIT EDITS ---\n${JSON.stringify(templateConfig, null, 2)}\n--- END CORBIT EDITS --- */\n`;
        fs.writeFileSync(destPath, tContent + "\n" + editsBlock);
        dbg(`fork-template: copied ${templateFilename} to theme.tsx with initial config`);
      } catch (err) {
        dbg(`fork-template ERROR copying file: ${err}`);
      }
    }
  }

    // Ensure no stale settings.json remains
    const sp = settingsPath(user, projectName, projectId);
    if (fs.existsSync(sp)) {
      try { fs.unlinkSync(sp); dbg('fork-template: removed stale settings.json'); } catch {}
    }
    res.json({ success: true, forked: true });
});

/* ── Save rendered page HTML ── */
router.post("/local/save-page", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const { projectName, projectId, html } = req.body;
    if (!projectName || !projectId || html === undefined) {
      res.status(400).json({ error: "projectName, projectId and html are required" });
      return;
    }
    const dir = path.join(ACCOUNTS_DIR, userDir(user), projectDir(projectName, projectId));
    ensureDir(dir);
    const sp = path.join(dir, "index.html");
    fs.writeFileSync(sp, html, "utf-8");
    dbg(`save-page: ${sp} (${html.length} bytes)`);
    res.json({ success: true, path: sp });
  } catch (e: any) {
    dbg(`save-page ERROR: ${e?.stack || String(e)}`);
    res.status(500).json({ error: String(e) });
  }
});

/* ── Load rendered page HTML ── */
router.get("/local/page/:projectName/:projectId", async (req, res) => {
  try {
    const { projectName, projectId } = req.params;
    const dir = path.join(ACCOUNTS_DIR, `${projectName}+${projectId}`);
    const sp = path.join(dir, "index.html");
    if (!fs.existsSync(sp)) {
      res.status(404).send("Page not found");
      return;
    }
    const html = fs.readFileSync(sp, "utf-8");
    res.type("html").send(html);
  } catch (e: any) {
    dbg(`load-page ERROR: ${e?.stack || String(e)}`);
    res.status(500).send("Error loading page");
  }
});

export default router;
