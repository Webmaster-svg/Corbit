import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "../../templates";
import { useAuth } from "@/lib/auth";
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  X, 
  Sliders, 
  Sun, 
  Moon, 
  Globe,
  FileText,
  Search,
  Server,
  Link2
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  // Read project parameter from query string
  const queryParams = new URLSearchParams(window.location.search);
  const projectParam = queryParams.get("project");

  // Find template by ID or slug
  const template = TEMPLATES.find(
    (tmpl) => tmpl.id === parseInt(id || "") || tmpl.slug.toLowerCase() === id?.toLowerCase()
  );

  // If template not found, redirect to templates explorer
  useEffect(() => {
    if (!template) {
      setLocation("/templates");
    }
  }, [template, setLocation]);

  if (!template) return null;

  // Simulator configuration states
  const [language, setLanguage] = useState<"en" | "fr" | "ar">("en");
  const [selectedScheme, setSelectedScheme] = useState(template.schemes[0]);
  const [isDark, setIsDark] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(true);
  const [customBrandName, setCustomBrandName] = useState(template.name.toLowerCase());

  // Handle CTA Click to deploy/use template
  const handleUseTemplate = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation(`/register?templateId=${template.id}`);
    }
  };

  const ActiveComponent = template.component;

  // List of standard pages inside these premium templates
  const themePages = [
    { title: "Home Landing", path: "/", desc: "Hero, carousel, about snippet", icon: "🏠" },
    { title: "Products Directory", path: "/products", desc: "Category filter, search, quick cart", icon: "📦" },
    { title: "Brand Story (About)", path: "/about", desc: "Heritage, values, craft narrative", icon: "📖" },
    { title: "Contact Hub", path: "/contact", desc: "Interactive form, map, visits", icon: "✉️" }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-900 text-zinc-100 font-sans select-none dark">
      
      {/* ── TOP PLATFORM PREVIEW BAR ── */}
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
          
          {/* Brand Logo & Info Group */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-455 flex items-center justify-center shadow-sm relative overflow-hidden shrink-0">
              <span className="text-white font-extrabold text-xs tracking-tighter">C</span>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">{template.name}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase scale-90">
                  {template.category}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold">Simulated Sandbox Environment</span>
            </div>
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

          {/* Quick Customizer Sidebar Trigger (Rounded full) */}
          <button
            onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
            className={`flex items-center gap-2 px-4.5 py-1.5 border text-[10px] font-bold h-9 rounded-full transition-all cursor-pointer shadow-2xs ${
              isAppearanceOpen
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          {/* Primary CTA (Vibrant Brand Blue & Fully Rounded) */}
          <Button
            size="sm"
            onClick={handleUseTemplate}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 rounded-full px-5.5 gap-1.5 shadow-md shadow-blue-600/10 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Use Template
          </Button>
        </div>
      </header>

      {/* ── MAIN AREA SPLIT ── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Native Template Sandbox Viewport */}
        <div className="flex-1 overflow-y-auto relative h-full bg-zinc-950">
          <ActiveComponent 
            language={language} 
            scheme={selectedScheme} 
            dark={isDark} 
          />
        </div>

        {/* Right Side: Platform Customizer Sidebar (PERMANENTLY DARK) ── */}
        <AnimatePresence>
          {isAppearanceOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-zinc-800 bg-zinc-950 text-white flex flex-col h-full shrink-0 z-40 overflow-hidden relative shadow-2xl animate-in fade-in-50"
            >
              <div className="w-[340px] flex flex-col h-full">
                
                {/* Customizer Sidebar Header */}
                <div className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/20">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    Appearance Settings
                  </span>
                  <button
                    onClick={() => setIsAppearanceOpen(false)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-zinc-800 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Customizer Settings Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
                  
                  {/* Color Schemes */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                      Color Scheme
                    </label>
                    <div className="space-y-2">
                      {template.schemes.map((scheme) => (
                        <button
                          key={scheme.name}
                          onClick={() => setSelectedScheme(scheme)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                            selectedScheme.name === scheme.name
                              ? "bg-blue-500/5 border-blue-500/40 text-blue-300 shadow-2xs font-extrabold"
                              : "bg-zinc-900/50 border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-5 h-5 rounded-full border border-zinc-700 shrink-0 shadow-inner"
                              style={{ backgroundColor: scheme.swatch }}
                            />
                            <span>{scheme.name}</span>
                          </div>
                          {selectedScheme.name === scheme.name && (
                            <Check className="w-4 h-4 text-blue-400 shrink-0 animate-in zoom-in-50 duration-200" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Pages Directory Section */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-zinc-500" />
                      Theme Pages Directory
                    </label>
                    <div className="space-y-2">
                      {themePages.map((page) => (
                        <div 
                          key={page.title}
                          className="flex items-start gap-3 p-3 bg-zinc-900/50 border border-zinc-850 rounded-2xl hover:border-zinc-800 transition-colors"
                        >
                          <span className="text-base select-none shrink-0 mt-0.5">{page.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-150 leading-none">{page.title}</span>
                              <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md font-semibold select-none leading-none">
                                {page.path}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal mt-1">{page.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google SEO snippet simulation */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-zinc-500" />
                      Google Search Result SEO Preview
                    </label>
                    
                    {/* Simulated SEO Card */}
                    <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-2xl space-y-2 shadow-inner">
                      <div className="space-y-1">
                        {/* URL snippet */}
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 truncate">
                          <span>https://algeriaweb.studio</span>
                          <span>›</span>
                          <span className="text-zinc-400 lowercase">{customBrandName}.dz</span>
                        </div>
                        {/* Title Snippet */}
                        <h4 className="text-sm font-semibold text-[#8ab4f8] leading-tight hover:underline cursor-pointer">
                          {template.name} Store | Premium E-Commerce Website Builder
                        </h4>
                      </div>
                      {/* Description snippet */}
                      <p className="text-[11px] text-zinc-400 leading-relaxed leading-normal">
                        {template.description} Get started with fully responsive, multilingual e-commerce stores optimized for Algeria payment networks.
                      </p>
                    </div>

                    {/* SEO Input simulator */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-zinc-500">Live Domain Simulator (.dz)</span>
                      <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 scale-95 origin-left">
                        <span className="text-[10px] font-bold text-zinc-500 px-2.5 py-2 bg-zinc-950 border-r border-zinc-800 select-none">brandname</span>
                        <input 
                          type="text" 
                          value={customBrandName}
                          onChange={(e) => setCustomBrandName(e.target.value.replace(/\s+/g, "").toLowerCase())}
                          placeholder="e.g. fashion"
                          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-zinc-650 focus:outline-none"
                        />
                        <span className="text-[10px] font-bold text-blue-400 px-2.5 py-2 bg-zinc-950 select-none">.dz</span>
                      </div>
                    </div>
                  </div>

                  {/* Isolated Docker Server Info */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-zinc-500" />
                      Isolated Container Server Specs
                    </label>
                    <div className="p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-850 space-y-2 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Virtual Environment:</span>
                        <span className="text-zinc-300 font-bold">Ubuntu 24.04 (Docker Node)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Hosting Region:</span>
                        <span className="text-zinc-300 font-bold">Algeria-East-1 (Alger Telecom)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">Isolated Database:</span>
                        <span className="text-zinc-300 font-bold">Memory Pool JSON / SQLite</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-medium">SSL Security:</span>
                        <span className="text-emerald-450 font-bold">Active Let's Encrypt SSL</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Customizer Sidebar Bottom CTA (Rounded full & Blue brand styled) */}
                <div className="p-5 border-t border-zinc-800 shrink-0 space-y-2 bg-zinc-950">
                  <Button
                    onClick={handleUseTemplate}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs h-11 rounded-full shadow-lg shadow-blue-600/15 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Use This Template
                  </Button>
                  <p className="text-[10px] text-zinc-500 text-center font-bold">
                    Free to start — no credit card
                  </p>
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
