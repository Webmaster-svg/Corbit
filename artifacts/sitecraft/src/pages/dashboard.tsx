import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { PlatformLoader } from "@/components/ui/platform-loader";
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
import { 
  useListProjects, 
  useListTemplates, 
  useCreateProject, 
  useLogout, 
  getListProjectsQueryKey,
  useDeleteProject
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Globe, FileText, TrendingUp, Plus, 
  FolderOpen, Clock, LogOut, Settings, Activity, 
  Package, ShoppingCart, FileEdit, Search, ArrowRight, Trash2, AlertTriangle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { setToken } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | undefined>();
  const [projectToDelete, setProjectToDelete] = useState<{ id: number; name: string } | null>(null);

  const { data: projects, isLoading: projectsLoading } = useListProjects();
  const { data: templates } = useListTemplates();

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        setToken(null);
        setLocation("/login");
      },
    },
  });

  const createMutation = useCreateProject({
    mutation: {
      onSuccess: (newProj: any) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setNewName("");
        setNewDesc("");
        setSelectedTemplate(undefined);
        
        // Redirect directly to dashboard/{projectName}!
        const slug = newProj.name.toLowerCase().replace(/\s+/g, "-");
        setLocation(`/dashboard/${slug}`);
      },
    },
  });

  const deleteMutation = useDeleteProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setProjectToDelete(null);
      },
    },
  });

  const handleDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    setProjectToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate({ id: projectToDelete.id });
    }
  };

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

  const filtered = (Array.isArray(projects) ? projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) : []) as any[];

  if (projectsLoading) {
    return <PlatformLoader fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        {/* Main content split viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-auto bg-muted/10">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Explore Projects (7 columns span) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{t("sidebar.projects")}</h1>
                  <p className="text-muted-foreground text-sm mt-1">Select an active website project to unlock advanced CMS, analytics and commerce tools.</p>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80 transition-all font-medium"
                  />
                </div>

                {/* Projects List Grid */}
                {projectsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="bg-card border rounded-xl p-5 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="bg-card/50 border border-dashed rounded-2xl p-12 text-center space-y-3">
                    <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-foreground">No projects found</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Spin up a brand new website container on the right!</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((p) => {
                      const slug = p.name.toLowerCase().replace(/\s+/g, "-");
                      return (
                        <div
                          key={p.id}
                          onClick={() => setLocation(`/dashboard/${slug}`)}
                          className="bg-card hover:bg-accent/15 border border-border/80 hover:border-primary/45 rounded-2xl p-5 flex flex-col justify-between h-36 cursor-pointer shadow-xs hover:shadow-md transition-all group relative overflow-hidden"
                        >
                          <button
                            onClick={(e) => handleDelete(e, p.id, p.name)}
                            className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="space-y-1.5 min-w-0 pr-6">
                            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {p.name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {p.description || "No description provided."}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              p.published
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}>
                              {p.published ? "Live" : "Draft"}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                              <span>Manage</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <AlertDialogContent className="sm:max-w-[425px] bg-background dark:bg-[#0B101B] border-border/40 p-8 sm:rounded-2xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                      <AlertTriangle className="w-6 h-6 text-red-500 relative z-10" />
                    </div>
                    
                    <AlertDialogHeader className="w-full flex flex-col items-center sm:text-center space-y-3 mb-8">
                      <AlertDialogTitle className="text-2xl font-bold text-foreground dark:text-white tracking-tight">
                        Delete Project?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[15px] text-muted-foreground dark:text-slate-400 leading-relaxed max-w-[320px]">
                        Are you sure you want to delete <strong className="text-foreground dark:text-white font-semibold">{projectToDelete?.name}</strong>? This action is permanent and cannot be undone. It will be removed from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <AlertDialogFooter className="w-full flex sm:flex-row flex-col gap-3 sm:space-x-0">
                      <AlertDialogCancel className="mt-0 flex-1 h-12 rounded-full bg-background dark:bg-transparent border-border dark:border-white/10 hover:bg-accent dark:hover:bg-white/5 text-foreground dark:text-white font-medium transition-colors">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={confirmDelete}
                        className="flex-1 h-12 rounded-full bg-[#ff3b4b] hover:bg-[#ff3b4b]/90 text-white font-semibold border-none shadow-[0_0_20px_rgba(255,59,75,0.3)] hover:shadow-[0_0_25px_rgba(255,59,75,0.4)] transition-all"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              {/* RIGHT COLUMN: Create New Project Form (5 columns span) */}
              <div className="lg:col-span-5 bg-card border border-border/70 rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    New Project
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">Spin up an enterprise Docker mini-server with a secure proxy and SSL dynamically.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g. My Awesome Shop"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80 transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Description (Optional)</label>
                    <textarea
                      placeholder="What is this website about?"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full h-20 px-3.5 py-2.5 rounded-xl border border-border bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80 transition-all font-medium resize-none"
                    />
                  </div>

                  {/* Template Selector Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Select Template (Optional)</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">Blank by default</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                      {templates?.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            selectedTemplate === t.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-muted/10 hover:border-border/80 hover:bg-muted/25"
                          }`}
                        >
                          <p className="text-xs font-bold text-foreground truncate">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{t.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-bold h-11 text-xs tracking-tight shadow-md hover:shadow-lg transition-all"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Spawning server..." : "Create Project Container"}
                  </Button>
                </form>
              </div>

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
