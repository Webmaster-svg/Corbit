import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { TEMPLATES } from "../../templates";
import type { TemplateEntry } from "../../templates/types";
import {
  ArrowLeft, Layers, Plus, Trash2, Copy,
  ChevronUp, ChevronDown, Settings, Eye, EyeOff, Pencil,
  Save, Loader2, Monitor, Smartphone, Check,
  Sun, Moon, Undo2, Redo2, Upload, GripVertical,
} from "lucide-react";
import type { ColorScheme, Language } from "../../templates/types";
import { useGetProject, useListProjects } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import {
  loadThemeConfig, saveLocalProject, forkTemplate, savePageHtml,
  getWorkspace, initWorkspace, saveSections, loadSections
} from "@/lib/local-storage";
import { sectionTemplates, SectionTemplate, SectionContent, SectionSettings, FormFieldDef } from "@/lib/section-templates";
import { getThemeContent } from "@/lib/section-theme-content";
import { useThemeApply } from "@/lib/theme-context";

const defaultScheme = (): ColorScheme => ({
  name: "Custom", swatch: "#3b82f6", bg: "#ffffff", surface: "#f8fafc",
  accent: "#3b82f6", accentText: "#ffffff", text: "#0f172a",
  muted: "#64748b", border: "#e2e8f0",
});

interface SectionState {
  id: string;
  type: string;
  content: SectionContent;
  settings: SectionSettings;
  formFields?: FormFieldDef[];
}

/* Phase 3: UUID-based section IDs — never use array indices */
function freshId(): string {
  return crypto.randomUUID();
}

/* Phase 4: Fallback defaults — sections never collapse to 0px on empty content */
const FALLBACK_CONTENT: Record<string, string> = {
  brand: "My Brand",
  headline: "Empty Text Block",
  subheadline: "Edit this text in the right panel",
  description: "Add your content here",
  buttonText: "Click Here",
  cta: "Get Started",
  tagline: "Your tagline here",
  productName: "Product Name",
  price: "$0.00",
  originalPrice: "",
  badge: "New",
  image: "",
  testimonialText: "Amazing service! I highly recommend them.",
  author: "Your Name",
  role: "Customer",
  stats: "99%",
  statLabel: "Satisfaction",
  feature1: "Feature One",
  feature2: "Feature Two",
  feature3: "Feature Three",
  socialLinks: "",
  copyright: "© 2024 All rights reserved",
};
function ensureContent(content: SectionContent): SectionContent {
  const safe: SectionContent = {};
  for (const key of Object.keys(FALLBACK_CONTENT)) {
    safe[key] = content[key] || FALLBACK_CONTENT[key];
  }
  return { ...content, ...safe };
}

const defaultSettings = (): SectionSettings => ({
  backgroundColor: "transparent",
  paddingTop: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  paddingRight: "0px",
  textColor: "",
  accentColor: "",
});

const STARTER_TYPES = ["navbar", "hero", "featured-products", "trust-bar", "testimonials", "about", "newsletter", "footer"];

function createStarterSections(tmpl?: TemplateEntry): SectionState[] {
  const slug = tmpl?.slug || "luxuria";
  const accent = tmpl?.schemes?.[0]?.accent || "#d4a574";
  return STARTER_TYPES.map(type => {
    const secTmpl = sectionTemplates.find(t => t.type === type);
    const themeContent = getThemeContent(slug, type);
    return {
      id: freshId(),
      type,
      content: themeContent || (secTmpl ? { ...secTmpl.defaultContent } : {}),
      settings: { ...defaultSettings(), accentColor: accent },
      formFields: secTmpl?.fields ? secTmpl.fields.map((f, i) => ({ ...f, id: `f-${i}-${freshId()}` })) : undefined,
    };
  });
}

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  // `:id` is the project name — find it from the user's project list
  const { data: allProjects, isLoading: listLoading } = useListProjects();
  const matchedProject = id && allProjects?.find(
    (p: any) => normalizeName(p.name || "") === normalizeName(id)
  );

  const project = matchedProject || null;
  const projectId: number | null = matchedProject?.id || null;

  const { user } = useAuth();
  const { openApplyThemeFlow } = useThemeApply();

  /* ── States ── */
  const [sections, setSections] = useState<SectionState[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [editMode, setEditMode] = useState(true);
  const [dark, setDark] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("idle");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuIndex, setAddMenuIndex] = useState<number | null>(null);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [scheme, setScheme] = useState<ColorScheme>(defaultScheme());
  const [renderTick, setRenderTick] = useState(0);
  const [workspace, setWorkspace] = useState<any | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [localConfig, setLocalConfig] = useState<Record<string, any> | null | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ── Derive template: prefer workspace.activeThemeId, fall back to project.templateId ── */
  const effectiveThemeId = (workspace?.workspace as any)?.activeThemeId || (project as any)?.templateId;
  const template = effectiveThemeId
    ? TEMPLATES.find((t) => t.id === effectiveThemeId)
    : null;

  const menuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSaveRef = useRef<any>(null);
  const saveStatusRef = useRef<string>("idle");
  const saveStartedRef = useRef(0);
  const statusTimerRef = useRef<any>(null);

  function triggerRender() { setRenderTick(t => t + 1); }

  useEffect(() => {
    if (!listLoading && allProjects !== undefined && !matchedProject) {
      setLocation("/templates");
    }
  }, [listLoading, allProjects, matchedProject, setLocation]);

  /* ── Initialize sections from project config or starter ── */
  useEffect(() => {
    if (!template || !projectId) return;
    const saved = (project as any)?.templateConfig;
    if (saved?.sections?.length) {
      setSections(saved.sections.map((s: any) => ({ ...s, id: s.id || freshId() })));
      setLanguage(saved.language || "en");
      setScheme(saved.scheme || template.schemes[0] || defaultScheme());
      setDark(saved.dark ?? false);
    } else {
      setSections(createStarterSections(template));
    }
  }, [template, project]);

  /* ── Phase 1: Workspace state ── */
  useEffect(() => {
    if (!projectId || !user) return;
    setWorkspaceLoading(true);
    getWorkspace(projectId)
      .then((ws) => { setWorkspace(ws); setWorkspaceLoading(false); })
      .catch(() => { setWorkspace(null); setWorkspaceLoading(false); });
  }, [projectId, user]);

  /* ── Phase 4: Debounced auto-save (500ms) ── */
  useEffect(() => {
    if (!projectId) return;
    const p = project as any;
    if (!p?.name) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      if (saveStatusRef.current === "saving") return;
      saveStatusRef.current = "saving";
      setSaveStatus("saving");
      const payload = { sections, language, scheme, dark, themeId: template?.id || null };
      saveSections(payload)
        .then(() => {
          setLocalConfig({ language, scheme, dark, sections, _templateId: template?.id || null });
        })
        .catch(() => { saveStatusRef.current = "idle"; setSaveStatus("idle"); });
    }, 500);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [sections, language, scheme, dark, renderTick]);

  /* ── Dirty detection ── */
  useEffect(() => {
    if (saveStatus === "uptodate") setSaveStatus("idle");
  }, [sections, language, scheme, dark]);

  /* ── Section actions ── */
  const addSection = (type: string, index?: number) => {
    const tmpl = sectionTemplates.find(t => t.type === type);
    if (!tmpl) return;
    const newSection: SectionState = {
      id: freshId(),
      type,
      content: { ...tmpl.defaultContent },
      settings: { ...defaultSettings(), accentColor: scheme.accent || "#d4a574" },
      formFields: tmpl.fields ? tmpl.fields.map((f, i) => ({ ...f, id: `f-${i}-${freshId()}` })) : undefined,
    };
    setSections(prev => {
      const idx = index ?? prev.length;
      const next = [...prev];
      next.splice(idx, 0, newSection);
      return next;
    });
    setSelectedSection(newSection.id);
    setShowAddMenu(false);
    setAddMenuIndex(null);
    triggerRender();
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    if (selectedSection === sectionId) setSelectedSection(null);
    triggerRender();
  };

  const duplicateSection = (sectionId: string) => {
    const idx = sections.findIndex(s => s.id === sectionId);
    if (idx < 0) return;
    const orig = sections[idx];
    const dup: SectionState = {
      ...orig,
      id: freshId(),
      content: { ...orig.content },
      settings: { ...orig.settings },
      formFields: orig.formFields?.map((f, fi) => ({ ...f, id: `f-${fi}-${freshId()}` })) || undefined,
    };
    setSections(prev => {
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
    setSelectedSection(dup.id);
    triggerRender();
  };

  const moveSection = (sectionId: string, dir: "up" | "down") => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx < 0) return prev;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    triggerRender();
  };

  /* ── Save handler ── */
  const handleSave = () => {
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    saveStatusRef.current = "saving";
    const payload = { sections, language, scheme, dark, themeId: template?.id || null };
    saveSections(payload)
      .then(() => {
        setLocalConfig({ language, scheme, dark, sections, _templateId: template?.id || null });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("uptodate"), 2000);
      })
      .catch(() => { setSaveStatus("idle"); saveStatusRef.current = "idle"; });
  };

  /* ── Change Theme ── */
  const handleChangeTheme = (newTemplate: TemplateEntry) => {
    if (newTemplate.id === template?.id) { setShowThemeSwitcher(false); return; }
    setShowThemeSwitcher(false);
    openApplyThemeFlow(newTemplate, () => {
      if (project) window.location.href = `/editor/${normalizeName((project as any).name)}`;
    });
  };

  /* ── Close add menu on outside click ── */
  useEffect(() => {
    if (!showAddMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
        setAddMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAddMenu]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddMenu(false);
        setAddMenuIndex(null);
        setShowThemeSwitcher(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Loading spinner while project list / workspace is in-flight ── */
  if (listLoading || allProjects === undefined || workspaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!template) return null;

  const activeSection = sections.find(s => s.id === selectedSection) || null;
  const activeTmpl = activeSection ? sectionTemplates.find(t => t.type === activeSection.type) : null;

  const deviceWidth = deviceMode === "desktop" ? "100%" : "375px";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-900 text-zinc-100 font-sans select-none">
      {/* ── TOP TOOLBAR ── */}
      <header className="h-12 flex items-center justify-between px-3 bg-zinc-900 shrink-0 z-50 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => window.history.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <span className="text-sm font-semibold text-zinc-100 truncate max-w-[160px]">
            {(project as any)?.name || template.name}
          </span>
          {project && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${(project as any).status === "published"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
              }`}>
              {(project as any).status === "published" ? "Published" : "Draft"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-0.5">
            <button onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded-full transition-colors ${deviceMode === "desktop" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded-full transition-colors ${deviceMode === "mobile" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}>
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => { setShowAddMenu(true); setAddMenuIndex(sections.length); }}
            className="flex items-center gap-1.5 px-4 h-8 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
            <Redo2 className="w-4 h-4" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <div className="flex items-center gap-0.5 bg-zinc-800/50 rounded-lg p-0.5">
            <button onClick={() => setEditMode(true)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-full text-[11px] font-semibold transition-all leading-none ${editMode ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}>
              <Pencil className="w-3 h-3" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button onClick={() => setEditMode(false)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-full text-[11px] font-semibold transition-all leading-none ${!editMode ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}>
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">View</span>
            </button>
          </div>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <button onClick={() => setDark(!dark)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={handleSave} disabled={saveStatus === "saving" || saveStatus === "uptodate"}
            className={`px-3 h-8 flex items-center gap-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${saveStatus === "saving" ? "bg-zinc-700 text-zinc-400" : saveStatus === "saved" ? "bg-emerald-600 text-white" : saveStatus === "uptodate" ? "bg-zinc-700/60 text-zinc-500" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
            {saveStatus === "saving" ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : saveStatus === "saved" ? <><Check className="w-3.5 h-3.5" /> Saved</> : saveStatus === "uptodate" ? <><Check className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save</>}
          </button>
        </div>
      </header>

      {/* ── MAIN AREA ── */}
      <div className={`flex-1 flex ${deviceMode !== "desktop" ? "justify-center" : ""} overflow-hidden pb-4`}>

        {/* ── LEFT PANEL ── */}
        {showLeftPanel && (
          <aside className={`bg-zinc-900 flex flex-col shrink-0 overflow-hidden ${deviceMode !== "desktop" ? "flex-1" : ""}`}>
            <div className={`${deviceMode !== "desktop" ? "w-full" : "w-[260px]"} flex flex-col h-full`}>
              <div className="px-3 pt-3 pb-3 space-y-3">
                <div className="flex items-center gap-2.5 px-1">
                  <div className="w-1 h-4 rounded-full bg-emerald-500 shrink-0" />
                  <h3 className="text-xs font-semibold text-zinc-100">Sections</h3>
                  <span className="text-[9px] text-zinc-500 font-mono">{sections.length}</span>
                </div>
                <button onClick={() => { setShowAddMenu(true); setAddMenuIndex(sections.length); }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-dashed border-zinc-700/40 hover:border-zinc-600/50 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {sections.map((sec, i) => {
                  const tmpl = sectionTemplates.find(t => t.type === sec.type);
                  return (
                    <div key={sec.id}
                      onClick={() => setSelectedSection(sec.id)}
                      className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${selectedSection === sec.id
                          ? "bg-zinc-700/50 text-zinc-200"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                        }`}>
                      <GripVertical className="w-3 h-3 text-zinc-600 shrink-0" />
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: scheme.accent }} />
                      <span className="truncate flex-1 text-[11px] font-medium">
                        {i + 1}. {tmpl?.label || sec.type}
                      </span>
                      <span className="text-[8px] text-zinc-600 font-mono">{sec.type}</span>
                      {editMode && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {i > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "up"); }}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50">
                              <ChevronUp className="w-3 h-3" />
                            </button>
                          )}
                          {i < sections.length - 1 && (
                            <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "down"); }}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50">
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); duplicateSection(sec.id); }}
                            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50">
                            <Copy className="w-3 h-3" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }}
                            className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* ── CANVAS ── */}
        <div className={`${deviceMode !== "desktop" ? "w-[375px]" : "flex-1"} overflow-y-auto overflow-x-hidden bg-zinc-900 rounded-2xl hide-scrollbar`} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div ref={scrollRef} className="min-h-full flex flex-col w-full bg-zinc-900">
            <div className="min-h-full flex flex-col items-center">
              <div style={{ width: deviceWidth }} className={`${deviceMode !== "desktop" ? "bg-white rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-zinc-700/50" : "w-full"}`}>
                <div id="section-canvas" style={{ background: dark ? "#0a0a0a" : scheme.bg, color: dark ? "#f5f5f5" : scheme.text, fontFamily: "'Georgia',serif", minHeight: "100vh" }}>
                  {sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center text-zinc-500">
                      <Layers className="w-8 h-8 mb-3 text-zinc-600" />
                      <p className="text-sm mb-4">No sections yet</p>
                      <button onClick={() => { setShowAddMenu(true); setAddMenuIndex(0); }}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors">
                        Add your first section
                      </button>
                    </div>
                  ) : (
                    sections.map((sec, i) => {
                      const tmpl = sectionTemplates.find(t => t.type === sec.type);
                      const isSelected = selectedSection === sec.id;
                      const selectedAccent = scheme.accent || "#3b82f6";

                      /* Section settings with scheme fallback */
                      const mergedSettings: SectionSettings = {
                        ...defaultSettings(),
                        ...sec.settings,
                        textColor: sec.settings.textColor || scheme.text,
                        accentColor: sec.settings.accentColor || scheme.accent,
                      };

                      return (
                        <div key={sec.id} className="relative">
                          {/* Drop zone above section (only when edit mode) */}
                          {editMode && (
                            <div className="relative h-1 group/drop">
                              <button onClick={() => { setShowAddMenu(true); setAddMenuIndex(i); }}
                                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 flex items-center justify-center opacity-0 group-hover/drop:opacity-100 transition-opacity z-20">
                                <div className="h-0.5 w-full rounded-full" style={{ background: `${selectedAccent}40` }} />
                                <div className="absolute px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: selectedAccent, color: "#fff" }}>+</div>
                              </button>
                            </div>
                          )}

                          {/* Section */}
                          <div
                            onClick={() => setSelectedSection(sec.id)}
                            className={`relative ${editMode ? "cursor-pointer" : ""}`}
                            style={{
                              outline: isSelected && editMode ? `2px solid ${selectedAccent}` : "2px solid transparent",
                              outlineOffset: "-1px",
                            }}
                          >
                            {/* Section toolbar (edit mode + selected) */}
                            {editMode && isSelected && (
                              <div className="absolute -top-8 left-0 z-30 flex items-center gap-px shadow-lg rounded-md overflow-hidden" style={{ pointerEvents: "auto" }}>
                                <span className="text-[9px] font-bold px-2 py-1 text-white" style={{ background: selectedAccent }}>
                                  {tmpl?.label || sec.type}
                                </span>
                                <button onClick={(e) => { e.stopPropagation(); setShowAddMenu(true); setAddMenuIndex(i); }}
                                  className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors" style={{ background: selectedAccent }}>
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); duplicateSection(sec.id); }}
                                  className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors" style={{ background: selectedAccent }}>
                                  <Copy className="w-3 h-3" />
                                </button>
                                {i > 0 && (
                                  <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "up"); }}
                                    className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors" style={{ background: selectedAccent }}>
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                )}
                                {i < sections.length - 1 && (
                                  <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "down"); }}
                                    className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors" style={{ background: selectedAccent }}>
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }}
                                  className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors" style={{ background: selectedAccent }}>
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {/* Phase 3-4: Render with fallback defaults so sections never collapse */}
                            <div className="relative">
                              {tmpl ? tmpl.render(ensureContent(sec.content), mergedSettings) : (
                                <div className="py-8 text-center text-sm text-zinc-500">
                                  Unknown section type: {sec.type}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Drop zone below last section */}
                          {editMode && i === sections.length - 1 && (
                            <div className="relative h-1 group/drop">
                              <button onClick={() => { setShowAddMenu(true); setAddMenuIndex(i + 1); }}
                                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 flex items-center justify-center opacity-0 group-hover/drop:opacity-100 transition-opacity z-20">
                                <div className="h-0.5 w-full rounded-full" style={{ background: `${selectedAccent}40` }} />
                                <div className="absolute px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: selectedAccent, color: "#fff" }}>+</div>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        {showRightPanel && (
          <aside className={`bg-zinc-900 flex flex-col shrink-0 overflow-hidden ${deviceMode !== "desktop" ? "flex-1" : ""}`}>
            <div className={`${deviceMode !== "desktop" ? "w-full" : "w-[280px]"} flex flex-col h-full`}>
              <div className="px-4 pt-4 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
                    <h3 className="text-xs font-semibold text-zinc-100">
                      {activeSection ? (activeTmpl?.label || "Section") : "Properties"}
                    </h3>
                  </div>
                  {activeSection && (
                    <button onClick={() => setSelectedSection(null)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {!activeSection && (
                  <p className="text-[10px] text-zinc-500">Select a section to edit its content</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3">
                {!activeSection && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 flex items-center justify-center mb-4 ring-1 ring-zinc-700/50">
                      <Settings className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[180px]">Select a section on the canvas or from the left panel to edit its content</p>
                  </div>
                )}

                {activeSection && activeTmpl && (
                  <SectionContentEditor
                    section={activeSection}
                    template={activeTmpl}
                    onUpdateContent={updateSectionContent}
                    onUpdateSettings={updateSectionSettings}
                    onUpdateFormFields={updateSectionFormFields}
                  />
                )}

                {/* ── Global settings ── */}
                <div className="relative py-1">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-800" />
                  <div className="relative flex justify-center">
                    <span className="px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900">Global</span>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Colors</h4>
                  {([
                    { label: "Background", key: "bg" as const },
                    { label: "Surface", key: "surface" as const },
                    { label: "Accent", key: "accent" as const },
                    { label: "Text", key: "text" as const },
                  ]).map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">{label}</span>
                      <div className="flex items-center gap-2">
                        <input type="color" value={scheme[key]}
                          onChange={(e) => setScheme({ ...scheme, [key]: e.target.value })}
                          className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0.5" />
                        <span className="text-[9px] font-mono text-zinc-500 w-14 text-right">{scheme[key]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Presets</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {template.schemes.map((s) => (
                      <button key={s.name} onClick={() => setScheme(s)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${scheme.name === s.name ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"}`}>
                        <span className="w-3 h-3 rounded-md ring-1 ring-zinc-700/50" style={{ background: s.accent }} />
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Language</h4>
                  <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-0.5">
                    {(["en", "fr", "ar"] as const).map((lang) => (
                      <button key={lang} onClick={() => setLanguage(lang)}
                        className={`flex-1 px-3 py-1.5 text-[10px] font-bold rounded-md uppercase transition-all ${language === lang ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>{lang}</button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Display</h4>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-[11px] text-zinc-400">Dark Mode</span>
                    </div>
                    <div className="relative w-8 h-4" onClick={() => setDark(!dark)}>
                      <div className={`absolute inset-0 rounded-full transition-colors ${dark ? "bg-blue-600" : "bg-zinc-700"}`} />
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${dark ? "translate-x-4" : ""}`} />
                    </div>
                  </label>
                </div>
                <div className="h-2" />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Add Section Menu (floating) ── */}
      {showAddMenu && (
        <div ref={menuRef} className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => { setShowAddMenu(false); setAddMenuIndex(null); }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-zinc-800/95 rounded-2xl shadow-2xl border border-zinc-700/50 w-[520px] max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-zinc-700/40">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Add Section</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Choose a section to insert into your page</p>
              </div>
              <button onClick={() => { setShowAddMenu(false); setAddMenuIndex(null); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin" style={{ scrollbarGutter: "stable" }}>
              {sectionTemplates.map((tmpl) => (
                <button key={tmpl.type} onClick={() => addSection(tmpl.type, addMenuIndex ?? undefined)}
                  className="w-full rounded-xl text-left transition-all duration-150 group hover:bg-zinc-700/40 active:scale-[0.99] overflow-hidden border border-zinc-700/30 hover:border-zinc-600/50">
                  <div className="w-full h-[72px] overflow-hidden relative bg-zinc-900/50">
                    <div className="absolute inset-0" style={{ transform: "scale(0.28)", transformOrigin: "top left", width: `${100 / 0.28}%`, pointerEvents: "none" }}>
                      <div style={{ background: dark ? "#0a0a0a" : scheme.bg, color: dark ? "#f5f5f5" : scheme.text, fontFamily: "'Georgia',serif" }}>
                        {tmpl.render(tmpl.defaultContent, { backgroundColor: "transparent", paddingTop: "0px", paddingBottom: "0px", paddingLeft: "0px", paddingRight: "0px", textColor: scheme.text, accentColor: scheme.accent })}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-zinc-800/80 to-transparent" />
                  </div>
                  <div className="flex items-center gap-3 px-3.5 py-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-zinc-200 group-hover:text-white transition-colors">{tmpl.label}</span>
                        <span className="text-[7px] font-mono text-zinc-600 group-hover:text-zinc-500 px-1 py-0.5 rounded bg-zinc-800/80">{tmpl.type}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed line-clamp-1">{tmpl.description}</div>
                    </div>
                    <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-zinc-700/40 flex items-center justify-between text-[10px] text-zinc-600">
              <span>{sectionTemplates.length} section types</span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-700/60 text-[8px] font-mono text-zinc-400">Esc</kbd>
                <span>to close</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {/* ── Theme Switcher ── */}
      {showThemeSwitcher && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowThemeSwitcher(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-zinc-800/95 rounded-2xl shadow-2xl border border-zinc-700/50 w-[520px] max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-zinc-700/40">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Change Theme</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Changing the theme will replace all sections with new starter content.</p>
              </div>
              <button onClick={() => setShowThemeSwitcher(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button key={tmpl.id} onClick={() => handleChangeTheme(tmpl)}
                  className={`flex flex-col items-start gap-1.5 p-3 rounded-xl text-left transition-all border ${tmpl.id === template?.id ? "border-blue-500/60 bg-blue-500/10" : "border-zinc-700/40 hover:bg-zinc-700/30 hover:border-zinc-600/50"}`}>
                  <span className="text-xs font-semibold text-zinc-200">{tmpl.name}</span>
                  <span className="text-[9px] text-zinc-500">{tmpl.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl transition-all ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Section Content Editor (right panel)
   ══════════════════════════════════════════════════════════════ */

function SectionContentEditor({
  section, template, onUpdateContent, onUpdateSettings, onUpdateFormFields,
}: {
  section: SectionState;
  template: SectionTemplate;
  onUpdateContent: (id: string, key: string, val: string) => void;
  onUpdateSettings: (id: string, updates: Partial<SectionSettings>) => void;
  onUpdateFormFields: (id: string, fields: FormFieldDef[]) => void;
}) {
  const inpCls = "w-full px-3 py-2 rounded-lg text-xs bg-zinc-800/80 border border-zinc-700/60 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/40 placeholder-zinc-500 transition-all";
  const secCls = "rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5";
  const lblCls = "text-[9px] font-bold text-zinc-500 uppercase tracking-widest";

  const fields = template.contentFields || [];

  const formFields = section.formFields || [];

  const addFormField = () => {
    const newField: FormFieldDef = {
      id: `f-${Date.now()}`,
      type: "text",
      label: "New Field",
      placeholder: "",
      required: false,
    };
    onUpdateFormFields(section.id, [...formFields, newField]);
  };

  const updateFormField = (fieldId: string, updates: Partial<FormFieldDef>) => {
    onUpdateFormFields(section.id, formFields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const removeFormField = (fieldId: string) => {
    onUpdateFormFields(section.id, formFields.filter(f => f.id !== fieldId));
  };

  return (
    <div className="space-y-3">
      {/* ── Section label ── */}
      <div className={secCls}>
        <h4 className={lblCls}>Section Type</h4>
        <div className="text-xs text-zinc-400 font-medium">{template.label}</div>
        <div className="text-[10px] text-zinc-500">{template.description}</div>
      </div>

      {/* ── Content fields ── */}
      {fields.map((field) => (
        <div key={field.key} className={secCls}>
          <h4 className={lblCls}>{field.label}</h4>
          {field.type === "textarea" ? (
            <textarea value={section.content[field.key] || ""}
              onChange={(e) => onUpdateContent(section.id, field.key, e.target.value)}
              rows={3} className={inpCls} placeholder={field.label} />
          ) : field.type === "image" ? (
            <div className="space-y-2">
              {section.content[field.key] && (
                <img src={section.content[field.key]} alt="" className="w-full h-24 object-cover rounded-lg" />
              )}
              <input value={section.content[field.key] || ""}
                onChange={(e) => onUpdateContent(section.id, field.key, e.target.value)}
                className={inpCls} placeholder="https://..." />
            </div>
          ) : (
            <input value={section.content[field.key] || ""}
              onChange={(e) => onUpdateContent(section.id, field.key, e.target.value)}
              className={inpCls} placeholder={field.label} />
          )}
        </div>
      ))}

      {/* ── Form fields editor (for form sections) ── */}
      {template.isForm && (
        <div className={secCls}>
          <div className="flex items-center justify-between">
            <h4 className={lblCls}>Form Fields</h4>
            <button onClick={addFormField}
              className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {formFields.length === 0 ? (
            <div className="text-[10px] text-zinc-500 italic">No form fields defined</div>
          ) : (
            <div className="space-y-1.5">
              {formFields.map((ff, i) => (
                <div key={ff.id} className="p-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-400 shrink-0">{i + 1}</span>
                      <input value={ff.label} onChange={(e) => updateFormField(ff.id, { label: e.target.value })}
                        className="flex-1 px-2 py-1 rounded text-[11px] font-medium bg-zinc-700/60 border border-zinc-600/60 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/60 placeholder-zinc-500 min-w-0" placeholder="Field label" />
                    </div>
                    <button onClick={() => removeFormField(ff.id)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <select value={ff.type} onChange={(e) => updateFormField(ff.id, { type: e.target.value as any })}
                      className="flex-1 px-2 py-1.5 rounded text-[10px] bg-zinc-700/60 border border-zinc-600/60 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/60 appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', paddingRight: '22px' }}>
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="number">Number</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 cursor-pointer shrink-0 px-1.5 py-1 rounded bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors">
                      <input type="checkbox" checked={!!ff.required} onChange={(e) => updateFormField(ff.id, { required: e.target.checked })}
                        className="accent-blue-500 w-3 h-3" />
                      Req
                    </label>
                  </div>
                  <input value={ff.placeholder || ""} onChange={(e) => updateFormField(ff.id, { placeholder: e.target.value })}
                    className="w-full px-2 py-1.5 rounded text-[10px] bg-zinc-700/60 border border-zinc-600/60 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/60 placeholder-zinc-500" placeholder="Placeholder text" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Section settings ── */}
      <div className={secCls}>
        <h4 className={lblCls}>Section Style</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">Background</span>
            <div className="flex items-center gap-1.5">
              <input type="color" value={section.settings.backgroundColor || "#000000"}
                onChange={(e) => onUpdateSettings(section.id, { backgroundColor: e.target.value })}
                className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0" />
              <input type="text" value={section.settings.backgroundColor || ""}
                onChange={(e) => onUpdateSettings(section.id, { backgroundColor: e.target.value })}
                className="w-16 px-1.5 py-1 rounded text-[9px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">Text Color</span>
            <div className="flex items-center gap-1.5">
              <input type="color" value={section.settings.textColor || "#000000"}
                onChange={(e) => onUpdateSettings(section.id, { textColor: e.target.value })}
                className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0" />
              <input type="text" value={section.settings.textColor || ""}
                onChange={(e) => onUpdateSettings(section.id, { textColor: e.target.value })}
                className="w-16 px-1.5 py-1 rounded text-[9px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">Accent Color</span>
            <div className="flex items-center gap-1.5">
              <input type="color" value={section.settings.accentColor || "#d4a574"}
                onChange={(e) => onUpdateSettings(section.id, { accentColor: e.target.value })}
                className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0" />
              <input type="text" value={section.settings.accentColor || ""}
                onChange={(e) => onUpdateSettings(section.id, { accentColor: e.target.value })}
                className="w-16 px-1.5 py-1 rounded text-[9px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Padding</span>
            <div className="grid grid-cols-4 gap-1">
              {(["Top", "Right", "Bottom", "Left"] as const).map((side) => {
                const key = `padding${side}` as keyof SectionSettings;
                return (
                  <div key={side} className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] text-zinc-600 font-semibold uppercase">{side[0]}</span>
                    <input type="text" value={(section.settings[key] as string) || "0px"}
                      onChange={(e) => onUpdateSettings(section.id, { [key]: e.target.value })}
                      className="w-full px-1 py-1 rounded text-[9px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50" placeholder="0px" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
