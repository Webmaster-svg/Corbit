import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useListProjects,
  useCreateProject,
  useDeleteProject,
  useListTemplates,
  getListProjectsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Globe, FileText, Trash2, ExternalLink, Loader2,
  LayoutDashboard, FolderOpen, TrendingUp, Settings, LogOut
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function Projects() {
  const queryClient = useQueryClient();
  const { setToken } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: projects, isLoading } = useListProjects();
  const { data: templates } = useListTemplates();

  const createMutation = useCreateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setShowCreate(false);
        setNewName("");
        setNewDesc("");
        setSelectedTemplate(undefined);
      },
    },
  });

  const deleteMutation = useDeleteProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setDeletingId(null);
      },
    },
  });

  const filtered = (projects || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate({
      data: {
        name: newName.trim(),
        description: newDesc || undefined,
        templateId: selectedTemplate,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col border-r bg-sidebar shrink-0">
          <div className="flex-1 px-3 py-6 space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
              { icon: FolderOpen, label: "My Projects", href: "/projects", active: true },
              { icon: Globe, label: "Templates", href: "/templates" },
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
            <button
              onClick={() => { setToken(null); setLocation("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">My Projects</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {(projects || []).length} site{(projects || []).length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button onClick={() => setShowCreate(true)} data-testid="button-create-project">
                <Plus className="w-4 h-4 mr-2" />
                New project
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>

            {/* Projects grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-card border rounded-xl overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-xl">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <h3 className="font-semibold mb-1">{search ? "No projects found" : "No projects yet"}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {search ? "Try a different search term" : "Create your first website in seconds"}
                </p>
                {!search && (
                  <Button onClick={() => setShowCreate(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create project
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              >
                <AnimatePresence>
                  {filtered.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                      data-testid={`card-project-${project.id}`}
                    >
                      <div className="h-36 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
                        <img
                          src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/400/240`}
                          alt={project.name}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" variant="secondary">
                              <ExternalLink className="w-3 h-3 mr-1" /> Open
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{project.name}</h3>
                            {project.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{project.description}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            project.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <span className="text-xs text-muted-foreground">{project.visitCount} visits</span>
                          <div className="flex gap-1">
                            <Link href={`/projects/${project.id}`}>
                              <Button size="sm" variant="ghost" className="h-7 px-2">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => setDeletingId(project.id)}
                              data-testid={`button-delete-${project.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-create-project">
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogDescription>Give your site a name and optionally pick a template to start with.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="My Restaurant Website"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                data-testid="input-project-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description (optional)</Label>
              <Input
                id="project-desc"
                placeholder="A short description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                data-testid="input-project-desc"
              />
            </div>
            {templates && templates.length > 0 && (
              <div className="space-y-2">
                <Label>Template (optional)</Label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {templates.slice(0, 6).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTemplate(selectedTemplate === t.id ? undefined : t.id)}
                      className={`border rounded-lg p-2 text-xs text-left transition-colors ${
                        selectedTemplate === t.id ? "border-primary bg-primary/5" : "hover:border-primary/40"
                      }`}
                    >
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-muted-foreground">{t.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                {createMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>This action cannot be undone. The project will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => { if (deletingId) deleteMutation.mutate({ id: deletingId }); }}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
