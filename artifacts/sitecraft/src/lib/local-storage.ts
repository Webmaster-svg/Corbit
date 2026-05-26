const API_BASE = "";

async function authFetch(url: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem("corbit_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    const raw = await res.text();
    let message: string;
    try {
      const json = JSON.parse(raw);
      message = json?.error || json?.message || `HTTP ${res.status}`;
    } catch {
      message = `Server error (${res.status})`;
    }
    throw new Error(`${url} → ${message}`);
  }
  return res.json();
}

export interface SavePayload {
  projectName: string;
  projectId: number;
  templateConfig: Record<string, any>;
}

export interface LocalProjectData {
  templateConfig?: Record<string, any> | null;
}

export function saveLocalProject(payload: SavePayload): Promise<{ success: boolean }> {
  return authFetch("/api/local/save", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loadLocalProject(projectName: string, projectId: number): Promise<LocalProjectData> {
  return authFetch(`/api/local/load/${encodeURIComponent(projectName)}/${projectId}`);
}

export function forkTemplate(payload: SavePayload): Promise<{ success: boolean; forked: boolean }> {
  return authFetch("/api/local/fork-template", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loadThemeConfig(projectName: string, projectId: number): Promise<LocalProjectData> {
  return authFetch(`/api/local/load-from-theme/${encodeURIComponent(projectName)}/${projectId}`);
}

export function savePageHtml(projectName: string, projectId: number, html: string): Promise<{ success: boolean }> {
  return authFetch("/api/local/save-page", {
    method: "POST",
    body: JSON.stringify({ projectName, projectId, html }),
  });
}

export function getPageHtmlUrl(projectName: string, projectId: number): string {
  return `/api/local/page/${encodeURIComponent(projectName)}/${projectId}`;
}

/* ═══════════════════════════════════════════════════════════════
   Phase 1-2: Workspace & Theme Gatekeeper API
   ═══════════════════════════════════════════════════════════════ */

export interface WorkspaceResponse {
  workspace: any | null;
  activeTheme?: any | null;
}

export function getWorkspace(): Promise<WorkspaceResponse> {
  return authFetch("/api/workspace");
}

export function initWorkspace(): Promise<{ workspace: any; created: boolean }> {
  return authFetch("/api/workspace/init", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export interface ApplyThemePayload {
  themeId: number;
}

export interface ApplyThemeResponse {
  success: boolean;
  workspace: any;
  theme: any;
  wiped: boolean;
  ghostCheck: { passed: boolean };
}

export function applyTheme(payload: ApplyThemePayload): Promise<ApplyThemeResponse> {
  return authFetch("/api/workspace/apply-theme", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteWorkspaceTheme(): Promise<{ success: boolean }> {
  return authFetch("/api/workspace/theme", {
    method: "DELETE",
  });
}

export function ghostCheck(): Promise<{ isEmpty: boolean; exists?: boolean; files: string[] }> {
  return authFetch("/api/workspace/ghost-check");
}

export function saveSections(payload: {
  sections: any[];
  language?: string;
  scheme?: any;
  dark?: boolean;
  themeId?: number | null;
}): Promise<{ success: boolean; sectionCount: number }> {
  return authFetch("/api/workspace/save-sections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loadSections(): Promise<{
  sections: any[] | null;
  language?: string;
  scheme?: any;
  dark?: boolean;
  themeId?: number | null;
}> {
  return authFetch("/api/workspace/load-sections");
}

export function getMasterThemes(): Promise<{ themes: any[] }> {
  return authFetch("/api/workspace/master-themes");
}
