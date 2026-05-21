import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "../../templates";
import {
  ArrowLeft, Layers, Type, Image, Square, LayoutGrid,
  Undo2, Redo2, Monitor, Tablet, Smartphone,
  Globe, Sun, Moon, GripVertical, Plus, Trash2, Copy,
  ChevronRight, ChevronDown, ChevronUp, Settings, Eye, EyeOff, Pencil, Minus
} from "lucide-react";
import type { ColorScheme, Language } from "../../templates/types";

const defaultScheme = (): ColorScheme => ({
  name: "Custom", swatch: "#3b82f6", bg: "#ffffff", surface: "#f8fafc",
  accent: "#3b82f6", accentText: "#ffffff", text: "#0f172a",
  muted: "#64748b", border: "#e2e8f0",
});

const pages = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "about", label: "About", icon: "ℹ️" },
  { id: "contact", label: "Contact", icon: "📬" },
];

const elementTypes = [
  { id: "text", label: "Text", icon: Type },
  { id: "image", label: "Image", icon: Image },
  { id: "button", label: "Button", icon: Square },
  { id: "section", label: "Section", icon: LayoutGrid },
  { id: "container", label: "Container", icon: Layers },
];

interface Rect { top: number; left: number; width: number; height: number }

interface LayerNode {
  id: string;
  type: string;
  label: string;
  depth: number;
  rect: Rect;
  element: HTMLElement;
  children: LayerNode[];
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

  const template = TEMPLATES.find(
    (tmpl) => tmpl.id === parseInt(id || "") || tmpl.slug.toLowerCase() === id?.toLowerCase()
  );

  useEffect(() => { if (!template) setLocation("/templates"); }, [template, setLocation]);

  const [language, setLanguage] = useState<Language>("en");
  const [scheme, setScheme] = useState<ColorScheme>(template?.schemes[0] || defaultScheme());
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [leftTab, setLeftTab] = useState<"pages" | "elements" | "layers">("layers");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editMode, setEditMode] = useState(true);

  /* ── Layer tree state ── */
  const [tree, setTree] = useState<LayerNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const editCanvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [addedBlocks, setAddedBlocks] = useState<{ id: string; type: string; label: string }[]>([]);

  useEffect(() => {
    if (editMode) { setShowLeftPanel(true); setShowRightPanel(true) }
    else { setShowLeftPanel(false); setShowRightPanel(false) }
  }, [editMode]);

  /* ── Recursive DOM scanner ── */
  function scanNode(
    el: HTMLElement,
    parentId: string,
    depth: number,
    overlayRect: DOMRect,
    idx: number
  ): LayerNode | null {
    if (!el || el.nodeType !== 1) return null;
    const id = parentId ? `${parentId}-c-${idx}` : `s-${idx}`;
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
      rect: { top: r.top - overlayRect.top, left: r.left - overlayRect.left, width: r.width, height: r.height },
      element: el,
      children: [],
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
      const n = scanNode(child, "", 0, o, idx);
      if (n) { list.push(n); idx++; }
    }
    setTree(list);
  }, [hiddenIds]);

  useEffect(() => {
    if (!editMode) return;
    const t = setTimeout(refreshTree, 80);
    return () => clearTimeout(t);
  }, [editMode, refreshTree, scheme, language, dark, activePage]);

  useEffect(() => {
    if (!editMode) return;
    const t = setInterval(refreshTree, 500);
    return () => clearInterval(t);
  }, [editMode, refreshTree]);

  /* ── Find node by id in tree ── */
  function findNodeById(nodes: LayerNode[], id: string): LayerNode | null {
    for (const n of nodes) {
      if (n.id === id) return n;
      const f = findNodeById(n.children, id);
      if (f) return f;
    }
    return null;
  }

  function findNodeAt(nodes: LayerNode[], x: number, y: number): string | null {
    let best: string | null = null;
    let bestDepth = -1;
    for (const n of nodes) {
      if (x >= n.rect.left && x <= n.rect.left + n.rect.width &&
          y >= n.rect.top && y <= n.rect.top + n.rect.height) {
        if (n.depth > bestDepth) { best = n.id; bestDepth = n.depth; }
        const deeper = findNodeAt(n.children, x, y);
        if (deeper) { const dn = findNodeById(n.children, deeper); if (dn && dn.depth > bestDepth) { best = deeper; bestDepth = dn.depth; } }
      }
    }
    return best;
  }

  /* ── Overlay handlers ── */
  const handleOverlayMove = (e: React.MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const o = overlay.getBoundingClientRect();
    const x = e.clientX - o.left;
    const y = e.clientY - o.top;
    const id = findNodeAt(tree, x, y);
    setHoveredId(id);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const o = overlay.getBoundingClientRect();
    const x = e.clientX - o.left;
    const y = e.clientY - o.top;
    const id = findNodeAt(tree, x, y);
    if (id) {
      setSelectedId(id);
      const n = findNodeById(tree, id);
      setSelectedElement(n?.type || "Element");
    } else {
      setSelectedId(null);
      setSelectedElement(null);
    }
  };

  /* ── Actions ── */
  const deleteNode = (id: string) => {
    const next = new Set(hiddenIds);
    next.add(id);
    setHiddenIds(next);
    setSelectedId(null);
    setSelectedElement(null);
    refreshTree();
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedIds(next);
  };

  const addBlock = (type: string, label: string) => {
    setAddedBlocks(prev => [...prev, { id: `b-${Date.now()}`, type, label }]);
    setSelectedElement(label);
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

  /* ── Computed highlight ── */
  const highlightId = selectedId ?? hoveredId;
  const highlightNode = highlightId ? findNodeById(tree, highlightId) : null;
  const isSelected = selectedId !== null;

  if (!template) return null;
  const ActiveComponent = template.component;
  const deviceWidth = deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "768px" : "375px";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans select-none">
      
      {/* ── TOP TOOLBAR ── */}
      <header className="h-12 flex items-center justify-between px-3 bg-zinc-900 border-b border-zinc-800 shrink-0 z-50 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <span className="text-sm font-semibold text-zinc-100 truncate max-w-[140px]">{template.name}</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50 shrink-0">Draft</span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-md transition-colors ${deviceMode === "desktop" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded-md transition-colors ${deviceMode === "tablet" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-md transition-colors ${deviceMode === "mobile" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 mx-0.5" />
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className={`p-1.5 rounded-md transition-colors ${showLeftPanel ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className={`p-1.5 rounded-md transition-colors ${showRightPanel ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
            <Redo2 className="w-4 h-4" />
          </button>
          <span className="h-5 w-px bg-zinc-700/60 shrink-0" />
          <div className="flex items-center gap-0.5 bg-zinc-800/50 rounded-lg p-0.5">
            <button
              onClick={() => setEditMode(true)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-semibold transition-all leading-none ${
                editMode ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Pencil className="w-3 h-3" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => setEditMode(false)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-semibold transition-all leading-none ${
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
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="px-3 h-8 flex items-center gap-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0">
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish</span>
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
                <div className="flex border-b border-zinc-800">
                  {[
                    { id: "pages", label: "Pages", icon: Layers },
                    { id: "elements", label: "Add", icon: Plus },
                    { id: "layers", label: "Layers", icon: GripVertical },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setLeftTab(tab.id as any); if (tab.id === "layers") refreshTree(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-colors ${
                        leftTab === tab.id
                          ? "text-white border-b-2 border-blue-500 bg-zinc-800/50"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ─── Pages ─── */}
                {leftTab === "pages" && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {pages.map((page) => (
                      <button key={page.id} onClick={() => setActivePage(page.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                          activePage === page.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                        }`}
                      >
                        <span className="text-sm">{page.icon}</span>
                        <span className="flex-1 text-left">{page.label}</span>
                        <span className="text-[10px] text-zinc-600">/ {page.id}</span>
                      </button>
                    ))}
                    <div className="pt-2 border-t border-zinc-800/60 mt-2">
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        Add Page
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── Add Elements ─── */}
                {leftTab === "elements" && (
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">
                      {editMode ? "Click to add to canvas" : "Switch to Edit to add"}
                    </div>
                    <div className="space-y-1">
                      {elementTypes.map((el) => (
                        <button key={el.id} disabled={!editMode}
                          onClick={() => editMode && addBlock(el.id, el.label)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                            editMode ? "text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer" : "text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          <el.icon className="w-4 h-4 text-zinc-500" />
                          {el.label}
                          <Plus className="w-3 h-3 ml-auto text-zinc-600" />
                        </button>
                      ))}
                    </div>
                    {addedBlocks.length > 0 && (
                      <>
                        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-5 px-1">Added Blocks</div>
                        <div className="space-y-1">
                          {addedBlocks.map((block, i) => (
                            <div key={block.id} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 bg-zinc-800/40">
                              <GripVertical className="w-3 h-3 text-zinc-600 shrink-0" />
                              <span>{block.label}</span>
                              <button onClick={() => setAddedBlocks(prev => prev.filter((_, j) => j !== i))} className="ml-auto text-zinc-500 hover:text-red-400 transition-colors">
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
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
                      Page Structure
                    </div>
                    {tree.length === 0 && (
                      <div className="text-xs text-zinc-600 px-3 py-6 text-center">Loading structure...</div>
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
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden w-full"
            style={{ background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)" }}
          >
            {!editMode ? (
              <ActiveComponent language={language} scheme={scheme} dark={dark} />
            ) : (
              <div className={deviceMode !== "desktop" ? "flex flex-col items-center py-8 min-h-full" : ""}>
                <div
                  style={{
                    width: deviceMode === "desktop" ? "100%" : deviceWidth,
                    maxWidth: "100%",
                    position: "relative",
                    transition: "width 0.3s ease"
                  }}
                  className={deviceMode !== "desktop" ? "bg-white rounded-[10px] shadow-2xl overflow-hidden shrink-0" : ""}
                >
                  <div ref={editCanvasRef} className="pointer-events-none">
                    <ActiveComponent language={language} scheme={scheme} dark={dark} />
                  </div>

                  {addedBlocks.length > 0 && (
                    <div className="p-6 border-2 border-dashed border-blue-500/40 rounded-lg m-4 bg-blue-500/5 text-center pointer-events-none">
                      <p className="text-sm font-medium text-blue-400 mb-1">Added Blocks</p>
                      <p className="text-xs text-zinc-500">{addedBlocks.map(b => b.label).join(", ")}</p>
                    </div>
                  )}

                  <div ref={overlayRef}
                    className="absolute inset-0 z-10 cursor-crosshair"
                    onMouseMove={handleOverlayMove}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={handleOverlayClick}
                  >
                    {highlightNode && (
                      <div className={`absolute rounded-[3px] pointer-events-none transition-none ${
                        isSelected ? "ring-2 ring-blue-500 ring-inset bg-blue-500/5" : "ring-2 ring-blue-400/60 ring-inset bg-blue-400/5"
                      }`} style={{ top: highlightNode.rect.top, left: highlightNode.rect.left, width: highlightNode.rect.width, height: highlightNode.rect.height }} />
                    )}
                    {selectedId && highlightNode && (
                      <div className="absolute flex items-center gap-0.5 bg-blue-600 rounded-md px-1 py-0.5 shadow-lg"
                        style={{ top: highlightNode.rect.top - 26, left: highlightNode.rect.left, pointerEvents: "auto", zIndex: 20 }}
                      >
                        <span className="text-[9px] font-semibold text-white/90 px-1 uppercase tracking-wider">{highlightNode.type}</span>
                        <span className="h-3 w-px bg-white/20" />
                        <button onClick={(e) => { e.stopPropagation(); deleteNode(selectedId); }}
                          className="p-0.5 rounded text-red-200 hover:text-red-100 hover:bg-red-500/30 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
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
                
                <div className="px-4 py-3 border-b border-zinc-800">
                  <h3 className="text-xs font-semibold text-zinc-100">Properties</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {selectedElement || "Select an element to edit"}
                  </p>
                  {selectedId && !hiddenIds.has(selectedId) && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60">
                      <button
                        onClick={() => deleteNode(selectedId)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                      <button
                        onClick={() => { setSelectedId(null); setSelectedElement(null); }}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800 transition-colors"
                      >
                        Deselect
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  <section>
                    <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Colors</h4>
                    <div className="space-y-2">
                      {([
                        { label: "Background", key: "bg" as const },
                        { label: "Surface", key: "surface" as const },
                        { label: "Accent", key: "accent" as const },
                        { label: "Text", key: "text" as const },
                      ]).map(({ label, key }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">{label}</span>
                          <div className="flex items-center gap-2">
                            <input type="color" value={scheme[key]}
                              onChange={(e) => setScheme({ ...scheme, [key]: e.target.value })}
                              className="w-7 h-7 rounded cursor-pointer border border-zinc-700/50 bg-transparent p-0.5"
                            />
                            <span className="text-[10px] font-mono text-zinc-500 w-16">{scheme[key]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Presets</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.schemes.map((s) => (
                        <button key={s.name} onClick={() => setScheme(s)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
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
                    <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Language</h4>
                    <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-0.5">
                      {(["en", "fr", "ar"] as const).map((lang) => (
                        <button key={lang} onClick={() => setLanguage(lang)}
                          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md uppercase transition-all ${
                            language === lang ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                          }`}
                        >{lang}</button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Display</h4>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-zinc-400">Dark Mode</span>
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
              className={`group flex items-center gap-1 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                hidden ? "text-zinc-700 line-through" :
                selectedId === node.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
              style={{ paddingLeft: `${12 + node.depth * 14}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
                  className="p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors shrink-0"
                >
                  {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <Icon className="w-3 h-3 text-zinc-500 shrink-0" />
              <span className="truncate flex-1">{node.label}</span>
              <span className="text-[9px] text-zinc-600 shrink-0 mr-1">{node.type}</span>
              {!hidden && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
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
