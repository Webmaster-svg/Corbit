import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "../../templates";
import { useAuth } from "@/lib/auth";
import { 
  ArrowLeft, 
  Check, 
  X, 
  Sun, 
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Loader2
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { usePublishProject, useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const queryParams = new URLSearchParams(window.location.search);
  const projectParam = queryParams.get("project");
  const cleanPreview = queryParams.get("clean") === "true";
  const queryClient = useQueryClient();
  const projectId = projectParam ? Number(projectParam) : null;

  const { data: project } = useGetProject(projectId || 0, { query: { enabled: !!projectId } });
  const publishMutation = usePublishProject({
    mutation: {
      onSuccess: () => {
        if (projectId) queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
      },
    },
  });

  const template = TEMPLATES.find(
    (tmpl) => tmpl.id === parseInt(id || "") || tmpl.slug.toLowerCase() === id?.toLowerCase()
  );

  useEffect(() => {
    if (!template) {
      setLocation("/templates");
    }
  }, [template, setLocation]);

  if (!template) return null;

  const savedConfig = project?.templateConfig as Record<string, any> | undefined;

  const [language, setLanguage] = useState<"en" | "fr" | "ar">(savedConfig?.language || "en");
  const [selectedScheme, setSelectedScheme] = useState(
    savedConfig?.scheme || template.schemes[0]
  );
  const [isDark, setIsDark] = useState(savedConfig?.dark ?? false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(true);
  const [customBrandName, setCustomBrandName] = useState(template.name.toLowerCase());
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customColorValue, setCustomColorValue] = useState(template.schemes[0].accent);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const effectiveScheme = isCustomColor
    ? { ...selectedScheme, swatch: customColorValue, accent: customColorValue }
    : selectedScheme;

  useEffect(() => {
    let io: IntersectionObserver | undefined;
    let mo: MutationObserver | undefined;

    const scan = (isMutation = false) => {
      const el = scrollRef.current;
      if (!el) return;
      if (isMutation) {
        const parent = el.parentElement;
        if (parent) parent.scrollTop = 0;
      }
      if (io) io.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );
      const targets = el.querySelectorAll(":scope > div > *");
      targets.forEach(t => {
        (t as HTMLElement).classList.remove("scroll-reveal", "revealed");
        (t as HTMLElement).classList.add("scroll-reveal");
        io?.observe(t);
      });
      if (targets[0]) (targets[0] as HTMLElement).classList.add("revealed");
    };

    scan();

    const el = scrollRef.current;
    if (el) {
      mo = new MutationObserver(() => scan(true));
      mo.observe(el, { childList: true, subtree: true, attributes: false, characterData: false });
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, [language, effectiveScheme.name, isDark]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUseTemplate = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation(`/register?templateId=${template.id}`);
    }
  };

  const ActiveComponent = template.component;

  const themePages = [
    { title: "Home Landing", path: "/", desc: "Hero, carousel, about snippet" },
    { title: "Products Catalog", path: "/products", desc: "Filters, search, quick cart" },
    { title: "Brand Story", path: "/about", desc: "Heritage, values, craft" },
    { title: "Contact Hub", path: "/contact", desc: "Form, map, visit info" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans select-none dark">
      
      {!cleanPreview && (
      /*  TOP PLATFORM PREVIEW BAR ── */
      <header className="h-16 border-b border-zinc-800 bg-zinc-950 text-white flex items-center justify-between px-6 z-50 shrink-0 select-none">
        
        {/* Left Side: Back Button & Template Name */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (projectParam) {
                const isProjects = window.location.pathname.startsWith("/projects") || document.referrer.includes("/projects");
                const base = isProjects ? "/projects" : "/dashboard";
                setLocation(`${base}/${projectParam}/theme`);
              } else {
                setLocation("/templates");
              }
            }}
            className="text-zinc-300 hover:text-white hover:bg-zinc-900 h-9 px-4 rounded-full text-xs gap-1.5 cursor-pointer font-bold border border-zinc-800 bg-zinc-950"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
            {projectParam ? "Back to Dashboard" : "Back"}
          </Button>
          
          <div className="h-5 w-px bg-zinc-800 hidden md:block" />
          
          {/* Template Name & Category */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-black tracking-tight text-white">{template.name}</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white uppercase scale-90">
              {template.category}
            </span>
          </div>
        </div>

        {/* Right Side: Quick Action Pills & CTA */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Quick Language pills (Rounded full) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-0.5">
            {(["en", "fr", "ar"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-full uppercase transition-all cursor-pointer ${
                  language === lang
                    ? "bg-white/10 text-white shadow-sm border border-white/20 font-extrabold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Simulator Dark/Light Toggle (Rounded full) */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 px-4.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full text-[10px] font-bold h-9 transition-all cursor-pointer shadow-2xs"
            title="Toggle Simulator Theme"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-500" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Primary CTA + Sidebar Toggle */}
          <div className="flex items-center">
            <Button
              size="sm"
              onClick={handleUseTemplate}
              className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs h-9 rounded-full px-5.5 gap-1.5 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Use Template
            </Button>
            <button
              onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
              className={`ml-1.5 p-2 rounded-full border text-zinc-400 hover:text-white transition-all cursor-pointer ${
                isAppearanceOpen
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/15"
                  : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              }`}
              title={isAppearanceOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isAppearanceOpen ? (
                <PanelRightClose className="w-3.5 h-3.5" />
              ) : (
                <PanelRightOpen className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>
      )}

      {cleanPreview && <nav className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 z-50 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="h-4 w-px bg-zinc-700/60" />
            <span className="text-sm font-semibold text-zinc-100">{template.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <div ref={newMenuRef} className="relative">
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                New
              </button>
              {showNewMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-40 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-xl z-50">
                  <button onClick={() => setShowNewMenu(false)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
                    Products
                  </button>
                  <button onClick={() => setShowNewMenu(false)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M4 11h16"/></svg>
                    Pages
                  </button>
                  <button onClick={() => setShowNewMenu(false)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
                    News
                  </button>
                </div>
              )}
            </div>
            <span className="h-4 w-px bg-zinc-700/60 mx-0.5" />
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer">
              Publish
              <div className="relative w-7 h-3.5">
                <input
                  type="checkbox"
                  checked={project?.status === "published"}
                  onChange={() => {
                    if (projectId) publishMutation.mutate({ id: projectId });
                  }}
                  disabled={!projectId || publishMutation.isPending}
                  className="peer sr-only"
                />
                <div className="absolute inset-0 rounded-full bg-zinc-700 peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white peer-checked:translate-x-3.5 transition-transform" />
              </div>
              {publishMutation.isPending && <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />}
            </label>
            <span className="h-4 w-px bg-zinc-700/60 mx-0.5" />
            <button onClick={() => setLocation(`/editor/${id}${projectId ? `?projectId=${projectId}` : ""}`)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors">Edit</button>
          </div>
        </nav>}

      {/* ── MAIN AREA SPLIT ─ */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left Side: Native Template Sandbox Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative h-full bg-zinc-950 viewport-scrollbar [transform:translateZ(0)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none z-10" />
          <div ref={scrollRef}>
            <ActiveComponent 
              language={language} 
              scheme={effectiveScheme} 
              dark={isDark} 
            />
          </div>
        </div>

        {!cleanPreview && (
        <AnimatePresence>
          {isAppearanceOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-zinc-800/80 bg-zinc-950 text-white flex flex-col h-full shrink-0 z-40 overflow-hidden relative"
            >
              <div className="w-[360px] flex flex-col h-full">
                
                {/* ── Scrollable Content ── */}
                <motion.div 
                  className="flex-1 overflow-y-auto px-6 py-10 space-y-10 hide-scrollbar"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  
                  {/* ── Color Direction ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="font-display text-base text-zinc-100">Color Direction</h3>
                      <div className="flex-1 h-px bg-zinc-800/60" />
                    </div>
                    <div className="space-y-1">
                      {template.schemes.map((scheme) => (
                        <button
                          key={scheme.name}
                          onClick={() => {
                            setSelectedScheme(scheme);
                            setIsCustomColor(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[10px] border transition-all cursor-pointer ${
                            selectedScheme.name === scheme.name && !isCustomColor
                              ? "bg-zinc-900/60 border-zinc-700/80 shadow-xs"
                              : "border-transparent hover:bg-zinc-900/30"
                          }`}
                        >
                          <div className="flex gap-px overflow-hidden rounded-[4px] border border-zinc-700/30 shrink-0">
                            <span className="w-5 h-6" style={{ background: scheme.bg }} />
                            <span className="w-6 h-6" style={{ background: scheme.surface }} />
                            <span className="w-5 h-6" style={{ background: scheme.accent }} />
                            <span className="w-5 h-6" style={{ background: scheme.text }} />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-xs font-medium text-zinc-300">{scheme.name}</span>
                          </div>
                          {selectedScheme.name === scheme.name && !isCustomColor && (
                            <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-zinc-800/30 pt-3 mt-3">
                      <button
                        onClick={() => setIsCustomColor(!isCustomColor)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[10px] border transition-all cursor-pointer ${
                          isCustomColor
                            ? "bg-zinc-900/60 border-zinc-700/80 shadow-xs"
                            : "border-transparent hover:bg-zinc-900/30"
                        }`}
                      >
                        <div className="flex gap-px overflow-hidden rounded-[4px] border border-zinc-700/30 shrink-0">
                          <span className="w-5 h-6" style={{ background: 'oklch(0.21 0.034 264)' }} />
                          <span className="w-6 h-6 bg-zinc-900" />
                          <span className="w-5 h-6" style={{ background: isCustomColor ? customColorValue : '#3b82f6' }} />
                          <span className="w-5 h-6 bg-zinc-100" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-xs font-medium text-zinc-300">Custom</span>
                        </div>
                        {isCustomColor && (
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                      </button>
                      {isCustomColor && (
                        <div className="flex items-center gap-2 px-1 mt-2.5">
                          <input
                            type="color"
                            value={customColorValue}
                            onChange={(e) => setCustomColorValue(e.target.value)}
                            className="w-7 h-7 rounded cursor-pointer border border-zinc-700/50 bg-transparent p-0.5"
                          />
                          <input
                            type="text"
                            value={customColorValue}
                            onChange={(e) => setCustomColorValue(e.target.value)}
                            className="flex-1 bg-transparent text-xs text-zinc-300 border border-zinc-800/60 rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-600 font-mono"
                            placeholder="#hex"
                          />
                        </div>
                      )}
                    </div>
                  </motion.section>

                  {/* ── Pages ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="font-display text-base text-zinc-100">Pages</h3>
                      <div className="flex-1 h-px bg-zinc-800/60" />
                    </div>
                    <div className="space-y-px">
                      {themePages.map((page, i) => (
                        <div 
                          key={page.title}
                          className="group flex items-center justify-between px-4 py-3 rounded-[10px] hover:bg-zinc-900/40 transition-colors cursor-default"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-zinc-600 w-5 text-right">{String(i + 1).padStart(2, '0')}</span>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{page.title}</span>
                              <span className="text-[10px] text-zinc-600 leading-tight mt-0.5">{page.desc}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-600 bg-zinc-900/80 px-2 py-0.5 rounded font-medium">
                            {page.path}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* ── Highlights ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="font-display text-base text-zinc-100">Highlights</h3>
                      <div className="flex-1 h-px bg-zinc-800/60" />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Languages", value: "EN / FR / AR", accent: "bg-blue-500/80" },
                        { label: "Responsive", value: "Mobile → Desktop", accent: "bg-emerald-500/80" },
                        { label: "Payments", value: "DZ-optimized", accent: "bg-amber-500/80" },
                        { label: "Pages", value: "4 included", accent: "bg-violet-500/80" }
                      ].map(({ label, value, accent }) => (
                        <div key={label} className="relative px-4 py-3.5 rounded-[10px] bg-zinc-900/25 border border-zinc-800/40 overflow-hidden">
                          <div className={`absolute top-0 left-0 w-full h-0.5 ${accent} opacity-60`} />
                          <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">{label}</span>
                          <p className="text-xs font-semibold text-zinc-200 mt-1.5">{value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* ── Search Preview ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="font-display text-base text-zinc-100">Search Preview</h3>
                      <div className="flex-1 h-px bg-zinc-800/60" />
                    </div>
                    
                    <div className="rounded-[10px] bg-zinc-900/20 border border-zinc-800/40 overflow-hidden">
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-600 truncate">
                          <span>algeriaweb.studio</span>
                          <span className="text-zinc-700">›</span>
                          <span className="text-zinc-500 lowercase">{customBrandName}.dz</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#8ab4f8] leading-tight">
                          {template.name} Store | Premium E-Commerce
                        </h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          {template.description} Fully responsive, multilingual, optimized for Algeria.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 border-t border-zinc-800/40 px-4 py-2.5">
                        <span className="text-[9px] font-semibold text-zinc-500 uppercase shrink-0">.dz</span>
                        <span className="text-[10px] text-zinc-700">/</span>
                        <input 
                          type="text" 
                          value={customBrandName}
                          onChange={(e) => setCustomBrandName(e.target.value.replace(/\s+/g, "").toLowerCase())}
                          placeholder="brand"
                          className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.section>

                </motion.div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
}
