import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";

type Page = "home" | "products" | "about" | "contact";

const PRODUCTS = [
  { id: 1, name: "ProRun X5 Shoes", price: "$149", priceNum: 149, img: "https://picsum.photos/seed/sport1/400/400", cat: "Running", hot: true },
  { id: 2, name: "FlexFit Shorts", price: "$59", priceNum: 59, img: "https://picsum.photos/seed/sport2/400/400", cat: "Training", hot: false },
  { id: 3, name: "Carbon Fiber Racket", price: "$279", priceNum: 279, img: "https://picsum.photos/seed/sport3/400/400", cat: "Tennis", hot: true },
  { id: 4, name: "AeroGrip Gloves", price: "$45", priceNum: 45, img: "https://picsum.photos/seed/sport4/400/400", cat: "Boxing", hot: false },
  { id: 5, name: "SmartCycle Bike", price: "$899", priceNum: 899, img: "https://picsum.photos/seed/sport5/400/400", cat: "Cycling", hot: true },
  { id: 6, name: "Hydro Flask Pro", price: "$39", priceNum: 39, img: "https://picsum.photos/seed/sport6/400/400", cat: "Essentials", hot: false },
  { id: 7, name: "Compression Tights", price: "$69", priceNum: 69, img: "https://picsum.photos/seed/sport7/400/400", cat: "Running", hot: false },
  { id: 8, name: "Basketball Pro", price: "$89", priceNum: 89, img: "https://picsum.photos/seed/sport8/400/400", cat: "Basketball", hot: true },
  { id: 9, name: "Yoga Mat Pro", price: "$79", priceNum: 79, img: "https://picsum.photos/seed/sport9/400/400", cat: "Training", hot: false },
  { id: 10, name: "Football Cleats", price: "$129", priceNum: 129, img: "https://picsum.photos/seed/sport10/400/400", cat: "Football", hot: false },
  { id: 11, name: "Swim Goggles Pro", price: "$34", priceNum: 34, img: "https://picsum.photos/seed/sport11/400/400", cat: "Swimming", hot: false },
  { id: 12, name: "Gym Duffel Bag", price: "$95", priceNum: 95, img: "https://picsum.photos/seed/sport12/400/400", cat: "Essentials", hot: false },
];

const CATS = ["All", "Running", "Training", "Tennis", "Boxing", "Cycling", "Basketball", "Football", "Swimming", "Essentials"];

const T = {
  en: { nav: ["Home", "Shop", "About", "Contact"], hero: "BUILT FOR\nCHAMPIONS", sub: "Performance gear engineered for those who refuse to settle. Train harder. Go further.", shop: "Shop Now", viewAll: "View All", addCart: "Add to Cart", allProd: "All Products", deal: "🏷️ MEMBERS SAVE 20% — Join Free Today", aboutTitle: "About SportsPro", aboutText: "SportsPro was built by athletes, for athletes. Since 2012 we've been delivering pro-grade equipment to amateurs and professionals alike. Every product is tested by our team of elite coaches and athletes before it reaches you.", contactTitle: "Talk to Us", name: "Name", email: "Email", message: "Your message", send: "Send", address: "SportsPro HQ, Los Angeles, CA", phone: "+1 (310) 555-0001", hours: "Mon–Fri 8am–8pm", footer: "© 2024 SportsPro. No limits." },
  fr: { nav: ["Accueil", "Boutique", "À Propos", "Contact"], hero: "CONÇU POUR\nLES CHAMPIONS", sub: "Équipement de performance conçu pour ceux qui refusent de se contenter de peu.", shop: "Acheter Maintenant", viewAll: "Voir Tout", addCart: "Ajouter", allProd: "Tous les Produits", deal: "🏷️ LES MEMBRES ÉCONOMISENT 20%", aboutTitle: "À Propos de SportsPro", aboutText: "SportsPro a été créé par des athlètes, pour des athlètes.", contactTitle: "Nous Contacter", name: "Nom", email: "Email", message: "Votre message", send: "Envoyer", address: "SportsPro HQ, Los Angeles, CA", phone: "+1 (310) 555-0001", hours: "Lun–Ven 8h–20h", footer: "© 2024 SportsPro. Sans limites." },
  ar: { nav: ["الرئيسية", "المتجر", "من نحن", "اتصل بنا"], hero: "صُنع\nللأبطال", sub: "معدات أداء مصممة لمن لا يقبلون بأقل من الأفضل.", shop: "تسوق الآن", viewAll: "عرض الكل", addCart: "أضف للسلة", allProd: "جميع المنتجات", deal: "🏷️ الأعضاء يوفرون 20%", aboutTitle: "عن سبورتس برو", aboutText: "بُنيت سبورتس برو من قِبل رياضيين، لأجل الرياضيين.", contactTitle: "تحدث إلينا", name: "الاسم", email: "البريد الإلكتروني", message: "رسالتك", send: "إرسال", address: "المقر الرئيسي، لوس أنجلوس، كاليفورنيا", phone: "+1 (310) 555-0001", hours: "الاثنين–الجمعة 8ص–8م", footer: "© 2024 سبورتس برو. بلا حدود." },
};

export default function SportsPro({ language, scheme, dark }: TemplateProps) {
  const [page, setPage] = useState<Page>("home");
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (p: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const found = prev.find(i => i.id === p.id);
      if (found) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, priceNum: p.priceNum, img: p.img, qty: 1 }];
    });
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const filtered = activeCat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);

  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#0c0c0c" : scheme.bg;
  const surf = dark ? "#1a1a1a" : scheme.surface;
  const txt = dark ? "#f5f5f5" : scheme.text;
  const mut = dark ? "#666" : scheme.muted;
  const brd = dark ? "#2a2a2a" : scheme.border;

  const navBar = (
    <>
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", fontWeight: 700 }}>{t.deal}</div>
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 900, fontSize: "1.6rem", color: txt, letterSpacing: "-0.03em" }}>SPORTS<span style={{ color: scheme.accent }}>PRO</span></button>
        <div style={{ display: "flex", gap: "2rem" }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? scheme.accent : mut, fontWeight: page === p ? 800 : 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.nav[i]}</button>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.5rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontWeight: 800, fontSize: "0.875rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          🛒 {cartCount > 0 && <span style={{ background: "#fff", color: scheme.accent, borderRadius: "50%", width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
      </nav>
    </>
  );

  const homePage = (
    <>
      <div style={{ position: "relative", height: "70vh", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/sporthero/1400/800" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4rem" }}>
          <h1 style={{ fontSize: "clamp(3rem,9vw,8rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#fff", marginBottom: "1.5rem", whiteSpace: "pre-line", textTransform: "uppercase" }}>{t.hero}</h1>
          <div style={{ width: "5rem", height: "4px", background: scheme.accent, marginBottom: "1.5rem" }} />
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "450px", lineHeight: 1.6, marginBottom: "2.5rem", fontSize: "1.05rem" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setPage("products")} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem 2.5rem", cursor: "pointer", fontWeight: 800, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.shop}</button>
          </div>
        </div>
      </div>
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "1rem 2rem", display: "flex", gap: "2rem", overflowX: "auto" }}>
        {CATS.filter(c => c !== "All").map(s => (
          <button key={s} onClick={() => { setPage("products"); setActiveCat(s); }} style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", whiteSpace: "nowrap", background: "none", border: "none", color: "inherit" }}>{s}</button>
        ))}
      </div>
      <section style={{ padding: "3rem 2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 900, fontSize: "1.75rem", textTransform: "uppercase" }}>Top Performers</h2>
          <button onClick={() => setPage("products")} style={{ color: scheme.accent, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.8rem", background: "none", border: "none" }}>{t.viewAll} →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "1rem" }}>
          {PRODUCTS.slice(0, 6).map(p => (
            <div key={p.id} style={{ background: surf, borderRadius: "0.5rem", overflow: "hidden", border: `1px solid ${brd}`, position: "relative" }}>
              {p.hot && <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: scheme.accent, color: scheme.accentText, fontSize: "0.65rem", fontWeight: 800, padding: "0.2rem 0.5rem", textTransform: "uppercase" }}>HOT</div>}
              <div style={{ aspectRatio: "1", overflow: "hidden" }}><img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ padding: "0.875rem" }}>
                <div style={{ fontSize: "0.65rem", color: scheme.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{p.cat}</div>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.75rem" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 900 }}>{p.price}</span>
                  <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.35rem", padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ borderTop: `1px solid ${brd}`, padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center", gap: "1rem" }}>
        {[{ icon: "🏆", text: "Pro-Grade Materials" }, { icon: "📦", text: "Free Shipping $50+" }, { icon: "↩️", text: "Easy Returns" }, { icon: "👟", text: "Expert Athletes" }].map((tr, i) => (
          <div key={i}><div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{tr.icon}</div><div style={{ fontWeight: 700, fontSize: "0.8rem", color: mut }}>{tr.text}</div></div>
        ))}
      </div>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem" }}>
      <h1 style={{ fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.875rem" }}>{filtered.length} products</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? scheme.accent : surf, color: activeCat === c ? scheme.accentText : txt, border: `1px solid ${activeCat === c ? scheme.accent : brd}`, borderRadius: "0.35rem", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: surf, borderRadius: "0.5rem", overflow: "hidden", border: `1px solid ${brd}`, position: "relative" }}>
            {p.hot && <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: scheme.accent, color: scheme.accentText, fontSize: "0.65rem", fontWeight: 800, padding: "0.2rem 0.5rem", textTransform: "uppercase", zIndex: 1 }}>HOT</div>}
            <div style={{ aspectRatio: "1", overflow: "hidden" }}><img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", color: scheme.accent, fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>{p.cat}</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900, fontSize: "1.05rem" }}>{p.price}</span>
                <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.35rem", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>{t.addCart}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", marginBottom: "1.5rem" }}>{t.aboutTitle}</h1>
      <p style={{ color: mut, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "3rem" }}>{t.aboutText}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
        {[{ n: "12+", l: "Years Experience" }, { n: "500K+", l: "Athletes Served" }, { n: "40+", l: "Countries" }].map(s => (
          <div key={s.l} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "0.5rem", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: scheme.accent, marginBottom: "0.5rem" }}>{s.n}</div>
            <div style={{ color: mut, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
      <div>
        <h1 style={{ fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", borderRadius: "0.35rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", borderRadius: "0.35rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.35rem", padding: "1rem", cursor: "pointer", fontWeight: 800, textTransform: "uppercase" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "2rem" }}>HQ</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[{ icon: "📍", text: t.address }, { icon: "📞", text: t.phone }, { icon: "🕐", text: t.hours }].map(i => (
            <div key={i.icon} style={{ display: "flex", gap: "1rem" }}>
              <span style={{ fontSize: "1.25rem" }}>{i.icon}</span><span style={{ color: mut, fontSize: "0.9rem", lineHeight: 1.6 }}>{i.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer style={{ padding: "1.5rem", textAlign: "center", color: mut, fontSize: "0.875rem", borderTop: `1px solid ${brd}` }}>{t.footer}</footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
