import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";

type Page = "home" | "products" | "about" | "contact";

const PRODUCTS = [
  { id: 1, name: "ProMax Phone 15", price: "$999", priceNum: 999, img: "https://picsum.photos/seed/tech1/400/400", cat: "Phones", old: "$1,199", rating: 4.9 },
  { id: 2, name: "UltraBook Air", price: "$1,299", priceNum: 1299, img: "https://picsum.photos/seed/tech2/400/400", cat: "Laptops", old: "$1,599", rating: 4.8 },
  { id: 3, name: "NoiseCancelling Pro", price: "$249", priceNum: 249, img: "https://picsum.photos/seed/tech3/400/400", cat: "Audio", old: "$349", rating: 4.7 },
  { id: 4, name: "SmartWatch X", price: "$399", priceNum: 399, img: "https://picsum.photos/seed/tech4/400/400", cat: "Wearables", old: "$499", rating: 4.6 },
  { id: 5, name: "Gaming Laptop Elite", price: "$1,799", priceNum: 1799, img: "https://picsum.photos/seed/tech5/400/400", cat: "Gaming", old: "$2,199", rating: 4.9 },
  { id: 6, name: "Mirrorless Camera", price: "$1,099", priceNum: 1099, img: "https://picsum.photos/seed/tech6/400/400", cat: "Cameras", old: "$1,299", rating: 4.8 },
  { id: 7, name: "Smart Speaker Hub", price: "$129", priceNum: 129, img: "https://picsum.photos/seed/tech7/400/400", cat: "Smart Home", old: "$179", rating: 4.5 },
  { id: 8, name: "USB-C Hub Pro", price: "$89", priceNum: 89, img: "https://picsum.photos/seed/tech8/400/400", cat: "Accessories", old: "$119", rating: 4.7 },
  { id: 9, name: "Tablet Pro 12\"", price: "$849", priceNum: 849, img: "https://picsum.photos/seed/tech9/400/400", cat: "Phones", old: "$999", rating: 4.8 },
  { id: 10, name: "Mechanical Keyboard", price: "$159", priceNum: 159, img: "https://picsum.photos/seed/tech10/400/400", cat: "Accessories", old: "$199", rating: 4.6 },
  { id: 11, name: "Gaming Headset 7.1", price: "$179", priceNum: 179, img: "https://picsum.photos/seed/tech11/400/400", cat: "Gaming", old: "$229", rating: 4.7 },
  { id: 12, name: "Wireless Charging Pad", price: "$49", priceNum: 49, img: "https://picsum.photos/seed/tech12/400/400", cat: "Accessories", old: "$69", rating: 4.5 },
];

const CATS = ["All", "Phones", "Laptops", "Audio", "Wearables", "Gaming", "Cameras", "Smart Home", "Accessories"];

const T = {
  en: { nav: ["Home", "Products", "About", "Contact"], hero: "Next-Level Tech\nAt Your Fingertips", sub: "The latest smartphones, laptops, and gadgets — shipped fast, backed by expert support.", shop: "Browse Deals", viewAll: "View All", addCart: "Add to Cart", allProd: "All Products", flash: "⚡ Flash Sale — Up to 40% OFF", aboutTitle: "About TechZone", aboutText: "Founded in 2015, TechZone has grown to become the most trusted electronics destination for tech enthusiasts. We offer curated selections of the world's best gadgets with expert support and fast shipping.", contactTitle: "Contact Support", name: "Name", email: "Email", message: "Describe your issue or question", send: "Send Message", address: "Tech Tower, Silicon Valley, CA", phone: "+1 (800) TECHZONE", hours: "24/7 Customer Support", footer: "© 2024 TechZone. Power your life." },
  fr: { nav: ["Accueil", "Produits", "À Propos", "Contact"], hero: "Tech de Pointe\nÀ Portée de Main", sub: "Les derniers smartphones, laptops et gadgets.", shop: "Voir les Offres", viewAll: "Voir Tout", addCart: "Ajouter", allProd: "Tous les Produits", flash: "⚡ Vente Flash — Jusqu'à 40% de réduction", aboutTitle: "À Propos de TechZone", aboutText: "Fondé en 2015, TechZone est devenu la destination électronique la plus fiable.", contactTitle: "Contacter le Support", name: "Nom", email: "Email", message: "Décrivez votre question", send: "Envoyer", address: "Tech Tower, Silicon Valley, CA", phone: "+1 (800) TECHZONE", hours: "Support client 24/7", footer: "© 2024 TechZone. Alimentez votre vie." },
  ar: { nav: ["الرئيسية", "المنتجات", "من نحن", "اتصل بنا"], hero: "أحدث التقنيات\nبين يديك", sub: "أحدث الهواتف الذكية وأجهزة الكمبيوتر.", shop: "تصفح العروض", viewAll: "عرض الكل", addCart: "أضف للسلة", allProd: "جميع المنتجات", flash: "⚡ تخفيضات فلاش — حتى 40% خصم", aboutTitle: "عن تك زون", aboutText: "تأسست عام 2015، وأصبحت تك زون الوجهة الإلكترونية الأكثر ثقة.", contactTitle: "تواصل مع الدعم", name: "الاسم", email: "البريد الإلكتروني", message: "صف مشكلتك أو سؤالك", send: "إرسال", address: "برج تك، سيليكون فالي، كاليفورنيا", phone: "+1 (800) TECHZONE", hours: "دعم عملاء 24/7", footer: "© 2024 تك زون. أطلق قدراتك." },
};

export default function TechZone({ language, scheme, dark }: TemplateProps) {
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
  const bg = dark ? "#050a14" : scheme.bg;
  const surf = dark ? "#0d1b2e" : scheme.surface;
  const txt = dark ? "#e2e8f0" : scheme.text;
  const mut = dark ? "#64748b" : scheme.muted;
  const brd = dark ? "#1e3a5f" : scheme.border;

  const navBar = (
    <>
      <div style={{ background: `linear-gradient(90deg,${scheme.accent},#8b5cf6)`, color: "#fff", textAlign: "center", padding: "0.5rem", fontSize: "0.8rem", fontWeight: 700 }}>{t.flash}</div>
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => setPage("home")} style={{ fontWeight: 900, fontSize: "1.4rem", color: scheme.accent, background: "none", border: "none", cursor: "pointer" }}>TechZone⚡</button>
        <div style={{ flex: 1, display: "flex", gap: "1.5rem" }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 400, fontSize: "0.875rem" }}>{t.nav[i]}</button>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{ background: scheme.accent, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          🛒 {cartCount > 0 && <span style={{ background: "#fff", color: scheme.accent, borderRadius: "50%", width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
      </nav>
    </>
  );

  const homePage = (
    <>
      <div style={{ position: "relative", overflow: "hidden", minHeight: "520px", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
        <div style={{ padding: "4rem", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${scheme.accent}22`, color: scheme.accent, border: `1px solid ${scheme.accent}44`, borderRadius: "2rem", padding: "0.375rem 1rem", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}>🔥 Best Sellers 2024</div>
          <h1 style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.25rem", whiteSpace: "pre-line" }}>
            {t.hero.split('\n').map((line, i) => <span key={i} style={{ display: "block", color: i === 1 ? scheme.accent : txt }}>{line}</span>)}
          </h1>
          <p style={{ color: mut, lineHeight: 1.7, marginBottom: "2rem", maxWidth: "400px" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setPage("products")} style={{ background: scheme.accent, color: "#fff", border: "none", borderRadius: "0.625rem", padding: "0.875rem 2rem", cursor: "pointer", fontWeight: 700 }}>{t.shop}</button>
          </div>
        </div>
        <div style={{ position: "relative", height: "520px", overflow: "hidden" }}>
          <img src="https://picsum.photos/seed/techhero/700/600" alt="tech" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${bg}, transparent)` }} />
        </div>
      </div>
      <section style={{ padding: "3rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Trending Now</h2>
          <button onClick={() => setPage("products")} style={{ color: scheme.accent, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", background: "none", border: "none" }}>{t.viewAll} →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem" }}>
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "1rem", overflow: "hidden" }}>
              <div style={{ aspectRatio: "1", overflow: "hidden" }}><img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>{p.name}</div>
                <div style={{ fontSize: "0.75rem", color: mut, marginBottom: "0.75rem" }}>⭐ {p.rating}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontWeight: 800, color: scheme.accent }}>{p.price}</span>
                  <span style={{ color: mut, fontSize: "0.8rem", textDecoration: "line-through" }}>{p.old}</span>
                </div>
                <button onClick={() => addToCart(p)} style={{ width: "100%", background: scheme.accent, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ background: surf, borderTop: `1px solid ${brd}`, borderBottom: `1px solid ${brd}`, padding: "2rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center" }}>
        {[{ icon: "🛡️", text: "2-Year Warranty" }, { icon: "🚀", text: "Free Express Shipping" }, { icon: "↩️", text: "30-Day Returns" }, { icon: "💬", text: "Expert Support 24/7" }].map((tr, i) => (
          <div key={i}><div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{tr.icon}</div><div style={{ fontWeight: 600, fontSize: "0.8rem", color: mut }}>{tr.text}</div></div>
        ))}
      </div>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem" }}>
      <h1 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: "0.5rem" }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.875rem" }}>{filtered.length} products</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? scheme.accent : surf, color: activeCat === c ? "#fff" : mut, border: `1px solid ${activeCat === c ? scheme.accent : brd}`, borderRadius: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "1rem", overflow: "hidden" }}>
            <div style={{ aspectRatio: "1", overflow: "hidden" }}><img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", color: scheme.accent, fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>{p.cat}</div>
              <div style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>{p.name}</div>
              <div style={{ fontSize: "0.75rem", color: mut, marginBottom: "0.75rem" }}>⭐ {p.rating}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, color: scheme.accent }}>{p.price}</span>
                <span style={{ color: mut, fontSize: "0.8rem", textDecoration: "line-through" }}>{p.old}</span>
              </div>
              <button onClick={() => addToCart(p)} style={{ width: "100%", background: scheme.accent, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>{t.addCart}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontWeight: 900, fontSize: "2.5rem", marginBottom: "1.5rem" }}>{t.aboutTitle}</h1>
      <p style={{ color: mut, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "3rem" }}>{t.aboutText}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
        {[{ n: "2M+", l: "Products Sold" }, { n: "4.9★", l: "Average Rating" }, { n: "50+", l: "Countries" }].map(s => (
          <div key={s.l} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "1rem", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: scheme.accent, marginBottom: "0.5rem" }}>{s.n}</div>
            <div style={{ color: mut, fontSize: "0.875rem" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
      <div>
        <h1 style={{ fontWeight: 900, fontSize: "2rem", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: scheme.accent, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "1rem", cursor: "pointer", fontWeight: 700 }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "2rem" }}>Support Info</h2>
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
      <footer style={{ padding: "1.5rem 2rem", textAlign: "center", color: mut, fontSize: "0.875rem", borderTop: `1px solid ${brd}` }}>{t.footer}</footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
