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
  Heading, Video, Link as LinkIcon, FormInput, ExternalLink, Minus, Upload, Search,
  Columns2, List, Quote, Tag, AlertTriangle, Code, Map as MapIcon, CircleUser,
  FileText, TextCursorInput, CheckSquare, CircleDot, Gauge, Hash,
  CreditCard, GalleryHorizontal, LayoutPanelTop, ChevronDownSquare, ArrowUpFromDot
} from "lucide-react";
import type { ColorScheme, Language } from "../../templates/types";
import { useUpdateProject, useGetProject } from "@workspace/api-client-react";
import { BUTTON_ICONS, createIconSvg } from "@/lib/button-icons";
import { useAuth } from "@/lib/auth";
import { loadThemeConfig, saveLocalProject, forkTemplate, savePageHtml } from "@/lib/local-storage";

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
  { id: "columns", label: "Columns", icon: Columns2 },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "list", label: "List", icon: List },
  { id: "blockquote", label: "Quote", icon: Quote },
  { id: "badge", label: "Badge", icon: Tag },
  { id: "alert", label: "Alert", icon: AlertTriangle },
  { id: "code", label: "Code", icon: Code },
  { id: "icon-box", label: "Icon Box", icon: LayoutGrid },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "avatar", label: "Avatar", icon: CircleUser },
  { id: "form", label: "Form", icon: FileText },
  { id: "textarea", label: "Textarea", icon: TextCursorInput },
  { id: "select", label: "Select", icon: ChevronDown },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "radio", label: "Radio", icon: CircleDot },
  { id: "progress", label: "Progress", icon: Gauge },
  { id: "counter", label: "Counter", icon: Hash },
  { id: "tabs", label: "Tabs", icon: LayoutPanelTop },
  { id: "accordion", label: "Accordion", icon: ChevronDownSquare },
  { id: "carousel", label: "Carousel", icon: GalleryHorizontal },
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
  icon?: string;
  items?: string[];
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
  if (t === "blockquote") return "Blockquote";
  if (t === "form") return "Form";
  if (t === "pre" || t === "code") return "Code";
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

  const queryParams = new URLSearchParams(window.location.search);
  const projectId = queryParams.get("projectId") ? Number(queryParams.get("projectId")) : null;

  const { data: project } = useGetProject(projectId || 0, { query: { enabled: !!projectId } });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving">("idle");
  const [editMode, setEditMode] = useState(true);

  const template = TEMPLATES.find(
    (tmpl) => tmpl.id === parseInt(id || "") || tmpl.slug.toLowerCase() === id?.toLowerCase()
  );

  useEffect(() => { if (!template) setLocation("/templates"); }, [template, setLocation]);

  const { user } = useAuth();
  const [localConfig, setLocalConfig] = useState<Record<string, any> | null | undefined>(undefined);

  useEffect(() => {
    const p = project as any;
    if (!p || !p.name || !projectId || !user) return;
    const projectName = p.name;
    loadThemeConfig(projectName, projectId).then((data) => {
      if (data?.templateConfig) {
        /* Merge loaded edits with any in-progress edits so we don't lose
           work the user started before the async load completed */
        const loaded = (data.templateConfig.elementEdits as Record<string, any>) || {};
        elementEditsRef.current = { ...loaded, ...elementEditsRef.current };
        const loadedLive = (data.templateConfig.liveElementEdits as Record<string, any>) || {};
        liveElementEditsRef.current = { ...loadedLive, ...liveElementEditsRef.current };
        setLocalConfig(data.templateConfig);
      } else {
        /* Fork template on first open if no local config exists */
        const defaultConfig: Record<string, any> = {
          language: "en",
          scheme: template?.schemes?.[0] || defaultScheme(),
          dark: false,
          hiddenIds: [],
          addedBlocks: [],
          _templateId: template?.id || null,
        };
        forkTemplate({ projectName, projectId, templateConfig: defaultConfig }).then(() => {
          /* Fresh fork — reset refs so stale template edits don't leak through */
          elementEditsRef.current = {};
          liveElementEditsRef.current = {};
          setLocalConfig(defaultConfig);
        }).catch(() => { /* fork failed silently */ });
      }
    }).catch(() => {
      /* Load failed (e.g. server not ready) — keep defaults */
    });
  }, [project?.id, projectId, user]);

  const savedConfig = (localConfig !== undefined ? localConfig : project?.templateConfig) as Record<string, any> | undefined;

  const hasDraft = !!(
    savedConfig?.elementEdits &&
    Object.keys(savedConfig.elementEdits).length > 0 &&
    JSON.stringify(savedConfig.elementEdits) !== JSON.stringify(savedConfig.liveElementEdits)
  );

  /* Destructive-sync: only runs for non-edit state (language, scheme, etc).
     NEVER overwrite elementEdits/liveElementEdits refs here — they are set
     by user actions and the load handler, and overwriting them would lose
     in-progress edits when the async load completes after the user started typing. */
  useEffect(() => {
    if (!savedConfig) return;
    setLanguage(savedConfig.language || "en");
    setScheme(savedConfig.scheme || template?.schemes[0] || defaultScheme());
    setDark(savedConfig.dark ?? false);
    setHiddenIds(new Set(savedConfig.hiddenIds || []));
    setAddedBlocks(savedConfig.addedBlocks || []);
  }, [savedConfig]);

  /* ── Apply edits to the DOM ── */
  /* In Edit mode we apply saved drafts (elementEdits) so the user sees
     their in-progress work.  In View mode we apply only published edits
     (liveElementEdits). */
  useEffect(() => {
    if (!editCanvasRef.current) return;
    const edits = (editMode
      ? savedConfig?.elementEdits
      : savedConfig?.liveElementEdits) as Record<string, any> | undefined;
    if (!edits) return;
    const paths = Object.keys(edits);
    if (paths.length === 0) return;
    const timer = setTimeout(() => {
      for (const path of paths) {
        try {
          const el = editCanvasRef.current!.querySelector(path) as HTMLElement;
          if (!el) continue;
          const data = edits[path];
          const iconName = data.icon || el.getAttribute("data-icon") || "";
          for (const key of Object.keys(data)) {
            const val = data[key];
            if (key.startsWith("style.")) {
              (el.style as any)[key.slice(6)] = val;
            } else if (key.startsWith("attr.")) {
              if (val) el.setAttribute(key.slice(5), val);
              else el.removeAttribute(key.slice(5));
            } else if (key === "text") {
              el.textContent = val;
            }
          }
          /* Re-inject icon SVG if icon edit exists */
          if (iconName && BUTTON_ICONS[iconName]) {
            el.setAttribute("data-icon", iconName);
            el.removeAttribute("data-custom-icon");
            el.querySelectorAll(".btn-icon").forEach(s => s.remove());
            const svg = createIconSvg(iconName, !!el.textContent);
            if (svg) el.insertBefore(svg, el.firstChild);
          } else if (iconName === "custom" && data.customSvg) {
            el.setAttribute("data-custom-icon", data.customSvg);
            el.removeAttribute("data-icon");
            el.querySelectorAll(".btn-icon").forEach(s => s.remove());
            const text = el.textContent || "";
            el.innerHTML = data.customSvg;
            const uploaded = el.querySelector("svg");
            if (uploaded) {
              uploaded.classList.add("btn-icon");
              uploaded.style.verticalAlign = "middle";
              if (text) uploaded.style.marginRight = "6px";
              uploaded.style.display = "inline-block";
            }
            if (text) el.appendChild(document.createTextNode(text));
          } else if (data.icon === "") {
            el.removeAttribute("data-icon");
            el.querySelectorAll(".btn-icon").forEach(s => s.remove());
          }
        } catch {}
      }
      refreshTree();
    }, 300);
    return () => clearTimeout(timer);
  }, [savedConfig?.elementEdits, savedConfig?.liveElementEdits, editMode]);

  /* ── Save rendered page HTML to Database folder after config changes ── */
  useEffect(() => {
    if (!savedConfig || !editCanvasRef.current) return;
    const p = project as any;
    if (!p?.name || !projectId) return;
    const html = editCanvasRef.current.innerHTML;
    if (!html) return;
    savePageHtml(p.name, projectId, html).catch(() => {});
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
  const [rightTab, setRightTab] = useState<"content" | "style" | "advanced">("content");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

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
  const layerTreeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [addedBlocks, setAddedBlocks] = useState<CustomBlock[]>(
    savedConfig?.addedBlocks || []
  );
  const [dragOver, setDragOver] = useState(false);
  const dragType = useRef<string | null>(null);
  const [selectedBlockRect, setSelectedBlockRect] = useState<Rect | null>(null);
  const customBlockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [, forceRender] = useState(0);

  /* ── Dirty tracking for DOM edits ── */
  const [dirty, setDirty] = useState(false);
  const elementEditsRef = useRef<Record<string, any>>(
    (savedConfig?.elementEdits as Record<string, any>) || {}
  );
  const liveElementEditsRef = useRef<Record<string, any>>(
    (savedConfig?.liveElementEdits as Record<string, any>) || {}
  );

  function buildElementPath(el: HTMLElement): string {
    const parts: string[] = [];
    let current: HTMLElement | null = el;
    const root = editCanvasRef.current;
    while (current && current !== root && current.parentElement) {
      const parent: HTMLElement = current.parentElement!;
      const idx = Array.from(parent.children).indexOf(current as HTMLElement) + 1;
      parts.unshift(`${current.tagName.toLowerCase()}:nth-child(${idx})`);
      current = parent;
    }
    return parts.join(" > ");
  }

  function markDirty(type: string, el?: HTMLElement | null, key?: string, value?: string) {
    if (el) {
      const path = buildElementPath(el);
      if (!elementEditsRef.current[path]) elementEditsRef.current[path] = {};
      if (type === "text" && key === undefined) {
        elementEditsRef.current[path]["text"] = el.textContent || "";
      } else if (type === "icon") {
        elementEditsRef.current[path]["icon"] = key ?? "";
        if (key === "custom" && value) elementEditsRef.current[path]["customSvg"] = value;
      } else if (key !== undefined) {
        elementEditsRef.current[path][`${type}.${key}`] = value ?? "";
      }
    }
    setDirty(true);
  }

  const isDirty = dirty;

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
      case "columns": return { ...base, label: "Columns", items: ["Column 1", "Column 2"] };
      case "card": return { ...base, label: "Card", content: "Card content goes here" };
      case "list": return { ...base, label: "List", items: ["Item 1", "Item 2", "Item 3"] };
      case "blockquote": return { ...base, label: "Quote", content: "This is an inspiring quote that makes you think." };
      case "badge": return { ...base, label: "Badge", content: "New" };
      case "alert": return { ...base, label: "Alert", content: "This is an alert message." };
      case "code": return { ...base, label: "Code", content: "console.log('hello world');" };
      case "icon-box": return { ...base, label: "Icon Box", content: "Feature description", icon: "Zap" };
      case "map": return { ...base, label: "Map", src: "https://www.openstreetmap.org/export/embed.html?bbox=-0.0040%2C51.4769%2C0.0055%2C51.4786&layer=mapnik" };
      case "avatar": return { ...base, label: "Avatar", src: "https://picsum.photos/seed/avatar/150/150", alt: "Avatar" };
      case "form": return { ...base, label: "Form" };
      case "textarea": return { ...base, label: "Textarea", placeholder: "Enter your message..." };
      case "select": return { ...base, label: "Select", items: ["Option 1", "Option 2", "Option 3"] };
      case "checkbox": return { ...base, label: "Checkbox", content: "Check me" };
      case "radio": return { ...base, label: "Radio", items: ["Choice 1", "Choice 2"] };
      case "progress": return { ...base, label: "Progress", content: "75" };
      case "counter": return { ...base, label: "Counter", content: "1234" };
      case "tabs": return { ...base, label: "Tabs", items: ["Tab 1", "Tab 2", "Tab 3"] };
      case "accordion": return { ...base, label: "Accordion", items: ["Section 1", "Section 2", "Section 3"] };
      case "carousel": return { ...base, label: "Carousel", items: ["Slide 1", "Slide 2", "Slide 3"] };
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
  const TextIcon = (p: any) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="14" y2="18"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="4" y1="10" x2="6" y2="10"/><line x1="4" y1="14" x2="8" y2="14"/></svg>;
  const HeadingIcon = (p: any) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 4 4 20 9 20"/><polyline points="20 4 20 20 15 20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>;
  const VideoIcon = (p: any) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none"/><polygon points="10 8 16 12 10 16" fill="none" stroke="currentColor"/></svg>;
  const ImageIcon = (p: any) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  function getIcon(type: string) {
    if (type === "Text") return TextIcon;
    if (type === "Heading") return HeadingIcon;
    if (type === "Image") return ImageIcon;
    if (type === "Video") return VideoIcon;
    if (type === "Button") return Square;
    if (type === "Link") return LinkIcon;
    if (["Nav", "Header", "Footer", "Section", "Container", "Block", "Card"].includes(type)) return Layers;
    if (type === "List" || type === "Item") return LayoutGrid;
    if (type === "Input" || type === "Form" || type === "Select" || type === "Textarea" || type === "Checkbox" || type === "Radio") return FormInput;
    if (type === "Columns") return Columns2;
    if (type === "Divider") return Minus;
    if (type === "Blockquote" || type === "Quote") return Quote;
    if (type === "Badge") return Tag;
    if (type === "Alert") return AlertTriangle;
    if (type === "Code") return Code;
    if (type === "Map") return MapIcon;
    if (type === "Avatar") return CircleUser;
    if (type === "IconBox" || type === "Icon-box" || type === "icon-box") return LayoutGrid;
    if (type === "Progress") return Gauge;
    if (type === "Counter") return Hash;
    if (type === "Tabs") return LayoutPanelTop;
    if (type === "Accordion") return ChevronDownSquare;
    if (type === "Carousel") return GalleryHorizontal;
    return Layers;
  }

  function typeColor(type: string): { ring: string; bg: string; label: string } {
    const t = type.toLowerCase();
    if (["section", "header", "footer", "nav", "card", "columns"].includes(t)) return { ring: "#f59e0b", bg: "rgba(245,158,11,0.08)", label: "bg-amber-500" };
    if (["container", "block", "div", "accordion", "tabs", "carousel"].includes(t)) return { ring: "#10b981", bg: "rgba(16,185,129,0.08)", label: "bg-emerald-500" };
    if (["text", "heading", "p", "blockquote", "quote", "code", "list", "badge", "alert"].includes(t)) return { ring: "#3b82f6", bg: "rgba(59,130,246,0.08)", label: "bg-blue-500" };
    if (["image", "img", "video", "avatar", "icon-box", "iconbox", "map", "carousel"].includes(t)) return { ring: "#8b5cf6", bg: "rgba(139,92,246,0.08)", label: "bg-violet-500" };
    if (["button", "a", "link", "counter", "progress"].includes(t)) return { ring: "#ec4899", bg: "rgba(236,72,153,0.08)", label: "bg-pink-500" };
    if (["input", "select", "textarea", "form", "checkbox", "radio"].includes(t)) return { ring: "#06b6d4", bg: "rgba(6,182,212,0.08)", label: "bg-cyan-500" };
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
      case "columns":
        return wrap(
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(block.items || ["Col 1", "Col 2"]).map((item, i) => (
              <div key={i} style={{ padding: 16, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{item}</div>
            ))}
          </div>
        );
      case "card":
        return wrap(
          <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
            <div style={{ height: 100, background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))" }} />
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{block.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{block.content}</div>
            </div>
          </div>
        );
      case "list":
        return wrap(
          <ul style={{ margin: 0, paddingLeft: 20, color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.8 }}>
            {(block.items || ["Item 1", "Item 2", "Item 3"]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case "blockquote":
        return wrap(
          <blockquote style={{ margin: 0, padding: "12px 16px 12px 20px", borderLeft: "3px solid #3b82f6", background: "rgba(59,130,246,0.06)", borderRadius: "0 8px 8px 0" }}>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)", fontStyle: "italic", lineHeight: 1.6 }}>"{block.content}"</p>
          </blockquote>
        );
      case "badge":
        return wrap(
          <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: "#3b82f6", color: "#fff" }}>{block.content || "Badge"}</span>
        );
      case "alert":
        return wrap(
          <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 8, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", fontSize: 13, lineHeight: 1.5 }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <span>{block.content}</span>
          </div>
        );
      case "code":
        return wrap(
          <pre style={{ margin: 0, padding: 14, borderRadius: 8, background: "#1e1e2e", color: "#cdd6f4", fontSize: 12, fontFamily: "'Fira Code','Cascadia Code',monospace", overflowX: "auto", lineHeight: 1.6, border: "1px solid rgba(255,255,255,0.06)" }}>
            <code>{block.content}</code>
          </pre>
        );
      case "icon-box":
        return wrap(
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 4 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{block.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{block.content}</div>
            </div>
          </div>
        );
      case "map":
        return wrap(
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 8, overflow: "hidden" }}>
            <iframe src={block.src} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} loading="lazy" />
          </div>
        );
      case "avatar":
        return wrap(
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={block.src} alt={block.alt || ""} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{block.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{block.content || "User"}</div>
            </div>
          </div>
        );
      case "form":
        return wrap(
          <div style={{ padding: 16, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Form</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ height: 72, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ height: 36, borderRadius: 8, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600 }}>Submit</div>
            </div>
          </div>
        );
      case "textarea":
        return wrap(<textarea readOnly placeholder={block.placeholder || "Enter text..."} rows={4}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />);
      case "select":
        return wrap(
          <div style={{ position: "relative" }}>
            <select defaultValue="" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", appearance: "none", cursor: "pointer", boxSizing: "border-box", pointerEvents: "none" }}>
              {(block.items || ["Option 1", "Option 2"]).map((opt, i) => (
                <option key={i} value={opt} style={{ background: "#1e1e2e", color: "#fff" }}>{opt}</option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.4)" }}>▼</div>
          </div>
        );
      case "checkbox":
        return wrap(
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
            <input type="checkbox" readOnly style={{ width: 16, height: 16, accentColor: "#3b82f6", cursor: "pointer" }} />
            {block.content || "Checkbox label"}
          </label>
        );
      case "radio":
        return wrap(
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(block.items || ["Choice 1", "Choice 2"]).map((item, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                <input type="radio" name={block.id} readOnly style={{ width: 16, height: 16, accentColor: "#3b82f6", cursor: "pointer" }} />
                {item}
              </label>
            ))}
          </div>
        );
      case "progress":
        return wrap(
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              <span>{block.label}</span>
              <span>{block.content || "75"}%</span>
            </div>
            <div style={{ width: "100%", height: 8, borderRadius: 9999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${block.content || "75"}%`, height: "100%", borderRadius: 9999, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", transition: "width 0.3s" }} />
            </div>
          </div>
        );
      case "counter":
        return wrap(
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{block.content || "1234"}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{block.label}</div>
          </div>
        );
      case "tabs":
        return wrap(
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              {(block.items || ["Tab 1", "Tab 2"]).map((tab, i) => (
                <button key={i} style={{ flex: 1, padding: "8px 12px", border: "none", background: i === 0 ? "rgba(59,130,246,0.12)" : "transparent", color: i === 0 ? "#60a5fa" : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderBottom: i === 0 ? "2px solid #3b82f6" : "2px solid transparent" }}>{tab}</button>
              ))}
            </div>
            <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>Content for {(block.items || ["Tab 1"])[0]}</div>
          </div>
        );
      case "accordion":
        return wrap(
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            {(block.items || ["Section 1", "Section 2"]).map((section, i) => (
              <div key={i} style={{ borderBottom: i < (block.items || ["Section 1", "Section 2"]).length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                  {section}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.3)", transform: i === 0 ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {i === 0 && <div style={{ padding: "4px 14px 12px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Content for {section}</div>}
              </div>
            ))}
          </div>
        );
      case "carousel":
        return wrap(
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
            <div style={{ height: 160, background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>
              {(block.items || ["Slide 1"])[0]}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px 0", background: "rgba(0,0,0,0.15)" }}>
              {(block.items || ["Slide 1", "Slide 2", "Slide 3"]).map((_, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#3b82f6" : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>
        );
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

  function findAllNodesAt(nodes: LayerNode[], clientX: number, clientY: number): LayerNode[] {
    const result: LayerNode[] = [];
    for (const n of nodes) {
      const r = n.element.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        result.push(...findAllNodesAt(n.children, clientX, clientY));
        result.push(n);
      }
    }
    return result;
  }

  const handleOverlayMove = (e: React.MouseEvent) => {
    const all = findAllNodesAt(tree, e.clientX, e.clientY);
    setHoveredId(all.length > 0 ? all[0].id : null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const all = findAllNodesAt(tree, e.clientX, e.clientY);
    if (all.length === 0) {
      setSelectedId(null);
      setSelectedElement(null);
      setSelectedBlockRect(null);
      return;
    }
    /* Figma-style drill-down: all = [deepest…shallowest].
       First click → shallowest (outermost). Each next click → one level deeper. */
    const idx = all.findIndex(n => n.id === selectedId);
    let nextIdx: number;
    if (idx < 0) {
      nextIdx = all.length - 1;          // not in stack → outermost
    } else if (idx > 0) {
      nextIdx = idx - 1;                 // drill one level deeper
    } else {
      nextIdx = all.length - 1;          // already deepest → cycle back to outermost
    }
    const next = all[nextIdx];
    setSelectedId(next.id);
    setSelectedElement(next.type);
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

  /* ── Sync selection: expand parents + scroll into view ── */
  useEffect(() => {
    if (!selectedId) return;
    if (!selectedId.startsWith("b-")) {
      const path: string[] = [];
      let node = findNodeById(tree, selectedId);
      if (!node) return;
      while (node) {
        path.unshift(node.id);
        node = node.parentId ? findNodeById(tree, node.parentId) || null : null;
      }
      if (path.length > 0) {
        setExpandedIds(prev => {
          const next = new Set(prev);
          path.slice(0, -1).forEach(id => next.add(id));
          return next;
        });
      }
    }
    requestAnimationFrame(() => {
      if (!layerTreeRef.current) return;
      const el = layerTreeRef.current.querySelector(`[data-node-id="${selectedId}"]`);
      if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    if (selectedId.startsWith("b-") && scrollRef.current) {
      const blockEl = customBlockRefs.current.get(selectedId);
      if (blockEl) blockEl.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [selectedId, tree]);

  /* ── Computed highlight ── */
  const highlightId = selectedId ?? hoveredId;
  const highlightNode = highlightId ? findNodeById(tree, highlightId) : null;
  const isSelected = selectedId !== null;
  const selectedBlock = selectedId?.startsWith("b-") ? addedBlocks.find(b => b.id === selectedId) ?? null : null;

  if (!template) return null;
  const ActiveComponent = template.component;
  const deviceWidth = deviceMode === "desktop" ? "100%" : "352px";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-900 text-zinc-100 font-sans select-none">
      
      {/* ── TOP TOOLBAR ── */}
      <header className="h-12 flex items-center justify-between px-3 bg-zinc-900 shrink-0 z-50 gap-2">
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
              if (!editMode) {
                liveElementEditsRef.current = JSON.parse(JSON.stringify(elementEditsRef.current));
              }
              const tc = {
                language,
                scheme,
                dark,
                hiddenIds: Array.from(hiddenIds),
                addedBlocks,
                elementEdits: elementEditsRef.current,
                liveElementEdits: liveElementEditsRef.current,
                _templateId: template?.id || null,
              };
              const p = project as any;
              saveLocalProject({
                projectName: p.name,
                projectId,
                templateConfig: tc,
              }).then(() => {
                setLocalConfig(tc);
                setSaveStatus("idle");
                setDirty(false);
              }).catch((e) => {
                console.error("Save failed:", e);
                setSaveStatus("idle");
              });
            }}
            disabled={!projectId || saveStatus === "saving" || (editMode ? !isDirty : !hasDraft)}
            className={`px-3 h-8 flex items-center gap-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
              editMode
                ? isDirty
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-zinc-700 text-zinc-400"
                : hasDraft
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-zinc-700 text-zinc-400"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveStatus === "saving" ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> <span className="hidden sm:inline">Saving...</span></>
            ) : editMode ? (
              <><Save className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Save</span></>
            ) : (
              <><Upload className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Push Update</span></>
            )}
          </button>
        </div>
      </header>

        {/* ── MAIN AREA ── */}
      <div className={`flex-1 flex ${deviceMode !== "desktop" ? "justify-center" : ""} overflow-hidden`}>

        {/* ── LEFT PANEL ── */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: deviceMode !== "desktop" ? "auto" : 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`bg-zinc-900 flex flex-col shrink-0 overflow-hidden ${deviceMode !== "desktop" ? "flex-1" : ""}`}
            >
              <div className={`${deviceMode !== "desktop" ? "w-full" : "w-[260px]"} flex flex-col h-full`}>

                {/* ── Header ── */}
                <div className="px-3 pt-3 pb-3 space-y-3">
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="w-1 h-4 rounded-full bg-emerald-500 shrink-0" />
                    <h3 className="text-xs font-semibold text-zinc-100">
                      {leftTab === "pages" ? "Pages" : leftTab === "elements" ? "Add Blocks" : "Layers"}
                    </h3>
                  </div>
                  {/* ── Pill tabs ── */}
                  <div className="flex gap-1 bg-zinc-800/60 rounded-2xl p-1">
                    {[
                      { id: "pages", label: "Pages", icon: Layers },
                      { id: "elements", label: "Add", icon: Plus },
                      { id: "layers", label: "Layers", icon: GripVertical },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => { setLeftTab(tab.id as any); if (tab.id === "layers") refreshTree(); }}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-xl transition-all ${
                          leftTab === tab.id
                            ? "bg-zinc-700 text-zinc-100 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <tab.icon className="w-3 h-3" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Pages ─── */}
                {leftTab === "pages" && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-1">
                      {pages.map((page) => (
                        <button key={page.id} onClick={() => setActivePage(page.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                            activePage === page.id
                              ? "bg-zinc-700/60 text-zinc-100 shadow-sm"
                              : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            activePage === page.id
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-zinc-800/80 text-zinc-500"
                          }`}>
                            <page.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-xs font-semibold">{page.label}</div>
                            <div className="text-[10px] text-zinc-500 mt-px">/{page.id}</div>
                          </div>
                          {activePage === page.id && (
                            <span className="w-1 h-5 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 border border-dashed border-zinc-700/40 hover:border-zinc-600/50 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      Add Page
                    </button>
                  </div>
                )}

                {/* ─── Add Elements ─── */}
                {leftTab === "elements" && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {(() => {
                      const categories: { id: string; label: string; ids: string[]; desc: string }[] = [
                        { id: "layout", label: "Layout", ids: ["section", "container", "divider", "columns", "card"], desc: "Structure & spacing" },
                        { id: "content", label: "Content", ids: ["text", "heading", "button", "link", "list", "blockquote", "badge", "alert", "code"], desc: "Text & interaction" },
                        { id: "media", label: "Media", ids: ["image", "video", "icon-box", "map", "avatar"], desc: "Visual assets" },
                        { id: "form", label: "Form", ids: ["input", "form", "textarea", "select", "checkbox", "radio"], desc: "User input" },
                        { id: "dynamic", label: "Dynamic", ids: ["progress", "counter", "tabs", "accordion", "carousel"], desc: "Motion & layout" },
                      ];
                      return (
                        <>
                          {editMode ? (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/40 ring-1 ring-zinc-800/60 text-xs text-zinc-400">
                              <Search className="w-3.5 h-3.5 shrink-0" />
                              <input
                                placeholder="Find element..."
                                readOnly
                                className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder:text-zinc-500 w-full"
                              />
                            </div>
                          ) : (
                            <div className="px-3 py-3 text-[11px] text-zinc-500 text-center italic leading-relaxed rounded-xl bg-zinc-800/30 ring-1 ring-zinc-800/60">
                              Switch to <span className="text-amber-400/80 font-medium not-italic">Edit</span> to add blocks
                            </div>
                          )}
                          {categories.map((cat) => (
                            <div key={cat.id} className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                              <div className="flex items-center justify-between px-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{cat.label}</span>
                                  <span className="text-[9px] text-zinc-600 font-mono">{cat.desc}</span>
                                </div>
                                <span className="text-[9px] text-zinc-600">{cat.ids.length}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {cat.ids.map((cid) => {
                                  const el = elementTypes.find(e => e.id === cid);
                                  if (!el) return null;
                                  const IconComp = el.icon;
                                  return (
                                    <div key={el.id}
                                      draggable={editMode}
                                      onDragStart={editMode ? handleDragStart(el.id, el.label) : undefined}
                                    >
                                      <button disabled={!editMode}
                                        onClick={() => editMode && addBlock(el.id, el.label)}
                                        className={`w-full flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                                          editMode
                                            ? "text-zinc-300 hover:bg-zinc-700/50 hover:ring-1 hover:ring-zinc-600/40 cursor-grab active:cursor-grabbing bg-zinc-800/40"
                                            : "text-zinc-600 cursor-not-allowed bg-zinc-800/20"
                                        }`}
                                      >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                                          editMode
                                            ? "bg-zinc-700/60 text-zinc-400"
                                            : "bg-zinc-800/50 text-zinc-600"
                                        }`}>
                                          <IconComp className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-medium leading-tight">{el.label}</span>
                                        {editMode && (
                                          <span className="text-[7px] text-zinc-600 uppercase tracking-widest">drag</span>
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          {addedBlocks.length > 0 && (
                            <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2">
                              <div className="flex items-center gap-2 px-0.5">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Added</span>
                                <span className="text-[9px] text-zinc-600 font-mono">{addedBlocks.length} block{addedBlocks.length !== 1 ? "s" : ""}</span>
                              </div>
                              <div className="space-y-0.5">
                                {addedBlocks.map(block => (
                                  <div key={block.id}
                                    onClick={() => { setSelectedId(block.id); setSelectedElement(block.label); }}
                                    className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                                      selectedId === block.id
                                        ? "bg-zinc-700/50 text-zinc-200"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                                    }`}>
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: typeColor(block.type).ring }} />
                                    <span className="truncate flex-1">{block.label}</span>
                                    <span className="text-[9px] text-zinc-600 font-mono mr-0.5">{block.type}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setAddedBlocks(prev => prev.filter(b => b.id !== block.id)); }}
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* ─── Layers (element tree) ─── */}
                  {leftTab === "layers" && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={layerTreeRef}>
                    <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60">
                      <div className="flex items-center justify-between mb-2 px-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Structure</span>
                          <span className="text-[9px] text-zinc-600 font-mono">{tree.length}</span>
                        </div>
                        <button onClick={refreshTree}
                          className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-all"
                          title="Refresh tree">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                          </svg>
                        </button>
                      </div>
                      {tree.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-6 text-xs text-zinc-500">
                          <Layers className="w-5 h-5 text-zinc-600" />
                          <span>No elements yet</span>
                        </div>
                      ) : (
                        <LayerTreeItems
                          nodes={tree}
                          selectedId={selectedId}
                          expandedIds={expandedIds}
                          hiddenIds={hiddenIds}
                          onSelect={(id) => { setSelectedId(id); const n = findNodeById(tree, id); setSelectedElement(n?.type || "Element"); }}
                          onToggle={toggleExpand}
                          onDelete={deleteNode}
                          getIcon={getIcon}
                          typeColor={typeColor}
                        />
                      )}
                    </div>
                    {addedBlocks.length > 0 && (
                      <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2">
                        <div className="flex items-center gap-2 px-0.5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Custom</span>
                          <span className="text-[9px] text-zinc-600 font-mono">{addedBlocks.length}</span>
                        </div>
                        <div className="space-y-0.5">
                          {addedBlocks.map(block => (
                            <div key={block.id} data-node-id={block.id}
                              onClick={() => { setSelectedId(block.id); setSelectedElement(block.label); }}
                              className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                                selectedId === block.id
                                  ? "bg-zinc-700/50 text-zinc-200"
                                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: typeColor(block.type).ring }} />
                              <span className="truncate flex-1">{block.label}</span>
                              <span className="text-[9px] text-zinc-600 font-mono mr-0.5">{block.type}</span>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomBlock(block.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── CANVAS ── */}
        <div className={`${deviceMode !== "desktop" ? "w-[375px]" : "flex-1"} flex flex-col bg-zinc-900 overflow-hidden relative mx-0 rounded-2xl`}>
          <div ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-zinc-900 viewport-scrollbar"
          >
            <div className="min-h-full flex flex-col" ref={editMode ? wrapperRef : undefined}
              onDragOver={editMode ? handleDragOver : undefined}
              onDragLeave={editMode ? handleDragLeave : undefined}
              onDrop={editMode ? handleDrop : undefined}
            >
                <div
                  style={{
                    width: deviceMode === "desktop" ? "100%" : "375px",
                    margin: "0 auto",
                    position: "relative",
                    background: dragOver ? "rgba(59,130,246,0.05)" : undefined,
                  }}
                  className={`h-full ${
                    deviceMode !== "desktop"
                      ? "bg-white rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-zinc-700/50"
                      : "overflow-hidden"
                  }`}
                >
                  {deviceMode !== "desktop" && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                      <Smartphone className="w-3 h-3" />
                      Phone Preview
                    </div>
                  )}
                  <div ref={editCanvasRef} className="pointer-events-none">
                  <ActiveComponent language={language} scheme={scheme} dark={dark} />
                </div>

                {editMode && (
                  <>
                    {/* Overlay for mouse event capture (covers template area) */}
                    <div ref={overlayRef}
                      className="absolute inset-0 z-[100] cursor-crosshair"
                      onMouseMove={handleOverlayMove}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={handleOverlayClick}
                    />

                    {/* ── Selection UI (rendered outside overlay to avoid template z-index clipping) ── */}
                    <div className="absolute inset-0 z-[110] pointer-events-none">
                      {/* Hover badge */}
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

                      {/* Template element highlight ring */}
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

                      {/* Floating action bar for template elements */}
                      {selectedId && highlightNode && !selectedId.startsWith("b-") && (() => {
                        const r = getLiveRect(highlightNode.element);
                        if (!r) return null;
                        return (
                          <div className="absolute flex items-center gap-px shadow-lg"
                            style={{ top: Math.max(r.top - 25, 0), left: r.left, pointerEvents: "auto", borderRadius: "4px", overflow: "hidden" }}
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

                      {/* Floating action bar for custom blocks */}
                      {selectedId?.startsWith("b-") && selectedBlock && (() => {
                        const blockEl = customBlockRefs.current.get(selectedId);
                        if (!blockEl) return null;
                        const overlay = overlayRef.current;
                        if (!overlay) return null;
                        const o = overlay.getBoundingClientRect();
                        const r = blockEl.getBoundingClientRect();
                        return (
                          <div className="absolute flex items-center gap-px shadow-lg"
                            style={{ top: Math.max(((r.top - o.top) / scale) - 25, 0), left: (r.left - o.left) / scale, pointerEvents: "auto", borderRadius: "4px", overflow: "hidden" }}
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
                      <div className="px-4 py-2 border-t border-dashed border-white/10 bg-white/[0.02] relative z-[105] pointer-events-auto">
                        <div className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-2 px-1">Custom Blocks</div>
                        {addedBlocks.map(block => renderCustomBlock(block))}
                      </div>
                    )}

                    {dragOver && (
                      <div className="absolute inset-0 z-[120] pointer-events-none flex items-center justify-center">
                        <div className="px-6 py-3 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-semibold backdrop-blur-sm">
                          Drop to add block
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
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
              animate={{ width: deviceMode !== "desktop" ? "auto" : 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`bg-zinc-900 flex flex-col shrink-0 overflow-hidden ${deviceMode !== "desktop" ? "flex-1" : ""}`}
            >
              <div className={`${deviceMode !== "desktop" ? "w-full" : "w-[280px]"} flex flex-col h-full`}>

                {/* ── Header ── */}
                <div className="px-4 pt-4 pb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
                      <h3 className="text-xs font-semibold text-zinc-100">
                        {selectedId ? (selectedElement || "Element") : "Properties"}
                      </h3>
                    </div>
                    {selectedId && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => selectedId.startsWith("b-") ? handleDeleteCustomBlock(selectedId) : deleteNode(selectedId)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setSelectedId(null); setSelectedElement(null); setSelectedBlockRect(null); }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                          title="Deselect">
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedId ? (
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 font-semibold text-zinc-400">
                        {highlightNode ? highlightNode.type : selectedBlock?.type || "ELEMENT"}
                      </span>
                      {highlightNode && <span className="font-mono">{highlightNode.element.tagName.toLowerCase()}</span>}
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500">Select an element to edit</p>
                  )}
                  {/* ── Tab bar ── */}
                  {selectedId && (
                    <div className="flex gap-1 bg-zinc-800/60 rounded-2xl p-1">
                      {(["content", "style", "advanced"] as const).map((tab) => (
                        <button key={tab} onClick={() => setRightTab(tab)}
                          className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-xl transition-all ${
                            rightTab === tab
                              ? "bg-zinc-700 text-zinc-100 shadow-sm"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >{tab}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">

                  {/* ── Nothing selected ── */}
                  {!selectedId && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 flex items-center justify-center mb-4 ring-1 ring-zinc-700/50">
                        <Settings className="w-5 h-5 text-zinc-600" />
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[180px]">Select an element on the canvas to edit its properties</p>
                    </div>
                  )}

                  {/* ── CONTENT TAB ── */}
                  {selectedId && rightTab === "content" && (
                    <ElementContentEditor
                      node={highlightNode}
                      selectedBlock={selectedBlock}
                      customBlocks={addedBlocks}
                      onEditCustomBlock={editCustomBlock}
                      markDirty={markDirty}
                    />
                  )}

                  {/* ── STYLE TAB ── */}
                  {selectedId && rightTab === "style" && (
                    <ElementStyleEditor
                      node={highlightNode}
                      customElement={selectedBlock && customBlockRefs.current.get(selectedBlock.id) || null}
                      selectedBlock={selectedBlock}
                      isCustom={!!selectedBlock}
                      markDirty={markDirty}
                    />
                  )}

                  {/* ── ADVANCED TAB ── */}
                  {selectedId && rightTab === "advanced" && (
                    <ElementAdvancedEditor
                      node={highlightNode}
                      customElement={selectedBlock && customBlockRefs.current.get(selectedBlock.id) || null}
                      selectedBlock={selectedBlock}
                      isCustom={!!selectedBlock}
                      markDirty={markDirty}
                    />
                  )}

                  {/* ── Divider ── */}
                  <div className="relative py-1">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-800" />
                    <div className="relative flex justify-center">
                      <span className="px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900">Global</span>
                    </div>
                  </div>

                  {/* ── Global Colors ── */}
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
                            className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0.5"
                          />
                          <span className="text-[9px] font-mono text-zinc-500 w-14 text-right">{scheme[key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Presets ── */}
                  <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                    <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Presets</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {template.schemes.map((s) => (
                        <button key={s.name} onClick={() => setScheme(s)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            scheme.name === s.name ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
                          }`}
                        >
                          <span className="w-3 h-3 rounded-md ring-1 ring-zinc-700/50" style={{ background: s.accent }} />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Language ── */}
                  <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5">
                    <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Language</h4>
                    <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-0.5">
                      {(["en", "fr", "ar"] as const).map((lang) => (
                        <button key={lang} onClick={() => setLanguage(lang)}
                          className={`flex-1 px-3 py-1.5 text-[10px] font-bold rounded-md uppercase transition-all ${
                            language === lang ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >{lang}</button>
                      ))}
                    </div>
                  </div>

                  {/* ── Display ── */}
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

                  {/* bottom spacer */}
                  <div className="h-2" />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Sub-components for right-panel tabs
   ══════════════════════════════════════════════════════════════ */

/* ── Content Tab ── */
function ElementContentEditor({ node, selectedBlock, customBlocks, onEditCustomBlock, markDirty }:
  { node: LayerNode | null; selectedBlock: CustomBlock | null; customBlocks: CustomBlock[]; onEditCustomBlock: (id: string, u: Partial<CustomBlock>) => void; markDirty: (type: string, el?: HTMLElement | null, key?: string, value?: string) => void; }) {

  const isCustom = !!selectedBlock;
  const block = selectedBlock;
  const el = node?.element ?? null;
  const type = isCustom ? (block?.type || "") : (node?.type || "");

  const [localText, setLocalText] = useState("");
  const [localSrc, setLocalSrc] = useState("");
  const [localAlt, setLocalAlt] = useState("");
  const [localHref, setLocalHref] = useState("");
  const [localIcon, setLocalIcon] = useState("");
  const [customIconSvg, setCustomIconSvg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (el && !isCustom) {
      setLocalText((el as HTMLElement).textContent || "");
      setLocalSrc((el as HTMLImageElement).src || "");
      setLocalAlt((el as HTMLImageElement).alt || "");
      setLocalHref((el as HTMLAnchorElement).href || "");
      setLocalIcon(el.getAttribute("data-icon") || "");
      setCustomIconSvg(el.getAttribute("data-custom-icon") || "");
    } else if (isCustom && block) {
      setLocalIcon(block.icon || "");
    }
  }, [el, isCustom, block]);

  const updateDOMText = (val: string) => {
    if (!el) return;
    el.textContent = val;
    setLocalText(val);
    markDirty("text", el);
    /* re-inject icon after text reset */
    const cur = el.getAttribute("data-icon");
    const cust = el.getAttribute("data-custom-icon");
    if (cust) injectCustomSvg(el, cust);
    else if (cur) injectIcon(el, cur);
  };

  const updateDOMSrc = (val: string) => { if (el instanceof HTMLImageElement) { el.src = val; setLocalSrc(val); markDirty("attr", el, "src", val); } };
  const updateDOMAlt = (val: string) => { if (el instanceof HTMLImageElement) { el.alt = val; setLocalAlt(val); markDirty("attr", el, "alt", val); } };
  const updateDOMHref = (val: string) => { if (el instanceof HTMLAnchorElement) { el.href = val; setLocalHref(val); markDirty("attr", el, "href", val); } };

  function injectIcon(el: HTMLElement, iconName: string) {
    const paths = BUTTON_ICONS[iconName];
    if (!paths) { removeIcon(el); return; }
    el.setAttribute("data-icon", iconName);
    el.removeAttribute("data-custom-icon");
    /* rebuild: remove all children, add icon + text */
    el.querySelectorAll(".btn-icon").forEach(s => s.remove());
    const text = el.textContent || "";
    el.textContent = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16"); svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
    svg.style.verticalAlign = "middle";
    if (text) svg.style.marginRight = "6px";
    svg.style.display = "inline-block";
    svg.classList.add("btn-icon");
    for (const d of paths) {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", d); svg.appendChild(p);
    }
    el.appendChild(svg);
    if (text) el.appendChild(document.createTextNode(text));
  }

  function injectCustomSvg(el: HTMLElement, svgContent: string) {
    removeIcon(el);
    el.setAttribute("data-custom-icon", svgContent);
    el.querySelectorAll(".btn-icon").forEach(s => s.remove());
    const text = el.textContent || "";
    el.innerHTML = svgContent;
    /* wrap uploaded svg with btn-icon class */
    const uploaded = el.querySelector("svg");
    if (uploaded) {
      uploaded.classList.add("btn-icon");
      uploaded.style.verticalAlign = "middle";
      if (text) uploaded.style.marginRight = "6px";
      uploaded.style.display = "inline-block";
    }
    if (text) el.appendChild(document.createTextNode(text));
  }

  function removeIcon(el: HTMLElement) {
    el.removeAttribute("data-icon");
    el.removeAttribute("data-custom-icon");
    el.querySelectorAll(".btn-icon").forEach(s => s.remove());
  }

  const updateIcon = (iconName: string) => {
    if (isCustom && block) {
      onEditCustomBlock(block.id, { icon: iconName || undefined });
    } else if (el) {
      if (iconName) injectIcon(el, iconName);
      else removeIcon(el);
      markDirty("icon", el, iconName);
    }
    setLocalIcon(iconName);
    setCustomIconSvg("");
  };

  const handleUploadSvg = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !el) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (!content.includes("<svg")) return;
      const match = content.match(/<svg[\s\S]*?<\/svg>/i);
      if (!match) return;
      injectCustomSvg(el, match[0]);
      setLocalIcon("custom");
      setCustomIconSvg(match[0]);
      markDirty("icon", el, "custom", match[0]);
    };
    reader.readAsText(file);
  };

  const textTypes = ["Text", "Heading", "Button", "Item", "text", "heading", "button", "link", "blockquote", "badge", "alert", "checkbox"];
  const canEditText = textTypes.includes(type);
  const isBtnOrLink = ["button", "link", "Button", "Link"].includes(type);
  const isItemsType = ["list", "select", "radio", "tabs", "accordion", "carousel"].includes(type);
  const itemLabel = type === "select" ? "Options" : type === "radio" ? "Choices" : "Items";

  const inpCls = "w-full px-3 py-2 rounded-lg text-xs bg-zinc-800/80 border border-zinc-700/60 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/40 placeholder-zinc-500 transition-all";
  const secCls = "rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2";
  const lblCls = "text-[9px] font-bold text-zinc-500 uppercase tracking-widest";

  function iconSvg(name: string, size = 16) {
    const p = BUTTON_ICONS[name]?.map(d => `<path d="${d}"/>`).join("");
    if (!p) return null;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  }

  return (
    <div className="space-y-3">
      {canEditText && (
        <div className={secCls}>
          <h4 className={lblCls}>{isCustom ? "Content" : "Edit Text"}</h4>
          <input value={isCustom ? (block?.content || "") : localText}
            onChange={(e) => {
              if (isCustom && block) { onEditCustomBlock(block.id, { content: e.target.value }); }
              else { updateDOMText(e.target.value); }
            }}
            className={inpCls} placeholder="Enter text..." />
          {/* ── Icon picker for button / link ── */}
          {isBtnOrLink && (
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className={lblCls}>Icon</h4>
                {localIcon && (
                  <button onClick={() => updateIcon("")}
                    className="text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors">Clear</button>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1">
                {Object.keys(BUTTON_ICONS).map(name => (
                  <button key={name} onClick={() => updateIcon(localIcon === name ? "" : name)}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                      localIcon === name
                        ? "bg-blue-600 text-white ring-2 ring-blue-400/50"
                        : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 ring-1 ring-zinc-700/50"
                    }`}
                    title={name}
                    dangerouslySetInnerHTML={{ __html: iconSvg(name, 14) || "" }}
                  />
                ))}
                <button onClick={handleUploadSvg}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                    localIcon === "custom"
                      ? "bg-blue-600 text-white ring-2 ring-blue-400/50"
                      : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 ring-1 ring-zinc-700/50"
                  }`}
                  title="Upload SVG"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept=".svg" onChange={onFileSelected} className="hidden" />
            </div>
          )}
        </div>
      )}
      {type.toLowerCase() === "image" && (
        <div className={secCls}>
          <h4 className={lblCls}>Image URL</h4>
          <input value={isCustom ? (block?.src || "") : localSrc}
            onChange={(e) => {
              if (isCustom && block) { onEditCustomBlock(block.id, { src: e.target.value }); }
              else { updateDOMSrc(e.target.value); }
            }}
            className={inpCls} placeholder="https://..." />
          <div className="space-y-2">
            <h4 className={lblCls}>Alt Text</h4>
            <input value={isCustom ? (block?.alt || "") : localAlt}
              onChange={(e) => {
                if (isCustom && block) { onEditCustomBlock(block.id, { alt: e.target.value }); }
                else { updateDOMAlt(e.target.value); }
              }}
              className={inpCls} placeholder="Describe the image" />
          </div>
        </div>
      )}
      {type.toLowerCase() === "link" && (
        <div className={secCls}>
          <h4 className={lblCls}>Link URL</h4>
          <input value={isCustom ? (block?.href || "") : localHref}
            onChange={(e) => {
              if (isCustom && block) { onEditCustomBlock(block.id, { href: e.target.value }); }
              else { updateDOMHref(e.target.value); }
            }}
            className={inpCls} placeholder="https://..." />
        </div>
      )}
      {type.toLowerCase() === "input" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Placeholder</h4>
          <input value={block.placeholder || ""}
            onChange={(e) => onEditCustomBlock(block.id, { placeholder: e.target.value })}
            className={inpCls} placeholder="Placeholder text" />
        </div>
      )}
      {type.toLowerCase() === "video" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Video URL</h4>
          <input value={block.src || ""}
            onChange={(e) => onEditCustomBlock(block.id, { src: e.target.value })}
            className={inpCls} placeholder="YouTube embed URL" />
        </div>
      )}
      {type === "code" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Code</h4>
          <textarea value={block.content || ""}
            onChange={(e) => onEditCustomBlock(block.id, { content: e.target.value })}
            rows={5}
            className={inpCls + " font-mono text-[11px]"} placeholder="Paste your code here..." />
        </div>
      )}
      {type === "map" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Map URL</h4>
          <input value={block.src || ""}
            onChange={(e) => onEditCustomBlock(block.id, { src: e.target.value })}
            className={inpCls} placeholder="Embed URL..." />
        </div>
      )}
      {type === "avatar" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Image URL</h4>
          <input value={block.src || ""}
            onChange={(e) => onEditCustomBlock(block.id, { src: e.target.value })}
            className={inpCls} placeholder="https://..." />
          <div className="space-y-2">
            <h4 className={lblCls}>Name</h4>
            <input value={block.label}
              onChange={(e) => onEditCustomBlock(block.id, { label: e.target.value })}
              className={inpCls} placeholder="Name" />
          </div>
          <div className="space-y-2">
            <h4 className={lblCls}>Subtitle</h4>
            <input value={block.content || ""}
              onChange={(e) => onEditCustomBlock(block.id, { content: e.target.value })}
              className={inpCls} placeholder="Role or description" />
          </div>
        </div>
      )}
      {type === "textarea" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Placeholder</h4>
          <input value={block.placeholder || ""}
            onChange={(e) => onEditCustomBlock(block.id, { placeholder: e.target.value })}
            className={inpCls} placeholder="Placeholder text" />
        </div>
      )}
      {type === "progress" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Label</h4>
          <input value={block.label}
            onChange={(e) => onEditCustomBlock(block.id, { label: e.target.value })}
            className={inpCls} placeholder="Progress bar label" />
          <div className="space-y-2">
            <h4 className={lblCls}>Value (%)</h4>
            <input type="range" min="0" max="100" value={block.content || "75"}
              onChange={(e) => onEditCustomBlock(block.id, { content: e.target.value })}
              className="w-full accent-blue-500" />
            <div className="text-center text-[11px] text-zinc-400 font-mono">{block.content || "75"}%</div>
          </div>
        </div>
      )}
      {type === "counter" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Label</h4>
          <input value={block.label}
            onChange={(e) => onEditCustomBlock(block.id, { label: e.target.value })}
            className={inpCls} placeholder="Counter label" />
          <div className="space-y-2">
            <h4 className={lblCls}>Number</h4>
            <input type="number" value={block.content || "0"}
              onChange={(e) => onEditCustomBlock(block.id, { content: e.target.value })}
              className={inpCls} placeholder="0" />
          </div>
        </div>
      )}
      {isItemsType && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>{itemLabel}</h4>
          <p className="text-[9px] text-zinc-600">One per line</p>
          <textarea value={(block.items || []).join("\n")}
            onChange={(e) => onEditCustomBlock(block.id, { items: e.target.value.split("\n").filter(Boolean) })}
            rows={5}
            className={inpCls + " font-mono text-[11px]"} placeholder={`Enter ${itemLabel.toLowerCase()}...`} />
        </div>
      )}
      {type === "card" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Title</h4>
          <input value={block.label}
            onChange={(e) => onEditCustomBlock(block.id, { label: e.target.value })}
            className={inpCls} placeholder="Card title" />
          <div className="space-y-2">
            <h4 className={lblCls}>Description</h4>
            <textarea value={block.content || ""}
              onChange={(e) => onEditCustomBlock(block.id, { content: e.target.value })}
              rows={3}
              className={inpCls + " text-[11px]"} placeholder="Card description..." />
          </div>
        </div>
      )}
      {type === "icon-box" && isCustom && block && (
        <div className={secCls}>
          <h4 className={lblCls}>Title</h4>
          <input value={block.label}
            onChange={(e) => onEditCustomBlock(block.id, { label: e.target.value })}
            className={inpCls} placeholder="Title" />
          <div className="space-y-2">
            <h4 className={lblCls}>Description</h4>
            <input value={block.content || ""}
              onChange={(e) => onEditCustomBlock(block.id, { content: e.target.value })}
              className={inpCls} placeholder="Description text" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Style Tab ── */
function ElementStyleEditor({ node, selectedBlock, isCustom, markDirty, customElement }:
  { node: LayerNode | null; selectedBlock: CustomBlock | null; isCustom: boolean; markDirty: (type: string, el?: HTMLElement | null, key?: string, value?: string) => void; customElement?: HTMLElement | null; }) {

  const el = isCustom ? customElement : (node?.element ?? null);

  const [styleVals, setStyleVals] = useState<Record<string, string>>({});

  function toHex(cssColor: string): string {
    const m = cssColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (m) {
      return "#" + [1,2,3].map(i => parseInt(m[i]).toString(16).padStart(2, "0")).join("");
    }
    if (/^#[0-9a-f]{6}$/i.test(cssColor)) return cssColor;
    return "transparent";
  }

  useEffect(() => {
    if (el) {
      const cs = getComputedStyle(el);
      setStyleVals({
        width: el.style.width || "",
        height: el.style.height || "",
        paddingTop: el.style.paddingTop || cs.paddingTop,
        paddingRight: el.style.paddingRight || cs.paddingRight,
        paddingBottom: el.style.paddingBottom || cs.paddingBottom,
        paddingLeft: el.style.paddingLeft || cs.paddingLeft,
        marginTop: el.style.marginTop || cs.marginTop,
        marginRight: el.style.marginRight || cs.marginRight,
        marginBottom: el.style.marginBottom || cs.marginBottom,
        marginLeft: el.style.marginLeft || cs.marginLeft,
        backgroundColor: toHex(el.style.backgroundColor || cs.backgroundColor),
        color: toHex(el.style.color || cs.color),
        fontSize: el.style.fontSize || cs.fontSize,
        textAlign: el.style.textAlign || cs.textAlign,
        borderRadius: el.style.borderRadius || cs.borderRadius,
        opacity: el.style.opacity || cs.opacity,
      });
    } else {
      setStyleVals({});
    }
  }, [el, isCustom]);

  const updateStyle = (prop: string, val: string) => {
    if (!el) return;
    if (val && val !== "auto" && val !== "") {
      (el.style as any)[prop] = val;
    } else {
      (el.style as any)[prop] = "";
    }
    setStyleVals(prev => ({ ...prev, [prop]: val }));
    markDirty("style", el, prop, val);
  };

  if (!el) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-zinc-800/60 flex items-center justify-center mb-3 ring-1 ring-zinc-700/50">
          <Settings className="w-4 h-4 text-zinc-600" />
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[180px]">Select an element to style</p>
      </div>
    );
  }

  const inpCls = "w-full px-2 py-1.5 rounded-lg text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 placeholder-zinc-600 transition-all";
  const smInpCls = "w-14 px-2 py-1.5 rounded-lg text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 placeholder-zinc-600 transition-all";
  const secCls = "rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5";
  const lblCls = "text-[9px] font-bold text-zinc-500 uppercase tracking-widest";

  const gridInput = (sub: string) => (
    <input type="text" value={styleVals[sub] || ""}
      onChange={e => updateStyle(sub, e.target.value)}
      className="w-full px-1 py-1 rounded-lg text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder-zinc-600 transition-all"
      placeholder="0" />
  );

  const spacing = (prefix: string) => (
    <div className="grid grid-cols-4 gap-1">
      {["Top", "Right", "Bottom", "Left"].map((side) => {
        const prop = prefix + side;
        return (
          <div key={prop} className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] text-zinc-600 font-semibold uppercase">{side[0]}</span>
            {gridInput(prop)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Dimensions */}
      <div className={secCls}>
        <h4 className={lblCls}>Dimensions</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 w-12 shrink-0">Width</span>
            <input type="text" value={styleVals.width || ""}
              onChange={e => updateStyle("width", e.target.value)}
              className={inpCls} placeholder="auto" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 w-12 shrink-0">Height</span>
            <input type="text" value={styleVals.height || ""}
              onChange={e => updateStyle("height", e.target.value)}
              className={inpCls} placeholder="auto" />
          </div>
        </div>
      </div>

      {/* Padding */}
      <div className={secCls}>
        <h4 className={lblCls}>Padding</h4>
        {spacing("padding")}
      </div>

      {/* Margin */}
      <div className={secCls}>
        <h4 className={lblCls}>Margin</h4>
        {spacing("margin")}
      </div>

      {/* Typography */}
      <div className={secCls}>
        <h4 className={lblCls}>Typography</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400">Color</span>
            <div className="flex items-center gap-1.5">
              <input type="color" value={styleVals.color && styleVals.color !== "transparent" ? styleVals.color : "#000000"}
                onChange={e => updateStyle("color", e.target.value)}
                className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0" />
              <input type="text" value={styleVals.color || ""}
                onChange={e => updateStyle("color", e.target.value)}
                className={smInpCls} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400">Size</span>
            <input type="text" value={styleVals.fontSize || ""}
              onChange={e => updateStyle("fontSize", e.target.value)}
              className={inpCls} placeholder="16px" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400">Align</span>
            <div className="flex gap-1">
              {(["left", "center", "right", "justify"] as const).map(a => (
                <button key={a} onClick={() => updateStyle("textAlign", a)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    styleVals.textAlign === a ? "bg-blue-600 text-white shadow-sm" : "bg-zinc-800 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/80"
                  }`}
                >{a[0]}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className={secCls}>
        <h4 className={lblCls}>Background</h4>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-400">Color</span>
          <div className="flex items-center gap-1.5">
            <input type="color" value={styleVals.backgroundColor && styleVals.backgroundColor !== "transparent" ? styleVals.backgroundColor : "#000000"}
              onChange={e => updateStyle("backgroundColor", e.target.value)}
              className="w-6 h-6 rounded-lg cursor-pointer border border-zinc-700/50 bg-transparent p-0" />
            <input type="text" value={styleVals.backgroundColor || ""}
              onChange={e => updateStyle("backgroundColor", e.target.value)}
              className={smInpCls} />
          </div>
        </div>
      </div>

      {/* Border */}
      <div className={secCls}>
        <h4 className={lblCls}>Border</h4>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-400">Radius</span>
          <input type="text" value={styleVals.borderRadius || ""}
            onChange={e => updateStyle("borderRadius", e.target.value)}
            className={inpCls} placeholder="0px" />
        </div>
      </div>

      {/* Effects */}
      <div className={secCls}>
        <h4 className={lblCls}>Effects</h4>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-400">Opacity</span>
          <input type="text" value={styleVals.opacity || ""}
            onChange={e => updateStyle("opacity", e.target.value)}
            className={smInpCls} placeholder="1" />
        </div>
      </div>
    </div>
  );
}

/* ── Advanced Tab ── */
function ElementAdvancedEditor({ node, selectedBlock, isCustom, markDirty, customElement }:
  { node: LayerNode | null; selectedBlock: CustomBlock | null; isCustom: boolean; markDirty: (type: string, el?: HTMLElement | null, key?: string, value?: string) => void; customElement?: HTMLElement | null; }) {

  const el = isCustom ? customElement : (node?.element ?? null);
  const block = selectedBlock;

  const [elemId, setElemId] = useState("");
  const [cssClass, setCssClass] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [zIndex, setZIndex] = useState("");

  useEffect(() => {
    if (el) {
      setElemId(el.id || "");
      setCssClass(el.className || "");
      setVisibility(el.style.display !== "none");
      setZIndex(el.style.zIndex || "");
    } else {
      setElemId("");
      setCssClass("");
      setVisibility(true);
      setZIndex("");
    }
  }, [el, isCustom]);

  const updateAttr = (attr: string, val: string) => {
    if (!el) return;
    if (val) { el.setAttribute(attr, val); }
    else { el.removeAttribute(attr); }
    markDirty("attr", el, attr, val);
  };

  const updateVisibility = (v: boolean) => {
    if (!el) return;
    el.style.display = v ? "" : "none";
    setVisibility(v);
    markDirty("style", el, "display", v ? "" : "none");
  };

  if (!el) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-zinc-800/60 flex items-center justify-center mb-3 ring-1 ring-zinc-700/50">
          <Settings className="w-4 h-4 text-zinc-600" />
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[180px]">Select an element to edit</p>
      </div>
    );
  }

  const inpCls = "w-full px-2 py-1.5 rounded-lg text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 placeholder-zinc-600 transition-all";
  const secCls = "rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2.5";
  const lblCls = "text-[9px] font-bold text-zinc-500 uppercase tracking-widest";

  const type = node?.type || "";
  const tag = el?.tagName.toLowerCase() || "";

  return (
    <div className="space-y-3">
      <div className={secCls}>
        <h4 className={lblCls}>Attributes</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 w-8 shrink-0">ID</span>
            <input type="text" value={elemId}
              onChange={e => { setElemId(e.target.value); updateAttr("id", e.target.value); }}
              className={inpCls} placeholder="element-id" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 w-8 shrink-0">Class</span>
            <input type="text" value={cssClass}
              onChange={e => { setCssClass(e.target.value); updateAttr("class", e.target.value); }}
              className={inpCls} placeholder="class-name" />
          </div>
        </div>
      </div>

      <div className={secCls}>
        <h4 className={lblCls}>Visibility & Layout</h4>
        <div className="space-y-2.5">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[10px] text-zinc-400">Visible</span>
            <div className="relative w-8 h-4" onClick={() => updateVisibility(!visibility)}>
              <div className={`absolute inset-0 rounded-full transition-colors ${visibility ? "bg-blue-600" : "bg-zinc-700"}`} />
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${visibility ? "translate-x-4" : ""}`} />
            </div>
          </label>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400">Z-Index</span>
            <input type="number" value={zIndex}
              onChange={e => { const v = e.target.value; setZIndex(v); if (el) el.style.zIndex = v; markDirty("style", el, "zIndex", v); }}
              className="w-16 px-2 py-1.5 rounded-lg text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder-zinc-600 transition-all"
              placeholder="auto" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-800/30 p-3 ring-1 ring-zinc-800/60 space-y-2">
        <h4 className={lblCls}>Element Info</h4>
        <div className="space-y-1.5 text-[10px]">
          <div className="flex justify-between">
            <span className="text-zinc-500">Type</span>
            <span className="font-mono text-zinc-300">{type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Tag</span>
            <span className="font-mono text-zinc-300">{tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tree rendering component ── */
function LayerTreeItems({
  nodes, selectedId, expandedIds, hiddenIds,
  onSelect, onToggle, onDelete, getIcon, typeColor, depth,
}: {
  nodes: LayerNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  hiddenIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => any;
  typeColor: (type: string) => { ring: string; bg: string; label: string };
  depth?: number;
}) {
  const baseDepth = depth ?? 0;
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => {
        const Icon = getIcon(node.type);
        const hasChildren = node.children.length > 0;
        const expanded = expandedIds.has(node.id);
        const hidden = hiddenIds.has(node.id);
        const tc = typeColor(node.type);

        return (
          <div key={node.id}>
            <div data-node-id={node.id}
              onClick={() => { if (!hidden) onSelect(node.id); }}
              className={`group relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-100 ${
                hidden
                  ? "text-muted-foreground/25"
                  : selectedId === node.id
                    ? "bg-zinc-800/80 text-foreground shadow-sm border border-zinc-700/40"
                    : "text-sidebar-foreground hover:bg-zinc-800/40 border border-transparent"
              }`}
              style={{ paddingLeft: `${10 + (node.depth - baseDepth) * 14}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
                  className={`p-0.5 rounded transition-all shrink-0 ${
                    hidden ? "text-muted-foreground/20" : "text-muted-foreground hover:text-foreground hover:bg-zinc-700/50"
                  }`}
                >
                  {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              ) : (
                <span className="w-3.5 shrink-0" />
              )}
              <span className={`w-[3px] h-3 rounded-full shrink-0 transition-all ${
                selectedId === node.id ? "" : "opacity-40 group-hover:opacity-80"
              }`} style={{ background: hidden ? "transparent" : tc.ring }} />
              <Icon className={`w-4 h-4 shrink-0 ${hidden ? "text-transparent" : "text-zinc-400"}`} />
              <span className={`truncate flex-1 ${hidden ? "line-through" : ""}`}>{node.label}</span>
              <span className={`text-[8px] font-mono shrink-0 mr-0.5 px-1 py-0.5 rounded ${
                hidden ? "text-muted-foreground/15 bg-transparent" : "text-muted-foreground/40 bg-zinc-800/50"
              }`}>{node.type}</span>
              {!hidden && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
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
                typeColor={typeColor}
                depth={baseDepth}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
