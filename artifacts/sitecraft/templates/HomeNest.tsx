import type { TemplateProps } from "./types";

const T = {
  en: { hero: "Design Your\nPerfect Space", sub: "Modern furniture and home décor crafted for comfort, style, and lasting quality.", shop: "Shop Collection", featured: "New Arrivals", viewAll: "View All", addCart: "Add to Cart", cats: "Shop by Room", deal: "Free design consultation with any purchase over $500", trust1: "10-Year Warranty", trust2: "White Glove Delivery", trust3: "Free Returns", trust4: "Sustainably Made", footer: "© 2024 HomeNest. Where life happens." },
  fr: { hero: "Concevez Votre\nEspace Parfait", sub: "Mobilier moderne et décoration intérieure pour le confort et le style.", shop: "Voir la Collection", featured: "Nouveautés", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Pièce", deal: "Consultation design gratuite pour tout achat supérieur à 500€", trust1: "Garantie 10 Ans", trust2: "Livraison Premium", trust3: "Retours Gratuits", trust4: "Fabrication Durable", footer: "© 2024 HomeNest. Là où la vie se passe." },
  ar: { hero: "صمم\nمساحتك المثالية", sub: "أثاث عصري وديكور منزلي مصنوع للراحة والأناقة والجودة الدائمة.", shop: "تسوق المجموعة", featured: "الوافدون الجدد", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوق حسب الغرفة", deal: "استشارة تصميم مجانية لأي مشتريات فوق 500$", trust1: "ضمان 10 سنوات", trust2: "توصيل فاخر", trust3: "إرجاع مجاني", trust4: "صنع بشكل مستدام", footer: "© 2024 هوم نيست. حيث تحدث الحياة." },
};

const products = [
  { id: 1, name: "Nordic Lounge Chair", price: "$649", img: "https://picsum.photos/seed/home1/500/400", room: "Living Room" },
  { id: 2, name: "Oak Dining Table", price: "$1,299", img: "https://picsum.photos/seed/home2/500/400", room: "Dining" },
  { id: 3, name: "Linen Bed Frame", price: "$899", img: "https://picsum.photos/seed/home3/500/400", room: "Bedroom" },
  { id: 4, name: "Terrazzo Side Table", price: "$299", img: "https://picsum.photos/seed/home4/500/400", room: "Living Room" },
  { id: 5, name: "Wool Throw Blanket", price: "$89", img: "https://picsum.photos/seed/home5/500/400", room: "Bedroom" },
  { id: 6, name: "Rattan Pendant Light", price: "$199", img: "https://picsum.photos/seed/home6/500/400", room: "Dining" },
];

const rooms = [{ name: "Living Room", icon: "🛋️" }, { name: "Bedroom", icon: "🛏️" }, { name: "Kitchen", icon: "🍳" }, { name: "Dining", icon: "🪑" }, { name: "Office", icon: "💼" }, { name: "Outdoor", icon: "🌿" }];

export default function HomeNest({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#0e0d0b" : scheme.bg;
  const surf = dark ? "#1a1815" : scheme.surface;
  const txt = dark ? "#f5f0ea" : scheme.text;
  const mut = dark ? "#7a7268" : scheme.muted;
  const brd = dark ? "#2e2a24" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Georgia', serif", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem 1rem", fontSize: "0.8rem" }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontWeight: 400, fontSize: "1.5rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>HomeNest</div>
        <div style={{ display: "flex", gap: "2.5rem", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {["Furniture", "Lighting", "Decor", "Outdoor", "Sale"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: mut }}>
          <span style={{ cursor: "pointer" }}>🔍</span>
          <span style={{ cursor: "pointer" }}>🖤 Wishlist</span>
          <span style={{ cursor: "pointer" }}>🛒 Cart (0)</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", height: "85vh", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/homehero/1400/900" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5rem", color: "#fff" }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.25rem", opacity: 0.7 }}>Spring Collection 2024</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1.5rem", whiteSpace: "pre-line" }}>{t.hero}</h1>
          <p style={{ opacity: 0.75, maxWidth: "400px", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem 2.5rem", cursor: "pointer", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.shop}</button>
            <button style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", padding: "1rem 2.5rem", cursor: "pointer", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>View Lookbook</button>
          </div>
        </div>
      </div>

      {/* Rooms */}
      <section style={{ padding: "4rem 2.5rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "1.5rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2.5rem" }}>{t.cats}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
          {rooms.map(r => (
            <div key={r.name} style={{ background: surf, border: `1px solid ${brd}`, padding: "1.5rem 1rem", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{r.icon}</div>
              <div style={{ fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "2rem 2.5rem 5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${brd}`, paddingBottom: "1rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 400, fontSize: "1.4rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.featured}</h2>
          <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          {products.slice(0, 6).map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ overflow: "hidden", aspectRatio: "5/4", marginBottom: "1rem", background: surf }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ fontSize: "0.7rem", color: scheme.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{p.room}</div>
              <div style={{ fontWeight: 400, fontSize: "0.95rem", marginBottom: "0.5rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{p.price}</span>
                <button style={{ background: "transparent", border: `1px solid ${brd}`, color: txt, padding: "0.375rem 1rem", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.08em" }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div style={{ background: surf, borderTop: `1px solid ${brd}`, borderBottom: `1px solid ${brd}`, padding: "3rem 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: "2rem" }}>
        {[{ icon: "🛡️", text: t.trust1 }, { icon: "🚚", text: t.trust2 }, { icon: "↩️", text: t.trust3 }, { icon: "🌱", text: t.trust4 }].map((tr, i) => (
          <div key={i}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{tr.icon}</div>
            <div style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      <footer style={{ padding: "2rem", textAlign: "center", color: mut, fontSize: "0.75rem", letterSpacing: "0.12em" }}>{t.footer}</footer>
    </div>
  );
}
