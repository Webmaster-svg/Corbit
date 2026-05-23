import { useState } from "react";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

const T = {
  en: { hero: "The Best Digital\nProducts, Delivered", sub: "Premium software, templates, courses, and tools — instant download, lifetime access.", shop: "Browse Marketplace", featured: "Top Downloads", viewAll: "View All", addCart: "Buy Now", cats: "Categories", deal: "🔥 New arrivals every week — Join 50K+ creators", trust1: "Instant Download", trust2: "Lifetime Updates", trust3: "Money-Back Guarantee", trust4: "Verified Creators", testimonialTitle: "Trusted by Creators Worldwide", testimonial1: "The AI prompt library saved me hours of work. Best investment I've made for my workflow.", testimonialName1: "Alex Chen", testimonialRole1: "Digital Creator", testimonial2: "Incredible quality and variety. The templates are polished and ready to ship.", testimonialName2: "Maya Patel", testimonialRole2: "Freelance Designer", testimonial3: "I've downloaded over 50 products and every single one exceeded my expectations.", testimonialName3: "Ryan O'Brien", testimonialRole3: "Agency Owner", newsletterTitle: "Stay Ahead of the Curve", newsletterText: "Get early access to new releases, creator tips, and exclusive discounts straight to your inbox.", newsletterPlaceholder: "Enter your email", newsletterButton: "Subscribe", footer: "© 2024 DigitalShop. Fuel your creativity." },
  fr: { hero: "Les Meilleurs Produits\nNumériques", sub: "Logiciels, modèles, cours et outils premium — téléchargement instantané, accès à vie.", shop: "Explorer la Marketplace", featured: "Top Téléchargements", viewAll: "Voir Tout", addCart: "Acheter", cats: "Catégories", deal: "🔥 Nouveautés chaque semaine — Rejoignez 50K+ créateurs", trust1: "Téléchargement Instantané", trust2: "Mises à Jour à Vie", trust3: "Remboursement Garanti", trust4: "Créateurs Vérifiés", testimonialTitle: "Approuvé par les Créateurs du Monde Entier", testimonial1: "La bibliothèque de prompts IA m'a fait gagner des heures de travail. Le meilleur investissement.", testimonialName1: "Alex Chen", testimonialRole1: "Créateur Numérique", testimonial2: "Qualité et variété incroyables. Les templates sont prêts à l'emploi.", testimonialName2: "Maya Patel", testimonialRole2: "Designer Freelance", testimonial3: "J'ai téléchargé plus de 50 produits et chacun a dépassé mes attentes.", testimonialName3: "Ryan O'Brien", testimonialRole3: "Propriétaire d'Agence", newsletterTitle: "Restez en Avance", newsletterText: "Accédez en avant-première aux nouveautés et aux réductions exclusives.", newsletterPlaceholder: "Votre email", newsletterButton: "S'abonner", footer: "© 2024 DigitalShop. Alimentez votre créativité." },
  ar: { hero: "أفضل المنتجات\nالرقمية", sub: "برامج ونماذج ودورات وأدوات متميزة — تحميل فوري، وصول مدى الحياة.", shop: "تصفح السوق", featured: "الأكثر تحميلاً", viewAll: "عرض الكل", addCart: "اشتري الآن", cats: "الفئات", deal: "🔥 وافدون جدد كل أسبوع — انضم لـ50K+ مبدع", trust1: "تحميل فوري", trust2: "تحديثات مدى الحياة", trust3: "ضمان استرداد المال", trust4: "مبدعون موثوقون", testimonialTitle: "موثوق به من قبل المبدعين في جميع أنحاء العالم", testimonial1: "مكتبة أوامر الذكاء الاصطناعي وفرت لي ساعات من العمل. أفضل استثمار قمت به.", testimonialName1: "أليكس تشين", testimonialRole1: "مبدع رقمي", testimonial2: "جودة وتنوع لا يصدقان. القوالب مصقولة وجاهزة للنشر.", testimonialName2: "مايا باتيل", testimonialRole2: "مصممة مستقلة", testimonial3: "لقد قمت بتحميل أكثر من 50 منتج وكل واحد تجاوز توقعاتي.", testimonialName3: "ريان أوبراين", testimonialRole3: "مالك وكالة", newsletterTitle: "ابق في المقدمة", newsletterText: "احصل على وصول مبكر للإصدارات الجديدة والنصائح الحصرية.", newsletterPlaceholder: "أدخل بريدك الإلكتروني", newsletterButton: "اشتراك", footer: "© 2024 ديجيتال شوب. أشعل إبداعك." },
};

const products = [
  { id: 1, name: "UI Kit Pro 2024", price: "$49", img: "https://picsum.photos/seed/dig1/400/300", cat: "Design", rating: 4.9, sales: "12.4k" },
  { id: 2, name: "Notion OS Bundle", price: "$29", img: "https://picsum.photos/seed/dig2/400/300", cat: "Productivity", rating: 4.8, sales: "8.7k" },
  { id: 3, name: "Framer Template Pack", price: "$79", img: "https://picsum.photos/seed/dig3/400/300", cat: "Templates", rating: 5.0, sales: "4.2k" },
  { id: 4, name: "AI Prompt Library", price: "$19", img: "https://picsum.photos/seed/dig4/400/300", cat: "AI Tools", rating: 4.7, sales: "21k" },
  { id: 5, name: "Video Editing Presets", price: "$39", img: "https://picsum.photos/seed/dig5/400/300", cat: "Video", rating: 4.9, sales: "6.3k" },
  { id: 6, name: "SEO Toolkit 2024", price: "$59", img: "https://picsum.photos/seed/dig6/400/300", cat: "Marketing", rating: 4.6, sales: "3.1k" },
  { id: 7, name: "Icon Library Pro", price: "$29", img: "https://picsum.photos/seed/dig7/400/300", cat: "Design", rating: 4.8, sales: "8.7k" },
  { id: 8, name: "Social Media Bundle", price: "$49", img: "https://picsum.photos/seed/dig8/400/300", cat: "Marketing", rating: 4.7, sales: "5.2k" },
  { id: 9, name: "React Component Kit", price: "$69", img: "https://picsum.photos/seed/dig9/400/300", cat: "Development", rating: 4.9, sales: "3.8k" },
];

const categories = [
  { name: "Design", icon: "palette", count: 240 },
  { name: "Development", icon: "monitor", count: 185 },
  { name: "Marketing", icon: "chart", count: 120 },
  { name: "AI Tools", icon: "bot", count: 94 },
  { name: "Productivity", icon: "zap", count: 78 },
  { name: "Video", icon: "clapper", count: 63 },
  { name: "Audio", icon: "music", count: 51 },
  { name: "Templates", icon: "file", count: 310 },
];

export default function DigitalShop({ language, scheme, dark }: TemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#06050f" : scheme.bg;
  const surf = dark ? "#0f0e1f" : scheme.surface;
  const txt = dark ? "#e8e4ff" : scheme.text;
  const mut = dark ? "#6b6590" : scheme.muted;
  const brd = dark ? "#1e1c3a" : scheme.border;

  return (
    <div dir={dir} className="min-h-screen font-sans" style={{ background: bg, color: txt }}>
      {/* Banner */}
      <div className="text-center py-2.5 text-xs font-semibold text-white" style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>{t.deal}</div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-8 sticky top-0 z-50 border-b backdrop-blur-md" style={{ background: `${bg}ee`, borderColor: brd }}>
        <div className="font-black text-[1.4rem] bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>DigitalShop</div>
        <div className="hidden md:flex flex-1 justify-center gap-6 text-sm">
          {["Marketplace", "Bundles", "Free", "Blog", "Creators"].map(item => (
            <span key={item} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{item}</span>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center gap-2 border rounded-lg px-4 py-2" style={{ background: surf, borderColor: brd }}>
            <Icon name="search" size={16} style={{ color: mut }} />
            <input placeholder="Search products..." className="bg-transparent border-none outline-none text-xs w-40" style={{ color: txt }} />
          </div>
          <button className="hidden sm:block text-white border-none rounded-lg px-6 py-2.5 cursor-pointer font-bold text-sm" style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>Sign In</button>
          <button className="md:hidden p-2 rounded-md" style={{ color: txt }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col border-b px-4 py-2" style={{ background: bg, borderColor: brd }}>
          {["Marketplace", "Bundles", "Free", "Blog", "Creators"].map(item => (
            <span key={item} className="py-3 text-sm font-medium border-b last:border-0 cursor-pointer" style={{ color: txt, borderColor: brd }}>{item}</span>
          ))}
          <button className="text-white border-none rounded-lg px-6 py-3 mt-4 cursor-pointer font-bold text-sm" style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>Sign In</button>
        </div>
      )}

      {/* Hero */}
      <div className="relative px-6 py-24 md:px-8 md:py-24 text-center overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${scheme.accent}22 0%, transparent 70%)` }} />
        <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-semibold mb-8" style={{ background: `${scheme.accent}22`, color: scheme.accent, borderColor: `${scheme.accent}44` }}>
          <Icon name="sparkles" size={16} /> Over 1,200 Digital Products
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-[5rem] font-black leading-[1.05] mb-6 whitespace-pre-line">
          {t.hero.split('\n').map((line, i) => (
            <span key={i} className="block bg-clip-text text-transparent" style={{ backgroundImage: i === 0 ? `linear-gradient(90deg, ${txt}, ${txt})` : `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>{line}</span>
          ))}
        </h1>
        <p className="max-w-xl mx-auto mb-10 leading-[1.7] text-[0.95rem] md:text-base" style={{ color: mut }}>{t.sub}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button className="text-white border-none rounded-xl px-10 py-4 cursor-pointer font-bold text-sm" style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, boxShadow: `0 4px 20px ${scheme.accent}44` }}>{t.shop}</button>
          <button className="bg-transparent border rounded-xl px-10 py-4 cursor-pointer font-semibold text-sm" style={{ color: txt, borderColor: brd }}>View Free</button>
        </div>
        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center mt-14 pt-12 border-t w-full max-w-4xl" style={{ borderColor: brd }}>
          {[{ val: "50K+", label: "Creators" }, { val: "1.2M+", label: "Downloads" }, { val: "4.9★", label: "Avg Rating" }, { val: "100%", label: "Secure" }].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-black text-3xl bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>{s.val}</div>
              <div className="text-xs mt-1" style={{ color: mut }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="px-6 py-12 md:px-8 md:py-12">
        <h2 className="font-extrabold text-xl mb-5">{t.cats}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {categories.map(c => (
            <div key={c.name} className="border rounded-xl p-4 text-center cursor-pointer flex flex-col items-center hover:opacity-80 transition-opacity" style={{ background: surf, borderColor: brd }}>
              <div className="mb-2"><Icon name={c.icon} size={24} /></div>
              <div className="text-[0.7rem] font-bold mb-1">{c.name}</div>
              <div className="text-[0.65rem]" style={{ color: mut }}>{c.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-6 py-8 md:px-8 md:py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-extrabold text-[1.4rem]">{t.featured}</h2>
          <span className="cursor-pointer font-semibold text-sm" style={{ color: scheme.accent }}>{t.viewAll} →</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <div key={p.id} className="border rounded-2xl overflow-hidden cursor-pointer group" style={{ background: surf, borderColor: brd }}>
              <div className="aspect-video overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[0.7rem] font-bold py-1 px-2.5 rounded-full" style={{ background: `${scheme.accent}22`, color: scheme.accent }}>{p.cat}</span>
                  <span className="text-xs" style={{ color: mut }}>⭐ {p.rating} · {p.sales} sales</span>
                </div>
                <div className="font-bold text-[0.95rem] mb-4">{p.name}</div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-xl bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>{p.price}</span>
                  <button className="text-white border-none rounded-lg px-5 py-2 cursor-pointer font-bold text-xs" style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>{t.addCart}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 md:p-16">
        <h2 className="text-center font-extrabold text-xl md:text-2xl mb-10">{t.testimonialTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} className="border rounded-2xl p-6 flex flex-col" style={{ background: surf, borderColor: brd }}>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
              </div>
              <p className="text-[0.85rem] leading-[1.7] m-0 mb-4 flex-1 italic" style={{ color: txt }}>"{item.text}"</p>
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs" style={{ color: mut }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div className="border-t py-10 px-6 grid grid-cols-2 md:grid-cols-4 text-center gap-6" style={{ background: surf, borderColor: brd }}>
        {[{ icon: "zap", text: t.trust1 }, { icon: "infinity", text: t.trust2 }, { icon: "wallet", text: t.trust3 }, { icon: "check", text: t.trust4 }].map((tr, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2"><Icon name={tr.icon} size={28} /></div>
            <div className="font-semibold text-xs" style={{ color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="py-14 px-6 md:p-14 text-center text-white" style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>
        <h2 className="font-extrabold text-2xl md:text-3xl mb-3">{t.newsletterTitle}</h2>
        <p className="opacity-90 mb-6 text-sm md:text-[0.9rem] max-w-md mx-auto">{t.newsletterText}</p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input type="email" placeholder={t.newsletterPlaceholder} className="flex-1 rounded-lg py-3 px-5 text-sm outline-none w-full" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }} />
          <button className="bg-white border-none rounded-lg py-3 px-6 cursor-pointer font-bold text-sm whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0" style={{ color: scheme.accent }}>{t.newsletterButton}</button>
        </div>
      </div>

      <footer className="border-t mt-8" style={{ background: dark ? "#08071a" : "#f8f7ff", borderColor: brd }}>
        <div className="max-w-5xl mx-auto px-6 py-12 md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <div className="text-xl font-black mb-2 bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)` }}>DigitalShop</div>
            <p className="text-[0.85rem] leading-[1.7] mb-4 max-w-sm" style={{ color: mut }}>The leading marketplace for digital products. Thousands of creators trust us to deliver high-quality design assets, templates, and tools.</p>
            <div className="flex gap-3">
              <Icon name="twitter" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="instagram" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="youtube" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="message" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
            </div>
          </div>
          <div>
            <div className="font-bold text-[0.8rem] uppercase tracking-[0.08em] mb-4" style={{ color: txt }}>Explore</div>
            {["Marketplace", "Bundles", "Free Assets", "Blog", "Creators"].map(l => (
              <div key={l} className="text-[0.82rem] mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-bold text-[0.8rem] uppercase tracking-[0.08em] mb-4" style={{ color: txt }}>Company</div>
            {["About", "Careers", "Terms of Service", "Privacy Policy", "Support"].map(l => (
              <div key={l} className="text-[0.82rem] mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
        </div>
        <div className="border-t px-6 py-5 text-center text-[0.8rem]" style={{ borderColor: brd, color: mut }}>{t.footer}</div>
      </footer>
    </div>
  );
}
