import { useParams, useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  useGetProject, useUpdateProject, usePublishProject, getGetProjectQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Globe, ArrowLeft, ExternalLink, Settings, LayoutDashboard, FolderOpen, TrendingUp, LogOut, CheckCircle2, Clock, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const [, setLocation] = useLocation();
  const { setToken } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const { data: project, isLoading } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) },
  });

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

  const handlePublish = () => {
    publishMutation.mutate({ id: projectId });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: projectId, data: { name: editName } });
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
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <Link href="/projects">
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
                </button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : !project ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Project not found.</p>
                <Link href="/projects">
                  <Button variant="outline" className="mt-4">Back to projects</Button>
                </Link>
              </div>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    {editing ? (
                      <form onSubmit={handleUpdate} className="flex gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-xl font-bold"
                          data-testid="input-edit-name"
                        />
                        <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <button
                          onClick={() => { setEditName(project.name); setEditing(true); }}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          data-testid="button-edit-name"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {project.description && <p className="text-muted-foreground">{project.description}</p>}
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium flex-shrink-0 flex items-center gap-1.5 ${
                    project.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {project.status === "published" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {project.status}
                  </span>
                </div>

                {/* Preview */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2.5 border-b flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-background border rounded-md px-3 py-1 text-xs text-muted-foreground">
                      {project.domain || `${project.name.toLowerCase().replace(/\s+/g, "-")}.sitecraft.dz`}
                    </div>
                    {project.status === "published" && (
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="h-48 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent flex items-center justify-center">
                    <div className="text-center space-y-2 opacity-50">
                      <Globe className="w-10 h-10 mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Site preview</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Visits", value: project.visitCount.toLocaleString() },
                    { label: "Pages", value: project.pageCount },
                    { label: "Created", value: new Date(project.createdAt).toLocaleDateString() },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-card border rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="bg-card border rounded-xl p-5 space-y-4">
                  <h2 className="font-semibold">Actions</h2>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handlePublish}
                      disabled={publishMutation.isPending}
                      variant={project.status === "published" ? "outline" : "default"}
                      data-testid="button-publish"
                    >
                      {publishMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                      ) : project.status === "published" ? (
                        <><Clock className="w-4 h-4 mr-2" /> Unpublish</>
                      ) : (
                        <><Globe className="w-4 h-4 mr-2" /> Publish site</>
                      )}
                    </Button>
                    {project.domain && (
                      <Button variant="outline" asChild>
                        <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit site
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
