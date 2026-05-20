import type { TemplateProps } from "./types";

const T = {
  en: { hero: "Your Skin\nDeserves Better", sub: "Science-backed skincare formulated with natural ingredients for every skin type.", shop: "Discover Your Routine", featured: "Best Sellers", viewAll: "View All", addCart: "Add to Cart", cats: "Shop by Concern", quiz: "Find Your Skin Type →", deal: "🌸 Free gift with orders over $60", trust1: "Dermatologist Tested", trust2: "Cruelty Free", trust3: "Clean Ingredients", trust4: "Free Samples", footer: "© 2024 BeautyGlow. Glow naturally." },
  fr: { hero: "Votre Peau\nMérite Mieux", sub: "Soins de la peau scientifiques formulés avec des ingrédients naturels.", shop: "Découvrir votre Routine", featured: "Meilleures Ventes", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Préoccupation", quiz: "Trouvez votre type de peau →", deal: "🌸 Cadeau gratuit pour les commandes de plus de 60€", trust1: "Testé par des Dermatologues", trust2: "Sans Cruauté", trust3: "Ingrédients Propres", trust4: "Échantillons Gratuits", footer: "© 2024 BeautyGlow. Brillez naturellement." },
  ar: { hero: "بشرتك\nتستحق الأفضل", sub: "عناية بالبشرة مدعومة علمياً من مكونات طبيعية لكل أنواع البشرة.", shop: "اكتشفي روتينك", featured: "الأكثر مبيعاً", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوقي حسب الاهتمام", quiz: "اعرفي نوع بشرتك →", deal: "🌸 هدية مجانية للطلبات فوق 60$", trust1: "اختبرته الأطباء", trust2: "خالية من القسوة", trust3: "مكونات نظيفة", trust4: "عينات مجانية", footer: "© 2024 بيوتي غلو. تألقي بشكل طبيعي." },
};

const products = [
  { id: 1, name: "Vitamin C Serum", price: "$48", img: "https://picsum.photos/seed/beauty1/400/500", tag: "Best Seller", steps: "Step 2" },
  { id: 2, name: "Hyaluronic Moisturiser", price: "$54", img: "https://picsum.photos/seed/beauty2/400/500", tag: "Editor's Pick", steps: "Step 3" },
  { id: 3, name: "Rose Glow Oil", price: "$62", img: "https://picsum.photos/seed/beauty3/400/500", tag: "New", steps: "Step 4" },
  { id: 4, name: "SPF 50 Daily Sunscreen", price: "$36", img: "https://picsum.photos/seed/beauty4/400/500", tag: "Essential", steps: "Step 5" },
];

const concerns = ["Anti-Aging", "Hydration", "Brightening", "Acne", "Sensitive", "Dark Spots"];

export default function BeautyGlow({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#120a10" : scheme.bg;
  const surf = dark ? "#1e1018" : scheme.surface;
  const txt = dark ? "#fce7f3" : scheme.text;
  const mut = dark ? "#9b7595" : scheme.muted;
  const brd = dark ? "#3d1f33" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh" }}>
      {/* Promo */}
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.05em" }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontWeight: 400, fontSize: "1.6rem", letterSpacing: "0.15em" }}>beautyGlow</div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
          {["Skincare", "Makeup", "Body", "Sets", "Journal"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", alignItems: "center" }}>
          <span style={{ cursor: "pointer", color: mut }}>🔍</span>
          <span style={{ cursor: "pointer", color: mut }}>👤</span>
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>🛒 Bag</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "550px", alignItems: "stretch" }}>
        <div style={{ overflow: "hidden" }}>
          <img src="https://picsum.photos/seed/beautyhero/700/600" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "4rem 4rem", display: "flex", flexDirection: "column", justifyContent: "center", background: surf }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: scheme.accent, textTransform: "uppercase", marginBottom: "1.5rem" }}>The New Ritual</div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: "1.5rem", whiteSpace: "pre-line" }}>{t.hero}</h1>
          <p style={{ color: mut, lineHeight: 1.8, marginBottom: "2rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "1rem 2rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>{t.shop}</button>
            <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>{t.quiz}</span>
          </div>
        </div>
      </div>

      {/* Shop by concern */}
      <section style={{ padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "1.75rem", marginBottom: "2rem", letterSpacing: "0.05em" }}>{t.cats}</h2>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {concerns.map(c => (
            <button key={c} style={{ background: "transparent", border: `1px solid ${brd}`, borderRadius: "2rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontSize: "0.875rem", color: txt, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = scheme.accent; (e.target as HTMLElement).style.color = scheme.accentText; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = txt; }}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "0 2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 400, fontSize: "1.75rem", letterSpacing: "0.03em" }}>{t.featured}</h2>
          <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.875rem" }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ position: "relative", marginBottom: "1rem", overflow: "hidden", aspectRatio: "4/5", background: surf }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: scheme.accent, color: scheme.accentText, fontSize: "0.7rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "2rem" }}>{p.tag}</div>
                <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: `${bg}cc`, color: txt, fontSize: "0.65rem", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>{p.steps}</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: scheme.accent, fontWeight: 700 }}>{p.price}</span>
                <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "0.375rem 1rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div style={{ background: surf, borderTop: `1px solid ${brd}`, padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: "1rem" }}>
        {[{ icon: "🔬", text: t.trust1 }, { icon: "🐰", text: t.trust2 }, { icon: "🌿", text: t.trust3 }, { icon: "🎁", text: t.trust4 }].map((tr, i) => (
          <div key={i}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{tr.icon}</div>
            <div style={{ fontSize: "0.8rem", color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      <footer style={{ padding: "1.5rem 2rem", textAlign: "center", color: mut, fontSize: "0.8rem", letterSpacing: "0.1em" }}>{t.footer}</footer>
    </div>
  );
}
