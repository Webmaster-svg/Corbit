import React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { Layers, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t } = useTranslation();
  const [location] = useLocation();

  // Helper to check if a link is active
  const isActive = (path: string) => {
    // Prevent hash links (like /legal#terms) from highlighting simultaneously in the footer
    if (path.includes('#')) {
      return false;
    }
    return location === path;
  };

  return (
    <footer className="relative border-t py-20 bg-background overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300">
                <Layers className="w-7 h-7 text-primary" />
              </div>
              <span className="font-bold text-3xl tracking-tight">Corbit</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
              {t("footer.desc")}
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-4 lg:col-span-2 lg:col-start-7">
            <h3 className="font-semibold mb-6 text-foreground">{t("footer.product")}</h3>
            <ul className="space-y-4">
              {[
                { path: "/templates", label: t("nav.templates") },
                { path: "/pricing", label: t("nav.pricing") },
                { path: "/docs", label: t("footer.docs") }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.path} 
                    className={cn(
                      "transition-colors",
                      isActive(link.path) 
                        ? "text-primary font-medium" 
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-semibold mb-6 text-foreground">{t("footer.company")}</h3>
            <ul className="space-y-4">
              {[
                { path: "/about", label: t("footer.about") },
                { path: "/community", label: t("footer.community") },
                { path: "/help", label: t("footer.help") }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.path} 
                    className={cn(
                      "transition-colors",
                      isActive(link.path) 
                        ? "text-primary font-medium" 
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-semibold mb-6 text-foreground">{t("footer.legal")}</h3>
            <ul className="space-y-4">
              {[
                { path: "/legal#terms", label: t("footer.terms") },
                { path: "/legal#privacy", label: t("footer.privacy") }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.path} 
                    className={cn(
                      "transition-colors",
                      isActive(link.path) 
                        ? "text-primary font-medium" 
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
