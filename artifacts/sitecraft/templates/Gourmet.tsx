import type { TemplateProps } from "./types";

const T = {
  en: { badge: "Exceptional Flavors Since 1998", hero: "Taste the\nExtraordinary", sub: "Premium artisan foods and fine wines curated by world-class chefs and sommeliers.", shop: "Explore the Cellar", featured: "Chef's Selection", viewAll: "View All", addCart: "Add to Cart", cats: "Shop by Category", deal: "🍷 Complimentary tasting notes with every wine order", trust1: "Expert Curation", trust2: "Temperature Controlled Delivery", trust3: "Satisfaction Guaranteed", trust4: "Exclusive Producers", footer: "© 2024 Gourmet. The art of exceptional taste." },
  fr: { badge: "Saveurs Exceptionnelles depuis 1998", hero: "Goûtez\nl'Extraordinaire", sub: "Aliments artisanaux et vins fins sélectionnés par des chefs et sommeliers de classe mondiale.", shop: "Explorer la Cave", featured: "Sélection du Chef", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Catégorie", deal: "🍷 Notes de dégustation offertes avec chaque commande de vin", trust1: "Sélection d'Experts", trust2: "Livraison à Température Contrôlée", trust3: "Satisfaction Garantie", trust4: "Producteurs Exclusifs", footer: "© 2024 Gourmet. L'art du goût exceptionnel." },
  ar: { badge: "نكهات استثنائية منذ 1998", hero: "ذُق\nالاستثنائي", sub: "أطعمة حرفية فاخرة ونبيذ راقي منتقى من قبل طهاة وخبراء عالميين.", shop: "استكشف القبو", featured: "اختيار الشيف", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوق حسب الفئة", deal: "🍷 ملاحظات تذوق مجانية مع كل طلب نبيذ", trust1: "انتقاء خبراء", trust2: "توصيل بتحكم بالحرارة", trust3: "ضمان الرضا", trust4: "منتجون حصريون", footer: "© 2024 غورميه. فن الذوق الاستثنائي." },
};

const products = [
  { id: 1, name: "Truffle Reserve Collection", price: "$189", img: "https://picsum.photos/seed/gourmet1/400/500", sub: "Limited Edition" },
  { id: 2, name: "Grand Cru Bordeaux 2018", price: "$245", img: "https://picsum.photos/seed/gourmet2/400/500", sub: "Wine" },
  { id: 3, name: "Aged Parmigiano 36mo", price: "$68", img: "https://picsum.photos/seed/gourmet3/400/500", sub: "Italian" },
  { id: 4, name: "Kaluga Caviar 50g", price: "$320", img: "https://picsum.photos/seed/gourmet4/400/500", sub: "Delicacy" },
];

const categories = ["Fine Wines", "Charcuterie", "Cheeses", "Truffles", "Olive Oils", "Chocolates", "Spices", "Gift Sets"];

export default function Gourmet({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#0e0608" : scheme.bg;
  const surf = dark ? "#1c0e12" : scheme.surface;
  const txt = dark ? "#f5ece0" : scheme.text;
  const mut = dark ? "#8a6a5a" : scheme.muted;
  const brd = dark ? "#3d1c22" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontSize: "1.75rem", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase" }}>GOURMET</div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: scheme.accent, marginTop: "-2px" }}>Fine Foods & Wines</div>
        </div>
        <div style={{ display: "flex", gap: "2.5rem", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {["Wines", "Foods", "Gifts", "Membership"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: mut }}>
          <span style={{ cursor: "pointer" }}>🔍</span>
          <span style={{ cursor: "pointer" }}>👤 Account</span>
          <span style={{ cursor: "pointer" }}>🛒 (0)</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", height: "88vh", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/gourmethero/1400/900" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#f5ece0" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: scheme.accent, marginBottom: "2rem", border: `1px solid ${scheme.accent}`, padding: "0.5rem 1.5rem" }}>{t.badge}</div>
          <h1 style={{ fontSize: "clamp(3rem, 9vw, 8rem)", fontWeight: 400, lineHeight: 1.0, marginBottom: "1.5rem", whiteSpace: "pre-line", letterSpacing: "-0.01em" }}>{t.hero}</h1>
          <div style={{ width: "3rem", height: "1px", background: scheme.accent, margin: "0 auto 1.5rem" }} />
          <p style={{ color: "rgba(245,236,224,0.7)", maxWidth: "480px", lineHeight: 1.9, marginBottom: "3rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <button style={{ background: "transparent", color: "#f5ece0", border: `1px solid ${scheme.accent}`, padding: "1rem 3rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{t.shop}</button>
        </div>
      </div>

      {/* Categories strip */}
      <div style={{ background: surf, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2.5rem", display: "flex", gap: "2.5rem", justifyContent: "center" }}>
        {categories.map(c => (
          <span key={c} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", color: mut }}>{c}</span>
        ))}
      </div>

      {/* Featured */}
      <section style={{ padding: "5rem 2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", borderBottom: `1px solid ${brd}`, paddingBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontWeight: 400, fontSize: "2rem", letterSpacing: "0.05em" }}>{t.featured}</h2>
            <div style={{ width: "2rem", height: "1px", background: scheme.accent, marginTop: "0.75rem" }} />
          </div>
          <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ overflow: "hidden", aspectRatio: "4/5", marginBottom: "1.25rem", background: surf }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: scheme.accent, marginBottom: "0.4rem" }}>{p.sub}</div>
              <div style={{ fontWeight: 400, fontSize: "0.95rem", marginBottom: "0.75rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>{p.price}</span>
                <button style={{ background: "transparent", border: `1px solid ${brd}`, color: txt, padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "3rem 2.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: "1.5rem" }}>
        {[t.trust1, t.trust2, t.trust3, t.trust4].map((tr, i) => (
          <div key={i} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.6 }}>{tr}</div>
        ))}
      </div>

      <footer style={{ padding: "2rem", textAlign: "center", color: mut, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{t.footer}</footer>
    </div>
  );
}
