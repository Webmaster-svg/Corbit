import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";

type Page = "home" | "products" | "about" | "contact";

const PRODUCTS = [
  { id: 1, name: "Ceramic Pour-Over Set", price: "$85", priceNum: 85, img: "https://picsum.photos/seed/art1/400/500", cat: "Ceramics", maker: "Maria, Portugal" },
  { id: 2, name: "Woven Wall Hanging", price: "$120", priceNum: 120, img: "https://picsum.photos/seed/art2/400/500", cat: "Weaving", maker: "Amara, Morocco" },
  { id: 3, name: "Oak Cutting Board", price: "$68", priceNum: 68, img: "https://picsum.photos/seed/art3/400/500", cat: "Woodwork", maker: "Lars, Sweden" },
  { id: 4, name: "Hand-Dyed Linen Tote", price: "$54", priceNum: 54, img: "https://picsum.photos/seed/art4/400/500", cat: "Textiles", maker: "Suki, Japan" },
  { id: 5, name: "Beeswax Candle Set", price: "$42", priceNum: 42, img: "https://picsum.photos/seed/art5/400/500", cat: "Candles", maker: "Eva, France" },
  { id: 6, name: "Leather Journal Cover", price: "$78", priceNum: 78, img: "https://picsum.photos/seed/art6/400/500", cat: "Leather", maker: "Ahmed, Algeria" },
  { id: 7, name: "Raku Fired Bowl", price: "$95", priceNum: 95, img: "https://picsum.photos/seed/art7/400/500", cat: "Ceramics", maker: "Kenji, Japan" },
  { id: 8, name: "Hammered Copper Mug", price: "$62", priceNum: 62, img: "https://picsum.photos/seed/art8/400/400", cat: "Metalwork", maker: "Hassan, Morocco" },
  { id: 9, name: "Macramé Plant Hanger", price: "$38", priceNum: 38, img: "https://picsum.photos/seed/art9/400/500", cat: "Weaving", maker: "Sofia, Brazil" },
  { id: 10, name: "Walnut Serving Tray", price: "$115", priceNum: 115, img: "https://picsum.photos/seed/art10/400/400", cat: "Woodwork", maker: "Erik, Norway" },
  { id: 11, name: "Indigo Dyed Scarf", price: "$89", priceNum: 89, img: "https://picsum.photos/seed/art11/400/500", cat: "Textiles", maker: "Lin, China" },
  { id: 12, name: "Silver Ring Band", price: "$145", priceNum: 145, img: "https://picsum.photos/seed/art12/400/400", cat: "Jewelry", maker: "Clara, Spain" },
];

const CATS = ["All", "Ceramics", "Weaving", "Woodwork", "Leather", "Candles", "Textiles", "Jewelry", "Metalwork"];

const T = {
  en: { nav: ["Home", "Shop", "Our Story", "Contact"], hero: "Made by Hand,\nMade to Last", sub: "Discover unique handcrafted goods made by independent artisans from around the world.", shop: "Shop Handmade", viewAll: "View All", addCart: "Add to Cart", allProd: "All Handmade Goods", deal: "🌿 10% off your first order — Code HANDMADE10", aboutTitle: "The Artisan Story", aboutText: "Artisan Marketplace was founded to connect skilled craftspeople with people who truly appreciate handmade goods. Every maker on our platform goes through a rigorous quality review. When you buy from Artisan, you directly support the livelihoods of independent creators worldwide.", contactTitle: "Say Hello", name: "Your Name", email: "Your Email", message: "Tell us how we can help", send: "Send Message", address: "The Craft House, Amsterdam", phone: "+31 20 000 0000", hours: "Mon–Fri 9am–6pm", footer: "© 2024 Artisan. Crafted with care." },
  fr: { nav: ["Accueil", "Boutique", "Notre Histoire", "Contact"], hero: "Fait à la Main,\nFait pour Durer", sub: "Découvrez des articles artisanaux uniques faits par des artisans indépendants.", shop: "Acheter Artisanal", viewAll: "Voir Tout", addCart: "Ajouter au Panier", allProd: "Tous les Articles Artisanaux", deal: "🌿 10% sur votre première commande — Code HANDMADE10", aboutTitle: "L'Histoire Artisan", aboutText: "Artisan Marketplace a été fondé pour connecter les artisans avec les personnes qui apprécient vraiment les articles faits à la main.", contactTitle: "Nous Dire Bonjour", name: "Votre Nom", email: "Votre Email", message: "Comment pouvons-nous vous aider?", send: "Envoyer", address: "The Craft House, Amsterdam", phone: "+31 20 000 0000", hours: "Lun–Ven 9h–18h", footer: "© 2024 Artisan. Fait avec soin." },
  ar: { nav: ["الرئيسية", "المتجر", "قصتنا", "اتصل بنا"], hero: "صُنع باليد،\nصُنع ليدوم", sub: "اكتشف منتجات حرفية فريدة من صنع حرفيين مستقلين من جميع أنحاء العالم.", shop: "تسوق المصنوع يدوياً", viewAll: "عرض الكل", addCart: "أضف إلى السلة", allProd: "جميع المنتجات اليدوية", deal: "🌿 10% خصم على طلبك الأول — الرمز HANDMADE10", aboutTitle: "قصة أرتيزان", aboutText: "تأسست أرتيزان ماركت بليس للربط بين الحرفيين الماهرين والأشخاص الذين يقدرون حقاً المنتجات المصنوعة يدوياً.", contactTitle: "قل مرحباً", name: "اسمك", email: "بريدك الإلكتروني", message: "كيف يمكننا مساعدتك؟", send: "إرسال", address: "بيت الحرف، أمستردام", phone: "+31 20 000 0000", hours: "الاثنين–الجمعة 9ص–6م", footer: "© 2024 أرتيزان. مصنوع بعناية." },
};

export default function Artisan({ language, scheme, dark }: TemplateProps) {
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
  const bg = dark ? "#100c06" : scheme.bg;
  const surf = dark ? "#1c160e" : scheme.surface;
  const txt = dark ? "#f5ede0" : scheme.text;
  const mut = dark ? "#8a7a68" : scheme.muted;
  const brd = dark ? "#302418" : scheme.border;

  const navBar = (
    <>
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem", fontSize: "0.8rem" }}>{t.deal}</div>
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 400, letterSpacing: "0.15em", color: txt }}>ARTISAN</div>
          <div style={{ fontSize: "0.6rem", color: mut, letterSpacing: "0.2em", textTransform: "uppercase" }}>Handcrafted Marketplace</div>
        </button>
        <div style={{ display: "flex", gap: "2rem" }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 400, fontSize: "0.8rem", letterSpacing: "0.08em" }}>{t.nav[i]}</button>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "0.625rem 1.5rem", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          🛒 {cartCount > 0 && <span style={{ background: "#fff", color: scheme.accent, borderRadius: "50%", width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
      </nav>
    </>
  );

  const homePage = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "550px" }}>
        <div style={{ overflow: "hidden" }}><img src="https://picsum.photos/seed/arthero/700/600" alt="artisan" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        <div style={{ padding: "4rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center", background: surf }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: scheme.accent, textTransform: "uppercase", marginBottom: "1.25rem" }}>Handcrafted with ❤️</div>
          <h1 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.5rem", whiteSpace: "pre-line", color: txt }}>{t.hero}</h1>
          <p style={{ color: mut, lineHeight: 1.9, marginBottom: "2rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <button onClick={() => setPage("products")} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem 2.5rem", cursor: "pointer", fontSize: "0.875rem", letterSpacing: "0.08em", width: "fit-content" }}>{t.shop}</button>
        </div>
      </div>
      <section style={{ padding: "4rem 2rem 5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${brd}`, paddingBottom: "1rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 400, fontSize: "1.4rem", letterSpacing: "0.08em", textTransform: "uppercase", color: txt }}>Maker's Picks</h2>
          <button onClick={() => setPage("products")} style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", background: "none", border: "none" }}>{t.viewAll} →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem" }}>
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ overflow: "hidden", aspectRatio: "4/5", marginBottom: "1rem" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ fontSize: "0.65rem", color: scheme.accent, letterSpacing: "0.1em", marginBottom: "0.3rem" }}>by {p.maker}</div>
              <div style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: txt }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: txt }}>{p.price}</span>
                <button onClick={() => addToCart(p)} style={{ background: "transparent", border: `1px solid ${brd}`, color: txt, padding: "0.35rem 0.875rem", cursor: "pointer", fontSize: "0.7rem" }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "2rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center", gap: "1rem" }}>
        {["Handmade Guarantee", "Support Artisans", "Eco Packaging", "Free Returns"].map((tr, i) => (
          <div key={i} style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{tr}</div>
        ))}
      </div>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem" }}>
      <h1 style={{ fontWeight: 400, fontSize: "2rem", letterSpacing: "0.05em", marginBottom: "0.5rem", color: txt }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.875rem" }}>{filtered.length} items</p>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? scheme.accent : "transparent", color: activeCat === c ? scheme.accentText : txt, border: `1px solid ${activeCat === c ? scheme.accent : brd}`, padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem" }}>
        {filtered.map(p => (
          <div key={p.id}>
            <div style={{ overflow: "hidden", aspectRatio: "4/5", marginBottom: "1rem" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ fontSize: "0.65rem", color: scheme.accent, letterSpacing: "0.1em", marginBottom: "0.3rem" }}>by {p.maker}</div>
            <div style={{ fontSize: "0.65rem", color: mut, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.cat}</div>
            <div style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: txt }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: txt }}>{p.price}</span>
              <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "0.4rem 0.875rem", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.08em" }}>{t.addCart}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", marginBottom: "4rem" }}>
        <div>
          <h1 style={{ fontWeight: 400, fontSize: "2.5rem", marginBottom: "1.5rem", lineHeight: 1.1, color: txt }}>{t.aboutTitle}</h1>
          <p style={{ color: mut, lineHeight: 1.9, fontSize: "0.95rem" }}>{t.aboutText}</p>
        </div>
        <img src="https://picsum.photos/seed/artabout/600/500" alt="artisans" style={{ width: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
        {[{ n: "500+", l: "Makers Worldwide" }, { n: "12K+", l: "Handmade Products" }, { n: "98%", l: "Happy Customers" }].map(s => (
          <div key={s.l} style={{ background: surf, border: `1px solid ${brd}`, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: scheme.accent, marginBottom: "0.5rem" }}>{s.n}</div>
            <div style={{ color: mut, fontSize: "0.875rem" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
      <div>
        <h1 style={{ fontWeight: 400, fontSize: "2rem", marginBottom: "2rem", color: txt }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 400, fontSize: "1.25rem", marginBottom: "2rem", letterSpacing: "0.08em", textTransform: "uppercase", color: txt }}>Find Us</h2>
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
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh" }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer style={{ padding: "1.5rem", textAlign: "center", color: mut, fontSize: "0.75rem", letterSpacing: "0.1em", borderTop: `1px solid ${brd}` }}>{t.footer}</footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
