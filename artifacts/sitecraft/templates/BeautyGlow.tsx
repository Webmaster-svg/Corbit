import { useState } from "react";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

const T = {
  en: { hero: "Your Skin\nDeserves Better", sub: "Science-backed skincare formulated with natural ingredients for every skin type.", shop: "Discover Your Routine", featured: "Best Sellers", viewAll: "View All", addCart: "Add to Cart", cats: "Shop by Concern", quiz: "Find Your Skin Type →", deal: "🌸 Free gift with orders over $60", trust1: "Dermatologist Tested", trust2: "Cruelty Free", trust3: "Clean Ingredients", trust4: "Free Samples", testimonialTitle: "Real Results, Real People", testimonial1: "My skin has never looked better. The Vitamin C serum completely transformed my complexion!", testimonialName1: "Emma Richards", testimonialRole1: "Verified Buyer", testimonial2: "Finally, a skincare routine that actually works. My dark spots have faded significantly.", testimonialName2: "Sophie Laurent", testimonialRole2: "Skincare Enthusiast", testimonial3: "The personalized routine quiz made all the difference. My skin feels amazing.", testimonialName3: "Jessica Kim", testimonialRole3: "Regular Customer", newsletterTitle: "Glow In Your Inbox", newsletterText: "Get 10% off your first order when you subscribe to our weekly skincare tips and exclusive offers.", newsletterPlaceholder: "Enter your email", newsletterButton: "Subscribe", footer: "© 2024 BeautyGlow. Glow naturally." },
  fr: { hero: "Votre Peau\nMérite Mieux", sub: "Soins de la peau scientifiques formulés avec des ingrédients naturels.", shop: "Découvrir votre Routine", featured: "Meilleures Ventes", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Préoccupation", quiz: "Trouvez votre type de peau →", deal: "🌸 Cadeau gratuit pour les commandes de plus de 60€", trust1: "Testé par des Dermatologues", trust2: "Sans Cruauté", trust3: "Ingrédients Propres", trust4: "Échantillons Gratuits", testimonialTitle: "Des Résultats Réels, De Vraies Personnes", testimonial1: "Ma peau n'a jamais été aussi belle. Le sérum à la vitamine C a complètement transformé mon teint !", testimonialName1: "Emma Richards", testimonialRole1: "Acheteuse Confirmée", testimonial2: "Enfin une routine de soins qui fonctionne. Mes taches brunes ont considérablement diminué.", testimonialName2: "Sophie Laurent", testimonialRole2: "Passionnée de Soins", testimonial3: "Le test de routine personnalisée a fait toute la différence. Ma peau est incroyable.", testimonialName3: "Jessica Kim", testimonialRole3: "Cliente Fidèle", newsletterTitle: "Recevez Notre Newsletter", newsletterText: "Obtenez 10% de réduction sur votre première commande en vous abonnant à nos conseils beauté.", newsletterPlaceholder: "Votre email", newsletterButton: "S'abonner", footer: "© 2024 BeautyGlow. Brillez naturellement." },
  ar: { hero: "بشرتك\nتستحق الأفضل", sub: "عناية بالبشرة مدعومة علمياً من مكونات طبيعية لكل أنواع البشرة.", shop: "اكتشفي روتينك", featured: "الأكثر مبيعاً", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوقي حسب الاهتمام", quiz: "اعرفي نوع بشرتك →", deal: "🌸 هدية مجانية للطلبات فوق 60$", trust1: "اختبرته الأطباء", trust2: "خالية من القسوة", trust3: "مكونات نظيفة", trust4: "عينات مجانية", testimonialTitle: "نتائج حقيقية، أشخاص حقيقيون", testimonial1: "بشرتي لم تكن أفضل من أي وقت مضى. سيروم فيتامين سي غير بشرتي تماماً!", testimonialName1: "إيما ريتشاردز", testimonialRole1: "مشتر موثوق", testimonial2: "أخيراً روتين عناية يعمل بالفعل. بقعي الداكنة تلاشت بشكل ملحوظ.", testimonialName2: "صوفي لوران", testimonialRole2: "مهتمة بالعناية بالبشرة", testimonial3: "اختبار الروتين المخصص أحدث فرقاً كبيراً. بشرتي مذهلة.", testimonialName3: "جيسيكا كيم", testimonialRole3: "زبونة دائمة", newsletterTitle: "أشرقي مع نشرتنا", newsletterText: "احصلي على خصم 10% عند الاشتراك في نصائحنا الأسبوعية للعناية بالبشرة.", newsletterPlaceholder: "أدخلي بريدك الإلكتروني", newsletterButton: "اشتراك", footer: "© 2024 بيوتي غلو. تألقي بشكل طبيعي." },
};

const products = [
  { id: 1, name: "Vitamin C Serum", price: "$48", img: "https://picsum.photos/seed/beauty1/400/500", tag: "Best Seller", steps: "Step 2" },
  { id: 2, name: "Hyaluronic Moisturiser", price: "$54", img: "https://picsum.photos/seed/beauty2/400/500", tag: "Editor's Pick", steps: "Step 3" },
  { id: 3, name: "Rose Glow Oil", price: "$62", img: "https://picsum.photos/seed/beauty3/400/500", tag: "New", steps: "Step 4" },
  { id: 4, name: "SPF 50 Daily Sunscreen", price: "$36", img: "https://picsum.photos/seed/beauty4/400/500", tag: "Essential", steps: "Step 5" },
  { id: 5, name: "Vitamin C Serum", price: "$48", img: "https://picsum.photos/seed/beauty5/400/400", tag: "Best Seller", steps: "Step 1" },
  { id: 6, name: "Retinol Night Cream", price: "$72", img: "https://picsum.photos/seed/beauty6/400/400", tag: "New", steps: "Step 4" },
  { id: 7, name: "SPF 50 Sunscreen", price: "$38", img: "https://picsum.photos/seed/beauty7/400/400", tag: "Essential", steps: "Step 5" },
  { id: 8, name: "Lip Sleeping Mask", price: "$26", img: "https://picsum.photos/seed/beauty8/400/400", tag: "Editor's Pick", steps: "Step 5" },
];

const concerns = ["Anti-Aging", "Hydration", "Brightening", "Acne", "Sensitive", "Dark Spots"];

export default function BeautyGlow({ language, scheme, dark }: TemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#120a10" : scheme.bg;
  const surf = dark ? "#1e1018" : scheme.surface;
  const txt = dark ? "#fce7f3" : scheme.text;
  const mut = dark ? "#9b7595" : scheme.muted;
  const brd = dark ? "#3d1f33" : scheme.border;

  return (
    <div dir={dir} className="min-h-screen" style={{ background: bg, color: txt, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Promo */}
      <div className="text-center py-2.5 text-xs font-medium tracking-[0.05em]" style={{ background: scheme.accent, color: scheme.accentText }}>{t.deal}</div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-8 sticky top-0 z-50 border-b" style={{ background: bg, borderColor: brd }}>
        <div className="font-normal text-2xl tracking-[0.15em]">beautyGlow</div>
        <div className="hidden md:flex gap-8 text-xs tracking-[0.1em]">
          {["Skincare", "Makeup", "Body", "Sets", "Journal"].map(item => (
            <span key={item} className="cursor-pointer transition-opacity hover:opacity-80" style={{ color: mut }}>{item}</span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Icon name="search" size={16} className="cursor-pointer hidden sm:block hover:opacity-80 transition-opacity" style={{ color: mut }} />
          <Icon name="user" size={16} className="cursor-pointer hidden sm:block hover:opacity-80 transition-opacity" style={{ color: mut }} />
          <button className="border-none rounded-full py-2 px-5 cursor-pointer text-xs font-semibold flex items-center gap-1.5" style={{ background: scheme.accent, color: scheme.accentText }}><Icon name="bag" size={16} /> Bag</button>
          <button className="md:hidden p-2 rounded-md" style={{ color: txt }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col border-b px-4 py-2" style={{ background: bg, borderColor: brd }}>
          {["Skincare", "Makeup", "Body", "Sets", "Journal"].map(item => (
            <span key={item} className="py-3 text-sm font-medium border-b last:border-0 cursor-pointer" style={{ color: txt, borderColor: brd }}>{item}</span>
          ))}
        </div>
      )}

      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[550px] items-stretch">
        <div className="overflow-hidden h-[300px] md:h-auto order-1 md:order-none">
          <img src="https://picsum.photos/seed/beautyhero/700/600" alt="hero" className="w-full h-full object-cover" />
        </div>
        <div className="p-8 md:p-16 flex flex-col justify-center order-2 md:order-none" style={{ background: surf }}>
          <div className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: scheme.accent }}>The New Ritual</div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.15] mb-6 whitespace-pre-line">{t.hero}</h1>
          <p className="leading-[1.8] mb-8 text-[0.95rem]" style={{ color: mut }}>{t.sub}</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <button className="border-none rounded-full py-4 px-8 cursor-pointer text-sm font-semibold" style={{ background: scheme.accent, color: scheme.accentText }}>{t.shop}</button>
            <span className="cursor-pointer text-sm font-semibold text-center sm:text-left" style={{ color: scheme.accent }}>{t.quiz}</span>
          </div>
        </div>
      </div>

      {/* Shop by concern */}
      <section className="px-6 py-16 md:p-16">
        <h2 className="text-center font-normal text-2xl md:text-3xl mb-8 tracking-[0.05em]">{t.cats}</h2>
        <div className="flex gap-3 justify-center flex-wrap">
          {concerns.map(c => (
            <button key={c} className="bg-transparent border rounded-full py-2.5 px-6 cursor-pointer text-sm transition-all duration-200" style={{ borderColor: brd, color: txt }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = scheme.accent; (e.target as HTMLElement).style.color = scheme.accentText; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = txt; }}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-6 pb-16 md:px-8 md:pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-normal text-2xl md:text-3xl tracking-[0.03em]">{t.featured}</h2>
          <span className="cursor-pointer text-sm" style={{ color: scheme.accent }}>{t.viewAll} →</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="cursor-pointer group">
              <div className="relative mb-4 overflow-hidden aspect-[4/5]" style={{ background: surf }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.04]" />
                <div className="absolute top-3 left-3 text-[0.7rem] font-semibold py-1 px-3 rounded-full" style={{ background: scheme.accent, color: scheme.accentText }}>{p.tag}</div>
                <div className="absolute top-3 right-3 text-[0.65rem] py-1 px-2 rounded-sm" style={{ background: `${bg}cc`, color: txt }}>{p.steps}</div>
              </div>
              <div className="font-semibold text-sm md:text-[0.9rem] mb-1">{p.name}</div>
              <div className="flex justify-between items-center">
                <span className="font-bold" style={{ color: scheme.accent }}>{p.price}</span>
                <button className="border-none rounded-full py-1.5 px-4 cursor-pointer text-xs font-semibold" style={{ background: scheme.accent, color: scheme.accentText }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 md:p-16">
        <h2 className="text-center font-normal text-xl md:text-2xl tracking-[0.08em] uppercase mb-10">{t.testimonialTitle}</h2>
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
        {[{ icon: "flask", text: t.trust1 }, { icon: "rabbit", text: t.trust2 }, { icon: "leaf", text: t.trust3 }, { icon: "gift", text: t.trust4 }].map((tr, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2"><Icon name={tr.icon} size={28} /></div>
            <div className="text-xs" style={{ color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="py-14 px-6 md:p-14 text-center" style={{ background: scheme.accent, color: scheme.accentText }}>
        <h2 className="font-normal text-2xl md:text-3xl mb-3 tracking-[0.04em]">{t.newsletterTitle}</h2>
        <p className="opacity-85 mb-6 text-sm md:text-[0.9rem] max-w-md mx-auto">{t.newsletterText}</p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input type="email" placeholder={t.newsletterPlaceholder} className="flex-1 border rounded-full py-3 px-5 text-sm outline-none w-full" style={{ background: `${scheme.accentText}22`, borderColor: `${scheme.accentText}44`, color: scheme.accentText }} />
          <button className="border-none rounded-full py-3 px-6 cursor-pointer font-bold text-sm whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0" style={{ background: scheme.accentText, color: scheme.accent }}>{t.newsletterButton}</button>
        </div>
      </div>

      <footer className="border-t mt-12" style={{ background: surf, borderColor: brd }}>
        <div className="max-w-5xl mx-auto px-6 py-12 md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <div className="text-xl font-semibold mb-2 font-serif" style={{ color: txt }}>BeautyGlow</div>
            <div className="text-[0.75rem] tracking-[0.2em] uppercase mb-3" style={{ color: scheme.accent }}>Clean Beauty, Real Results</div>
            <p className="text-[0.85rem] leading-[1.7] mb-4 max-w-sm" style={{ color: mut }}>Cruelty-free, dermatologist-tested skincare crafted with clean ingredients for every skin type.</p>
            <div className="flex gap-3">
              <Icon name="instagram" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="facebook" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="twitter" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="youtube" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
            </div>
          </div>
          <div>
            <div className="font-semibold text-[0.8rem] uppercase tracking-[0.1em] mb-4" style={{ color: txt }}>Shop</div>
            {["Skincare", "Makeup", "Body Care", "Sets & Kits", "Gift Cards"].map(l => (
              <div key={l} className="text-[0.8rem] mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-semibold text-[0.8rem] uppercase tracking-[0.1em] mb-4" style={{ color: txt }}>Connect</div>
            <div className="text-[0.8rem] mb-2 cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: mut }}><Icon name="mail" size={14} /> hello@beautyglow.com</div>
            <div className="text-[0.8rem] mb-2 cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: mut }}><Icon name="phone" size={14} /> +1 (800) 555-GLOW</div>
            <div className="text-[0.8rem] mb-2 cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: mut }}><Icon name="clock" size={14} /> Mon–Fri 9am–6pm</div>
          </div>
        </div>
        <div className="border-t px-6 py-5 text-center text-[0.75rem] tracking-[0.08em]" style={{ borderColor: brd, color: mut }}>{t.footer}</div>
      </footer>
    </div>
  );
}
