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
  PanelRightOpen
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const queryParams = new URLSearchParams(window.location.search);
  const projectParam = queryParams.get("project");

  const template = TEMPLATES.find(
    (tmpl) => tmpl.id === parseInt(id || "") || tmpl.slug.toLowerCase() === id?.toLowerCase()
  );

  useEffect(() => {
    if (!template) {
      setLocation("/templates");
    }
  }, [template, setLocation]);

  if (!template) return null;

  const [language, setLanguage] = useState<"en" | "fr" | "ar">("en");
  const [selectedScheme, setSelectedScheme] = useState(template.schemes[0]);
  const [isDark, setIsDark] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(true);
  const [customBrandName, setCustomBrandName] = useState(template.name.toLowerCase());
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customColorValue, setCustomColorValue] = useState(template.schemes[0].accent);
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
      
      {/*  TOP PLATFORM PREVIEW BAR ── */}
      <header className="h-16 border-b border-zinc-200 bg-white text-zinc-900 flex items-center justify-between px-6 z-50 shrink-0 select-none">
        
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
            className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 h-9 px-4 rounded-full text-xs gap-1.5 cursor-pointer font-bold border border-zinc-200 bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
            {projectParam ? "Back to Dashboard" : "Back"}
          </Button>
          
          <div className="h-5 w-px bg-zinc-200 hidden md:block" />
          
          {/* Template Name & Category */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-black tracking-tight text-zinc-900">{template.name}</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 uppercase scale-90">
              {template.category}
            </span>
          </div>
        </div>

        {/* Right Side: Quick Action Pills & CTA */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Quick Language pills (Rounded full) */}
          <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-full p-0.5">
            {(["en", "fr", "ar"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-full uppercase transition-all cursor-pointer ${
                  language === lang
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700 font-extrabold"
                    : "text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Simulator Dark/Light Toggle (Rounded full) */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 px-4.5 py-1.5 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-full text-[10px] font-bold h-9 transition-all cursor-pointer shadow-2xs"
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
              className="bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs h-9 rounded-full px-5.5 gap-1.5 border border-zinc-200 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Use Template
            </Button>
            <button
              onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
              className={`ml-1.5 p-2 rounded-full border text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer ${
                isAppearanceOpen
                  ? "bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200"
                  : "bg-white border-zinc-200 hover:bg-zinc-100"
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

        {/* Right Side: Platform Customizer Sidebar ── */}
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
      </div>
    </div>
  );
}
