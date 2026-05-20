import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Book, ChevronRight, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Docs() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("s1");

  const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" } 
    );

    sections.forEach((i) => {
      const el = document.getElementById(`s${i}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Docs Header */}
      <header className="bg-primary/5 border-b py-12">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{t("docs.title")}</h1>
            <p className="text-muted-foreground">{t("docs.subtitle")}</p>
          </div>
          <div className="relative w-full md:w-96">
            <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              className="w-full pl-9 bg-card border-primary/20" 
              placeholder={t("docs.search.placeholder")}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl py-12">
        <div className="grid md:grid-cols-[260px_1fr] gap-12 items-start">
          
          {/* Docs Sidebar */}
          <aside className="hidden md:block sticky top-24 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 px-4">
              ON THIS PAGE
            </h3>
            {sections.map((i) => (
              <a 
                key={i}
                href={`#s${i}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm",
                  activeSection === `s${i}` 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Hash className="w-3.5 h-3.5" />
                {t(`docs.content.s${i}.title`)}
              </a>
            ))}
          </aside>

          {/* Docs Content */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full mb-4">
                <Book className="w-4 h-4" />
                {t("docs.getting_started")}
              </div>
              
              <h1 className="text-4xl font-bold mb-6">{t("docs.welcome.title")}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("docs.welcome.intro")}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 not-prose mt-12 mb-16">
                {[1, 2, 3, 4].map((i) => (
                  <a href="#" key={i} className="group border rounded-xl p-5 bg-card hover:border-primary/40 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{t(`docs.quickstart.${i}.title`)}</h4>
                      <p className="text-sm text-muted-foreground">{t(`docs.quickstart.${i}.desc`)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>

              {/* Extended Long Content Area */}
              <div className="space-y-16 border-t pt-12">
                {sections.map((i) => (
                  <div id={`s${i}`} key={i} className="scroll-mt-24 space-y-4">
                    <h2 className="text-3xl font-bold border-b pb-4">{t(`docs.content.s${i}.title`)}</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t(`docs.content.s${i}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
