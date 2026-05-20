import type { TemplateProps } from "./types";

const T = {
  en: { hero: "Fun Starts Here! 🎉", sub: "Safe, educational, and endlessly fun toys and clothing for kids of all ages.", shop: "Let's Play!", featured: "Top Picks for Kids", viewAll: "See All", addCart: "Add to Cart", cats: "Shop by Age", deal: "🎈 Buy 2, Get 1 FREE on all toys this weekend!", trust1: "Child Safe Certified", trust2: "Free Delivery", trust3: "Easy Returns", trust4: "Award-Winning Toys", footer: "© 2024 KidsWorld. Play, Learn, Grow." },
  fr: { hero: "Le Fun Commence Ici! 🎉", sub: "Jouets et vêtements sûrs, éducatifs et amusants pour enfants.", shop: "Jouer Maintenant!", featured: "Sélections pour Enfants", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Âge", deal: "🎈 Achetez 2, obtenez 1 GRATUIT sur tous les jouets!", trust1: "Certifié Sécurité Enfant", trust2: "Livraison Gratuite", trust3: "Retours Faciles", trust4: "Jouets Primés", footer: "© 2024 KidsWorld. Jouer, Apprendre, Grandir." },
  ar: { hero: "المرح يبدأ هنا! 🎉", sub: "ألعاب وملابس آمنة وتعليمية وممتعة للأطفال من جميع الأعمار.", shop: "هيا نلعب!", featured: "أفضل اختيارات للأطفال", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوق حسب العمر", deal: "🎈 اشترِ 2 واحصل على 1 مجاناً على جميع الألعاب!", trust1: "معتمد لسلامة الطفل", trust2: "توصيل مجاني", trust3: "إرجاع سهل", trust4: "ألعاب حائزة على جوائز", footer: "© 2024 كيدز وورلد. العب، تعلم، اكبر." },
};

const products = [
  { id: 1, name: "LEGO City Mega Set", price: "$59.99", img: "https://picsum.photos/seed/kid1/400/400", age: "6-12", color: "#fef9c3" },
  { id: 2, name: "Plush Rainbow Bear", price: "$24.99", img: "https://picsum.photos/seed/kid2/400/400", age: "0-3", color: "#fce7f3" },
  { id: 3, name: "Art & Craft Kit", price: "$34.99", img: "https://picsum.photos/seed/kid3/400/400", age: "4-8", color: "#dbeafe" },
  { id: 4, name: "Mini Dinosaur Set", price: "$19.99", img: "https://picsum.photos/seed/kid4/400/400", age: "3-7", color: "#dcfce7" },
  { id: 5, name: "Coding Robot Buddy", price: "$79.99", img: "https://picsum.photos/seed/kid5/400/400", age: "8-12", color: "#e0e7ff" },
  { id: 6, name: "Princess Dress-Up", price: "$29.99", img: "https://picsum.photos/seed/kid6/400/400", age: "3-8", color: "#fce7f3" },
];

const ageGroups = [
  { label: "0-2 Years", emoji: "👶", color: "#fee2e2" },
  { label: "3-5 Years", emoji: "🧒", color: "#fef9c3" },
  { label: "6-8 Years", emoji: "🧒‍♂️", color: "#dcfce7" },
  { label: "9-12 Years", emoji: "🧑", color: "#dbeafe" },
  { label: "Teens", emoji: "👦", color: "#e0e7ff" },
];

export default function KidsWorld({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#0d0a1a" : scheme.bg;
  const surf = dark ? "#1a1530" : scheme.surface;
  const txt = dark ? "#f0ecff" : scheme.text;
  const mut = dark ? "#7a6fa0" : scheme.muted;
  const brd = dark ? "#2a2050" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif", minHeight: "100vh" }}>
      {/* Deal */}
      <div style={{ background: `linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff)`, color: "#000", textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", fontWeight: 700 }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: bg, borderBottom: `3px solid ${scheme.accent}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "2rem" }}>🧸</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 900, background: "linear-gradient(90deg, #ff6b6b, #4d96ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KidsWorld</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", fontWeight: 600 }}>
          {["Toys 🎮", "Clothes 👕", "Books 📚", "Outdoor 🌳", "Sale 🏷️"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontWeight: 800, fontSize: "0.875rem" }}>🛒 Cart (0)</button>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "480px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "3.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem", background: `linear-gradient(135deg, ${scheme.accent}, #4d96ff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.hero}</h1>
          <p style={{ color: mut, lineHeight: 1.7, marginBottom: "2rem", fontSize: "1rem", maxWidth: "380px" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "1rem 2.5rem", cursor: "pointer", fontWeight: 900, fontSize: "1rem", boxShadow: `0 4px 15px ${scheme.accent}66` }}>{t.shop}</button>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${scheme.accent}33, #4d96ff22)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <img src="https://picsum.photos/seed/kidhero/600/480" alt="kids" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {["⭐", "🎈", "🦄", "🎪"].map((emoji, i) => (
            <div key={i} style={{ position: "absolute", fontSize: "2rem", top: `${20 + i * 20}%`, left: i % 2 === 0 ? "5%" : "88%", opacity: 0.6 }}>{emoji}</div>
          ))}
        </div>
      </div>

      {/* Age groups */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.5rem", marginBottom: "1.5rem" }}>{t.cats}</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {ageGroups.map(a => (
            <div key={a.label} style={{ background: dark ? surf : a.color, border: `2px solid ${brd}`, borderRadius: "1rem", padding: "1.25rem 1.5rem", textAlign: "center", cursor: "pointer", minWidth: "100px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{a.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>{a.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "2rem 2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 900, fontSize: "1.5rem" }}>{t.featured} 🌟</h2>
          <span style={{ color: scheme.accent, cursor: "pointer", fontWeight: 700 }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ background: dark ? surf : p.color, borderRadius: "1.25rem", overflow: "hidden", cursor: "pointer", border: `2px solid ${brd}` }}>
              <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "0.875rem" }}>
                <div style={{ fontSize: "0.65rem", background: scheme.accent, color: scheme.accentText, display: "inline-block", borderRadius: "1rem", padding: "0.15rem 0.5rem", marginBottom: "0.4rem", fontWeight: 700 }}>Age {p.age}</div>
                <div style={{ fontWeight: 800, fontSize: "0.8rem", marginBottom: "0.5rem" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 900, color: scheme.accent }}>{p.price}</span>
                  <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "1rem", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800 }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div style={{ background: surf, borderTop: `3px solid ${scheme.accent}`, padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center" }}>
        {[{ icon: "✅", text: t.trust1 }, { icon: "🚚", text: t.trust2 }, { icon: "↩️", text: t.trust3 }, { icon: "🏆", text: t.trust4 }].map((tr, i) => (
          <div key={i}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{tr.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      <footer style={{ padding: "1.5rem 2rem", textAlign: "center", color: mut, fontSize: "0.875rem" }}>{t.footer}</footer>
    </div>
  );
}
