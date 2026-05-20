import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Legal() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("terms");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update active section when it intersects
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // Trigger when the element crosses the middle of the screen
      { rootMargin: "-20% 0px -60% 0px" } 
    );

    const terms = document.getElementById("terms");
    const privacy = document.getElementById("privacy");
    
    if (terms) observer.observe(terms);
    if (privacy) observer.observe(privacy);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 pb-24">
        <section className="bg-muted/20 border-b py-16">
          <div className="container max-w-4xl space-y-4 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2"
            >
              <ShieldCheck className="w-8 h-8" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight"
            >
              {t("legal.title")}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              {t("legal.subtitle")}
            </motion.p>
          </div>
        </section>

        <section className="container max-w-4xl py-16">
          <div className="grid md:grid-cols-[240px_1fr] gap-12 items-start">
            
            {/* Sidebar Nav */}
            <aside className="sticky top-24 space-y-1">
              <a 
                href="#terms" 
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors",
                  activeSection === "terms" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <FileText className="w-4 h-4" />
                {t("legal.nav.terms")}
              </a>
              <a 
                href="#privacy" 
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors",
                  activeSection === "privacy" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Lock className="w-4 h-4" />
                {t("legal.nav.privacy")}
              </a>
            </aside>

            {/* Content Body */}
            <div className="prose prose-blue dark:prose-invert max-w-none space-y-12">
              <div id="terms" className="scroll-mt-24 space-y-6">
                <h2 className="text-3xl font-bold border-b pb-4">{t("legal.terms.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("legal.terms.intro")}</p>
                
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <h3 className="text-xl font-semibold mt-8 mb-3">{t(`legal.terms.s${i}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t(`legal.terms.s${i}.desc`)}</p>
                  </div>
                ))}
              </div>

              <div id="privacy" className="scroll-mt-24 space-y-6 pt-12 border-t">
                <h2 className="text-3xl font-bold border-b pb-4">{t("legal.privacy.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("legal.privacy.intro")}</p>
                
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <h3 className="text-xl font-semibold mt-8 mb-3">{t(`legal.privacy.s${i}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t(`legal.privacy.s${i}.desc`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
