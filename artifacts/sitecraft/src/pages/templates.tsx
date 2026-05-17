import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useListTemplates } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, ArrowRight, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n";

const CATEGORIES = ["all", "business", "portfolio", "ecommerce", "blog", "restaurant", "agency", "landing"];

export default function Templates() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: templates, isLoading } = useListTemplates();

  const filtered = (templates || []).filter((tmpl) => {
    const matchSearch = tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || tmpl.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          <div className="container space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20"
            >
              <Layers className="w-3.5 h-3.5" />
              {(templates || []).length}+ professional templates
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Find your perfect template
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Every template is mobile-ready, fast, and fully customizable. Pick one, make it yours.
            </motion.p>

            {/* Search */}
            <motion.div
              className="relative max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
                data-testid="input-search-templates"
              />
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b">
          <div className="container">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
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
        </section>

        {/* Grid */}
        <section className="py-10 pb-20">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No templates found. Try a different filter.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              >
                <AnimatePresence>
                  {filtered.map((template) => (
                    <motion.div
                      key={template.id}
                      variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all hover:-translate-y-1"
                      data-testid={`card-template-${template.id}`}
                    >
                      <div className="relative overflow-hidden h-44">
                        <img
                          src={template.thumbnailUrl}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${template.id}/400/280`;
                          }}
                        />
                        {template.isPro && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> PRO
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Link href="/register">
                            <Button size="sm" variant="secondary">
                              Use this template <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md capitalize flex-shrink-0">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
