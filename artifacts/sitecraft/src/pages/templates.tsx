import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useListTemplates, useCreateProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, ArrowRight, Layers, LayoutDashboard, FolderOpen, Globe, TrendingUp, Settings, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["all", "business", "portfolio", "ecommerce", "blog", "restaurant", "agency", "landing"];

export default function Templates() {
  const { setToken, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<null | { id: number; name: string }>(null);
  const [projectName, setProjectName] = useState("");

  const { data: templates, isLoading } = useListTemplates();

  const createMutation = useCreateProject({
    mutation: {
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setSelectedTemplate(null);
        setProjectName("");
        setLocation(`/projects/${project.id}`);
      },
    },
  });

  const filtered = (templates || []).filter((tmpl) => {
    const matchSearch =
      tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || tmpl.category === category;
    return matchSearch && matchCategory;
  });

  const handleUseTemplate = (tmpl: { id: number; name: string }) => {
    if (!isAuthenticated) {
      setLocation("/register");
      return;
    }
    setProjectName(tmpl.name);
    setSelectedTemplate(tmpl);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !projectName.trim()) return;
    createMutation.mutate({
      data: { name: projectName.trim(), templateId: selectedTemplate.id },
    });
  };

  const sidebar = (
    <aside className="hidden md:flex w-60 flex-col border-r bg-sidebar shrink-0">
      <div className="flex-1 px-3 py-6 space-y-1">
        {[
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: FolderOpen, label: "My Projects", href: "/projects" },
          { icon: Layers, label: "Templates", href: "/templates", active: true },
          { icon: TrendingUp, label: "Analytics", href: "#" },
          { icon: Settings, label: "Settings", href: "#" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          </Link>
        ))}
      </div>
      <div className="p-3 border-t">
        {isAuthenticated ? (
          <button
            onClick={() => { setToken(null); setLocation("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        ) : (
          <Link href="/login">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4 rotate-180" />
              Sign in
            </button>
          </Link>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        {sidebar}

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
            <div className="px-6 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Templates
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {(templates || []).length} professional templates — pick one to start your site
                </p>
              </div>
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                  data-testid="input-search-templates"
                />
              </div>
            </div>

            {/* Category filter */}
            <div className="px-6 md:px-8 flex gap-2 overflow-x-auto pb-3 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors border flex-shrink-0 ${
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                  }`}
                  data-testid={`filter-${cat}`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    <Skeleton className="h-44 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No templates found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              >
                <AnimatePresence>
                  {filtered.map((template) => (
                    <motion.div
                      key={template.id}
                      variants={{ hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="group border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all hover:-translate-y-1"
                      data-testid={`card-template-${template.id}`}
                    >
                      <div className="relative overflow-hidden h-44">
                        <img
                          src={template.thumbnailUrl}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${template.id + 20}/400/280`;
                          }}
                        />
                        {template.isPro && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> PRO
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Use template <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md capitalize flex-shrink-0">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-1"
                          onClick={() => handleUseTemplate(template)}
                          data-testid={`button-use-template-${template.id}`}
                        >
                          Use this template
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Create project from template dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Start with "{selectedTemplate?.name}"</DialogTitle>
            <DialogDescription>
              Give your new project a name to get started.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Project name</Label>
              <Input
                id="proj-name"
                placeholder="My awesome site"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                autoFocus
                data-testid="input-project-name-from-template"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                ) : (
                  "Create project"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
