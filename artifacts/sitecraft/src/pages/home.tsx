import { useRef, useEffect, useCallback, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlatformLoader } from "@/components/ui/platform-loader";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Layout, Zap, Globe, Smartphone,
  Star, Palette, ShieldCheck, BarChart3, Layers, MousePointer2,
  Clock, Users, TrendingUp, ChevronRight, Check, X, Sparkles
} from "lucide-react";
import { useListTemplates } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const testimonials = [
  {
    name: "Amira Bensalem",
    roleKey: "testimonial.role.1",
    textKey: "testimonial.text.1",
    rating: 5,
  },
  {
    name: "Karim Hadj",
    roleKey: "testimonial.role.2",
    textKey: "testimonial.text.2",
    rating: 5,
  },
  {
    name: "Sonia Mebarki",
    roleKey: "testimonial.role.3",
    textKey: "testimonial.text.3",
    rating: 5,
  },
  {
    name: "Yacine Ferhat",
    roleKey: "testimonial.role.4",
    textKey: "testimonial.text.4",
    rating: 5,
  },
];

const features = [
  {
    icon: Layout,
    titleKey: "features.editor",
    descKey: "features.editor.desc",
  },
  {
    icon: Palette,
    titleKey: "features.templates",
    descKey: "features.templates.desc",
  },
  {
    icon: Zap,
    titleKey: "features.speed",
    descKey: "features.speed.desc",
  },
  {
    icon: Globe,
    titleKey: "features.domain",
    descKey: "features.domain.desc",
  },
  {
    icon: Smartphone,
    titleKey: "features.responsive",
    descKey: "features.responsive.desc",
  },
  {
    icon: BarChart3,
    titleKey: "features.analytics",
    descKey: "features.analytics.desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "features.secure",
    descKey: "features.secure.desc",
  },
  {
    icon: Users,
    titleKey: "features.support",
    descKey: "features.support.desc",
  },
];

const steps = [
  {
    num: "01",
    icon: Layers,
    titleKey: "how.step1",
    descKey: "how.step1.desc",
  },
  {
    num: "02",
    icon: MousePointer2,
    titleKey: "how.step2",
    descKey: "how.step2.desc",
  },
  {
    num: "03",
    icon: Globe,
    titleKey: "how.step3",
    descKey: "how.step3.desc",
  },
];

const pricingLocalizations: Record<string, any> = {
  en: {
    title: "Simple, transparent pricing",
    subtitle: "Start free. Scale when you're ready.",
    freeLabel: "Free",
    freePrice: "Free",
    freeDesc: "Test Sitecraft isolated environments.",
    starterLabel: "Starter",
    starterPrice: "1,900 DA/mo",
    starterDesc: "For local stores wanting custom branding.",
    starterTrial: "14 Days Free Trial (Without Domain)",
    proLabel: "Pro",
    proPrice: "5,900 DA/mo",
    proDesc: "For fast-growing ventures seeking maximum server power.",
    proDiscount: "20% off first month: 4,720 DA",
    ctaFree: "Get started",
    ctaStarter: "Start Starter — Most popular",
    ctaPro: "Get started",
    features: {
      freeTemplates: "Free templates",
      starterTemplates: "Starter templates",
      allTemplates: "All the templates",
      aiSupport: "Normal support (Chatbot)",
      managerSupport: "Support (talk with managers)",
      adminSupport: "Support (talk with administration)",
      writeCommunity: "Community (read and post)",
      topCommunity: "Community (read, post & post at top)",
      storageFree: "100 MB storage",
      storageStarter: "2 GB storage",
      storagePro: "10 GB storage",
      customDomain: "Custom domain included"
    },
    comparison: "Compare all subscription features"
  },
  fr: {
    title: "Une tarification simple et transparente",
    subtitle: "Commencez gratuitement. Évoluez quand vous êtes prêt.",
    freeLabel: "Gratuit",
    freePrice: "Gratuit",
    freeDesc: "Testez les environnements de Sitecraft.",
    starterLabel: "Starter",
    starterPrice: "1 900 DA/mois",
    starterDesc: "Pour les boutiques locales souhaitant une marque personnalisée.",
    starterTrial: "14 jours d'essai gratuit (sans domaine)",
    proLabel: "Pro",
    proPrice: "5,900 DA/mois",
    proDesc: "Pour les entreprises en croissance rapide.",
    proDiscount: "-20% le 1er mois : 4 720 DA",
    ctaFree: "Commencer",
    ctaStarter: "Essayer Starter — Populaire",
    ctaPro: "Commencer",
    features: {
      freeTemplates: "Templates gratuits",
      starterTemplates: "Templates starter",
      allTemplates: "Tous les templates",
      aiSupport: "Support normal (Chatbot)",
      managerSupport: "Support (discuter avec les managers)",
      adminSupport: "Support (direct avec l'administration)",
      writeCommunity: "Communauté (lecture et écriture)",
      topCommunity: "Communauté (lecture, écriture et posts en haut)",
      storageFree: "100 Mo de stockage",
      storageStarter: "2 Go de stockage",
      storagePro: "10 Go de stockage",
      customDomain: "Domaine personnalisé inclus"
    },
    comparison: "Comparer toutes les fonctionnalités"
  },
  ar: {
    title: "أسعار بسيطة وشفافة",
    subtitle: "ابدأ مجاناً. وقم بالترقية عندما تكون جاهزاً.",
    freeLabel: "مجاني",
    freePrice: "مجاناً",
    freeDesc: "اختبر بيئات عمل Sitecraft المعزولة.",
    starterLabel: "البداية",
    starterPrice: "1,900 د.ج/شهر",
    starterDesc: "للمتاجر المحلية التي تبحث عن هوية مخصصة.",
    starterTrial: "تجربة مجانية 14 يوماً (بدون نطاق)",
    proLabel: "احترافي",
    proPrice: "5,900 د.ج/شهر",
    proDesc: "للمشاريع سريعة النمو التي تبحث عن أقصى أداء.",
    proDiscount: "خصم 20% للشهر الأول: 4,720 د.ج",
    ctaFree: "ابدأ الآن",
    ctaStarter: "ابدأ باقة البداية — الأكثر شعبية",
    ctaPro: "ابدأ الآن",
    features: {
      freeTemplates: "قوالب مجانية",
      starterTemplates: "قوالب البداية",
      allTemplates: "جميع القوالب بلا حدود",
      aiSupport: "دعم عادي (روبوت دردشة)",
      managerSupport: "الدعم (التحدث مع المديرين)",
      adminSupport: "الدعم (التحدث مع الإدارة مباشرة)",
      writeCommunity: "المجتمع (قراءة ونشر)",
      topCommunity: "المجتمع (قراءة ونشر وظهور منشورك في الأعلى)",
      storageFree: "مساحة تخزين 100 ميجابايت",
      storageStarter: "مساحة تخزين 2 جيجابايت",
      storagePro: "مساحة تخزين 10 جيجابايت",
      customDomain: "نطاق مخصص مشمول"
    },
    comparison: "قارن بين كافة ميزات الاشتراسات"
  }
};

export default function Home() {
  const { t, language } = useTranslation();
  const tHomeLocal = pricingLocalizations[language] || pricingLocalizations["en"];

  const homePlans = [
    {
      key: "free",
      name: tHomeLocal.freeLabel,
      price: tHomeLocal.freePrice,
      desc: tHomeLocal.freeDesc,
      cta: tHomeLocal.ctaFree,
      popular: false,
      features: [
        { label: tHomeLocal.features.freeTemplates, included: true },
        { label: tHomeLocal.features.aiSupport, included: true },
        { label: tHomeLocal.features.storageFree, included: true },
        { label: tHomeLocal.features.customDomain, included: false },
        { label: tHomeLocal.features.writeCommunity, included: false }
      ]
    },
    {
      key: "starter",
      name: tHomeLocal.starterLabel,
      price: tHomeLocal.starterPrice,
      desc: tHomeLocal.starterDesc,
      cta: tHomeLocal.ctaStarter,
      popular: true,
      features: [
        { label: tHomeLocal.features.customDomain, included: true },
        { label: tHomeLocal.features.starterTemplates, included: true },
        { label: tHomeLocal.features.storageStarter, included: true },
        { label: tHomeLocal.features.managerSupport, included: true },
        { label: tHomeLocal.features.writeCommunity, included: true }
      ]
    },
    {
      key: "pro",
      name: tHomeLocal.proLabel,
      price: tHomeLocal.proPrice,
      desc: tHomeLocal.proDesc,
      cta: tHomeLocal.ctaPro,
      popular: false,
      features: [
        { label: tHomeLocal.features.customDomain, included: true },
        { label: tHomeLocal.features.allTemplates, included: true },
        { label: tHomeLocal.features.storagePro, included: true },
        { label: tHomeLocal.features.adminSupport, included: true },
        { label: tHomeLocal.features.topCommunity, included: true }
      ]
    }
  ];
  const { data: templates, isLoading } = useListTemplates();
  const { isAuthenticated } = useAuth();
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to guarantee the premium platform loader displays
    const bootTimer = setTimeout(() => setBootLoading(false), 3500);
    return () => clearTimeout(bootTimer);
  }, []);

  let showcaseTemplates = Array.isArray(templates) ? templates.slice(0, 8) : [];
  if (showcaseTemplates.length > 0 && showcaseTemplates.length < 6) {
    // Duplicate showcase templates so they always overflow and trigger horizontal scroll-pinning on large (1920px+) viewports
    showcaseTemplates = [
      ...showcaseTemplates,
      ...showcaseTemplates.map(t => ({
        ...t,
        id: (typeof t.id === "number" ? (t.id as number) + 100 : (t.id as string) + "_dup") as any
      }))
    ];
  }
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const lastWheelTime = useRef(0);
  const [extraHeight, setExtraHeight] = useState(0);

  // Force browser scroll restoration to manual and scroll to top on fresh mount/refresh (with layout paint delay protection)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (typeof window !== "undefined" && !bootLoading && !isLoading) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Scroll immediately
      window.scrollTo(0, 0);

      // Scroll again after React finishes dynamic render paint and expansions
      timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0 });
      }, 50);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [bootLoading, isLoading]);

  // Directly update the progress bar DOM properties to prevent high-frequency React re-renders during scrolls
  const updateProgressDOM = useCallback((progress: number) => {
    if (progressRef.current) {
      const isRTL = document.documentElement.dir === "rtl";
      progressRef.current.style.transformOrigin = isRTL ? "right" : "left";
      progressRef.current.style.transform = `scaleX(${progress})`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.innerText = progress >= 0.98 ? t("templates.keep") : t("templates.explore");
    }
  }, [t]);

  // Measure carousel scroll width dynamically and set wrapper height using ResizeObserver
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const measure = () => {
      const scrollable = carousel.scrollWidth - carousel.clientWidth;
      setExtraHeight(scrollable > 0 ? scrollable * 1.1 : 0); // Multiply by 1.1 for a slightly more relaxed and smooth scroll journey
    };

    const observer = new ResizeObserver(measure);
    observer.observe(carousel);

    // Also observe all children cards to trigger refits if layout elements shift or load
    Array.from(carousel.children).forEach(child => observer.observe(child));

    measure();

    return () => {
      observer.disconnect();
    };
  }, [showcaseTemplates]);

  // Map window scroll inside the wrapper to carousel scrollLeft with strict boundary snaps
  const handleScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    const carousel = carouselRef.current;
    if (!wrapper || !carousel || extraHeight === 0) return;

    // Prevent scroll event race conflicts by ignoring window scrolls during active wheel-scrolling
    if (Date.now() - lastWheelTime.current < 800) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    const scrolledIn = -rect.top;

    if (scrolledIn < 0) {
      updateProgressDOM(0);
      carousel.scrollLeft = 0;
      return;
    }

    const isRTL = document.documentElement.dir === "rtl";
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (scrolledIn > extraHeight) {
      updateProgressDOM(1);
      carousel.scrollLeft = isRTL ? -maxScroll : maxScroll;
      return;
    }

    const progress = scrolledIn / extraHeight;
    updateProgressDOM(progress);
    carousel.scrollLeft = isRTL ? -(progress * maxScroll) : progress * maxScroll;
  }, [extraHeight, updateProgressDOM]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Intercept wheel events on the templates section to freeze vertical page scrolling and translate to smooth horizontal scrolling
  useEffect(() => {
    const section = sectionRef.current;
    const carousel = carouselRef.current;
    if (!section || !carousel) return;

    const handleWheel = (e: WheelEvent) => {
      const isRTL = document.documentElement.dir === "rtl";
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (maxScroll <= 0) return;

      const isScrollingDown = e.deltaY > 0;
      const currentScroll = Math.abs(carousel.scrollLeft);

      if (isScrollingDown) {
        if (currentScroll < maxScroll - 1) {
          e.preventDefault();
          lastWheelTime.current = Date.now(); // Update wheel lock timestamp
          const targetScroll = Math.min(maxScroll, currentScroll + e.deltaY);
          carousel.scrollLeft = isRTL ? -targetScroll : targetScroll;
          updateProgressDOM(targetScroll / maxScroll);
        }
      } else {
        if (currentScroll > 1) {
          e.preventDefault();
          lastWheelTime.current = Date.now(); // Update wheel lock timestamp
          const targetScroll = Math.max(0, currentScroll + e.deltaY);
          carousel.scrollLeft = isRTL ? -targetScroll : targetScroll;
          updateProgressDOM(targetScroll / maxScroll);
        }
      }
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", handleWheel);
    };
  }, [showcaseTemplates, updateProgressDOM, bootLoading]);

  if (isLoading || bootLoading) {
    return <PlatformLoader fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ overflowX: "clip" }}>
      <Navbar />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
            <motion.div
              className="absolute top-20 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-blue-500/8 blur-3xl"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          <div className="container text-center relative z-10 space-y-8 max-w-5xl mx-auto">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {t("stats.v1")} {t("hero.badge")}
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-foreground">{t("hero.title").split(",")[0]},</span>
              <br />
              <span className="gradient-text">{t("hero.title").split(",").slice(1).join(",").trim()}</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="rounded-full h-13 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" data-testid="button-hero-cta">
                  {t("hero.cta.start")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="rounded-full h-13 px-8 text-base font-semibold" data-testid="button-hero-templates">
                  {t("hero.cta.templates")}
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[t("hero.trust.1"), t("hero.trust.2"), t("hero.trust.3")].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Hero browser mockup */}
            <motion.div
              className="relative mx-auto max-w-4xl mt-12"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
                <div className="bg-muted/60 px-4 py-3 flex items-center gap-3 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-background rounded-md px-4 py-1.5 text-xs text-muted-foreground border text-left">
                    getcorbit.com/editor
                  </div>
                </div>
                <div className="h-64 md:h-80 bg-gradient-to-br from-primary/5 via-blue-500/3 to-transparent flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-2 p-4 opacity-20">
                    {Array(48).fill(0).map((_, i) => (
                      <div key={i} className="rounded bg-primary/20" />
                    ))}
                  </div>
                  <div className="relative text-center space-y-3 z-10">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Layout className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">{t("hero.mockup.title")}</div>
                        <div className="text-sm text-muted-foreground">{t("hero.mockup.desc")}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 text-xs font-medium text-primary">{t("hero.mockup.add")}</div>
                      <div className="bg-card border rounded-lg px-3 py-1.5 text-xs font-medium">{t("hero.mockup.preview")}</div>
                      <div className="bg-primary rounded-lg px-3 py-1.5 text-xs font-medium text-primary-foreground">{t("hero.mockup.publish")}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <motion.div
                className="absolute -right-6 top-12 bg-card border rounded-xl shadow-lg p-3 text-xs"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="font-medium">{t("hero.mockup.live")}</span>
                </div>
              </motion.div>
              <motion.div
                className="absolute -left-6 bottom-12 bg-card border rounded-xl shadow-lg p-3 text-xs"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="text-muted-foreground">{t("hero.mockup.visitor")}</div>
                <div className="font-bold text-primary">{t("hero.mockup.today")}</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── LOGOS / TRUST BAR ── */}
        <section className="py-10 border-y bg-muted/30">
          <div className="container">
            <p className="text-center text-sm text-muted-foreground mb-6">{t("trust.title")}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {[t("wilaya.alger"), t("wilaya.oran"), t("wilaya.constantine"), t("wilaya.annaba"), t("wilaya.setif"), t("wilaya.tlemcen"), t("wilaya.bejaia"), t("wilaya.blida")].map((city) => (
                <span key={city} className="text-sm font-semibold text-muted-foreground">{city}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 md:py-32">
          <div className="container">
            <FadeIn className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                {t("features.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("features.title")}</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {t("features.desc")}
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, i) => (
                <FadeIn key={feature.titleKey} delay={i * 0.06}>
                  <motion.div
                    className="bg-card border rounded-xl p-5 space-y-3 h-full hover:border-primary/40 hover:shadow-md transition-all"
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEMPLATE SHOWCASE — sticky-pin horizontal scroll ── */}
        {/*
          Outer wrapper is tall: 100vh (the pinned viewport) + extra scrollable height
          that equals the carousel's overflowing content width.
          As the user scrolls through the wrapper, the inner section stays pinned
          at top:0 via `sticky`, and we map window scroll progress → carousel.scrollLeft.
        */}
        <div
          ref={wrapperRef}
          style={{ height: extraHeight > 0 ? `calc(100vh + ${extraHeight}px)` : "auto" }}
        >
          <section
            ref={sectionRef}
            className="sticky top-0 h-screen flex flex-col justify-center bg-muted/20 border-y overflow-hidden"
          >
            {/* Header */}
            <div className="container mb-10 flex-shrink-0">
              <FadeIn className="flex items-end justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
                    <Layers className="w-3.5 h-3.5" />
                    {t("templates.badge")}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("templates.title")}</h2>
                  <p className="text-muted-foreground max-w-lg">
                    {t("templates.desc")}
                  </p>
                </div>
                <Link href="/templates" className="hidden md:block">
                  <Button variant="outline">
                    {t("templates.cta.all")} <ChevronRight className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                  </Button>
                </Link>
              </FadeIn>
            </div>

            {/* Carousel — overflow hidden, scrollLeft driven by window scroll */}
            {showcaseTemplates.length > 0 ? (
              <div
                ref={carouselRef}
                className="flex gap-5 px-8 overflow-hidden pb-2 flex-shrink-0"
                style={{ willChange: "scroll-position" }}
              >
                {showcaseTemplates.map((tmpl, i) => (
                  <motion.div
                    key={tmpl.id}
                    className="flex-shrink-0 w-64 md:w-80 border rounded-2xl overflow-hidden bg-card hover:shadow-xl group transition-shadow duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={tmpl.thumbnailUrl}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${tmpl.id + 20}/400/300`;
                        }}
                      />
                      {tmpl.isPro && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">PRO</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{tmpl.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{tmpl.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
                    </div>
                  </motion.div>
                ))}
                {/* trailing spacer */}
                <div className="flex-shrink-0 w-16" />
              </div>
            ) : (
              <div className="flex gap-5 px-8 overflow-hidden pb-2 flex-shrink-0">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80 h-60 rounded-2xl border bg-card animate-pulse" />
                ))}
              </div>
            )}

            {/* Progress bar */}
            <div className="container mt-8 flex-shrink-0 flex items-center gap-4">
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-primary rounded-full origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <span
                ref={progressTextRef}
                className="text-xs text-muted-foreground whitespace-nowrap select-none"
              >
                {t("templates.explore")}
              </span>
            </div>

            {/* Mobile CTA */}
            <div className="container mt-5 flex-shrink-0 md:hidden">
              <Link href="/templates">
                <Button variant="outline" className="w-full">
                  {t("templates.cta.browse")} <ChevronRight className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </section>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 md:py-32">
          <div className="container max-w-4xl">
            <FadeIn className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
                <Clock className="w-3.5 h-3.5" />
                {t("how.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("how.title")}</h2>
              <p className="text-muted-foreground text-lg">{t("how.desc")}</p>
            </FadeIn>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <FadeIn key={step.num} delay={i * 0.15}>
                  <motion.div
                    className="flex gap-6 items-start bg-card border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-primary/60 mb-1">{step.num}</div>
                      <h3 className="font-bold text-lg mb-1.5">{t(step.titleKey)}</h3>
                      <p className="text-muted-foreground">{t(step.descKey)}</p>
                    </div>
                    <div className="text-5xl font-black text-primary/5 hidden md:block">{step.num}</div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING PREVIEW ── */}
        <section className="py-24 bg-muted/20 border-y relative overflow-hidden">
          {/* Subtle Ambient light elements */}
          <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container max-w-5xl">
            <FadeIn className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{tHomeLocal.title}</h2>
              <p className="text-muted-foreground text-lg">{tHomeLocal.subtitle}</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {homePlans.map((plan, i) => (
                <FadeIn key={plan.key} delay={i * 0.1}>
                  <div
                    className={`relative rounded-3xl border p-7.5 h-full flex flex-col justify-between gap-8 transition-all duration-300 ${
                      plan.popular
                        ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-650/20 scale-105 z-10"
                        : "bg-white dark:bg-card border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-foreground shadow-sm"
                    }`}
                  >
                    <div className="space-y-6">
                      {/* Category Label */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`block text-xs font-bold uppercase tracking-wider ${
                          plan.popular ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"
                        }`}>
                          {plan.name}
                        </span>
                        {plan.key === "starter" && (
                          <span className="text-[8px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 tracking-wide select-none">
                            {tHomeLocal.starterTrial}
                          </span>
                        )}
                      </div>

                      {/* Price Callout */}
                      <div className="space-y-2 text-left">
                        <h3 className="text-4xl font-extrabold tracking-tight">
                          {plan.price}
                        </h3>
                        {plan.key === "pro" && (
                          <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit select-none">
                            <Sparkles className="w-3 h-3 fill-emerald-500 shrink-0" />
                            <span>{tHomeLocal.proDiscount}</span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className={`h-px ${plan.popular ? "bg-blue-500/60" : "bg-zinc-200 dark:bg-zinc-800"}`} />

                      {/* Features List */}
                      <ul className="space-y-3.5 text-left">
                        {plan.features.map((feature, idx) => {
                          const isIncluded = feature.included;
                          return (
                            <li key={idx} className="flex items-center gap-3 text-xs font-bold leading-normal">
                              {isIncluded ? (
                                <Check className={`w-4 h-4 rounded-full p-0.5 shrink-0 ${
                                  plan.popular 
                                    ? "text-blue-600 bg-white" 
                                    : "text-blue-500 bg-blue-500/10"
                                }`} />
                              ) : (
                                <X className={`w-4 h-4 rounded-full p-0.5 shrink-0 ${
                                  plan.popular 
                                    ? "text-blue-500 bg-blue-700" 
                                    : "text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800"
                                }`} />
                              )}
                              <span className={!isIncluded && !plan.popular ? "text-zinc-400 dark:text-zinc-500 line-through" : ""}>
                                <span className={plan.popular ? "text-white" : "text-zinc-700 dark:text-zinc-300"}>
                                  {feature.label}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Link href="/pricing" className="w-full">
                      <Button
                        className={`w-full font-bold h-11 rounded-full text-xs cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                          plan.popular 
                            ? "bg-white text-blue-600 hover:bg-zinc-100" 
                            : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="text-center mt-12">
              <Link href="/pricing">
                <Button variant="ghost" className="text-muted-foreground hover:bg-transparent hover:text-foreground group text-xs font-bold">
                  {tHomeLocal.comparison} <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 md:py-32">
          <div className="container">
            <FadeIn className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                <Star className="w-3.5 h-3.5 fill-current" />
                {t("testimonials.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("testimonials.title")}</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {t("testimonials.desc")}
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((testi, i) => (
                <FadeIn key={testi.name} delay={i * 0.08}>
                  <motion.div
                    className="bg-card border rounded-xl p-5 space-y-4 h-full hover:shadow-md transition-shadow"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex gap-0.5">
                      {Array(testi.rating).fill(0).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">"{t(testi.textKey)}"</p>
                    <div>
                      <div className="font-semibold text-sm">{testi.name}</div>
                      <div className="text-xs text-muted-foreground">{t(testi.roleKey)}</div>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-200 blur-3xl" />
          </div>
          <div className="container relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
              {[
                { value: t("stats.v1"), label: t("stats.l1") },
                { value: t("stats.v2"), label: t("stats.l2") },
                { value: t("stats.v3"), label: t("stats.l3") },
                { value: t("stats.v4"), label: t("stats.l4") },
              ].map((stat, i) => (
                <FadeIn key={stat.label} delay={i * 0.1}>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                    <div className="text-primary-foreground/70 mt-1 text-sm">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 md:py-32">
          <div className="container max-w-3xl text-center">
            <FadeIn className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t("cta.final.title")}
                <br />
                <span className="gradient-text">{t("cta.final.subtitle")}</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("cta.final.desc")}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                  <Button size="lg" className="rounded-full h-13 px-10 text-base font-semibold shadow-lg shadow-primary/25" data-testid="button-cta-final">
                    {t("cta.final.cta")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="rounded-full h-13 px-8 text-base">
                    {t("cta.final.templates")}
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("cta.final.note")}
              </p>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
