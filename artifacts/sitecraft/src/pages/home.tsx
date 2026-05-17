import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Layout, Zap, Globe, Smartphone,
  Star, Palette, ShieldCheck, BarChart3, Layers, MousePointer2,
  Clock, Users, TrendingUp, ChevronRight
} from "lucide-react";
import { useListTemplates } from "@workspace/api-client-react";

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
    role: "Boutique owner, Alger",
    text: "I launched my online store in one afternoon. My customers now order directly from my site — it changed everything.",
    rating: 5,
  },
  {
    name: "Karim Hadj",
    role: "Architect, Oran",
    text: "The portfolio templates are stunning. My clients are always impressed when I share my Corbit portfolio.",
    rating: 5,
  },
  {
    name: "Sonia Mebarki",
    role: "Restaurant owner, Constantine",
    text: "We had zero technical experience. Now our restaurant has a beautiful website with online reservations.",
    rating: 5,
  },
  {
    name: "Yacine Ferhat",
    role: "Freelance designer, Annaba",
    text: "I use Corbit for all my clients now. The editor is fast, the templates are professional, and support is excellent.",
    rating: 5,
  },
];

const features = [
  {
    icon: Layout,
    title: "Drag-and-Drop Editor",
    desc: "Build pages visually without writing a single line of code. Move, resize, and style every element.",
  },
  {
    icon: Palette,
    title: "Premium Templates",
    desc: "50+ professionally designed templates for every industry — from restaurants to e-commerce stores.",
  },
  {
    icon: Zap,
    title: "Blazing Fast Performance",
    desc: "Sites load in under 2 seconds. Optimized hosting on global CDN keeps your visitors engaged.",
  },
  {
    icon: Globe,
    title: "Custom Domain (.dz)",
    desc: "Connect your .dz domain or use our free subdomain. SSL certificate included at no extra cost.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Every template adapts perfectly to phones, tablets, and desktops — no extra work needed.",
  },
  {
    icon: BarChart3,
    title: "Built-in Analytics",
    desc: "See how many visitors you get, where they're from, and which pages they love most.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    desc: "99.9% uptime SLA, automatic backups, and enterprise-grade security included.",
  },
  {
    icon: Users,
    title: "Algerian Support",
    desc: "Our local team speaks Arabic, French, and English. We're here when you need us.",
  },
];

const steps = [
  {
    num: "01",
    icon: Layers,
    title: "Choose a template",
    desc: "Browse 50+ templates built for Algerian businesses. Filter by industry and pick your favourite.",
  },
  {
    num: "02",
    icon: MousePointer2,
    title: "Customize everything",
    desc: "Use our visual editor to change colours, fonts, images, and text — all in real time.",
  },
  {
    num: "03",
    icon: Globe,
    title: "Publish to the world",
    desc: "Hit publish and your site goes live instantly on fast, secure global hosting.",
  },
];

export default function Home() {
  const { t } = useTranslation();
  const { data: templates } = useListTemplates();
  const showcaseTemplates = (templates || []).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
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
              5,000+ Algerian businesses online
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
              <Link href="/register">
                <Button size="lg" className="h-13 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" data-testid="button-hero-cta">
                  {t("hero.cta.start")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold" data-testid="button-hero-templates">
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
              {["No credit card required", "Free plan forever", "Setup in 5 minutes"].map((badge) => (
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
                    sitecraft.dz/editor
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
                        <div className="font-bold text-lg">Site Editor</div>
                        <div className="text-sm text-muted-foreground">Drag, drop, publish</div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 text-xs font-medium text-primary">+ Add block</div>
                      <div className="bg-card border rounded-lg px-3 py-1.5 text-xs font-medium">Preview</div>
                      <div className="bg-primary rounded-lg px-3 py-1.5 text-xs font-medium text-primary-foreground">Publish</div>
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
                  <span className="font-medium">Live now</span>
                </div>
              </motion.div>
              <motion.div
                className="absolute -left-6 bottom-12 bg-card border rounded-xl shadow-lg p-3 text-xs"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="text-muted-foreground">New visitor</div>
                <div className="font-bold text-primary">+1,247 today</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── LOGOS / TRUST BAR ── */}
        <section className="py-10 border-y bg-muted/30">
          <div className="container">
            <p className="text-center text-sm text-muted-foreground mb-6">Trusted by businesses across Algeria's 48 wilayas</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {["Alger", "Oran", "Constantine", "Annaba", "Sétif", "Tlemcen", "Béjaïa", "Blida"].map((city) => (
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
                Powerful platform
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("features.title")}</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Everything you need to build, launch, and grow your online presence in Algeria.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, i) => (
                <FadeIn key={feature.title} delay={i * 0.06}>
                  <motion.div
                    className="bg-card border rounded-xl p-5 space-y-3 h-full hover:border-primary/40 hover:shadow-md transition-all"
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEMPLATE SHOWCASE ── */}
        <section className="py-24 bg-muted/20 border-y overflow-hidden">
          <div className="container mb-12">
            <FadeIn className="flex items-end justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
                  <Layers className="w-3.5 h-3.5" />
                  Templates
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Start from a great template</h2>
                <p className="text-muted-foreground max-w-lg">
                  Every template is mobile-ready, fast, and fully customizable. Pick one and make it yours in minutes.
                </p>
              </div>
              <Link href="/templates" className="hidden md:block">
                <Button variant="outline">
                  All templates <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </FadeIn>
          </div>

          {showcaseTemplates.length > 0 ? (
            <div className="flex gap-5 px-8 overflow-x-auto pb-4 scrollbar-none">
              {showcaseTemplates.map((tmpl, i) => (
                <FadeIn key={tmpl.id} delay={i * 0.08}>
                  <motion.div
                    className="flex-shrink-0 w-64 md:w-72 border rounded-xl overflow-hidden bg-card hover:shadow-lg group transition-all"
                    whileHover={{ y: -6 }}
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={tmpl.thumbnailUrl}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${tmpl.id + 20}/400/280`;
                        }}
                      />
                      {tmpl.isPro && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">PRO</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm">{tmpl.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{tmpl.category}</p>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="flex gap-5 px-8 overflow-x-auto pb-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-72 h-56 rounded-xl border bg-card" />
              ))}
            </div>
          )}

          <div className="container mt-8 md:hidden">
            <Link href="/templates">
              <Button variant="outline" className="w-full">
                Browse all templates <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 md:py-32">
          <div className="container max-w-4xl">
            <FadeIn className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
                <Clock className="w-3.5 h-3.5" />
                Simple process
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("how.title")}</h2>
              <p className="text-muted-foreground text-lg">Three steps. Five minutes. Your site is live.</p>
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
                      <h3 className="font-bold text-lg mb-1.5">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                    <div className="text-5xl font-black text-primary/5 hidden md:block">{step.num}</div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING PREVIEW ── */}
        <section className="py-24 bg-muted/20 border-y">
          <div className="container max-w-5xl">
            <FadeIn className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("pricing.title")}</h2>
              <p className="text-muted-foreground text-lg">Start free. Scale when you're ready.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: t("pricing.free"), price: "Free", features: ["1 website", "5 templates", "100 MB storage", "Corbit subdomain"] },
                { name: t("pricing.pro"), price: "2,490 DA/mo", features: ["10 websites", "All templates", "2 GB storage", "Custom domain", "E-commerce", "Analytics"], highlight: true },
                { name: t("pricing.business"), price: "7,900 DA/mo", features: ["Unlimited websites", "10 GB storage", "API access", "Dedicated support", "White-label"] },
              ].map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 0.1}>
                  <div className={`rounded-2xl border p-6 space-y-5 h-full flex flex-col ${plan.highlight ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20" : "bg-card"}`}>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <div className="text-3xl font-bold mt-1">{plan.price}</div>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} />
                          <span className={plan.highlight ? "text-primary-foreground/90" : ""}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.highlight ? "/register" : "/pricing"}>
                      <Button
                        variant={plan.highlight ? "secondary" : "outline"}
                        className="w-full"
                        data-testid={`button-pricing-${plan.name}`}
                      >
                        {plan.highlight ? "Start Pro free" : "Get started"}
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="text-center mt-8">
              <Link href="/pricing">
                <Button variant="ghost" className="text-muted-foreground">
                  See full pricing comparison <ChevronRight className="w-4 h-4 ml-1" />
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
                4.9/5 average rating
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Loved by Algerian entrepreneurs</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Real businesses, real results. See what our customers are saying.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t, i) => (
                <FadeIn key={t.name} delay={i * 0.08}>
                  <motion.div
                    className="bg-card border rounded-xl p-5 space-y-4 h-full hover:shadow-md transition-shadow"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex gap-0.5">
                      {Array(t.rating).fill(0).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
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
                { value: "5,000+", label: "Websites launched" },
                { value: "48", label: "Wilayas covered" },
                { value: "99.9%", label: "Uptime" },
                { value: "< 5 min", label: "Average setup time" },
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
                Your business deserves
                <br />
                <span className="gradient-text">a great website.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Join 5,000+ Algerian entrepreneurs who chose Corbit to build their online presence.
                Start free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-13 px-10 text-base font-semibold shadow-lg shadow-primary/25" data-testid="button-cta-final">
                    Start building for free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="h-13 px-8 text-base">
                    Browse templates
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Free forever plan available. No credit card required.
              </p>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
