import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListTemplates } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Search, ExternalLink, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

export default function Templates() {
  const { data: templates, isLoading } = useListTemplates();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ecommerce" | "pro" | "free">("all");

  const filteredTemplates = Array.isArray(templates)
    ? templates.filter((tmpl: any) => {
        const matchesSearch =
          tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tmpl.tags && tmpl.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesCategory =
          selectedCategory === "all" ||
          (selectedCategory === "ecommerce" && tmpl.category.toLowerCase() === "ecommerce") ||
          (selectedCategory === "pro" && tmpl.isPro) ||
          (selectedCategory === "free" && !tmpl.isPro);

        return matchesSearch && matchesCategory;
      })
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 text-center overflow-hidden border-b bg-muted/20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          {/* Neon Glow Circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

          <div className="container space-y-6 max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explore Premium Themes
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Professional Website <span className="gradient-text">Themes</span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Deploy fully responsive, lightning-fast e-commerce stores and portfolios to your isolated virtual server instantly.
            </motion.p>
          </div>
        </section>

        {/* Filter and Search controls */}
        <section className="py-8 bg-card border-b sticky top-[64px] z-30 backdrop-blur-md bg-card/85">
          <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category selection */}
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              {[
                { id: "all", label: "All Themes" },
                { id: "ecommerce", label: "E-Commerce" },
                { id: "pro", label: "Premium (PRO)" },
                { id: "free", label: "Free to Use" }
              ].map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className="rounded-full px-5 h-9 font-semibold text-xs cursor-pointer"
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search themes or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-full bg-muted/20 border-border text-xs focus-visible:ring-primary focus-visible:ring-1"
              />
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-16 bg-muted/10 min-h-[400px]">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-card border rounded-2xl overflow-hidden aspect-[16/14] space-y-4 p-4">
                    <div className="w-full aspect-[16/10] bg-muted animate-pulse rounded-xl" />
                    <div className="h-4 bg-muted animate-pulse w-3/4 rounded" />
                    <div className="h-3 bg-muted animate-pulse w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((t: any, i: number) => (
                  <motion.div
                    key={t.id}
                    className="group bg-card border rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col hover:border-primary/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                      <img
                        src={t.thumbnailUrl}
                        alt={t.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${t.id + 10}/600/400`;
                        }}
                      />
                      
                      {/* Overlay and badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-between p-4.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-black/40 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                            {t.category}
                          </span>
                          {t.isPro && (
                            <span className="text-[9px] font-extrabold tracking-widest uppercase bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full shadow-sm">
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {t.tags && t.tags.map((tag: string) => (
                            <span key={tag} className="text-[9px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Information */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-extrabold text-base text-foreground leading-tight group-hover:text-primary transition-colors text-left">
                          {t.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed text-left">
                          {t.description}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Link href={`/preview/${t.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 rounded-xl font-bold border border-border hover:bg-accent/30 text-xs gap-1.5 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Preview
                          </Button>
                        </Link>
                        <Link href={isAuthenticated ? "/dashboard" : `/register?templateId=${t.id}`} className="flex-1">
                          <Button
                            size="sm"
                            className="w-full h-9 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
                          >
                            Use Theme
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border rounded-2xl max-w-md mx-auto space-y-3 px-4">
                <Search className="w-10 h-10 mx-auto text-muted-foreground animate-bounce" />
                <h3 className="font-bold text-base text-foreground">No Themes Found</h3>
                <p className="text-xs text-muted-foreground">
                  We couldn't find any themes matching your search query. Try broadening your keywords!
                </p>
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="cursor-pointer">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
