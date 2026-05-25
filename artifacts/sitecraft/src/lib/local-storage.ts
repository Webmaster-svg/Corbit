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
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
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
