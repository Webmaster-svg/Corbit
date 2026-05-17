import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useGetDashboardSummary, useGetRecentActivity, useListProjects, useLogout, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LayoutDashboard, Globe, FileText, TrendingUp, Plus, FolderOpen, Clock, LogOut, Settings, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ label, value, icon: Icon, sub, color = "primary" }: {
  label: string;
  value: string | number;
  icon: any;
  sub?: string;
  color?: string;
}) {
  return (
    <motion.div
      className="bg-card border rounded-xl p-5 flex items-start justify-between hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
    >
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      <div className={`p-2.5 rounded-lg bg-primary/10`}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </motion.div>
  );
}

const activityIcons: Record<string, any> = {
  project_created: Plus,
  project_published: Globe,
  project_updated: Settings,
  project_deleted: FileText,
  template_used: LayoutDashboard,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Dashboard() {
  const { setToken } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: projects } = useListProjects();

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        setToken(null);
        queryClient.clear();
        setLocation("/");
      },
    },
  });

  const recentProjects = (projects || []).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col border-r bg-sidebar shrink-0">
          <div className="flex-1 px-3 py-6 space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
              { icon: FolderOpen, label: "My Projects", href: "/projects" },
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
                  data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
          <div className="p-3 border-t">
            <button
              onClick={() => logoutMutation.mutate({})}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Welcome back — here's how your sites are doing.</p>
              </div>
              <Link href="/projects">
                <Button data-testid="button-new-project">
                  <Plus className="w-4 h-4 mr-2" />
                  New project
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {summaryLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-card border rounded-xl p-5">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))
              ) : summary ? (
                <>
                  <StatCard label="Total Projects" value={summary.totalProjects} icon={FolderOpen} />
                  <StatCard label="Published" value={summary.publishedProjects} icon={Globe} sub="Live sites" />
                  <StatCard label="Drafts" value={summary.draftProjects} icon={FileText} />
                  <StatCard label="Total Visits" value={summary.totalVisits.toLocaleString()} icon={TrendingUp} sub="All time" />
                </>
              ) : null}
            </motion.div>

            {/* Plan usage */}
            {summary && (
              <motion.div
                className="bg-card border rounded-xl p-5 space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold capitalize">{summary.plan} Plan</span>
                    <span className="text-muted-foreground text-sm ml-2">— Storage usage</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{summary.storageUsedMb} / {summary.storageMaxMb} MB</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((summary.storageUsedMb / summary.storageMaxMb) * 100, 100)}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                {summary.plan === "free" && (
                  <p className="text-xs text-muted-foreground">
                    On the free plan.{" "}
                    <Link href="/pricing" className="text-primary hover:underline">Upgrade to Pro</Link>
                    {" "}for more storage and features.
                  </p>
                )}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <motion.div
                className="bg-card border rounded-xl p-5 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary" />
                    Recent Projects
                  </h2>
                  <Link href="/projects" className="text-xs text-primary hover:underline">View all</Link>
                </div>
                {recentProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No projects yet</p>
                    <Link href="/projects">
                      <Button size="sm" variant="outline" className="mt-3">Create your first site</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentProjects.map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          data-testid={`card-project-${project.id}`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground">{project.visitCount} visits</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            project.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            project.status === "draft" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Activity feed */}
              <motion.div
                className="bg-card border rounded-xl p-5 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Recent Activity
                </h2>
                {activityLoading ? (
                  <div className="space-y-3">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (activity || []).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(activity || []).slice(0, 6).map((item) => {
                      const Icon = activityIcons[item.type] || Activity;
                      return (
                        <div key={item.id} className="flex items-start gap-3" data-testid={`activity-${item.id}`}>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
