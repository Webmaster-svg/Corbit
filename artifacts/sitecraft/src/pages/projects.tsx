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
  LayoutDashboard, FolderOpen, TrendingUp, Settings, LogOut,
  Package, ShoppingCart, FileEdit
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";

export default function Projects() {
  const { t } = useTranslation();
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

  const filtered = Array.isArray(projects) ? projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) : [];

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
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{t("projects.title")}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {Array.isArray(projects) ? projects.length : 0} {t("projects.sites")}
                </p>
              </div>
              <Button onClick={() => setShowCreate(true)} data-testid="button-create-project">
                <Plus className="w-4 h-4 mr-2" />
                {t("dashboard.new_project")}
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("projects.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>

            {/* Projects grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-xl">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <h3 className="font-semibold mb-1">{search ? t("projects.empty.found") : t("dashboard.no_projects")}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {search ? t("projects.empty.search") : t("projects.empty.create")}
                </p>
                {!search && (
                  <Button onClick={() => setShowCreate(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("templates.dialog.submit")}
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
                              <ExternalLink className="w-3 h-3 mr-1" /> {t("projects.open")}
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
                          <span className="text-xs text-muted-foreground">{project.visitCount} {t("dashboard.visits")}</span>
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
            <DialogTitle>{t("projects.dialog.title")}</DialogTitle>
            <DialogDescription>{t("projects.dialog.desc")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">{t("templates.dialog.label")}</Label>
              <Input
                id="project-name"
                placeholder={t("projects.dialog.placeholder")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                data-testid="input-project-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">{t("projects.dialog.desc_label")}</Label>
              <Input
                id="project-desc"
                placeholder={t("projects.dialog.desc_placeholder")}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                data-testid="input-project-desc"
              />
            </div>
            {Array.isArray(templates) && templates.length > 0 && (
              <div className="space-y-2">
                <Label>{t("projects.dialog.template")}</Label>
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
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>{t("common.cancel")}</Button>
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                {createMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("common.creating")}</> : t("templates.dialog.submit")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("projects.delete.title")}</DialogTitle>
            <DialogDescription>{t("projects.delete.desc")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeletingId(null)}>{t("common.cancel")}</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => { if (deletingId) deleteMutation.mutate({ id: deletingId }); }}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t("projects.delete.loading")}</> : t("projects.delete.submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
