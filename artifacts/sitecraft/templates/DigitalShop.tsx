import type { TemplateProps } from "./types";

const T = {
  en: { hero: "The Best Digital\nProducts, Delivered", sub: "Premium software, templates, courses, and tools — instant download, lifetime access.", shop: "Browse Marketplace", featured: "Top Downloads", viewAll: "View All", addCart: "Buy Now", cats: "Categories", deal: "🔥 New arrivals every week — Join 50K+ creators", trust1: "Instant Download", trust2: "Lifetime Updates", trust3: "Money-Back Guarantee", trust4: "Verified Creators", footer: "© 2024 DigitalShop. Fuel your creativity." },
  fr: { hero: "Les Meilleurs Produits\nNumériques", sub: "Logiciels, modèles, cours et outils premium — téléchargement instantané, accès à vie.", shop: "Explorer la Marketplace", featured: "Top Téléchargements", viewAll: "Voir Tout", addCart: "Acheter", cats: "Catégories", deal: "🔥 Nouveautés chaque semaine — Rejoignez 50K+ créateurs", trust1: "Téléchargement Instantané", trust2: "Mises à Jour à Vie", trust3: "Remboursement Garanti", trust4: "Créateurs Vérifiés", footer: "© 2024 DigitalShop. Alimentez votre créativité." },
  ar: { hero: "أفضل المنتجات\nالرقمية", sub: "برامج ونماذج ودورات وأدوات متميزة — تحميل فوري، وصول مدى الحياة.", shop: "تصفح السوق", featured: "الأكثر تحميلاً", viewAll: "عرض الكل", addCart: "اشتري الآن", cats: "الفئات", deal: "🔥 وافدون جدد كل أسبوع — انضم لـ50K+ مبدع", trust1: "تحميل فوري", trust2: "تحديثات مدى الحياة", trust3: "ضمان استرداد المال", trust4: "مبدعون موثوقون", footer: "© 2024 ديجيتال شوب. أشعل إبداعك." },
};

const products = [
  { id: 1, name: "UI Kit Pro 2024", price: "$49", img: "https://picsum.photos/seed/dig1/400/300", cat: "Design", rating: 4.9, sales: "12.4k" },
  { id: 2, name: "Notion OS Bundle", price: "$29", img: "https://picsum.photos/seed/dig2/400/300", cat: "Productivity", rating: 4.8, sales: "8.7k" },
  { id: 3, name: "Framer Template Pack", price: "$79", img: "https://picsum.photos/seed/dig3/400/300", cat: "Templates", rating: 5.0, sales: "4.2k" },
  { id: 4, name: "AI Prompt Library", price: "$19", img: "https://picsum.photos/seed/dig4/400/300", cat: "AI Tools", rating: 4.7, sales: "21k" },
  { id: 5, name: "Video Editing Presets", price: "$39", img: "https://picsum.photos/seed/dig5/400/300", cat: "Video", rating: 4.9, sales: "6.3k" },
  { id: 6, name: "SEO Toolkit 2024", price: "$59", img: "https://picsum.photos/seed/dig6/400/300", cat: "Marketing", rating: 4.6, sales: "3.1k" },
];

const categories = [
  { name: "Design", icon: "🎨", count: 240 },
  { name: "Development", icon: "💻", count: 185 },
  { name: "Marketing", icon: "📈", count: 120 },
  { name: "AI Tools", icon: "🤖", count: 94 },
  { name: "Productivity", icon: "⚡", count: 78 },
  { name: "Video", icon: "🎬", count: 63 },
  { name: "Audio", icon: "🎵", count: 51 },
  { name: "Templates", icon: "📄", count: 310 },
];

export default function DigitalShop({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#06050f" : scheme.bg;
  const surf = dark ? "#0f0e1f" : scheme.surface;
  const txt = dark ? "#e8e4ff" : scheme.text;
  const mut = dark ? "#6b6590" : scheme.muted;
  const brd = dark ? "#1e1c3a" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, color: "#fff", textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", fontWeight: 600 }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: `${bg}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${brd}`, padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontWeight: 900, fontSize: "1.4rem", background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DigitalShop</div>
        <div style={{ flex: 1, display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
          {["Marketplace", "Bundles", "Free", "Blog", "Creators"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "0.5rem", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: mut, fontSize: "0.8rem" }}>🔍</span>
            <input placeholder="Search products..." style={{ background: "transparent", border: "none", outline: "none", color: txt, fontSize: "0.8rem", width: "160px" }} />
          </div>
          <button style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>Sign In</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", padding: "6rem 2rem 4rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${scheme.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${scheme.accent}22`, color: scheme.accent, border: `1px solid ${scheme.accent}44`, borderRadius: "2rem", padding: "0.375rem 1rem", fontSize: "0.8rem", fontWeight: 600, marginBottom: "2rem" }}>
          ✨ Over 1,200 Digital Products
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.5rem", whiteSpace: "pre-line" }}>
          {t.hero.split('\n').map((line, i) => (
            <span key={i} style={{ display: "block", background: i === 0 ? `linear-gradient(90deg, ${txt}, ${txt})` : `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{line}</span>
          ))}
        </h1>
        <p style={{ color: mut, maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7, fontSize: "1rem" }}>{t.sub}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, color: "#fff", border: "none", borderRadius: "0.625rem", padding: "1rem 2.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", boxShadow: `0 4px 20px ${scheme.accent}44` }}>{t.shop}</button>
          <button style={{ background: "transparent", color: txt, border: `1px solid ${brd}`, borderRadius: "0.625rem", padding: "1rem 2.5rem", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" }}>View Free</button>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", gap: "3rem", justifyContent: "center", marginTop: "3.5rem", paddingTop: "3rem", borderTop: `1px solid ${brd}` }}>
          {[{ val: "50K+", label: "Creators" }, { val: "1.2M+", label: "Downloads" }, { val: "4.9★", label: "Avg Rating" }, { val: "100%", label: "Secure" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: "1.75rem", background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
              <div style={{ color: mut, fontSize: "0.8rem", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "1.25rem" }}>{t.cats}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "0.75rem" }}>
          {categories.map(c => (
            <div key={c.name} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "0.75rem", padding: "1rem 0.5rem", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{c.icon}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.2rem" }}>{c.name}</div>
              <div style={{ fontSize: "0.65rem", color: mut }}>{c.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "2rem 2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>{t.featured}</h2>
          <span style={{ color: scheme.accent, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "1rem", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ background: `${scheme.accent}22`, color: scheme.accent, fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "1rem" }}>{p.cat}</span>
                  <span style={{ fontSize: "0.75rem", color: mut }}>⭐ {p.rating} · {p.sales} sales</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 900, fontSize: "1.25rem", background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}</span>
                  <button style={{ background: `linear-gradient(90deg, ${scheme.accent}, #8b5cf6)`, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}>{t.addCart}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div style={{ background: surf, borderTop: `1px solid ${brd}`, padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: "1rem" }}>
        {[{ icon: "⚡", text: t.trust1 }, { icon: "♾️", text: t.trust2 }, { icon: "💰", text: t.trust3 }, { icon: "✅", text: t.trust4 }].map((tr, i) => (
          <div key={i}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{tr.icon}</div>
            <div style={{ fontWeight: 600, fontSize: "0.8rem", color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      <footer style={{ padding: "1.5rem 2rem", textAlign: "center", color: mut, fontSize: "0.875rem" }}>{t.footer}</footer>
    </div>
  );
}
