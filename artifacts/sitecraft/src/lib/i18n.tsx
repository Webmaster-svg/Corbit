import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr" | "ar";

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  en: {
    "nav.templates": "Templates",
    "nav.pricing": "Pricing",
    "nav.login": "Log in",
    "nav.register": "Start Free",
    "nav.dashboard": "Dashboard",
    "hero.title": "Build your dream website, effortlessly.",
    "hero.subtitle": "SiteCraft is the easiest way for Algerian entrepreneurs to launch stunning, high-performance websites without writing a single line of code.",
    "hero.cta.start": "Start building for free",
    "hero.cta.templates": "Explore templates",
    "features.title": "Everything you need to succeed online",
    "features.design": "Stunning Design",
    "features.design.desc": "Premium templates crafted for modern businesses.",
    "features.speed": "Lightning Fast",
    "features.speed.desc": "Optimized for speed to keep your visitors engaged.",
    "features.domain": "Custom Domains",
    "features.domain.desc": "Connect your own domain with one click.",
    "features.responsive": "Mobile Ready",
    "features.responsive.desc": "Looks perfect on every device, out of the box.",
    "how.title": "How it works",
    "how.step1": "Choose a template",
    "how.step1.desc": "Start with a beautiful, responsive template.",
    "how.step2": "Customize everything",
    "how.step2.desc": "Make it yours with our intuitive drag-and-drop editor.",
    "how.step3": "Publish to the world",
    "how.step3.desc": "Go live instantly on a secure, global network.",
    "pricing.title": "Simple, transparent pricing",
    "pricing.free": "Free",
    "pricing.starter": "Starter",
    "pricing.pro": "Pro",
    "pricing.business": "Business",
    "footer.rights": "© 2024 SiteCraft. All rights reserved.",
  },
  fr: {
    "nav.templates": "Modèles",
    "nav.pricing": "Tarifs",
    "nav.login": "Connexion",
    "nav.register": "Commencer",
    "nav.dashboard": "Tableau de bord",
    "hero.title": "Créez le site de vos rêves, sans effort.",
    "hero.subtitle": "SiteCraft est le moyen le plus simple pour les entrepreneurs algériens de lancer des sites web magnifiques et performants sans coder.",
    "hero.cta.start": "Commencer gratuitement",
    "hero.cta.templates": "Explorer les modèles",
    "features.title": "Tout ce dont vous avez besoin",
    "features.design": "Design Magnifique",
    "features.design.desc": "Des modèles premium conçus pour les entreprises modernes.",
    "features.speed": "Ultra Rapide",
    "features.speed.desc": "Optimisé pour la vitesse afin de retenir vos visiteurs.",
    "features.domain": "Domaines Personnalisés",
    "features.domain.desc": "Connectez votre propre domaine en un clic.",
    "features.responsive": "Prêt pour Mobile",
    "features.responsive.desc": "Parfait sur tous les appareils, dès le départ.",
    "how.title": "Comment ça marche",
    "how.step1": "Choisissez un modèle",
    "how.step1.desc": "Commencez avec un modèle beau et réactif.",
    "how.step2": "Personnalisez tout",
    "how.step2.desc": "Appropriez-le avec notre éditeur intuitif.",
    "how.step3": "Publiez au monde",
    "how.step3.desc": "Mettez en ligne instantanément sur un réseau mondial sécurisé.",
    "pricing.title": "Une tarification simple et transparente",
    "pricing.free": "Gratuit",
    "pricing.starter": "Starter",
    "pricing.pro": "Pro",
    "pricing.business": "Business",
    "footer.rights": "© 2024 SiteCraft. Tous droits réservés.",
  },
  ar: {
    "nav.templates": "القوالب",
    "nav.pricing": "الأسعار",
    "nav.login": "تسجيل الدخول",
    "nav.register": "ابدأ مجاناً",
    "nav.dashboard": "لوحة التحكم",
    "hero.title": "أنشئ موقع أحلامك، بكل سهولة.",
    "hero.subtitle": "SiteCraft هي أسهل طريقة لرواد الأعمال الجزائريين لإطلاق مواقع إلكترونية رائعة وعالية الأداء دون كتابة سطر واحد من التعليمات البرمجية.",
    "hero.cta.start": "ابدأ البناء مجاناً",
    "hero.cta.templates": "استكشف القوالب",
    "features.title": "كل ما تحتاجه للنجاح",
    "features.design": "تصميم مذهل",
    "features.design.desc": "قوالب متميزة مصممة للشركات الحديثة.",
    "features.speed": "فائق السرعة",
    "features.speed.desc": "مُحسّن للسرعة للحفاظ على تفاعل زوارك.",
    "features.domain": "نطاقات مخصصة",
    "features.domain.desc": "اربط نطاقك الخاص بنقرة واحدة.",
    "features.responsive": "جاهز للموبايل",
    "features.responsive.desc": "يبدو مثالياً على كل جهاز، من البداية.",
    "how.title": "كيف تعمل",
    "how.step1": "اختر قالباً",
    "how.step1.desc": "ابدأ بقالب جميل ومتجاوب.",
    "how.step2": "خصص كل شيء",
    "how.step2.desc": "اجعله خاصاً بك باستخدام محررنا البديهي.",
    "how.step3": "انشر للعالم",
    "how.step3.desc": "انطلق فوراً على شبكة عالمية آمنة.",
    "pricing.title": "تسعير بسيط وشفاف",
    "pricing.free": "مجاني",
    "pricing.starter": "بداية",
    "pricing.pro": "احترافي",
    "pricing.business": "أعمال",
    "footer.rights": "© 2024 SiteCraft. جميع الحقوق محفوظة.",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("sitecraft_lang");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sitecraft_lang", lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
