import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, User, Settings, LogOut, Plus, ArrowUpRight, ArrowRight, Monitor, Twitter, ChevronDown, Sparkles, Search, BookOpen, Bell, Megaphone, ShoppingBag, MessageSquare, Home, Info, Users, HelpCircle, Terminal, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, setToken, user } = useAuth();

  const handleLogout = () => {
    setToken(null);
  };

  const [location] = useLocation();
  const isDashboard = location.startsWith("/dashboard") || location.startsWith("/projects") || location.startsWith("/templates");
  const isRTL = language === "ar";

  const [supportOpen, setSupportOpen] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHoverOpenedRef = useRef(0);

  const showSupport = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (!supportOpen) lastHoverOpenedRef.current = Date.now();
    setSupportOpen(true);
  };

  const hideSupport = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setSupportOpen(false);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSupportOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <header className={
      isDashboard 
        ? "sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-xs"
        : `sticky top-0 z-50 w-full border-b ${supportOpen ? 'bg-background' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`
    }>
      <div className={
        isDashboard 
          ? "w-full px-6 flex h-16 items-center justify-between"
          : "container flex h-16 items-center justify-between"
      }>
        <div className="flex items-center gap-6 md:gap-10">
          {isDashboard ? (
            <Link href="/" className="flex items-center gap-2.5 group select-none cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20 relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <span className="text-white font-extrabold text-sm tracking-tighter">C</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                Corbit
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider scale-90">
                Studio
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
              <span className="font-bold text-xl inline-block">Corbit</span>
            </Link>
          )}
          
          {isDashboard ? (
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Input Command Mockup */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/80" />
                <input
                  type="text"
                  placeholder={t("nav.search")}
                  className="w-full h-8 pl-9 pr-12 rounded-full border border-border/40 bg-muted/20 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/45 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  disabled
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/50 bg-card text-[9px] font-mono text-muted-foreground font-bold select-none shadow-xs scale-90">
                  <span>⌘</span><span>K</span>
                </div>
              </div>

              {/* Updates Popover Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all cursor-pointer select-none">
                    <Bell className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span>{t("nav.updates")}</span>
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[340px] p-0 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl overflow-hidden mt-2 font-sans">
                  {/* Dropdown Header */}
                  <div className="p-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-primary" />
                      {t("nav.updates")}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      3 New
                    </span>
                  </div>

                  {/* Scrollable Updates Feed List */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-border/30">
                    
                    {/* Item 1: News */}
                    <div className="p-3 hover:bg-muted/40 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Megaphone className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground truncate">Caddy Engine Upgraded</span>
                          <span className="text-[9px] text-muted-foreground shrink-0">2h ago</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          Dynamic SSL handshakes optimized. SSL checks are now 3x faster in Algeria.
                        </p>
                      </div>
                    </div>

                    {/* Item 2: Orders */}
                    <div className="p-3 hover:bg-muted/40 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground truncate">New Premium Order</span>
                          <span className="text-[9px] text-muted-foreground shrink-0">5h ago</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          Algeria Web Studio upgraded to Starter Plan. Custom domain connection complete.
                        </p>
                      </div>
                    </div>

                    {/* Item 3: Comments */}
                    <div className="p-3 hover:bg-muted/40 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground truncate">Comment on Sitecraft</span>
                          <span className="text-[9px] text-muted-foreground shrink-0">1d ago</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          "I love the domain binding flow, it is extremely fast and secure!"
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2 border-t border-border/40 bg-muted/10 text-center">
                    <button className="text-[10px] font-bold text-primary hover:underline w-full py-1">
                      Mark all as read
                    </button>
                  </div>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                {t("nav.home")}
              </Link>
              
              <Link href="/about" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                {t("nav.about")}
              </Link>

              <div ref={supportRef} className="relative">
                <button 
                  onMouseEnter={showSupport}
                  onMouseLeave={hideSupport}
                  onClick={() => {
                    if (!supportOpen) { setSupportOpen(true); return; }
                    if (Date.now() - lastHoverOpenedRef.current < 500) return;
                    setSupportOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer select-none focus:outline-none py-1 group"
                >
                  <span>{t("nav.support")}</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${supportOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`fixed inset-0 top-16 z-40 bg-black/10 dark:bg-black/30 transition-opacity duration-200 ${supportOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => setSupportOpen(false)}
                  aria-hidden="true"
                />
                
                <div 
                  onMouseEnter={showSupport}
                  onMouseLeave={hideSupport}
                  className={`fixed left-0 right-0 top-16 z-50 bg-background border-b border-border/40 shadow-xl transition-all duration-300 ${supportOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'}`}>
                  <div className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-4 gap-10">
                      
                      <div className="col-span-1">
                        <div className="flex flex-col h-full">
                          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                            {t("nav.support_hero")}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            {t("nav.support_hero_desc")}
                          </p>
                          <a 
                            href="mailto:support@corbit.dz"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foreground hover:bg-foreground/90 text-background text-sm font-semibold shadow-lg shadow-foreground/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 mt-auto"
                          >
                            <Mail className="w-4 h-4" />
                            {t("nav.contact_support")}
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-5">
                          {t("nav.get_started")}
                        </h4>
                        <ul className="space-y-3">
                          <li>
                            <Link href="/docs" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                              <span>{t("nav.quick_start")}</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/tutorials" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>{t("nav.tutorials")}</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/faq" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                              <span>{t("nav.faq_page")}</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-5">
                          {t("nav.community")}
                        </h4>
                        <ul className="space-y-3">
                          <li>
                            <Link href="/community" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <Users className="w-4 h-4 text-purple-500 shrink-0" />
                              <span>{t("nav.community_forum")}</span>
                            </Link>
                          </li>
                          <li>
                            <a href="https://discord.gg/corbit" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />
                              <span>{t("nav.discord")}</span>
                            </a>
                          </li>
                          <li>
                            <Link href="/events" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <Megaphone className="w-4 h-4 text-rose-500 shrink-0" />
                              <span>{t("nav.events")}</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-5">
                          {t("nav.resources")}
                        </h4>
                        <ul className="space-y-3">
                          <li>
                            <Link href="/docs" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span>{t("nav.docs")}</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/api" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <Terminal className="w-4 h-4 text-orange-500 shrink-0" />
                              <span>{t("nav.api_ref")}</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/help" className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSupportOpen(false)}>
                              <HelpCircle className="w-4 h-4 text-green-500 shrink-0" />
                              <span>{t("nav.help")}</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          {t("nav.all_operational")}
                        </span>
                      </div>
                      <Link href="/help" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors" onClick={() => setSupportOpen(false)}>
                        {t("nav.visit_help")} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/pricing" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                {t("nav.pricing")}
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isDashboard ? (
                <Link href="/pricing" className="cursor-pointer">
                  <Button className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-violet-600 via-primary to-blue-600 text-white shadow-md hover:shadow-lg hover:shadow-primary/30 border-0 h-9 px-4 font-semibold text-xs tracking-tight transition-all scale-100 hover:scale-105 active:scale-95 gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                    {t("nav.get_pro")}
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing" className="cursor-pointer">
                  <Button className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/20 border-0 h-9 px-4 font-semibold text-xs tracking-tight transition-all scale-100 active:scale-95">
                    {t("nav.get_pro")}
                  </Button>
                </Link>
              )}
              
              <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 gap-2 px-2.5 rounded-full bg-muted/40 hover:bg-muted border border-border/40 hover:border-border transition-all select-none cursor-pointer">
                      <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm shrink-0">
                        {user?.name?.[0] || "A"}
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-foreground/80 max-w-[100px] truncate">
                        {user?.name || "Algeria Web Studio"}
                      </span>
                      <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  alignOffset={isRTL ? 12 : 0} 
                  className="w-64 p-0 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl overflow-hidden font-sans"
                >
                  
                  {/* Header Section */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{user?.name || "Algeria Web Studio"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "admin@algeriawebstudio.com"}</p>
                    </div>
                    <Link href="/pricing">
                      <button className="w-full py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors">
                        {t("nav.upgrade")}
                      </button>
                    </Link>
                  </div>

                  <DropdownMenuSeparator className="m-0 bg-border/50" />
                  
                  {/* Actions Section */}
                  <div className="p-1.5">
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent focus:text-accent-foreground text-sm font-medium text-muted-foreground transition-colors">
                        <Plus className="mr-3 h-4 w-4" />
                        {t("nav.create_project")}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent focus:text-accent-foreground text-sm font-medium text-muted-foreground transition-colors">
                        <Settings className="mr-3 h-4 w-4" />
                        {t("sidebar.settings")}
                      </DropdownMenuItem>
                    </Link>
                  </div>

                  <DropdownMenuSeparator className="m-0 bg-border/50" />

                  {/* Toggles Section */}
                  <div className="p-2 space-y-1">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-sm font-semibold text-foreground">{t("nav.theme")}</span>
                      <div className="flex items-center bg-accent/50 rounded-full p-0.5 border border-border/50">
                        <button 
                          onClick={() => setTheme("light")}
                          className={`p-1 rounded-full transition-colors ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Sun className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setTheme("dark")}
                          className={`p-1 rounded-full transition-colors ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Moon className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setTheme("system")}
                          className={`p-1 rounded-full transition-colors ${theme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Monitor className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-sm font-semibold text-foreground">{t("nav.language")}</span>
                      <div className="flex items-center bg-accent/50 rounded-full p-0.5 border border-border/50">
                        <button 
                          onClick={() => setLanguage("en")}
                          className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${language === 'en' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          EN
                        </button>
                        <button 
                          onClick={() => setLanguage("fr")}
                          className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${language === 'fr' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          FR
                        </button>
                        <button 
                          onClick={() => setLanguage("ar")}
                          className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${language === 'ar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          AR
                        </button>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="m-0 bg-border/50" />

                  {/* Links Section */}
                  <div className="p-1.5">
                    <Link href="/pricing">
                      <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent text-sm font-semibold text-foreground transition-colors">
                        {t("nav.pricing")}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/templates">
                      <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent text-sm font-semibold text-foreground transition-colors">
                        {t("nav.templates")}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/docs">
                      <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent text-sm font-semibold text-foreground transition-colors flex justify-between items-center group">
                        {t("footer.docs")}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/community">
                      <DropdownMenuItem className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent text-sm font-semibold text-foreground transition-colors flex justify-between items-center group">
                        {t("footer.community")}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-md py-2 px-2.5 focus:bg-accent text-sm font-semibold text-foreground transition-colors mt-1">
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </div>

                  {/* Footer Section */}
                  <div className="px-4 py-3 bg-accent/30 flex items-center justify-between mt-1">
                    <div className="flex gap-3 text-[10px] font-medium text-muted-foreground">
                      <Link href="/legal#privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                      <Link href="/legal#terms" className="hover:text-foreground transition-colors">Terms</Link>
                    </div>
                    <Twitter className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                  </div>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Toggle language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-md border-border/50 rounded-xl">
                  <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer rounded-md">
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("fr")} className="cursor-pointer rounded-md">
                    Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")} className="cursor-pointer rounded-md">
                    العربية
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-md border-border/50 rounded-xl">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer rounded-md">
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer rounded-md">
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer rounded-md">
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden md:flex gap-2">
                <Link href="/login">
                  <Button variant="ghost">{t("nav.login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("nav.register")}</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
