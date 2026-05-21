import { useState, useEffect } from "react";
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

  const effectiveScheme = isCustomColor
    ? { ...selectedScheme, swatch: customColorValue, accent: customColorValue }
    : selectedScheme;

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
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase scale-90">
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
                    ? "bg-zinc-800 text-blue-400 shadow-sm border border-zinc-700 font-extrabold"
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
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Primary CTA + Sidebar Toggle */}
          <div className="flex items-center">
            <Button
              size="sm"
              onClick={handleUseTemplate}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 rounded-full px-5.5 gap-1.5 shadow-md shadow-blue-600/10 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Use Template
            </Button>
            <button
              onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
              className={`ml-1.5 p-2 rounded-full border text-zinc-400 hover:text-white transition-all cursor-pointer ${
                isAppearanceOpen
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/15"
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

      {/* ── MAIN AREA SPLIT ─ */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Native Template Sandbox Viewport */}
        <div className="flex-1 overflow-y-auto relative h-full bg-zinc-950">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none z-10" />
          <ActiveComponent 
            language={language} 
            scheme={effectiveScheme} 
            dark={isDark} 
          />
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
                  className="flex-1 overflow-y-auto px-6 py-8 space-y-7"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  
                  {/* ── Color Schemes ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="w-0.5 h-4 bg-blue-500/60 rounded-full" />
                      <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">
                        Color Direction
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {template.schemes.map((scheme) => (
                        <button
                          key={scheme.name}
                          onClick={() => {
                            setSelectedScheme(scheme);
                            setIsCustomColor(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-[10px] border text-xs font-medium transition-all cursor-pointer ${
                            selectedScheme.name === scheme.name && !isCustomColor
                              ? "bg-blue-500/[0.06] border-blue-500/35 text-blue-300 shadow-xs"
                              : "bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700/60 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-4 h-4 rounded-[3px] border border-zinc-700/60 shrink-0"
                              style={{ backgroundColor: scheme.swatch }}
                            />
                            <span>{scheme.name}</span>
                          </div>
                          {selectedScheme.name === scheme.name && !isCustomColor && (
                            <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-zinc-800/30 pt-1.5 mt-1.5">
                      <button
                        onClick={() => setIsCustomColor(!isCustomColor)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-[10px] border text-xs font-medium transition-all cursor-pointer ${
                          isCustomColor
                            ? "bg-blue-500/[0.06] border-blue-500/35 text-blue-300 shadow-xs"
                            : "bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700/60 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-4 h-4 rounded-[3px] border border-zinc-700/60 shrink-0"
                            style={{ backgroundColor: isCustomColor ? customColorValue : '#3b82f6' }}
                          />
                          <span>Custom</span>
                        </div>
                        {isCustomColor && (
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                      </button>
                      {isCustomColor && (
                        <div className="flex items-center gap-2 px-1 mt-2">
                          <input
                            type="color"
                            value={customColorValue}
                            onChange={(e) => setCustomColorValue(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-700/60 bg-transparent p-0.5"
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

                  {/* ── Theme Pages ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="w-0.5 h-4 bg-zinc-600/60 rounded-full" />
                      <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">
                        Pages
                      </span>
                    </div>
                    <div className="space-y-1">
                      {themePages.map((page) => (
                        <div 
                          key={page.title}
                          className="group flex items-center justify-between px-4 py-2.5 rounded-[10px] hover:bg-zinc-900/60 transition-colors cursor-default"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{page.title}</span>
                            <span className="text-[10px] text-zinc-600 leading-tight mt-0.5">{page.desc}</span>
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
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="w-0.5 h-4 bg-zinc-600/60 rounded-full" />
                      <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">
                        Highlights
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        ["Languages", "EN / FR / AR"],
                        ["Responsive", "Mobile → Desktop"],
                        ["Payments", "DZ-optimized"],
                        ["Pages", "4 included"]
                      ].map(([label, value]) => (
                        <div key={label} className="px-3.5 py-3 rounded-[10px] bg-zinc-900/30 border border-zinc-800/40">
                          <span className="text-[8px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">{label}</span>
                          <p className="text-xs font-semibold text-zinc-200 mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* ── Search Preview ── */}
                  <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="w-0.5 h-4 bg-zinc-600/60 rounded-full" />
                      <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">
                        Search Preview
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-[10px] bg-zinc-900/20 border border-zinc-800/40 space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-600 truncate">
                          <span>https://algeriaweb.studio</span>
                          <span className="text-zinc-700">›</span>
                          <span className="text-zinc-500 lowercase">{customBrandName}.dz</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#8ab4f8] leading-tight">
                          {template.name} Store | Premium E-Commerce
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {template.description} Fully responsive, multilingual, optimized for Algeria.
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-zinc-800/60 bg-zinc-900/20 px-3.5 py-2.5">
                      <span className="text-[9px] font-semibold text-zinc-500 uppercase shrink-0">.dz</span>
                      <div className="flex-1 flex items-center">
                        <span className="text-[10px] text-zinc-700 mr-1">/</span>
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
