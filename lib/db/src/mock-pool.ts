import fs from "fs";
import path from "path";

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

const MASTER_THEMES_SEED = [
  { id: 1, name: "Luxuria", slug: "luxuria", description: "Editorial luxury fashion store with a minimal black-and-gold aesthetic.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/Luxuria.tsx", thumbnailUrl: "https://picsum.photos/seed/luxhero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "FreshMart", slug: "freshmart", description: "Vibrant organic grocery store with a clean, fresh green palette.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/FreshMart.tsx", thumbnailUrl: "https://picsum.photos/seed/freshhero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "TechZone", slug: "techzone", description: "Sleek dark electronics store with a tech-forward blue accent design.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/TechZone.tsx", thumbnailUrl: "https://picsum.photos/seed/techhero/600/400", isPro: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Artisan", slug: "artisan", description: "Warm, earthy handmade marketplace with a rustic artisanal feel.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/Artisan.tsx", thumbnailUrl: "https://picsum.photos/seed/arthero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "SportsPro", slug: "sportspro", description: "Bold, energetic sports gear store with high-impact typography.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/SportsPro.tsx", thumbnailUrl: "https://picsum.photos/seed/sporthero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: "BeautyGlow", slug: "beautyglow", description: "Elegant skincare brand with a soft rose-gold and blush aesthetic.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/BeautyGlow.tsx", thumbnailUrl: "https://picsum.photos/seed/beautyhero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: "HomeNest", slug: "homenest", description: "Warm Scandinavian home decor store with a minimal, timeless style.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/HomeNest.tsx", thumbnailUrl: "https://picsum.photos/seed/homehero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, name: "KidsWorld", slug: "kidsworld", description: "Bright, playful children's toy and clothing store with a fun vibe.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/KidsWorld.tsx", thumbnailUrl: "https://picsum.photos/seed/kidhero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, name: "Gourmet", slug: "gourmet", description: "Sophisticated premium food and fine wine boutique with deep burgundy tones.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/Gourmet.tsx", thumbnailUrl: "https://picsum.photos/seed/gourmethero/600/400", isPro: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, name: "DigitalShop", slug: "digitalshop", description: "Modern digital marketplace with vibrant gradients for creators and makers.", category: "ecommerce", sourceFolderPath: "artifacts/sitecraft/templates/DigitalShop.tsx", thumbnailUrl: "https://picsum.photos/seed/dighero/600/400", isPro: false, createdAt: new Date(), updatedAt: new Date() },
];

export class MockPool {
  private dbFile: string;
  private data: {
    users: any[];
    sessions: any[];
    projects: any[];
    templates: any[];
    activity: any[];
    master_themes: any[];
    user_workspaces: any[];
  };

  constructor() {
    this.dbFile = path.join(process.cwd(), "local_db.json");
    this.data = {
      users: [],
      sessions: [],
      projects: [],
      templates: [
        {
          id: 1,
          name: "Luxuria",
          description: "Editorial luxury fashion store with a minimal black-and-gold aesthetic.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/luxhero/600/400",
          preview_url: "https://luxuria.getcorbit.com",
          is_pro: false,
          tags: ["fashion", "luxury", "minimalist"],
          created_at: new Date()
        },
        {
          id: 2,
          name: "FreshMart",
          description: "Vibrant organic grocery store with a clean, fresh green palette.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/freshhero/600/400",
          preview_url: "https://freshmart.getcorbit.com",
          is_pro: false,
          tags: ["grocery", "organic", "clean"],
          created_at: new Date()
        },
        {
          id: 3,
          name: "TechZone",
          description: "Sleek dark electronics store with a tech-forward blue accent design.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/techhero/600/400",
          preview_url: "https://techzone.getcorbit.com",
          is_pro: true,
          tags: ["electronics", "tech", "dark-mode"],
          created_at: new Date()
        },
        {
          id: 4,
          name: "Artisan",
          description: "Warm, earthy handmade marketplace with a rustic artisanal feel.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/arthero/600/400",
          preview_url: "https://artisan.getcorbit.com",
          is_pro: false,
          tags: ["handmade", "marketplace", "rustic"],
          created_at: new Date()
        },
        {
          id: 5,
          name: "SportsPro",
          description: "Bold, energetic sports gear store with high-impact typography.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/sporthero/600/400",
          preview_url: "https://sportspro.getcorbit.com",
          is_pro: false,
          tags: ["sports", "gear", "energetic"],
          created_at: new Date()
        },
        {
          id: 6,
          name: "BeautyGlow",
          description: "Elegant skincare brand with a soft rose-gold and blush aesthetic.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/beautyhero/600/400",
          preview_url: "https://beautyglow.getcorbit.com",
          is_pro: false,
          tags: ["beauty", "skincare", "rose-gold"],
          created_at: new Date()
        },
        {
          id: 7,
          name: "HomeNest",
          description: "Warm Scandinavian home decor store with a minimal, timeless style.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/homehero/600/400",
          preview_url: "https://homenest.getcorbit.com",
          is_pro: false,
          tags: ["furniture", "decor", "scandinavian"],
          created_at: new Date()
        },
        {
          id: 8,
          name: "KidsWorld",
          description: "Bright, playful children's toy and clothing store with a fun vibe.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/kidhero/600/400",
          preview_url: "https://kidsworld.getcorbit.com",
          is_pro: false,
          tags: ["children", "toys", "playful"],
          created_at: new Date()
        },
        {
          id: 9,
          name: "Gourmet",
          description: "Sophisticated premium food and fine wine boutique with deep burgundy tones.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/gourmethero/600/400",
          preview_url: "https://gourmet.getcorbit.com",
          is_pro: true,
          tags: ["food", "wine", "premium"],
          created_at: new Date()
        },
        {
          id: 10,
          name: "DigitalShop",
          description: "Modern digital marketplace with vibrant gradients for creators and makers.",
          category: "ecommerce",
          thumbnail_url: "https://picsum.photos/seed/dighero/600/400",
          preview_url: "https://digitalshop.getcorbit.com",
          is_pro: false,
          tags: ["digital", "marketplace", "creators"],
          created_at: new Date()
        }
      ],
      activity: [],
      master_themes: [...MASTER_THEMES_SEED.map(t => ({ ...t }))],
      user_workspaces: [],
    };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.dbFile)) {
        const fileContent = fs.readFileSync(this.dbFile, "utf-8");
        
        // Convert date strings back to Date objects
        const reviver = (key: string, val: any) => {
          if (typeof val === "string" && (key === "created_at" || key === "updated_at" || key === "expires_at" || key === "createdAt" || key === "updatedAt")) {
            return new Date(val);
          }
          return val;
        };

        const converted = JSON.parse(fileContent, reviver);

        this.data = {
          ...this.data,
          ...converted,
          // Always ensure the default templates exist
          templates: this.data.templates,
          // Always ensure the default master themes exist
          master_themes: this.data.master_themes
        };
      } else {
        this.save();
      }
    } catch (e) {
      console.warn("Failed to load local mock database, using in-memory store:", e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.dbFile, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to save local mock database:", e);
    }
  }

  async query(sql: string | { text: string; values?: any[]; rowMode?: string } | any, params: any[] = []): Promise<{ rows: any[] }> {
    let isArrayMode = false;
    if (typeof sql === "object" && sql !== null && sql.rowMode === "array") {
      isArrayMode = true;
    }

    const result = await this.queryRaw(sql, params);
    
    if (isArrayMode && result && result.rows) {
      let queryText = "";
      if (typeof sql === "object" && sql !== null) {
        queryText = sql.text || "";
      } else {
        queryText = sql || "";
      }
      
      const cleanSql = queryText.replace(/\s+/g, " ").trim();
      const cleanSqlLower = cleanSql.toLowerCase();
      
      let columns: string[] = [];
      if (cleanSqlLower.includes(" select ")) {
        const match = cleanSql.match(/select\s+(.*?)\s+from/i);
        if (match) {
          columns = match[1].split(",").map(c => c.trim().replace(/"/g, ""));
        }
      } else if (cleanSqlLower.startsWith("select ")) {
        const match = cleanSql.match(/^select\s+(.*?)\s+from/i);
        if (match) {
          columns = match[1].split(",").map(c => c.trim().replace(/"/g, ""));
        }
      }
      
      if (cleanSqlLower.includes(" returning ")) {
        const match = cleanSql.match(/returning\s+(.*)$/i);
        if (match) {
          columns = match[1].split(",").map(c => c.trim().replace(/"/g, ""));
        }
      }
      
      if (columns.length > 0 && !columns.some(c => c.includes("*"))) {
        const finalRows = result.rows.map(row => {
          return columns.map(col => {
            let colKey = col;
            if (col.includes(".")) {
              colKey = col.split(".")[1];
            }
            const val = row[colKey];
            if (val !== undefined) return val;
            const camel = snakeToCamel(colKey);
            return camel !== colKey ? (row[camel] ?? null) : null;
          });
        });
        return { rows: finalRows };
      }
    }
    
    return result;
  }

  async queryRaw(sql: string | { text: string; values?: any[] }, params: any[] = []): Promise<{ rows: any[] }> {
    let queryText = "";
    let queryParams = params || [];

    if (typeof sql === "object" && sql !== null) {
      queryText = sql.text || "";
      queryParams = sql.values || params || [];
    } else {
      queryText = sql || "";
    }

    const cleanSql = queryText.replace(/\s+/g, " ").trim();
    const cleanSqlLower = cleanSql.toLowerCase();

    console.log(`[Mock DB Query] SQL: "${cleanSql}" | Params:`, queryParams);

    // 1. SELECT FROM users
    // SELECT ... FROM "users" WHERE "users"."email" = $1 LIMIT $2
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "users"') && cleanSqlLower.includes('"users"."email" = $1')) {
      const email = queryParams[0];
      const user = this.data.users.find(u => u.email === email);
      return { rows: user ? [user] : [] };
    }
    
    // SELECT ... FROM "users" WHERE "users"."id" = $1 LIMIT $2
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "users"') && cleanSqlLower.includes('"users"."id" = $1')) {
      const id = Number(queryParams[0]);
      const user = this.data.users.find(u => u.id === id);
      return { rows: user ? [user] : [] };
    }

    // 2. INSERT INTO users
    // INSERT INTO "users" ("name", "email", "password_hash", "plan") VALUES ($1, $2, $3, $4) RETURNING *
    if (cleanSqlLower.startsWith('insert into "users"')) {
      const name = queryParams[0];
      const email = queryParams[1];
      const passwordHash = queryParams[2];
      const plan = queryParams[3] || "free";
      
      const newUser = {
        id: this.data.users.length + 1,
        name,
        email,
        password_hash: passwordHash,
        plan,
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.data.users.push(newUser);
      this.save();
      console.log("[Mock Pool Users Insert] Returning newUser object:", newUser);
      return { rows: [newUser] };
    }

    // 3. INSERT INTO sessions
    // INSERT INTO "sessions" ("user_id", "token", "expires_at") VALUES ($1, $2, $3)
    if (cleanSqlLower.startsWith('insert into "sessions"')) {
      const userId = Number(queryParams[0]);
      const token = queryParams[1];
      const expiresAt = new Date(queryParams[2]);
      
      const newSession = {
        id: this.data.sessions.length + 1,
        user_id: userId,
        token,
        created_at: new Date(),
        expires_at: expiresAt
      };
      this.data.sessions.push(newSession);
      this.save();
      return { rows: [newSession] };
    }

    // 4. SELECT FROM sessions
    // SELECT ... FROM "sessions" WHERE "sessions"."token" = $1 LIMIT $2
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "sessions"') && cleanSqlLower.includes('"sessions"."token" = $1')) {
      const token = queryParams[0];
      const session = this.data.sessions.find(s => s.token === token);
      if (session) {
        return { 
          rows: [{
            ...session,
            expires_at: new Date(session.expires_at),
            created_at: new Date(session.created_at)
          }] 
        };
      }
      return { rows: [] };
    }

    // 5. DELETE FROM sessions
    // DELETE FROM "sessions" WHERE "sessions"."token" = $1
    if (cleanSqlLower.startsWith('delete from "sessions"') && cleanSqlLower.includes('"sessions"."token" = $1')) {
      const token = queryParams[0];
      this.data.sessions = this.data.sessions.filter(s => s.token !== token);
      this.save();
      return { rows: [] };
    }

    // 6. SELECT FROM templates
    // SELECT ... FROM "templates" WHERE "templates"."id" = $1 LIMIT $2
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "templates"') && cleanSqlLower.includes('"templates"."id" = $1')) {
      const id = Number(queryParams[0]);
      const template = this.data.templates.find(t => t.id === id);
      return { rows: template ? [template] : [] };
    }
    // SELECT ... FROM "templates"
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "templates"')) {
      return { rows: this.data.templates };
    }

    // 7. SELECT FROM projects
    if (cleanSqlLower.startsWith('select ') && (cleanSqlLower.includes('from "projects"') || cleanSqlLower.includes('from projects'))) {
      if (!cleanSqlLower.includes('where')) {
        return { rows: this.data.projects };
      }

      let filterId: number | null = null;
      let filterUserId: number | null = null;

      // Regex to find "id" = $X or "user_id" = $Y
      const regex = /(?:(?:"?projects"?\.)?"?(id|user_id)"?\s*=\s*\$(\d+))/g;
      let match;
      while ((match = regex.exec(cleanSqlLower)) !== null) {
        const col = match[1];
        const paramIdx = Number(match[2]) - 1;
        const val = Number(queryParams[paramIdx]);
        
        if (col === 'id') {
          filterId = val;
        } else if (col === 'user_id') {
          filterUserId = val;
        }
      }

      // Fallback matching if regex doesn't match cleanSqlLower structure
      if (filterId === null && filterUserId === null && queryParams.length > 0) {
        const hasIdFilter = cleanSqlLower.includes('"id"') || cleanSqlLower.includes('id =') || cleanSqlLower.includes('id=');
        const hasUserFilter = cleanSqlLower.includes('"user_id"') || cleanSqlLower.includes('user_id =') || cleanSqlLower.includes('user_id=');
        
        if (hasIdFilter && hasUserFilter && queryParams.length >= 2) {
          filterId = Number(queryParams[0]);
          filterUserId = Number(queryParams[1]);
        } else if (hasIdFilter && queryParams.length === 1) {
          filterId = Number(queryParams[0]);
        } else if (hasUserFilter && queryParams.length === 1) {
          filterUserId = Number(queryParams[0]);
        }
      }

      console.log(`[Mock DB Projects Matcher] Filter parsed: id=${filterId}, user_id=${filterUserId}`);

      let filtered = this.data.projects;
      if (filterUserId !== null && !isNaN(filterUserId)) {
        filtered = filtered.filter(p => p.user_id === filterUserId);
      }
      if (filterId !== null && !isNaN(filterId)) {
        const single = filtered.find(p => p.id === filterId);
        return { rows: single ? [single] : [] };
      }
      
      return { rows: filtered };
    }

    if (cleanSqlLower.startsWith('insert into "projects"')) {
      const colsMatch = cleanSql.match(/\((.*?)\)\s*values\s*\((.*?)\)/i);
      let name = null;
      let description = null;
      let status = "draft";
      let templateId = null;
      let thumbnailUrl = null;
      let domain = null;
      let userId = null;

      if (colsMatch) {
        const cols = colsMatch[1].split(',').map(c => c.trim().replace(/"/g, ''));
        const vals = colsMatch[2].split(',').map(v => v.trim());

        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          const val = vals[i];
          if (val.startsWith('$')) {
            const paramIdx = Number(val.slice(1)) - 1;
            const paramVal = queryParams[paramIdx];
            if (col === 'name') name = paramVal;
            else if (col === 'description') description = paramVal;
            else if (col === 'status') status = paramVal;
            else if (col === 'template_id') templateId = paramVal ? Number(paramVal) : null;
            else if (col === 'thumbnail_url') thumbnailUrl = paramVal;
            else if (col === 'domain') domain = paramVal;
            else if (col === 'user_id') userId = paramVal ? Number(paramVal) : null;
          }
        }
      } else {
        name = queryParams[0];
        description = queryParams[1] || null;
        status = queryParams[2] || "draft";
        templateId = queryParams[3] ? Number(queryParams[3]) : null;
        thumbnailUrl = queryParams[4] || null;
        domain = queryParams[5] || null;
        userId = Number(queryParams[6]);
      }

      const newProject = {
        id: this.data.projects.length + 1,
        name,
        description,
        status,
        template_id: templateId,
        thumbnail_url: thumbnailUrl,
        domain,
        user_id: userId,
        page_count: 1,
        visit_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.data.projects.push(newProject);
      this.save();
      return { rows: [newProject] };
    }

    // 9. UPDATE projects
    if (cleanSqlLower.startsWith('update "projects"') || cleanSqlLower.startsWith('update projects')) {
      const idMatch = cleanSqlLower.match(/where\s+.*?"?(?:projects\.)?id"?\s*=\s*\$(\d+)/i);
      if (idMatch) {
        const idParamIdx = Number(idMatch[1]) - 1;
        const id = Number(queryParams[idParamIdx]);

        const idx = this.data.projects.findIndex(p => p.id === id);
        if (idx !== -1) {
          const setStartIndex = cleanSqlLower.indexOf('set ') + 4;
          const setEndIndex = cleanSqlLower.indexOf(' where');
          const setPart = cleanSql.substring(setStartIndex, setEndIndex);
          const assignments = setPart.split(',').map(s => s.trim());

          for (const assign of assignments) {
            const parts = assign.split('=').map(p => p.trim());
            const col = parts[0].replace(/"/g, '').replace(/.*?\./, ''); // remove quotes and table prefix
            const val = parts[1];
            if (val.startsWith('$')) {
              const paramIdx = Number(val.slice(1)) - 1;
              const paramVal = queryParams[paramIdx];

              if (col === 'name') this.data.projects[idx].name = paramVal;
              else if (col === 'description') this.data.projects[idx].description = paramVal;
              else if (col === 'status') this.data.projects[idx].status = paramVal;
              else if (col === 'template_id') this.data.projects[idx].template_id = paramVal ? Number(paramVal) : null;
              else if (col === 'domain') this.data.projects[idx].domain = paramVal;
              else if (col === 'custom_domain') this.data.projects[idx].customDomain = paramVal;
              else if (col === 'custom_domain_status') this.data.projects[idx].customDomainStatus = paramVal;
              else if (col === 'docker_bridge_ip') this.data.projects[idx].dockerBridgeIp = paramVal;
              else if (col === 'updated_at') this.data.projects[idx].updated_at = new Date(paramVal);
            }
          }

          this.save();
          return { rows: [this.data.projects[idx]] };
        }
      }
      return { rows: [] };
    }

    // 10. DELETE FROM projects
    // DELETE FROM "projects" WHERE "projects"."id" = $1
    if (cleanSqlLower.startsWith('delete from "projects"') || cleanSqlLower.startsWith('delete from projects')) {
      let filterId: number | null = null;
      // Regex to find "id" = $X or id = $X
      const match = cleanSqlLower.match(/(?:(?:"?projects"?\.)?"?id"?\s*=\s*\$(\d+))/i);
      if (match) {
        const paramIdx = Number(match[1]) - 1;
        filterId = Number(queryParams[paramIdx]);
      } else {
        filterId = Number(queryParams[0]);
      }

      if (filterId && !isNaN(filterId)) {
        this.data.projects = this.data.projects.filter(p => p.id !== filterId);
        this.save();
      }
      return { rows: [] };
    }

    // 11. INSERT INTO activity
    // INSERT INTO "activity" ("user_id", "type", "label", "project_id", "project_name") VALUES ($1, $2, $3, $4, $5)
    if (cleanSqlLower.startsWith('insert into "activity"')) {
      const userId = Number(queryParams[0]);
      const type = queryParams[1];
      const label = queryParams[2];
      const projectId = queryParams[3] ? Number(queryParams[3]) : null;
      const projectName = queryParams[4] || null;

      const newActivity = {
        id: this.data.activity.length + 1,
        user_id: userId,
        type,
        label,
        project_id: projectId,
        project_name: projectName,
        created_at: new Date()
      };
      this.data.activity.push(newActivity);
      this.save();
      return { rows: [newActivity] };
    }

    // 12. SELECT FROM activity
    // SELECT ... FROM "activity" WHERE "activity"."user_id" = $1
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "activity"') && cleanSqlLower.includes('"activity"."user_id" = $1')) {
      const userId = Number(queryParams[0]);
      const activities = this.data.activity.filter(a => a.user_id === userId);
      return { rows: activities };
    }

    // ══════════════════════════════════════════════════════════
    // master_themes TABLE HANDLERS
    // ══════════════════════════════════════════════════════════

    // 13. SELECT FROM master_themes (all — no WHERE)
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "master_themes"') && !cleanSqlLower.includes('where')) {
      return { rows: this.data.master_themes };
    }

    // SELECT FROM master_themes WHERE id = $1
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "master_themes"') && cleanSqlLower.includes('"master_themes"."id" = $1')) {
      const id = Number(queryParams[0]);
      const theme = this.data.master_themes.find(t => t.id === id);
      return { rows: theme ? [theme] : [] };
    }

    // SELECT FROM master_themes WHERE slug = $1
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "master_themes"') && cleanSqlLower.includes('"master_themes"."slug" = $1')) {
      const slug = queryParams[0];
      const theme = this.data.master_themes.find(t => t.slug === slug);
      return { rows: theme ? [theme] : [] };
    }

    // ══════════════════════════════════════════════════════════
    // user_workspaces TABLE HANDLERS
    // ══════════════════════════════════════════════════════════

    // 14. SELECT FROM user_workspaces WHERE user_id = $1
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "user_workspaces"') && cleanSqlLower.includes('"user_workspaces"."user_id" = $1')) {
      const userId = Number(queryParams[0]);
      const ws = this.data.user_workspaces.find(w => w.user_id === userId || w.userId === userId);
      return { rows: ws ? [ws] : [] };
    }

    // SELECT FROM user_workspaces WHERE id = $1
    if (cleanSqlLower.startsWith('select ') && cleanSqlLower.includes('from "user_workspaces"') && cleanSqlLower.includes('"user_workspaces"."id" = $1')) {
      const id = Number(queryParams[0]);
      const ws = this.data.user_workspaces.find(w => w.id === id);
      return { rows: ws ? [ws] : [] };
    }

    // 15. INSERT INTO user_workspaces
    if (cleanSqlLower.startsWith('insert into "user_workspaces"')) {
      const colsMatch = cleanSql.match(/\((.*?)\)\s*values\s*\((.*?)\)/i);
      let userId: number = 0;
      let activeThemeId: number | null = null;
      let dbFolderPath: string = "";
      let pageJson: any = null;
      if (colsMatch) {
        const cols = colsMatch[1].split(',').map(c => c.trim().replace(/"/g, ''));
        const vals = colsMatch[2].split(',').map(v => v.trim());
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          const val = vals[i];
          if (val.startsWith('$')) {
            const paramIdx = Number(val.slice(1)) - 1;
            const paramVal = queryParams[paramIdx];
            if (col === 'user_id') userId = Number(paramVal);
            else if (col === 'active_theme_id') activeThemeId = paramVal ? Number(paramVal) : null;
            else if (col === 'db_folder_path') dbFolderPath = paramVal;
            else if (col === 'page_json') {
              try { pageJson = typeof paramVal === 'string' ? JSON.parse(paramVal) : paramVal; } catch { pageJson = paramVal; }
            }
          }
        }
      }
      const newWs = {
        id: this.data.user_workspaces.length + 1,
        userId,
        activeThemeId,
        dbFolderPath,
        pageJson,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.data.user_workspaces.push(newWs);
      this.save();
      return { rows: [newWs] };
    }

    // 16. UPDATE user_workspaces
    if (cleanSqlLower.startsWith('update "user_workspaces"') || cleanSqlLower.startsWith('update user_workspaces')) {
      const idMatch = cleanSqlLower.match(/where\s+.*?"?(?:user_workspaces\.)?(id|user_id)"?\s*=\s*\$(\d+)/i);
      if (idMatch) {
        const filterCol = idMatch[1];
        const paramIdx = Number(idMatch[2]) - 1;
        const filterVal = Number(queryParams[paramIdx]);
        const idx = this.data.user_workspaces.findIndex(w => {
          const camelCol = snakeToCamel(filterCol);
          return String(w[filterCol]) === String(filterVal) || (camelCol !== filterCol && String(w[camelCol]) === String(filterVal));
        });
        if (idx !== -1) {
          const setStartIndex = cleanSqlLower.indexOf('set ') + 4;
          const setEndIndex = cleanSqlLower.indexOf(' where');
          const setPart = cleanSql.substring(setStartIndex, setEndIndex);
          const assignments = setPart.split(',').map(s => s.trim());
          for (const assign of assignments) {
            const parts = assign.split('=').map(p => p.trim());
            const col = parts[0].replace(/"/g, '').replace(/.*?\./, '');
            const val = parts[1];
            if (val.startsWith('$')) {
              const pIdx = Number(val.slice(1)) - 1;
              const pVal = queryParams[pIdx];
              if (col === 'active_theme_id') this.data.user_workspaces[idx].activeThemeId = pVal ? Number(pVal) : null;
              else if (col === 'page_json') {
                try { this.data.user_workspaces[idx].pageJson = typeof pVal === 'string' ? JSON.parse(pVal) : pVal; } catch { this.data.user_workspaces[idx].pageJson = pVal; }
              }
              else if (col === 'updated_at') this.data.user_workspaces[idx].updatedAt = new Date(pVal);
            }
          }
          this.data.user_workspaces[idx].updatedAt = new Date();
          this.save();
          return { rows: [this.data.user_workspaces[idx]] };
        }
      }
      return { rows: [] };
    }

    // 17. DELETE FROM user_workspaces (for wipe)
    if (cleanSqlLower.startsWith('delete from "user_workspaces"') || cleanSqlLower.startsWith('delete from user_workspaces')) {
      let filterUserId: number | null = null;
      const match = cleanSqlLower.match(/(?:(?:"?user_workspaces"?\.)?"?user_id"?\s*=\s*\$(\d+))/i);
      if (match) {
        const pIdx = Number(match[1]) - 1;
        filterUserId = Number(queryParams[pIdx]);
      }
      if (filterUserId !== null && !isNaN(filterUserId)) {
        this.data.user_workspaces = this.data.user_workspaces.filter(w => w.user_id !== filterUserId && w.userId !== filterUserId);
        this.save();
      }
      return { rows: [] };
    }

    console.warn(`[Mock DB Query] UNHANDLED QUERY: ${cleanSql} | Params:`, queryParams);
    return { rows: [] };
  }

  async connect() {
    return {
      query: this.query.bind(this),
      release: () => {}
    };
  }
}
