import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Zap, 
  Sparkles, 
  Server, 
  Globe, 
  ShieldCheck, 
  HeartHandshake, 
  Link2, 
  Star, 
  BadgeCheck,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  FileText
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// Multi-lingual translations for high fidelity
const localizations: Record<string, any> = {
  en: {
    badge: "Platform Subscriptions",
    title: "Simple, transparent pricing",
    desc: "Start free. Scale when you're ready.",
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
    popularBadge: "Starter — Most popular",
    ctaFree: "Get started",
    ctaStarter: "Start Starter — Most popular",
    ctaPro: "Get started",
    features: {
      customDomain: "Custom domain included",
      noCustomDomain: "No Custom domain",
      freeTemplates: "Free templates",
      starterTemplates: "Starter templates",
      allTemplates: "All the templates",
      aiSupport: "Normal support (Chatbot)",
      managerSupport: "Support (talk with managers)",
      adminSupport: "Support (talk with administration)",
      readCommunity: "Community (only read)",
      writeCommunity: "Community (read and post)",
      topCommunity: "Community (read, post & post at top)",
      storageFree: "100 MB storage",
      storageStarter: "2 GB storage",
      storagePro: "10 GB storage"
    },
    offersTitle: "🎁 Special Long-Term Package Deals",
    offersDesc: "Get massive upfront savings on complete 12 and 24-month custom domain and hosting setups.",
    offerBadge1: "24 MONTHS",
    offerBadge2: "12 MONTHS",
    ecommerceOfferTitle: "E-Commerce Suite Package",
    ecommerceOfferDesc: "A complete custom-domain webshop setup ready to accept payments across Algeria.",
    elearningOfferTitle: "E-Learning Hub Platform",
    elearningOfferDesc: "Host and sell courses on an isolated educational hub.",
    portfolioOfferTitle: "Creative Portfolio Showcase",
    portfolioOfferDesc: "Display your work beautifully to worldwide clients.",
    onepageOfferTitle: "One-Page Landing Showcase",
    onepageOfferDesc: "Capture leads and promote products on a single optimized page."
  },
  fr: {
    badge: "Abonnements Plateforme",
    title: "Une tarification simple et transparente",
    desc: "Commencez gratuitement. Évoluez quand vous êtes prêt.",
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
    popularBadge: "Starter — Le plus populaire",
    ctaFree: "Commencer",
    ctaStarter: "Essayer Starter — Populaire",
    ctaPro: "Commencer",
    features: {
      customDomain: "Domaine personnalisé inclus",
      noCustomDomain: "Pas de domaine personnalisé",
      freeTemplates: "Templates gratuits",
      starterTemplates: "Templates starter",
      allTemplates: "Tous les templates",
      aiSupport: "Support normal (Chatbot)",
      managerSupport: "Support (discuter avec les managers)",
      adminSupport: "Support (direct avec l'administration)",
      readCommunity: "Communauté (lecture seule)",
      writeCommunity: "Communauté (lecture et écriture)",
      topCommunity: "Communauté (lecture, écriture et posts en haut)",
      storageFree: "100 Mo de stockage",
      storageStarter: "2 Go de stockage",
      storagePro: "10 Go de stockage"
    },
    offersTitle: "🎁 Offres Spéciales Long Terme",
    offersDesc: "Bénéficiez de réductions massives avec des packs d'hébergement et de domaines personnalisés sur 12 et 24 mois.",
    offerBadge1: "24 MOIS",
    offerBadge2: "12 MOIS",
    ecommerceOfferTitle: "Pack E-Commerce Complet",
    ecommerceOfferDesc: "Une boutique personnalisée prête à accepter des paiements en Algérie.",
    elearningOfferTitle: "Plateforme E-Learning",
    elearningOfferDesc: "Hébergez et vendez des cours sur un portail éducatif isolé.",
    portfolioOfferTitle: "Portfolio Vitrine Showcase",
    portfolioOfferDesc: "Affichez vos travaux de manière premium pour des clients mondiaux.",
    onepageOfferTitle: "Page Unique Promotionnelle",
    onepageOfferDesc: "Capturez des leads et vendez un produit sur une seule page optimisée."
  },
  ar: {
    badge: "اشتراكات المنصة",
    title: "أسعار بسيطة وشفافة",
    desc: "ابدأ مجاناً. وقم بالترقية عندما تكون جاهزاً.",
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
    popularBadge: "البداية — الأكثر طلباً",
    ctaFree: "ابدأ الآن",
    ctaStarter: "ابدأ باقة البداية — الأكثر شعبية",
    ctaPro: "ابدأ الآن",
    features: {
      customDomain: "نطاق مخصص مشمول",
      noCustomDomain: "بدون نطاق مخصص",
      freeTemplates: "قوالب مجانية",
      starterTemplates: "قوالب البداية",
      allTemplates: "جميع القوالب بلا حدود",
      aiSupport: "دعم عادي (روبوت دردشة)",
      managerSupport: "الدعم (التحدث مع المديرين)",
      adminSupport: "الدعم (التحدث مع الإدارة مباشرة)",
      readCommunity: "المجتمع (قراءة فقط)",
      writeCommunity: "المجتمع (قراءة ونشر)",
      topCommunity: "المجتمع (قراءة ونشر وظهور منشورك في الأعلى)",
      storageFree: "مساحة تخزين 100 ميجابايت",
      storageStarter: "مساحة تخزين 2 جيجابايت",
      storagePro: "مساحة تخزين 10 جيجابايت"
    },
    offersTitle: "🎁 عروض وباقات خاصة طويلة الأمد",
    offersDesc: "وفر الكثير مع باقات الاستضافة وحجز النطاق المخصصة المسبقة الدفع لمدة 12 و 24 شهراً.",
    offerBadge1: "24 شهراً",
    offerBadge2: "12 شهراً",
    ecommerceOfferTitle: "باقة متجر إلكتروني متكامل",
    ecommerceOfferDesc: "متجر إلكتروني متكامل جاهز لاستقبال الطلبات وتفعيل الدفع في الجزائر.",
    elearningOfferTitle: "منصة التعليم والتدريس",
    elearningOfferDesc: "قم برفع وبيع دوراتك التدريسية على مساحة تعليمية معزولة بالكامل.",
    portfolioOfferTitle: "معرض أعمال إبداعي",
    portfolioOfferDesc: "اعرض مهاراتك وأعمالك لعملائك حول العالم بشكل احترافي.",
    onepageOfferTitle: "صفحة هبوط تسويقية",
    onepageOfferDesc: "اجمع بيانات عملائك أو سوق لمنتجك عبر صفحة واحدة فائقة السرعة."
  }
};

export default function Pricing() {
  const { language } = useTranslation();
  
  // Resolve localized texts
  const tLocal = localizations[language] || localizations["en"];

  const corePlans = [
    {
      key: "free",
      name: tLocal.freeLabel,
      price: tLocal.freePrice,
      desc: tLocal.freeDesc,
      cta: tLocal.ctaFree,
      popular: false,
      features: [
        { label: tLocal.features.freeTemplates, included: true },
        { label: tLocal.features.aiSupport, included: true },
        { label: tLocal.features.storageFree, included: true },
        { label: tLocal.features.customDomain, included: false },
        { label: tLocal.features.writeCommunity, included: false }
      ]
    },
    {
      key: "starter",
      name: tLocal.starterLabel,
      price: tLocal.starterPrice,
      desc: tLocal.starterDesc,
      cta: tLocal.ctaStarter,
      popular: true, // Styled solid blue middle card!
      features: [
        { label: tLocal.features.customDomain, included: true },
        { label: tLocal.features.starterTemplates, included: true },
        { label: tLocal.features.storageStarter, included: true },
        { label: tLocal.features.managerSupport, included: true },
        { label: tLocal.features.writeCommunity, included: true }
      ]
    },
    {
      key: "pro",
      name: tLocal.proLabel,
      price: tLocal.proPrice,
      desc: tLocal.proDesc,
      cta: tLocal.ctaPro,
      popular: false,
      features: [
        { label: tLocal.features.customDomain, included: true },
        { label: tLocal.features.allTemplates, included: true },
        { label: tLocal.features.storagePro, included: true },
        { label: tLocal.features.adminSupport, included: true },
        { label: tLocal.features.topCommunity, included: true }
      ]
    }
  ];

  const bundleOffers = [
    {
      title: tLocal.ecommerceOfferTitle,
      price: "30,000 DA",
      badge: tLocal.offerBadge1,
      desc: tLocal.ecommerceOfferDesc,
      icon: <ShoppingBag className="w-5 h-5 text-blue-500 animate-pulse" />,
      colorClass: "from-blue-600/10 via-indigo-600/5 to-transparent border-blue-500/20",
      bulletColor: "text-blue-500",
      bullets: {
        en: [
          "Free Custom .DZ Domain included",
          "24 Months High-Speed Docker hosting",
          "Premium E-Commerce Theme with live checkout",
          "Integrated local Algeria shipping support"
        ],
        fr: [
          "Nom de domaine .DZ personnalisé offert",
          "Hébergement Docker haute vitesse sur 24 mois",
          "Thème e-commerce premium avec panier interactif",
          "Support d'expédition locale intégré"
        ],
        ar: [
          "نطاق جزائري مخصص .DZ مجاني بالكامل",
          "استضافة سحابية Docker فائقة السرعة لمدة 24 شهراً",
          "قالب متجر إلكتروني احترافي مع سلة شراء حية",
          "دعم شركات الشحن والتوصيل الجزائرية داخلياً"
        ]
      }
    },
    {
      title: tLocal.elearningOfferTitle,
      price: "24,000 DA",
      badge: tLocal.offerBadge1,
      desc: tLocal.elearningOfferDesc,
      icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
      colorClass: "from-indigo-600/10 via-purple-600/5 to-transparent border-indigo-500/20",
      bulletColor: "text-indigo-500",
      bullets: {
        en: [
          "Free Custom Domain name (.dz / .com)",
          "24 Months Educational hosting & stream server",
          "Educational LMS portal theme with chapters",
          "Supports up to 10,000 active students"
        ],
        fr: [
          "Nom de domaine offert (.dz / .com)",
          "24 mois d'hébergement LMS avec streaming",
          "Thème de portail de cours interactifs complet",
          "Capacité jusqu'à 10 000 étudiants actifs"
        ],
        ar: [
          "نطاق مخصص مجاني بالكامل (.dz / .com)",
          "استضافة منصة تعليمية ودعم بث فيديو لمدة 24 شهراً",
          "قالب مركز تعليمي متطور لدعم الفصول والدروس",
          "يدعم وصول لغاية 10,000 طالب نشط معاً"
        ]
      }
    },
    {
      title: tLocal.portfolioOfferTitle,
      price: "7,000 DA",
      badge: tLocal.offerBadge2,
      desc: tLocal.portfolioOfferDesc,
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      colorClass: "from-emerald-600/10 via-teal-600/5 to-transparent border-emerald-500/20",
      bulletColor: "text-emerald-500",
      bullets: {
        en: [
          "Free Custom Domain (.com / .dz)",
          "12 Months Premium Docker workspace hosting",
          "Stunning creative showcase layout theme",
          "High-speed Global CDN for media load"
        ],
        fr: [
          "Nom de domaine personnalisé offert (.com / .dz)",
          "Hébergement de conteneur premium 12 mois",
          "Thème vitrine ultra design et créatif",
          "CDN mondial pour un chargement média instantané"
        ],
        ar: [
          "نطاق مخصص مجاني بالكامل (.dz / .com)",
          "استضافة مساحة عمل Docker ممتازة لمدة 12 شهراً",
          "تصاميم قوالب استعراض أعمال عصرية ومبهرة",
          "شبكة CDN عالمية لسرعة تحميل الصور والمرفقات"
        ]
      }
    },
    {
      title: tLocal.onepageOfferTitle,
      price: "4,000 DA",
      badge: tLocal.offerBadge2,
      desc: tLocal.onepageOfferDesc,
      icon: <FileText className="w-5 h-5 text-amber-500" />,
      colorClass: "from-amber-600/10 via-orange-600/5 to-transparent border-amber-500/20",
      bulletColor: "text-amber-500",
      bullets: {
        en: [
          "Free Custom Domain name (.com)",
          "12 Months High-Performance Docker hosting",
          "High-conversion Landing Page template theme",
          "Direct lead capture database spreadsheet"
        ],
        fr: [
          "Nom de domaine offert (.com)",
          "Hébergement performant 12 mois",
          "Thème d'atterrissage à fort taux de conversion",
          "Base de données de capture de leads intégrée"
        ],
        ar: [
          "نطاق مخصص مجاني بالكامل (.com)",
          "استضافة خادم Docker عالية الكفاءة لمدة 12 شهراً",
          "قالب صفحة هبوط ذات تحويل عالي للطلبات",
          "قاعدة بيانات حية لتتبع وتخزين بيانات العملاء"
        ]
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1">
        {/* ── HERO BANNER ── */}
        <section className="py-20 md:py-24 text-center relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
          {/* Subtle Ambient light elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/10 blur-3xl -z-10" />
          
          <div className="container px-6 space-y-4">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {tLocal.title}
            </motion.h1>
            
            <motion.p
              className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {tLocal.desc}
            </motion.p>
          </div>
        </section>

        {/* ── CORE PLANS GRID (MATCHING THE SCREENSHOT EXACTLY) ── */}
        <section className="pb-24">
          <div className="container px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
              {corePlans.map((plan) => (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className={`relative rounded-3xl border p-7.5 flex flex-col justify-between gap-8 transition-all duration-300 ${
                    plan.popular
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-650/20 scale-105 z-10"
                      : "bg-white dark:bg-card border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-foreground shadow-sm"
                  }`}
                >
                  <div className="space-y-6">
                    {/* Category Label */}
                    {/* Category Label */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`block text-xs font-bold uppercase tracking-wider ${
                        plan.popular ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"
                      }`}>
                        {plan.name}
                      </span>
                      {plan.key === "starter" && (
                        <span className="text-[8px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 tracking-wide select-none">
                          {tLocal.starterTrial}
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
                          <span>{tLocal.proDiscount}</span>
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
                  <Link href={`/checkout?plan=${plan.key}`} className="w-full">
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REDESIGNED BUNDLE OFFERS GRID (ULTRA-HARMONIOUS VERTICAL CARDS) ── */}
        <section className="py-24 bg-muted/20 border-t border-border/40 relative overflow-hidden">
          {/* Radial blur ambient background glows */}
          <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container px-6 max-w-6xl mx-auto space-y-16 relative z-10">
            
            {/* Offers Header */}
            <div className="text-center space-y-3.5 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-2">
                {tLocal.offersTitle}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLocal.offersDesc}
              </p>
            </div>

            {/* Offers Grid: 2x2 of Beautiful, Balanced, and Harmonious Vertical Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {bundleOffers.map((offer, idx) => {
                const bulletList = offer.bullets[language as "en" | "fr" | "ar"] || offer.bullets.en;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group relative flex flex-col justify-between p-6.5 rounded-3xl bg-card border border-border/30 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Active Corner Glow element */}
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all duration-300 pointer-events-none" />

                    {/* Content Group (Header & Description & Bullet lists) */}
                    <div className="space-y-5 text-left">
                      
                      {/* Header Row */}
                      <div className="flex items-center gap-4">
                        {/* Glowing Icon Frame */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${offer.colorClass} border flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden select-none`}>
                          {offer.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-extrabold text-sm text-foreground truncate">{offer.title}</h4>
                            <span className="text-[9px] font-black px-2 py-0.5 bg-blue-500/10 border border-blue-500/25 rounded-full select-none text-blue-500 tracking-wider">
                              {offer.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                            {offer.desc}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border/40" />

                      {/* Features Bullet List */}
                      <ul className="space-y-2.5">
                        {bulletList.map((bullet: string, bIdx: number) => (
                          <li key={bIdx} className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-350">
                            <BadgeCheck className={`w-4 h-4 shrink-0 ${offer.bulletColor}`} />
                            <span className="truncate">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Docked Bottom Pricing & Action CTA (Horizontal Bottom Row) */}
                    <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                      <div className="text-left space-y-0.5">
                        <span className="block text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none">LAUNCH PRICE</span>
                        <span className="block text-xl font-black text-foreground leading-none">{offer.price}</span>
                      </div>
                      
                      <Link href="/register" className="shrink-0">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] h-9 px-5.5 rounded-full shadow-md shadow-blue-600/15 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Get Deal
                        </Button>
                      </Link>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TRUST & BRANDING ── */}
        <section className="py-20 border-t border-border/40 text-center bg-card">
          <div className="container px-6 max-w-xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mx-auto text-primary bg-muted/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg">Algerian-Hosted Workspace Networks</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All platform database operations run strictly on our secure hosting clusters with ultra-low latency. Upgrade or downgrade plans anytime with automatic network reconfiguration.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
