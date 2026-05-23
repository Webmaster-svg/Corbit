import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "../../templates";
import {
  ArrowLeft, Layers, Type, Image, Square, LayoutGrid,
  Undo2, Redo2, Monitor, Smartphone,
  Globe, Sun, Moon, GripVertical, Plus, Trash2, Copy,
  ChevronRight, ChevronDown, ChevronUp, Settings, Eye, EyeOff, Pencil,
  Save, Loader2, Check, Home, Package, Info, Mail,
  Heading, Video, Link as LinkIcon, FormInput, ExternalLink, Minus
} from "lucide-react";
import type { ColorScheme, Language } from "../../templates/types";
import { useUpdateProject, useGetProject } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetProjectQueryKey } from "@workspace/api-client-react";

const defaultScheme = (): ColorScheme => ({
  name: "Custom", swatch: "#3b82f6", bg: "#ffffff", surface: "#f8fafc",
  accent: "#3b82f6", accentText: "#ffffff", text: "#0f172a",
  muted: "#64748b", border: "#e2e8f0",
});

const pages = [
  { id: "home", label: "Home", icon: Home },
  { id: "products", label: "Products", icon: Package },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
];

const elementTypes = [
  { id: "text", label: "Text", icon: Type },
  { id: "heading", label: "Heading", icon: Heading },
  { id: "image", label: "Image", icon: Image },
  { id: "button", label: "Button", icon: Square },
  { id: "link", label: "Link", icon: LinkIcon },
  { id: "input", label: "Input", icon: FormInput },
  { id: "section", label: "Section", icon: LayoutGrid },
  { id: "container", label: "Container", icon: Layers },
  { id: "video", label: "Video", icon: Video },
  { id: "divider", label: "Divider", icon: Minus },
];

interface Rect { top: number; left: number; width: number; height: number }

interface CustomBlock {
  id: string;
  type: string;
  label: string;
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  headingLevel?: number;
  placeholder?: string;
}

interface LayerNode {
  id: string;
  type: string;
  label: string;
  depth: number;
  rect: Rect;
  element: HTMLElement;
  children: LayerNode[];
  parentId: string | null;
}

function detectType(el: HTMLElement): string {
  const t = el.tagName.toLowerCase();
  if (t === "img") return "Image";
  if (t === "button" || t === "a") return "Button";
  if (["input", "select", "textarea"].includes(t)) return "Input";
  if (["h1", "h2", "h3", "h4", "h5"].includes(t)) return "Heading";
  if (["p", "span", "label", "strong", "em", "b", "i", "small"].includes(t)) return "Text";
  if (t === "nav") return "Nav";
  if (t === "header") return "Header";
  if (t === "footer") return "Footer";
  if (t === "section" || t === "main" || t === "article") return "Section";
  if (["ul", "ol"].includes(t)) return "List";
  if (t === "li") return "Item";
  if (t === "div" && el.children.length > 0) return "Container";
  if (t === "div") return "Block";
  return "Block";
}

function makeLabel(type: string, el: HTMLElement, index: number): string {
  const text = el.textContent?.trim().slice(0, 30);
  if (text && ["Text", "Heading", "Button", "Item"].includes(type)) return text;
  if (el instanceof HTMLImageElement && el.alt) return el.alt;
  return `${type} ${index + 1}`;
}

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams(window.location.search);
  const projectId = queryParams.get("projectId") ? Number(queryParams.get("projectId")) : null;

  const { data: project } = useGetProject(projectId || 0, { query: { enabled: !!projectId } });
  const updateMutation = useUpdateProject({
    mutation: {
      onSuccess: () => {
        if (projectId) queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
        lastSavedRef.current = {
          language, scheme, dark,
          hiddenIds: Array.from(hiddenIds),
          addedBlocks,
        };
        setSaveStatus("idle");
      },
    },
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving">("idle");
  const lastSavedRef = useRef<Record<string, any> | null>(null);

  const template = TEMPLATES.find(
    (tmpl) => tmpl.id === parseInt(id || "") || tmpl.slug.toLowerCase() === id?.toLowerCase()
  );

  useEffect(() => { if (!template) setLocation("/templates"); }, [template, setLocation]);

  const savedConfig = project?.templateConfig as Record<string, any> | undefined;

  useEffect(() => {
    if (!savedConfig) return;
    setLanguage(savedConfig.language || "en");
    setScheme(savedConfig.scheme || template?.schemes[0] || defaultScheme());
    setDark(savedConfig.dark ?? false);
    setHiddenIds(new Set(savedConfig.hiddenIds || []));
    setAddedBlocks(savedConfig.addedBlocks || []);
    lastSavedRef.current = {
      language: savedConfig.language || "en",
      scheme: savedConfig.scheme,
      dark: savedConfig.dark ?? false,
      hiddenIds: savedConfig.hiddenIds || [],
      addedBlocks: savedConfig.addedBlocks || [],
    };
  }, [savedConfig]);

  const [language, setLanguage] = useState<Language>(savedConfig?.language || "en");
  const [scheme, setScheme] = useState<ColorScheme>(
    savedConfig?.scheme || template?.schemes[0] || defaultScheme()
  );
  const [dark, setDark] = useState(savedConfig?.dark ?? false);
  const [activePage, setActivePage] = useState("home");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [leftTab, setLeftTab] = useState<"pages" | "elements" | "layers">("layers");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [editMode, setEditMode] = useState(true);

  /* ── Layer tree state ── */
  const [tree, setTree] = useState<LayerNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(
    new Set(savedConfig?.hiddenIds || [])
  );
  const editCanvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [addedBlocks, setAddedBlocks] = useState<CustomBlock[]>(
    savedConfig?.addedBlocks || []
  );
  const [dragOver, setDragOver] = useState(false);
  const dragType = useRef<string | null>(null);
  const [selectedBlockRect, setSelectedBlockRect] = useState<Rect | null>(null);
  const customBlockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [, forceRender] = useState(0);

  const isDirty = (() => {
    const cur = { language, scheme, dark, hiddenIds: Array.from(hiddenIds), addedBlocks };
    const saved = lastSavedRef.current;
    if (!saved) return false;
    return JSON.stringify(cur) !== JSON.stringify(saved);
  })();

  /* ── Recursive DOM scanner ── */
  function scanNode(
    el: HTMLElement,
    parentNodeId: string | null,
    depth: number,
    overlayRect: DOMRect,
    idx: number
  ): LayerNode | null {
    if (!el || el.nodeType !== 1) return null;
    const id = parentNodeId ? `${parentNodeId}-c-${idx}` : `s-${idx}`;
    if (hiddenIds.has(id)) { el.style.display = "none"; return null; }
    el.style.display = "";

    const r = el.getBoundingClientRect();
    if (r.width < 5 || r.height < 5) return null;

    const type = detectType(el);
    const node: LayerNode = {
      id,
      type,
      label: makeLabel(type, el, idx),
      depth,
      rect: { 
        top: (r.top - overlayRect.top) / scale, 
        left: (r.left - overlayRect.left) / scale, 
        width: r.width / scale, 
        height: r.height / scale 
      },
      element: el,
      children: [],
      parentId: parentNodeId,
    };

    if (depth < 4) {
      let ci = 0;
      for (const child of el.children) {
        if (!(child instanceof HTMLElement)) continue;
        const c = scanNode(child, id, depth + 1, overlayRect, ci);
        if (c) { node.children.push(c); ci++; }
      }
    }
    return node;
  }

  /* ── Actions ── */
  const refreshTree = useCallback(() => {
    const root = editCanvasRef.current?.firstElementChild;
    if (!root || !(root instanceof HTMLElement)) { setTree([]); return; }
    const overlay = overlayRef.current;
    if (!overlay) return;
    const o = overlay.getBoundingClientRect();
    const list: LayerNode[] = [];
    let idx = 0;
    for (const child of root.children) {
      if (!(child instanceof HTMLElement)) continue;
      const n = scanNode(child, null, 0, o, idx);
      if (n) { list.push(n); idx++; }
    }
    setTree(list);
  }, [hiddenIds]);

  const createBlock = (type: string, label: string): CustomBlock => {
    const id = `b-${Date.now()}`;
    const base = { id, type, label };
    switch (type) {
      case "text": return { ...base, content: "Edit this text" };
      case "heading": return { ...base, content: "Heading Text", headingLevel: 2 };
      case "button": return { ...base, content: "Click Me", href: "#" };
      case "link": return { ...base, content: "Link Text", href: "#" };
      case "image": return { ...base, src: "https://picsum.photos/seed/default/400/300", alt: "Image" };
      case "input": return { ...base, placeholder: "Enter text...", label: "Input" };
      case "section": return { ...base, label: "Section" };
      case "container": return { ...base, label: "Container" };
      case "video": return { ...base, src: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
      case "divider": return { ...base };
      default: return { ...base, content: "New Block" };
    }
  };

  const addBlock = (type: string, label: string) => {
    setAddedBlocks(prev => [...prev, createBlock(type, label)]);
    setSelectedElement(label);
  };

  const editCustomBlock = (id: string, updates: Partial<CustomBlock>) => {
    setAddedBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleDragStart = (type: string, label: string) => (e: React.DragEvent) => {
    dragType.current = type;
    e.dataTransfer.setData("text/plain", JSON.stringify({ type, label }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      addBlock(data.type, data.label);
    } catch { /* ignore */ }
  };

  const handleDeleteCustomBlock = (id: string) => {
    setAddedBlocks(prev => prev.filter(b => b.id !== id));
    customBlockRefs.current.delete(id);
    if (selectedId === id) { setSelectedId(null); setSelectedElement(null); setSelectedBlockRect(null); }
  };

  /* ── Render helpers ── */
  function getIcon(type: string) {
    if (type === "Image") return Image;
    if (type === "Button") return Square;
    if (type === "Heading" || type === "Text") return Type;
    if (["Nav", "Header", "Footer", "Section", "Container", "Block"].includes(type)) return Layers;
    if (type === "List" || type === "Item") return LayoutGrid;
    return Layers;
  }

  function typeColor(type: string): { ring: string; bg: string; label: string } {
    const t = type.toLowerCase();
    if (["section", "header", "footer", "nav"].includes(t)) return { ring: "#f59e0b", bg: "rgba(245,158,11,0.08)", label: "bg-amber-500" };
    if (["container", "block", "div"].includes(t)) return { ring: "#10b981", bg: "rgba(16,185,129,0.08)", label: "bg-emerald-500" };
    if (["text", "heading", "p"].includes(t)) return { ring: "#3b82f6", bg: "rgba(59,130,246,0.08)", label: "bg-blue-500" };
    if (["image", "img", "video"].includes(t)) return { ring: "#8b5cf6", bg: "rgba(139,92,246,0.08)", label: "bg-violet-500" };
    if (["button", "a", "link"].includes(t)) return { ring: "#ec4899", bg: "rgba(236,72,153,0.08)", label: "bg-pink-500" };
    if (["input", "select", "textarea", "form"].includes(t)) return { ring: "#06b6d4", bg: "rgba(6,182,212,0.08)", label: "bg-cyan-500" };
    if (["list", "ul", "ol", "li", "item"].includes(t)) return { ring: "#f97316", bg: "rgba(249,115,22,0.08)", label: "bg-orange-500" };
    return { ring: "#3b82f6", bg: "rgba(59,130,246,0.08)", label: "bg-blue-500" };
  }

  function renderCustomBlock(block: CustomBlock) {
    const isSelected = selectedId === block.id;
    const selectedBorder = isSelected ? "2px solid #3b82f6" : "1px dashed rgba(255,255,255,0.15)";

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const el = e.currentTarget as HTMLElement;
      const parent = overlayRef.current?.getBoundingClientRect();
      if (parent) {
        setSelectedBlockRect({
          top: (el.getBoundingClientRect().top - parent.top) / scale,
          left: (el.getBoundingClientRect().left - parent.left) / scale,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      }
      setSelectedId(block.id);
      setSelectedElement(block.label);
    };

    const wrap = (child: React.ReactNode) => (
      <div key={block.id} onClick={handleClick} ref={(el) => { if (el) customBlockRefs.current.set(block.id, el); }}
        style={{ padding: block.type === "divider" ? "6px 0" : "12px", margin: "4px 0", border: selectedBorder, borderRadius: 8, cursor: "pointer", background: block.type === "section" ? "rgba(255,255,255,0.03)" : "transparent" }}>
        {child}
      </div>
    );

    switch (block.type) {
      case "image":
        return wrap(<img src={block.src} alt={block.alt || ""} style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 4, display: "block" }} />);
      case "video":
        return wrap(
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe src={block.src} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 4, border: "none" }} allowFullScreen />
          </div>
        );
      case "input":
        return wrap(<input type="text" placeholder={block.placeholder || "Enter text..."} readOnly
          style={{ width: "100%", padding: "10px 14px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />);
      case "divider":
        return wrap(<hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.15)", margin: 0 }} />);
      case "link":
        return wrap(<a href={block.href || "#"} style={{ color: "#3b82f6", textDecoration: "underline", fontSize: 14 }}>{block.content || "Link"}</a>);
      case "heading":
        return wrap(<h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>{block.content || "Heading"}</h2>);
      case "button":
        return wrap(<span style={{ display: "inline-block", background: "#3b82f6", color: "#fff", borderRadius: 9999, padding: "10px 24px", fontSize: 14, fontWeight: 600, border: "none" }}>{block.content || "Button"}</span>);
      default:
        return wrap(<p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{block.content || block.label}</p>);
    }
  }

  function getLiveRect(el: HTMLElement): Rect | null {
    const overlay = overlayRef.current;
    if (!overlay) return null;
    const o = overlay.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      top: (r.top - o.top) / scale,
      left: (r.left - o.left) / scale,
      width: r.width / scale,
      height: r.height / scale,
    };
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedIds(next);
  };

  const deleteNode = (id: string) => {
    const next = new Set(hiddenIds);
    next.add(id);
    setHiddenIds(next);
    setSelectedId(null);
    setSelectedElement(null);
    refreshTree();
  };

  function findNodeById(nodes: LayerNode[], id: string): LayerNode | null {
    for (const n of nodes) {
      if (n.id === id) return n;
      const f = findNodeById(n.children, id);
      if (f) return f;
    }
    return null;
  }

  function findNodeAt(nodes: LayerNode[], clientX: number, clientY: number): string | null {
    let best: string | null = null;
    let bestDepth = -1;
    for (const n of nodes) {
      const r = n.element.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        if (n.depth > bestDepth) { best = n.id; bestDepth = n.depth; }
        const deeper = findNodeAt(n.children, clientX, clientY);
        if (deeper) { const dn = findNodeById(n.children, deeper); if (dn && dn.depth > bestDepth) { best = deeper; bestDepth = dn.depth; } }
      }
    }
    return best;
  }

  const handleOverlayMove = (e: React.MouseEvent) => {
    const id = findNodeAt(tree, e.clientX, e.clientY);
    setHoveredId(id);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const id = findNodeAt(tree, e.clientX, e.clientY);
    if (id) {
      const n = findNodeById(tree, id);
      setSelectedId(id);
      setSelectedElement(n?.type || "Element");
    } else {
      setSelectedId(null);
      setSelectedElement(null);
    }
    setSelectedBlockRect(null);
  };

  useEffect(() => {
    if (editMode) { setShowLeftPanel(true); setShowRightPanel(true) }
    else { setShowLeftPanel(false); setShowRightPanel(false) }
  }, [editMode]);

  useEffect(() => {
    if (!editMode) return;
    const t = setTimeout(refreshTree, 80);
    return () => clearTimeout(t);
  }, [editMode, refreshTree, scheme, language, dark, activePage]);

  useEffect(() => {
    if (!editMode || !editCanvasRef.current) return;
    const el = editCanvasRef.current;
    const observer = new MutationObserver(() => refreshTree());
    observer.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    return () => observer.disconnect();
  }, [editMode, refreshTree]);

  useEffect(() => {
    if (!editMode) return;
    const onScroll = () => forceRender(n => n + 1);
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [editMode]);

  /* ── Computed highlight ── */
  const highlightId = selectedId ?? hoveredId;
  const highlightNode = highlightId ? findNodeById(tree, highlightId) : null;
  const isSelected = selectedId !== null;
  const selectedBlock = selectedId?.startsWith("b-") ? addedBlocks.find(b => b.id === selectedId) ?? null : null;

  if (!template) return null;
  const ActiveComponent = template.component;
  const deviceWidth = deviceMode === "desktop" ? "100%" : "352px";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans select-none">
      
      {/* ── TOP TOOLBAR ── */}
      <header className="h-12 flex items-center justify-between px-3 bg-zinc-900 border-b border-zinc-800 shrink-0 z-50 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <span className="text-sm font-semibold text-zinc-100 truncate max-w-[140px]">{template.name}</span>
          {project && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
              project.status === "published"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
            }`}>
              {project.status === "published" ? "Published" : "Draft"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-full transition-colors ${deviceMode === "desktop" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-full transition-colors ${deviceMode === "mobile" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 mx-0.5" />
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className={`p-1.5 rounded-full transition-colors ${showLeftPanel ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className={`p-1.5 rounded-full transition-colors ${showRightPanel ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Settings className="w-3.5 h-3.5" />
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
            <button
              onClick={() => setEditMode(true)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-full text-[11px] font-semibold transition-all leading-none ${
                editMode ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Pencil className="w-3 h-3" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => setEditMode(false)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-full text-[11px] font-semibold transition-all leading-none ${
                !editMode ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">View</span>
            </button>
          </div>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <button
            onClick={() => setDark(!dark)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              if (!projectId || !project || saveStatus === "saving") return;
              setSaveStatus("saving");
              updateMutation.mutate({
                id: projectId,
                data: {
                  templateConfig: {
                    language,
                    scheme,
                    dark,
                    hiddenIds: Array.from(hiddenIds),
                    addedBlocks,
                  },
                },
              });
            }}
            disabled={!projectId || saveStatus === "saving"}
            className={`px-3 h-8 flex items-center gap-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
              isDirty
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-zinc-700 text-zinc-400"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveStatus === "saving" ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> <span className="hidden sm:inline">Saving...</span></>
            ) : (
              <><Save className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Save</span></>
            )}
          </button>
        </div>
      </header>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0 overflow-hidden"
            >
              <div className="w-[260px] flex flex-col h-full">
                
                {/* Tabs */}
                <div className="flex gap-1 p-2 border-b border-sidebar-border">
                  {[
                    { id: "pages", label: "Pages", icon: Layers },
                    { id: "elements", label: "Add", icon: Plus },
                    { id: "layers", label: "Layers", icon: GripVertical },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setLeftTab(tab.id as any); if (tab.id === "layers") refreshTree(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full transition-all ${
                        leftTab === tab.id
                          ? "bg-background text-foreground shadow-sm border border-border"
                          : "text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ─── Pages ─── */}
                {leftTab === "pages" && (
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                      Pages
                    </div>
                    <div className="space-y-1">
                      {pages.map((page) => (
                        <button key={page.id} onClick={() => setActivePage(page.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            activePage === page.id
                              ? "bg-accent text-accent-foreground shadow-xs"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            activePage === page.id
                              ? "bg-primary/10 text-primary"
                              : "bg-zinc-800/50 text-muted-foreground"
                          }`}>
                            <page.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-xs font-semibold">{page.label}</div>
                            <div className="text-[10px] text-muted-foreground/70 mt-px">/{page.id}</div>
                          </div>
                          {activePage === page.id && (
                            <span className="w-1 h-6 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-dashed border-border/60 hover:border-border transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        Add Page
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── Add Elements ─── */}
                {leftTab === "elements" && (
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                      {editMode ? "Click to add to canvas" : "Switch to Edit to add"}
                    </div>
                    <div className="space-y-1">
                      {elementTypes.map((el) => (
                        <div key={el.id}
                          draggable={editMode}
                          onDragStart={editMode ? handleDragStart(el.id, el.label) : undefined}
                        >
                          <button disabled={!editMode}
                            onClick={() => editMode && addBlock(el.id, el.label)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                              editMode
                                ? "text-sidebar-foreground hover:bg-sidebar-accent cursor-grab active:cursor-grabbing"
                                : "text-muted-foreground/50 cursor-not-allowed"
                            }`}
                          >
                            <el.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1 text-left">{el.label}</span>
                            <span className="text-[9px] text-muted-foreground/40 font-mono">drag + click</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {addedBlocks.length > 0 && (
                      <>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-5 px-2">Added Blocks</div>
                        <div className="space-y-1">
                          {addedBlocks.map((block, i) => (
                            <div key={block.id} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-foreground bg-accent/50">
                              <GripVertical className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                              <span>{block.label}</span>
                              <button onClick={() => setAddedBlocks(prev => prev.filter((_, j) => j !== i))}
                                className="ml-auto p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ─── Layers (element tree) ─── */}
                {leftTab === "layers" && (
                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                      Page Structure
                    </div>
                    {tree.length === 0 && (
                      <div className="text-xs text-muted-foreground/60 px-3 py-6 text-center">Loading structure...</div>
                    )}
                    <LayerTreeItems
                      nodes={tree}
                      selectedId={selectedId}
                      expandedIds={expandedIds}
                      hiddenIds={hiddenIds}
                      onSelect={(id) => { setSelectedId(id); const n = findNodeById(tree, id); setSelectedElement(n?.type || "Element"); }}
                      onToggle={toggleExpand}
                      onDelete={deleteNode}
                      getIcon={getIcon}
                    />
                  </div>
                )}

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── CANVAS ── */}
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden relative">
          <div ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden w-full"
            style={{ background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)" }}
          >
            {!editMode ? (
              <ActiveComponent language={language} scheme={scheme} dark={dark} />
            ) : (
              <div className="min-h-full flex flex-col items-center py-6" ref={wrapperRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div
                  style={{
                    width: deviceMode === "desktop" ? "min(100%, 1280px)" : "375px",
                    margin: "0 auto",
                    position: "relative",
                    background: dragOver ? "rgba(59,130,246,0.05)" : undefined,
                  }}
                  className={deviceMode !== "desktop" ? "bg-white rounded-[10px] shadow-2xl overflow-hidden" : ""}
                >
                  {deviceMode !== "desktop" && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Mobile Preview</div>
                  )}
                    <div ref={editCanvasRef} className="pointer-events-none">
                      <ActiveComponent language={language} scheme={scheme} dark={dark} />
                    </div>

                    <div ref={overlayRef}
                      className="absolute inset-0 z-10 cursor-crosshair"
                      onMouseMove={handleOverlayMove}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={handleOverlayClick}
                    >
                      {/* ── Hover badge (Elementor style) ── */}
                      {hoveredId && highlightNode && !selectedId && (() => {
                        const r = getLiveRect(highlightNode.element);
                        if (!r) return null;
                        return (
                          <div className="absolute pointer-events-none"
                            style={{ top: r.top - 18, left: r.left }}>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-tl rounded-br text-white ${typeColor(highlightNode.type).label}`}>
                              {highlightNode.type}
                            </span>
                          </div>
                        );
                      })()}

                      {/* ── Template element highlight ring (type-based color) ── */}
                      {highlightNode && (highlightId === hoveredId || selectedId?.startsWith("s-")) && !highlightId?.startsWith("b-") && (() => {
                        const r = getLiveRect(highlightNode.element);
                        if (!r) return null;
                        return (
                          <div className="absolute pointer-events-none"
                            style={{
                              top: r.top, left: r.left, width: r.width, height: r.height,
                              boxShadow: `inset 0 0 0 ${isSelected && !hoveredId ? "2px" : "1.5px"} ${typeColor(highlightNode.type).ring}`,
                              background: isSelected && !hoveredId ? typeColor(highlightNode.type).bg : "transparent",
                              borderRadius: "3px",
                            }}
                          />
                        );
                      })()}

                      {/* ── Floating action bar (Elementor style) ── */}
                      {selectedId && highlightNode && !selectedId.startsWith("b-") && (() => {
                        const r = getLiveRect(highlightNode.element);
                        if (!r) return null;
                        return (
                          <div className="absolute flex items-center gap-px shadow-lg"
                            style={{ top: Math.max(r.top - 25, 0), left: r.left, pointerEvents: "auto", zIndex: 20, borderRadius: "4px", overflow: "hidden" }}
                          >
                            <span className={`text-[9px] font-bold px-2 py-1 text-white ${typeColor(highlightNode.type).label}`}>
                              {highlightNode.type}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); deleteNode(selectedId); }}
                              className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors text-[10px] font-bold"
                              style={{ backgroundColor: typeColor(highlightNode.type).ring }}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })()}

                      {/* ── Floating action bar for custom blocks ── */}
                      {selectedId?.startsWith("b-") && selectedBlock && (() => {
                        const blockEl = customBlockRefs.current.get(selectedId);
                        if (!blockEl) return null;
                        const overlay = overlayRef.current;
                        if (!overlay) return null;
                        const o = overlay.getBoundingClientRect();
                        const r = blockEl.getBoundingClientRect();
                        return (
                          <div className="absolute flex items-center gap-px shadow-lg"
                            style={{ top: Math.max(((r.top - o.top) / scale) - 25, 0), left: (r.left - o.left) / scale, pointerEvents: "auto", zIndex: 20, borderRadius: "4px", overflow: "hidden" }}
                          >
                            <span className="text-[9px] font-bold px-2 py-1 text-white bg-blue-500">
                              {selectedBlock.type.toUpperCase()}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomBlock(selectedId); }}
                              className="px-1.5 py-1 text-white/80 hover:text-white hover:bg-black/20 transition-colors text-[10px] font-bold bg-blue-500">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {addedBlocks.length > 0 && (
                      <div className="px-4 py-2 border-t border-dashed border-white/10 bg-white/[0.02] relative z-20 pointer-events-auto">
                        <div className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-2 px-1">Custom Blocks</div>
                        {addedBlocks.map(block => renderCustomBlock(block))}
                      </div>
                    )}

                    {dragOver && (
                      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                        <div className="px-6 py-3 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-semibold backdrop-blur-sm">
                          Drop to add block
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            )}
          </div>
          {!editMode && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-[10px] font-medium text-zinc-400 flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              Viewing
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-l border-zinc-800 bg-zinc-900 flex flex-col shrink-0 overflow-hidden"
            >
              <div className="w-[280px] flex flex-col h-full">
                
                <div className="px-4 py-3 border-b border-sidebar-border">
                  <h3 className="text-xs font-semibold text-foreground">Properties</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {selectedElement || "Select an element to edit"}
                  </p>
                  {selectedId && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/60">
                      <button
                        onClick={() => selectedId.startsWith("b-") ? handleDeleteCustomBlock(selectedId) : deleteNode(selectedId)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                      <button
                        onClick={() => { setSelectedId(null); setSelectedElement(null); setSelectedBlockRect(null); }}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        Deselect
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">

                  {/* ── Element-specific editor ── */}
                  {selectedId && (highlightNode || selectedBlock) && (
                    <ElementEditor
                      node={highlightNode}
                      selectedBlock={selectedBlock}
                      customBlocks={addedBlocks}
                      onEditCustomBlock={editCustomBlock}
                      scheme={scheme}
                      setScheme={setScheme}
                    />
                  )}

                  {/* ── Global settings ── */}
                  <section>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Global Colors</h4>
                    <div className="space-y-2">
                      {([
                        { label: "Background", key: "bg" as const },
                        { label: "Surface", key: "surface" as const },
                        { label: "Accent", key: "accent" as const },
                        { label: "Text", key: "text" as const },
                      ]).map(({ label, key }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{label}</span>
                          <div className="flex items-center gap-2">
                            <input type="color" value={scheme[key]}
                              onChange={(e) => setScheme({ ...scheme, [key]: e.target.value })}
                              className="w-7 h-7 rounded-full cursor-pointer border border-zinc-700/50 bg-transparent p-0.5"
                            />
                            <span className="text-[10px] font-mono text-muted-foreground w-16">{scheme[key]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Presets</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.schemes.map((s) => (
                        <button key={s.name} onClick={() => setScheme(s)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium transition-all ${
                            scheme.name === s.name ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-zinc-700/50" style={{ background: s.accent }} />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Language</h4>
                    <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-0.5">
                      {(["en", "fr", "ar"] as const).map((lang) => (
                        <button key={lang} onClick={() => setLanguage(lang)}
                          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-full uppercase transition-all ${
                            language === lang ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                          }`}
                        >{lang}</button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Display</h4>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-muted-foreground">Dark Mode</span>
                      <div className="relative w-8 h-4" onClick={() => setDark(!dark)}>
                        <div className={`absolute inset-0 rounded-full transition-colors ${dark ? "bg-blue-600" : "bg-zinc-700"}`} />
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${dark ? "translate-x-4" : ""}`} />
                      </div>
                    </label>
                  </section>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Element Editor component ── */
function ElementEditor({ node, selectedBlock, customBlocks, onEditCustomBlock, scheme, setScheme }:
  { node: LayerNode | null; selectedBlock: CustomBlock | null; customBlocks: CustomBlock[]; onEditCustomBlock: (id: string, u: Partial<CustomBlock>) => void; scheme: ColorScheme; setScheme: (s: ColorScheme) => void; }) {

  const isCustom = !!selectedBlock;
  const block = selectedBlock;
  const el = node?.element ?? null;
  const type = isCustom ? (block?.type || "") : (node?.type || "");
  const label = isCustom ? (block?.label || "") : (node?.label || "");

  /* ── Local state for template DOM editing ── */
  const [localText, setLocalText] = useState("");
  const [localSrc, setLocalSrc] = useState("");
  const [localAlt, setLocalAlt] = useState("");
  const [localHref, setLocalHref] = useState("");
  useEffect(() => {
    if (el && !isCustom) {
      setLocalText((el as HTMLElement).textContent || "");
      setLocalSrc((el as HTMLImageElement).src || "");
      setLocalAlt((el as HTMLImageElement).alt || "");
      setLocalHref((el as HTMLAnchorElement).href || "");
    }
  }, [el, isCustom]);

  const updateDOMText = (val: string) => { if (el) { el.textContent = val; } setLocalText(val); };
  const updateDOMSrc = (val: string) => { if (el instanceof HTMLImageElement) el.src = val; setLocalSrc(val); };
  const updateDOMAlt = (val: string) => { if (el instanceof HTMLImageElement) el.alt = val; setLocalAlt(val); };
  const updateDOMHref = (val: string) => { if (el instanceof HTMLAnchorElement) el.href = val; setLocalHref(val); };

  const textTypes = ["Text", "Heading", "Button", "Item", "text", "heading", "button", "link"];
  const canEditText = textTypes.includes(type);

  return (
    <>
      {/* Edit text content */}
      {canEditText && (
        <section>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {isCustom ? "Content" : "Edit Text"}
          </h4>
          <input
            value={isCustom ? (block?.content || "") : localText}
            onChange={(e) => {
              if (isCustom && block) { onEditCustomBlock(block.id, { content: e.target.value }); }
              else { updateDOMText(e.target.value); }
            }}
            className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
            placeholder="Enter text..."
          />
        </section>
      )}

      {/* Image src/alt */}
      {type.toLowerCase() === "image" && (
        <>
          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Image URL</h4>
            <input value={isCustom ? (block?.src || "") : localSrc}
              onChange={(e) => {
                if (isCustom && block) { onEditCustomBlock(block.id, { src: e.target.value }); }
                else { updateDOMSrc(e.target.value); }
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
              placeholder="https://..." />
          </section>
          <section>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Alt Text</h4>
            <input value={isCustom ? (block?.alt || "") : localAlt}
              onChange={(e) => {
                if (isCustom && block) { onEditCustomBlock(block.id, { alt: e.target.value }); }
                else { updateDOMAlt(e.target.value); }
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
              placeholder="Describe the image" />
          </section>
        </>
      )}

      {/* Link href */}
      {type.toLowerCase() === "link" && (
        <section>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Link URL</h4>
          <input value={isCustom ? (block?.href || "") : localHref}
            onChange={(e) => {
              if (isCustom && block) { onEditCustomBlock(block.id, { href: e.target.value }); }
              else { updateDOMHref(e.target.value); }
            }}
            className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
            placeholder="https://..." />
        </section>
      )}

      {/* Input placeholder */}
      {type.toLowerCase() === "input" && isCustom && block && (
        <section>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Placeholder</h4>
          <input value={block.placeholder || ""}
            onChange={(e) => onEditCustomBlock(block.id, { placeholder: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
            placeholder="Placeholder text" />
        </section>
      )}

      {/* Video src */}
      {type.toLowerCase() === "video" && isCustom && block && (
        <section>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Video URL</h4>
          <input value={block.src || ""}
            onChange={(e) => onEditCustomBlock(block.id, { src: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
            placeholder="YouTube embed URL" />
        </section>
      )}

      {/* Element info */}
      <section className="pt-2 border-t border-border/40">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Element Info</h4>
        <div className="space-y-1 text-[10px] text-muted-foreground/70">
          <div className="flex justify-between"><span>Type</span><span className="font-mono text-zinc-400">{type}</span></div>
          {el && <div className="flex justify-between"><span>Tag</span><span className="font-mono text-zinc-400">{el.tagName.toLowerCase()}</span></div>}
          {isCustom && <div className="flex justify-between"><span>Origin</span><span className="font-mono text-zinc-400">Custom block</span></div>}
        </div>
      </section>
    </>
  );
}

/* ── Tree rendering component ── */
function LayerTreeItems({
  nodes, selectedId, expandedIds, hiddenIds,
  onSelect, onToggle, onDelete, getIcon,
}: {
  nodes: LayerNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  hiddenIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => any;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => {
        const Icon = getIcon(node.type);
        const hasChildren = node.children.length > 0;
        const expanded = expandedIds.has(node.id);
        const hidden = hiddenIds.has(node.id);

        return (
          <div key={node.id}>
            <div
              onClick={() => { if (!hidden) onSelect(node.id); }}
              className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                hidden ? "text-muted-foreground/30 line-through" :
                selectedId === node.id ? "bg-accent text-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              style={{ paddingLeft: `${12 + node.depth * 14}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                >
                  {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate flex-1">{node.label}</span>
              <span className="text-[9px] text-muted-foreground/60 shrink-0 mr-1">{node.type}</span>
              {!hidden && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
            {hasChildren && expanded && (
              <LayerTreeItems
                nodes={node.children}
                selectedId={selectedId}
                expandedIds={expandedIds}
                hiddenIds={hiddenIds}
                onSelect={onSelect}
                onToggle={onToggle}
                onDelete={onDelete}
                getIcon={getIcon}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
