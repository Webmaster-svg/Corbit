import { useParams, useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  useGetProject, 
  useUpdateProject, 
  usePublishProject, 
  getGetProjectQueryKey, 
  useListProjects,
  useDeleteProject,
  getListProjectsQueryKey,
  useListTemplates
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Globe, ArrowLeft, ExternalLink, Settings, LayoutDashboard, 
  FolderOpen, TrendingUp, LogOut, CheckCircle2, Clock, 
  Pencil, ShieldCheck, ShieldAlert, Trash2, RefreshCw, 
  AlertCircle, Info, Lock, Copy, Eye, EyeOff, AlertTriangle, 
  Package, ShoppingCart, FileEdit, Plus, Users, DollarSign, 
  MousePointerClick, MapPin, Activity, FileText, Search, ArrowRight,
  Palette
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n";
import { Loader2, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectDetail() {
  const { id, tab } = useParams<{ id: string; tab?: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: projectsList, isLoading: listLoading } = useListProjects();
  const { data: templates } = useListTemplates();

  const foundProject = Array.isArray(projectsList)
    ? projectsList.find((p) => p.id === Number(id) || p.name.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase())
    : null;

  const projectId = foundProject ? foundProject.id : (Number(id) || 0);

  const { data: project, isLoading: projectLoading } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) },
  });

  const isLoading = listLoading || (!!projectId && projectLoading);
  const proj = project as any;

  const projectDomain = project?.domain || (project?.name ? `${project.name.toLowerCase().replace(/\s+/g, "-")}.getcorbit.com` : null);
  const activeDomain = proj?.customDomainStatus === "active" ? proj.customDomain : projectDomain;

  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { token, setToken } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect to tab "home" if tab is not present in URL
  useEffect(() => {
    if (!tab && id) {
      const isProjects = window.location.pathname.startsWith("/projects");
      const base = isProjects ? "/projects" : "/dashboard";
      setLocation(`${base}/${id}/home`, { replace: true });
    }
  }, [id, tab, setLocation]);

  // Derived active tab driven by URL tab parameter
  let activeTab: "overview" | "theme" | "products" | "orders" | "posts" | "analytics" | "settings" = "overview";
  if (tab) {
    const tLower = tab.toLowerCase();
    if (tLower === "home") activeTab = "overview";
    else if (tLower === "theme") activeTab = "theme";
    else if (tLower === "products") activeTab = "products";
    else if (tLower === "orders") activeTab = "orders";
    else if (tLower === "posts") activeTab = "posts";
    else if (tLower === "analytics") activeTab = "analytics";
    else if (tLower === "settings") activeTab = "settings";
  }

  // Custom Domain States
  const [domainInput, setDomainInput] = useState("");
  const [binding, setBinding] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [unbinding, setUnbinding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showIp, setShowIp] = useState(false);

  // Products Tab States
  const [productsList, setProductsList] = useState([
    { id: 1, name: "Enterprise Custom Domain SSL", price: "2,500 DA", stock: 99, status: "Active", image: "🔒" },
    { id: 2, name: "Premium Algerian Coffee Beans", price: "1,200 DA", stock: 45, status: "Active", image: "☕" },
    { id: 3, name: "Sitecraft Premium CSS Theme", price: "4,500 DA", stock: 12, status: "Active", image: "🎨" },
    { id: 4, name: "Algeria Hosting Enterprise Plan", price: "8,900 DA", stock: 8, status: "Draft", image: "⚡" },
  ]);
  const [prodSearch, setProdSearch] = useState("");
  const [showAddProd, setShowAddProd] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");

  // Orders Tab States
  const [ordersList, setOrdersList] = useState([
    { id: "AWS-4821", customer: "Farid Belkacem", date: "2026-05-18", amount: "2,500 DA", status: "Paid" },
    { id: "AWS-4820", customer: "Yasmine Ouali", date: "2026-05-17", amount: "5,700 DA", status: "Paid" },
    { id: "AWS-4819", customer: "Amine Meziani", date: "2026-05-16", amount: "1,200 DA", status: "Pending" },
    { id: "AWS-4818", customer: "Kamel Zerrouki", date: "2026-05-14", amount: "4,500 DA", status: "Refunded" },
  ]);

  // Posts Tab States
  const [postsList, setPostsList] = useState([
    { id: 1, title: "Why On-Demand SSL is critical for Algerian Businesses", date: "2026-05-18", views: 245, readTime: "4 min", status: "Published" },
    { id: 2, title: "Setting up a custom .DZ domain with Cloudflare Proxy", date: "2026-05-15", views: 489, readTime: "6 min", status: "Published" },
    { id: 3, title: "Vercel-style local deployment on isolated Docker networks", date: "2026-05-12", views: 120, readTime: "8 min", status: "Draft" },
  ]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostRead, setNewPostRead] = useState("");

  const publishMutation = usePublishProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
      },
    },
  });

  const updateMutation = useUpdateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
        setEditing(false);
      },
    },
  });

  const deleteMutation = useDeleteProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setLocation("/dashboard");
      },
    },
  });

  const handlePublish = () => {
    publishMutation.mutate({ id: projectId });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateMutation.mutate({ id: projectId, data: { name: editName.trim() } });
  };

  const handleDeleteProject = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProject = () => {
    deleteMutation.mutate({ id: projectId });
  };

  const handleBindDomain = async () => {
    if (!domainInput.trim()) return;
    setBinding(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ customDomain: domainInput.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to bind custom domain");
      queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
      setDomainInput("");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setBinding(false);
    }
  };

  const handleVerifyDomain = async () => {
    setVerifying(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/domain/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Domain DNS check failed");
      queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleUnbindDomain = async () => {
    if (!confirm("Are you sure you want to disconnect this domain?")) return;
    setUnbinding(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/domain`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to disconnect domain");
      queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setUnbinding(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice.trim()) return;
    setProductsList([
      ...productsList,
      {
        id: productsList.length + 1,
        name: newProdName.trim(),
        price: newProdPrice.includes("DA") ? newProdPrice.trim() : `${newProdPrice.trim()} DA`,
        stock: Number(newProdStock) || 0,
        status: "Active",
        image: "📦",
      }
    ]);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
    setShowAddProd(false);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;
    setPostsList([
      ...postsList,
      {
        id: postsList.length + 1,
        title: newPostTitle.trim(),
        date: new Date().toISOString().split("T")[0],
        views: 0,
        readTime: newPostRead ? `${newPostRead} min` : "3 min",
        status: "Published",
      }
    ]);
    setNewPostTitle("");
    setNewPostRead("");
    setShowAddPost(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied "${text}" to clipboard!`);
  };

  const filteredProducts = productsList.filter((p) =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1 relative">
        
        {/* Dynamic Sidebar Switcher */}
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isSidebarOpen ? 240 : 0,
            opacity: isSidebarOpen ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`hidden md:flex flex-col bg-sidebar shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            isSidebarOpen ? "border-r border-border" : ""
          }`}
        >
          <div className="w-[240px] flex flex-col h-full shrink-0">
            <div className="flex-1 px-3 py-6 space-y-1">
              {[
                { icon: LayoutDashboard, label: "Overview", tab: "overview" },
                { icon: Globe, label: "Theme", tab: "theme" },
                { icon: FolderOpen, label: t("sidebar.projects"), href: "/projects", hide: true },
                { icon: Package, label: t("sidebar.products"), tab: "products" },
                { icon: ShoppingCart, label: t("sidebar.orders"), tab: "orders" },
                { icon: FileEdit, label: t("sidebar.posts"), tab: "posts" },
                { icon: TrendingUp, label: t("sidebar.analytics"), tab: "analytics" },
                { icon: Settings, label: t("sidebar.settings"), tab: "settings" },
              ].filter(item => !item.hide).map((item: any) => {
                const active = item.tab ? activeTab === item.tab : false;
                
                const buttonContent = (
                  <button
                    onClick={() => {
                      if (item.tab) {
                        const isProjects = window.location.pathname.startsWith("/projects");
                        const base = isProjects ? "/projects" : "/dashboard";
                        const tabSegment = item.tab === "overview" ? "home" : item.tab === "posts" ? "Posts" : item.tab;
                        setLocation(`${base}/${id}/${tabSegment}`);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );

                return item.href ? (
                  <Link key={item.label} href={item.href}>
                    {buttonContent}
                  </Link>
                ) : (
                  <div key={item.label}>
                    {buttonContent}
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t">
              <button
                onClick={() => { setToken(null); setLocation("/"); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </motion.aside>

        <main className="flex-1 p-6 md:p-8 overflow-auto relative">
          {/* Toggle Sidebar Tab Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex absolute left-0 top-6 z-40 bg-card hover:bg-accent border border-l-0 rounded-r-xl p-2.5 shadow-sm text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : !project ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Project not found.</p>
                <Link href="/dashboard">
                  <Button variant="outline" className="mt-4">Back to dashboard</Button>
                </Link>
              </div>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Workspace Header */}
                <div className="flex items-start justify-between gap-4 border-b pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{project.name}</h1>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        project.status === "published" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {project.description && <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl">{project.description}</p>}
                  </div>
                  
                  {/* Switch Tab Breadcrumb visual */}
                  <span className="text-xs font-bold text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider select-none">
                    {activeTab} MODE
                  </span>
                </div>

                {/* TAB: THEME EXPLORER */}
                {activeTab === "theme" && (() => {
                  const activeTheme = Array.isArray(templates) ? templates.find((t: any) => t.id === project.templateId) : null;
                  
                  return (
                    <div className="space-y-6 animate-in fade-in-50 duration-200">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground">Explore Website Themes</h2>
                        <p className="text-xs text-muted-foreground">Select and apply responsive, premium templates to style your isolated web server.</p>
                      </div>

                      {/* Active Theme Showcase */}
                      {activeTheme ? (
                        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-6 shadow-xs flex flex-col md:flex-row gap-6 items-center">
                          {/* Glowing Background Blur Element */}
                          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                          
                          {/* Thumbnail of active theme */}
                          <div className="relative w-full md:w-56 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border border-border bg-muted">
                            <img 
                              src={activeTheme.thumbnail_url} 
                              alt={activeTheme.name} 
                              className="object-cover w-full h-full"
                            />
                            <span className="absolute top-2.5 left-2.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground select-none">
                              ACTIVE
                            </span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3 min-w-0 z-10">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary">
                                CURRENTLY APPLIED THEME
                              </span>
                              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                                {activeTheme.name}
                              </h3>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                              {activeTheme.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full uppercase">
                                {activeTheme.category}
                              </span>
                              {activeTheme.tags && activeTheme.tags.map((tag: string) => (
                                <span key={tag} className="text-[9px] font-medium bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto z-10">
                            {project?.status === "published" && activeDomain ? (
                              <a href={`https://${activeDomain}`} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button 
                                  variant="default" 
                                  className="w-full h-10 px-5 rounded-xl font-bold text-xs gap-1.5 cursor-pointer"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Visit Live Site
                                </Button>
                              </a>
                            ) : (
                              <Link href={`/preview/${activeTheme.id}?project=${projectId}&clean=true`} className="w-full">
                                <Button 
                                  variant="outline" 
                                  className="w-full h-10 px-5 rounded-xl font-bold border border-border hover:bg-accent/30 text-xs gap-1.5 cursor-pointer"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Preview Active Site
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/45">
                          <Palette className="w-8 h-8 mx-auto text-muted-foreground/60 animate-bounce mb-3" />
                          <h3 className="font-bold text-sm text-foreground">No Theme Applied Yet</h3>
                          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                            Select one of the premium responsive themes below to deploy and style your isolated server workspace.
                          </p>
                        </div>
                      )}

                      {/* Theme Explorer Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.isArray(templates) && templates.map((t: any) => {
                          const isActive = project.templateId === t.id;
                          
                          return (
                            <div 
                              key={t.id} 
                              className={`group relative bg-card border rounded-2xl overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col ${
                                isActive ? "border-primary ring-1 ring-primary/40" : "hover:border-primary/30"
                              }`}
                            >
                              {/* Thumbnail container */}
                              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                <img 
                                  src={t.thumbnail_url} 
                                  alt={t.name}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                
                                {/* Overlay for tags and active badge */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-between p-4">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-xs select-none">
                                      {t.category}
                                    </span>
                                    {isActive && (
                                      <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow-sm animate-pulse">
                                        ACTIVE THEME
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {t.tags && t.tags.map((tag: string) => (
                                      <span key={tag} className="text-[9px] font-medium bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Info */}
                              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-extrabold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                                      {t.name}
                                    </h3>
                                    {t.is_pro && (
                                      <span className="text-[9px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                        PRO
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t.description}
                                  </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                  <Link href={`/preview/${t.id}?project=${projectId}`} className="flex-1">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full h-9 rounded-xl font-bold border border-border hover:bg-accent/30 text-xs gap-1.5 cursor-pointer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      Live Preview
                                    </Button>
                                  </Link>
                                  <Button 
                                    size="sm" 
                                    disabled={isActive}
                                    onClick={() => updateMutation.mutate({ id: projectId, data: { templateId: t.id } })}
                                    className={`flex-1 h-9 rounded-xl font-bold text-xs cursor-pointer ${
                                      isActive 
                                        ? "bg-muted text-muted-foreground border border-transparent" 
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                    }`}
                                  >
                                    {isActive ? "Currently Applied" : "Apply Theme"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    {/* Preview browser mockup */}
                    <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
                      <div className="bg-muted/50 px-4 py-2.5 border-b flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-background border rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center justify-between font-medium">
                          <span className="font-mono">
                            {proj?.customDomainStatus === "active" 
                              ? proj.customDomain 
                              : (project.domain || `${project.name.toLowerCase().replace(/\s+/g, "-")}.getcorbit.com`)}
                          </span>
                          {proj?.customDomainStatus === "active" && (
                            <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none">
                              <Lock className="w-2.5 h-2.5 text-green-500" /> SECURE SSL
                            </span>
                          )}
                        </div>
                        {project.status === "published" && (
                          <a 
                            href={proj?.customDomainStatus === "active" ? `https://${proj.customDomain}` : `https://${project.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <div className="h-48 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent flex items-center justify-center">
                        <div className="text-center space-y-2 opacity-60">
                          <Globe className="w-10 h-10 mx-auto text-primary animate-pulse" />
                          <p className="text-xs font-semibold text-muted-foreground">Virtual sitecraft preview active</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Total Visits", value: project.visitCount.toLocaleString(), icon: Activity },
                        { label: "Active Subpages", value: project.pageCount, icon: FileText },
                        { label: "Launch Date", value: new Date(project.createdAt).toLocaleDateString(), icon: Clock },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-card border rounded-2xl p-4 flex items-center gap-3.5">
                          <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                            <stat.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xl font-bold tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-card border rounded-2xl p-5 space-y-4 shadow-2xs">
                      <h2 className="font-bold text-sm text-foreground">Workspace Quick Controls</h2>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handlePublish}
                          disabled={publishMutation.isPending}
                          variant={project.status === "published" ? "outline" : "default"}
                        >
                          {publishMutation.isPending ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                          ) : project.status === "published" ? (
                            <><Clock className="w-4 h-4 mr-2" /> Unpublish Website</>
                          ) : (
                            <><Globe className="w-4 h-4 mr-2" /> Publish Site Live</>
                          )}
                        </Button>
                        {project.domain && (
                          <Button 
                            variant="outline" 
                            disabled={proj?.customDomainStatus === "active"}
                            className={proj?.customDomainStatus === "active" ? "opacity-50 cursor-not-allowed text-muted-foreground" : ""}
                            asChild={proj?.customDomainStatus !== "active"}
                          >
                            {proj?.customDomainStatus === "active" ? (
                              <span className="flex items-center">
                                <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                                Subdomain Stopped
                              </span>
                            ) : (
                              <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Subdomain
                              </a>
                            )}
                          </Button>
                        )}
                        {proj?.customDomain && proj?.customDomainStatus === "active" && (
                          <Button variant="outline" className="border-green-500 hover:bg-green-50/20 text-green-600 bg-green-500/5" asChild>
                            <a href={`https://${proj.customDomain}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2 text-green-500" />
                              Visit Custom Domain
                            </a>
                          </Button>
                        )}
                        {project.templateId && (
                          <Button variant="default" onClick={() => setLocation(`/editor/${project.templateId}?projectId=${project.id}`)}>
                            <FileEdit className="w-4 h-4 mr-2" />
                            Open Editor
                          </Button>
                        )}
                      </div>
                    </div>


                  </div>
                )}

                {/* TAB 2: PRODUCTS */}
                {activeTab === "products" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground">Digital Products</h2>
                        <p className="text-xs text-muted-foreground">Create, list, and manage your products catalog dynamically.</p>
                      </div>
                      <Button onClick={() => setShowAddProd(!showAddProd)} className="rounded-xl flex items-center gap-1.5 h-10 text-xs font-bold shadow">
                        <Plus className="w-4 h-4" /> Add Product
                      </Button>
                    </div>

                    {showAddProd && (
                      <motion.div 
                        className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <h3 className="text-sm font-bold text-foreground">Create Product Item</h3>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold">Product Name</Label>
                            <Input 
                              placeholder="e.g. Premium Coffee beans" 
                              value={newProdName} 
                              onChange={(e) => setNewProdName(e.target.value)} 
                              required 
                              className="h-10 rounded-xl bg-muted/20"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold">Pricing (DA)</Label>
                            <Input 
                              placeholder="e.g. 1,500" 
                              value={newProdPrice} 
                              onChange={(e) => setNewProdPrice(e.target.value)} 
                              required 
                              className="h-10 rounded-xl bg-muted/20"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold">Stock Amount</Label>
                            <Input 
                              placeholder="e.g. 50" 
                              value={newProdStock} 
                              onChange={(e) => setNewProdStock(e.target.value)} 
                              className="h-10 rounded-xl bg-muted/20"
                            />
                          </div>
                          <div className="md:col-span-3 flex justify-end gap-2.5">
                            <Button type="button" variant="ghost" onClick={() => setShowAddProd(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-xl h-10 px-6">Save Product</Button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Search Inventory */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <input
                        type="text"
                        placeholder="Search product inventory catalog..."
                        value={prodSearch}
                        onChange={(e) => setProdSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80 transition-all font-medium"
                      />
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((p) => (
                        <div key={p.id} className="bg-card border border-border/80 hover:border-primary/30 rounded-2xl p-5 flex flex-col justify-between h-44 shadow-2xs hover:shadow-md transition-all group">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl">{p.image}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                p.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground"
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-foreground mt-3 group-hover:text-primary transition-colors truncate">{p.name}</h3>
                            <p className="text-[11px] text-muted-foreground mt-1 font-semibold">Stock: {p.stock} units available</p>
                          </div>
                          <div className="flex items-center justify-between border-t pt-3 mt-3">
                            <span className="text-sm font-black text-foreground">{p.price}</span>
                            <span className="text-[10px] text-primary font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">Edit SKU <ArrowRight className="w-3 h-3" /></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: ORDERS */}
                {activeTab === "orders" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-foreground">Sales Transactions Ledger</h2>
                      <p className="text-xs text-muted-foreground">Monitor e-commerce orders, payments, and invoices in real-time.</p>
                    </div>

                    {/* Financial summary metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-card border rounded-2xl p-4.5 flex items-center gap-3.5">
                        <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/25">
                          <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="text-xl font-bold tracking-tight">13,900 DA</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">Total Revenue Generated</div>
                        </div>
                      </div>
                      <div className="bg-card border rounded-2xl p-4.5 flex items-center gap-3.5">
                        <div className="p-2 rounded-lg bg-primary/5 border border-primary/15">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xl font-bold tracking-tight">4 Completed</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">Orders Processed</div>
                        </div>
                      </div>
                      <div className="bg-card border rounded-2xl p-4.5 flex items-center gap-3.5">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <Users className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-xl font-bold tracking-tight">3 Clients</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">Active Customers</div>
                        </div>
                      </div>
                    </div>

                    {/* Orders Table */}
                    <div className="border rounded-2xl overflow-hidden bg-card">
                      <table className="w-full text-left border-collapse text-xs font-medium">
                        <thead>
                          <tr className="bg-muted/40 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer Name</th>
                            <th className="p-3">Order Date</th>
                            <th className="p-3">Invoice Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordersList.map((o) => (
                            <tr key={o.id} className="border-b hover:bg-muted/10">
                              <td className="p-3 font-mono font-bold text-primary">{o.id}</td>
                              <td className="p-3 text-foreground">{o.customer}</td>
                              <td className="p-3 text-muted-foreground">{o.date}</td>
                              <td className="p-3 font-extrabold text-foreground">{o.amount}</td>
                              <td className="p-3">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  o.status === "Paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                  o.status === "Pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                  "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg">View Bill</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 4: POSTS */}
                {activeTab === "posts" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground">CMS Blog Articles</h2>
                        <p className="text-xs text-muted-foreground">Draft and publish posts, optimization updates, and reviews online.</p>
                      </div>
                      <Button onClick={() => setShowAddPost(!showAddPost)} className="rounded-xl flex items-center gap-1.5 h-10 text-xs font-bold shadow">
                        <Plus className="w-4 h-4" /> New Blog Post
                      </Button>
                    </div>

                    {showAddPost && (
                      <motion.div 
                        className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <h3 className="text-sm font-bold text-foreground">Compose Article</h3>
                        <form onSubmit={handleAddPost} className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold">Post Title</Label>
                            <Input 
                              placeholder="e.g. 5 Best Practices for Custom Domain setups" 
                              value={newPostTitle} 
                              onChange={(e) => setNewPostTitle(e.target.value)} 
                              required 
                              className="h-10 rounded-xl bg-muted/20"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold">Read Duration (minutes)</Label>
                              <Input 
                                placeholder="e.g. 5" 
                                value={newPostRead} 
                                onChange={(e) => setNewPostRead(e.target.value)} 
                                className="h-10 rounded-xl bg-muted/20"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold">Metadata Category</Label>
                              <Input placeholder="e.g. Tutorials" className="h-10 rounded-xl bg-muted/20" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2.5">
                            <Button type="button" variant="ghost" onClick={() => setShowAddPost(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-xl h-10 px-6">Publish Article</Button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Posts List */}
                    <div className="space-y-3">
                      {postsList.map((post) => (
                        <div key={post.id} className="bg-card border border-border/80 hover:border-primary/25 rounded-2xl p-4.5 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all group">
                          <div className="space-y-1 min-w-0">
                            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{post.title}</h3>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                              <span>Published: {post.date}</span>
                              <span>•</span>
                              <span>{post.readTime} read time</span>
                              <span>•</span>
                              <span className="text-primary">{post.views} Views</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              post.status === "Published" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground"
                            }`}>
                              {post.status}
                            </span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/5">
                              <Pencil className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: ANALYTICS */}
                {activeTab === "analytics" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-foreground">Performance & Visitor Analytics</h2>
                      <p className="text-xs text-muted-foreground">Understand your audience, traffic sources, and visits distribution in Algeria.</p>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Unique Visitors", value: "1,240", icon: Users, change: "+12.4% this week", color: "text-emerald-500" },
                        { label: "Total Page Views", value: project.visitCount.toLocaleString(), icon: MousePointerClick, change: "+8.2% this week", color: "text-emerald-500" },
                        { label: "Bounce Rate", value: "38.5%", icon: Activity, change: "-2.1% improvement", color: "text-blue-500" },
                        { label: "Avg Session", value: "3m 45s", icon: Clock, change: "+15s increase", color: "text-emerald-500" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-card border rounded-2xl p-5 space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</span>
                            <stat.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-2xl font-extrabold tracking-tight">{stat.value}</div>
                            <span className={`text-[10px] font-bold ${stat.color}`}>{stat.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Splitted Statistics Panels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Traffic Sources */}
                      <div className="bg-card border rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-foreground">Traffic Channels</h3>
                        <div className="space-y-3.5">
                          {[
                            { source: "Direct Traffic", percentage: 55, visits: "682 visits", color: "bg-primary" },
                            { source: "Search Engines (Google, Bing)", percentage: 30, visits: "372 visits", color: "bg-indigo-500" },
                            { source: "Social Referrals (Facebook, LinkedIn)", percentage: 15, visits: "186 visits", color: "bg-blue-400" },
                          ].map((item) => (
                            <div key={item.source} className="space-y-1 text-xs">
                              <div className="flex justify-between font-medium">
                                <span className="text-foreground">{item.source}</span>
                                <span className="text-muted-foreground font-semibold">{item.visits} ({item.percentage}%)</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Algerian Cities Visitor Distribution */}
                      <div className="bg-card border rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <MapPin className="w-4.5 h-4.5 text-primary" />
                          Geographic Distribution (Algeria)
                        </h3>
                        <div className="space-y-3.5">
                          {[
                            { city: "Algiers (الجزائر)", percentage: 60, visits: "744 visits" },
                            { city: "Oran (وهران)", percentage: 20, visits: "248 visits" },
                            { city: "Constantine (قسنطينة)", percentage: 12, visits: "148 visits" },
                            { city: "Annaba (عنابة)", percentage: 8, visits: "100 visits" },
                          ].map((city) => (
                            <div key={city.city} className="flex items-center justify-between text-xs font-medium">
                              <span className="text-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {city.city}
                              </span>
                              <span className="text-muted-foreground font-bold">{city.visits} ({city.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 6: SETTINGS */}
                {activeTab === "settings" && (
                  <div className="space-y-6 animate-in fade-in-50 duration-200">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-foreground">Project Settings</h2>
                      <p className="text-xs text-muted-foreground">Rename, modify, or permanently decommission this Dockerized mini-server.</p>
                    </div>

                    {/* Renaming Form Card */}
                    <div className="bg-card border rounded-2xl p-5 space-y-4 shadow-2xs">
                      <h3 className="text-sm font-bold text-foreground">Project Details</h3>
                      <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">Project Name</Label>
                          <Input
                            value={editName || project.name}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-10 rounded-xl bg-muted/20"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">Project Description</Label>
                          <Input
                            placeholder="Enter description..."
                            defaultValue={project.description || ""}
                            className="h-10 rounded-xl bg-muted/20"
                          />
                        </div>
                        <Button type="submit" disabled={updateMutation.isPending} className="rounded-xl h-10 px-6 font-bold shadow">
                          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Settings"}
                        </Button>
                      </form>
                    </div>

                    {/* Custom Domain Settings Card */}
                    <div className="bg-card border rounded-2xl p-5 space-y-6 shadow-2xs">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Custom Domain Settings
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Point your own domain name (e.g. yourshop.dz) to Algeria Web Studio isolated Docker proxies.
                          </p>
                        </div>
                        {proj?.customDomain && (
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            proj.customDomainStatus === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            proj.customDomainStatus === "failed" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                          }`}>
                            {proj.customDomainStatus === "active" ? (
                              <><ShieldCheck className="w-3 h-3 inline mr-1" /> Active</>
                            ) : proj.customDomainStatus === "failed" ? (
                              <><ShieldAlert className="w-3 h-3 inline mr-1" /> DNS Error</>
                            ) : (
                              <><Clock className="w-3 h-3 inline mr-1 animate-spin" /> Resolving</>
                            )}
                          </span>
                        )}
                      </div>

                      {errorMsg && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>{errorMsg}</div>
                        </div>
                      )}

                      {!proj?.customDomain ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="settings-domain-input" className="text-xs font-bold">Connect domain name</Label>
                            <div className="flex gap-2 max-w-md">
                              <Input
                                id="settings-domain-input"
                                placeholder="my-algerian-brand.dz"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                disabled={binding}
                                className="h-10 rounded-xl"
                              />
                              <Button onClick={handleBindDomain} disabled={binding || !domainInput} className="h-10 rounded-xl">
                                {binding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                            You will configure DNS records with your domain registrar after binding.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div className="bg-muted/30 border rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Bound Domain:</span>
                              <span className="font-mono text-sm font-extrabold text-primary">{proj.customDomain}</span>
                            </div>
                            {proj.customDomainStatus === "active" ? (
                              <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs rounded-xl p-3 flex gap-2.5 items-center">
                                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                <div className="space-y-0.5 text-left">
                                  <p className="font-bold">SSL Certificate & Routing Enabled</p>
                                  <p className="text-muted-foreground text-[10px]">Secured with Let's Encrypt TLS. Dynamically served via Caddy dynamic proxy.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs rounded-xl p-3 flex gap-2.5 items-start">
                                <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                <div className="space-y-0.5 text-left">
                                  <p className="font-bold">Verification Pending</p>
                                  <p className="text-muted-foreground text-[10px]">Please configure the DNS records shown below at your domain registrar.</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Configure DNS records</h4>
                              <Button variant="ghost" size="sm"
                                onClick={() => setShowIp(!showIp)}
                                className="h-7 text-xs flex items-center gap-1 text-primary hover:bg-primary/5"
                              >
                                {showIp ? <><EyeOff className="w-3.5 h-3.5" /> Hide IP</> : <><Eye className="w-3.5 h-3.5" /> Show IP</>}
                              </Button>
                            </div>
                            <div className="border rounded-2xl overflow-hidden bg-card">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-muted/40 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Host</th>
                                    <th className="p-3">Target Value</th>
                                    <th className="p-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b hover:bg-muted/10 font-medium">
                                    <td className="p-3 font-bold text-foreground">A</td>
                                    <td className="p-3 font-mono">@</td>
                                    <td className="p-3 font-mono">
                                      {showIp ? (proj?.dockerBridgeIp || "172.18.0.15") : <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-semibold text-muted-foreground">•••••••••••••</span>}
                                    </td>
                                    <td className="p-3 text-right">
                                      <Button variant="ghost" size="sm"
                                        onClick={() => copyToClipboard(proj?.dockerBridgeIp || "172.18.0.15")}
                                        disabled={!showIp}
                                        className="h-7 w-7 p-0 rounded-lg hover:bg-primary/5"
                                      >
                                        <Copy className="w-3.5 h-3.5 text-primary" />
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-muted/10 font-medium">
                                    <td className="p-3 font-bold text-foreground">CNAME</td>
                                    <td className="p-3 font-mono">www</td>
                                    <td className="p-3 font-mono">{proj.customDomain}</td>
                                    <td className="p-3 text-right">
                                      <Button variant="ghost" size="sm"
                                        onClick={() => copyToClipboard(proj.customDomain)}
                                        className="h-7 w-7 p-0 rounded-lg hover:bg-primary/5"
                                      >
                                        <Copy className="w-3.5 h-3.5 text-primary" />
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-4 flex gap-3 items-start">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                            <div className="space-y-1 text-left">
                              <p className="text-xs font-bold text-foreground">Cloudflare DNS CDN Proxy Configuration</p>
                              <p className="text-[11px] leading-relaxed text-muted-foreground">
                                If using Cloudflare, use <b>DNS Only</b> (gray cloud) for Let's Encrypt. Switch to <b>Proxied</b> (orange cloud) after SSL is active.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button onClick={handleVerifyDomain} disabled={verifying} className="h-10 flex items-center gap-2 rounded-xl">
                              {verifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying DNS...</> : <><RefreshCw className="w-4 h-4" /> Verify DNS</>}
                            </Button>
                          </div>

                          <div className="border-t pt-4 flex justify-end">
                            <Button variant="ghost"
                              onClick={handleUnbindDomain}
                              disabled={unbinding}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1.5 rounded-xl"
                            >
                              {unbinding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              Disconnect Custom Domain
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Danger Zone */}
                    <div className="border border-destructive/25 bg-destructive/5 rounded-2xl p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-destructive flex items-center gap-1.5">
                          <AlertTriangle className="w-4.5 h-4.5 text-destructive" />
                          Danger Zone
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Permanently shut down and wipe this website's isolated Docker networking bridge. This action is irreversible.</p>
                      </div>
                      
                      <div className="flex justify-start">
                        <Button 
                          onClick={handleDeleteProject}
                          disabled={deleteMutation.isPending}
                          variant="destructive"
                          className="bg-destructive hover:bg-destructive/90 text-white font-bold h-10 px-6 rounded-xl flex items-center gap-2 shadow"
                        >
                          {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          Decommission Project Server
                        </Button>

                        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                          <AlertDialogContent className="sm:max-w-[425px] bg-background dark:bg-[#0B101B] border-border/40 p-8 sm:rounded-2xl">
                            <div className="flex flex-col items-center text-center">
                              <div className="w-14 h-14 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                                <AlertTriangle className="w-6 h-6 text-red-500 relative z-10" />
                              </div>
                              
                              <AlertDialogHeader className="w-full flex flex-col items-center sm:text-center space-y-3 mb-8">
                                <AlertDialogTitle className="text-2xl font-bold text-foreground dark:text-white tracking-tight">
                                  Decommission Server?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[15px] text-muted-foreground dark:text-slate-400 leading-relaxed max-w-[320px]">
                                  Are you sure you want to decommission <strong className="text-foreground dark:text-white font-semibold">{proj?.name}</strong>? This action is permanent. The container will be shut down and removed from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              
                              <AlertDialogFooter className="w-full flex sm:flex-row flex-col gap-3 sm:space-x-0">
                                <AlertDialogCancel className="mt-0 flex-1 h-12 rounded-full bg-background dark:bg-transparent border-border dark:border-white/10 hover:bg-accent dark:hover:bg-white/5 text-foreground dark:text-white font-medium transition-colors">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={confirmDeleteProject}
                                  className="flex-1 h-12 rounded-full bg-[#ff3b4b] hover:bg-[#ff3b4b]/90 text-white font-semibold border-none shadow-[0_0_20px_rgba(255,59,75,0.3)] hover:shadow-[0_0_25px_rgba(255,59,75,0.4)] transition-all"
                                >
                                  {deleteMutation.isPending ? "Shutting down..." : "Decommission"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
