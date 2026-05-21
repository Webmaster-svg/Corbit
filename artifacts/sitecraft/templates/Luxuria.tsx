import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

type Page = "home" | "products" | "about" | "contact";

const PRODUCTS = [
  { id: 1, name: "Silk Draped Gown", price: "$1,240", priceNum: 1240, img: "https://picsum.photos/seed/lux1/400/500", cat: "Women" },
  { id: 2, name: "Tailored Wool Coat", price: "$890", priceNum: 890, img: "https://picsum.photos/seed/lux2/400/500", cat: "Women" },
  { id: 3, name: "Leather Envelope Clutch", price: "$420", priceNum: 420, img: "https://picsum.photos/seed/lux3/400/500", cat: "Accessories" },
  { id: 4, name: "Crystal Heel Mule", price: "$680", priceNum: 680, img: "https://picsum.photos/seed/lux4/400/500", cat: "Shoes" },
  { id: 5, name: "Cashmere Turtleneck", price: "$560", priceNum: 560, img: "https://picsum.photos/seed/lux5/400/500", cat: "Women" },
  { id: 6, name: "Structured Blazer", price: "$740", priceNum: 740, img: "https://picsum.photos/seed/lux6/400/500", cat: "Men" },
  { id: 7, name: "Linen Trousers", price: "$380", priceNum: 380, img: "https://picsum.photos/seed/lux7/400/500", cat: "Men" },
  { id: 8, name: "Gold Cuff Bracelet", price: "$290", priceNum: 290, img: "https://picsum.photos/seed/lux8/400/400", cat: "Fine Jewelry" },
  { id: 9, name: "Diamond Stud Earrings", price: "$1,850", priceNum: 1850, img: "https://picsum.photos/seed/lux9/400/400", cat: "Fine Jewelry" },
  { id: 10, name: "Italian Leather Belt", price: "$180", priceNum: 180, img: "https://picsum.photos/seed/lux10/400/400", cat: "Accessories" },
  { id: 11, name: "Oxford Brogue Shoes", price: "$520", priceNum: 520, img: "https://picsum.photos/seed/lux11/400/500", cat: "Shoes" },
  { id: 12, name: "Pleated Midi Skirt", price: "$460", priceNum: 460, img: "https://picsum.photos/seed/lux12/400/500", cat: "Women" },
  { id: 13, name: "Diamond Tennis Bracelet", price: "$4,200", priceNum: 4200, img: "https://picsum.photos/seed/lux13/500/600", cat: "Fine Jewelry" },
  { id: 14, name: "Wool Cashmere Overcoat", price: "$2,800", priceNum: 2800, img: "https://picsum.photos/seed/lux14/500/600", cat: "Women" },
  { id: 15, name: "Italian Leather Tote", price: "$1,950", priceNum: 1950, img: "https://picsum.photos/seed/lux15/500/600", cat: "Accessories" },
  { id: 16, name: "Hand-stitched Oxford Shoes", price: "$1,350", priceNum: 1350, img: "https://picsum.photos/seed/lux16/500/600", cat: "Shoes" },
];

const CATS = ["All", "Women", "Men", "Accessories", "Shoes", "Fine Jewelry"];

const T = {
  en: { nav: ["Home", "Products", "About", "Contact"], hero: "Wear the\nUnseen", sub: "Curated luxury fashion for those who define their own elegance.", shop: "Shop Collection", explore: "Explore Lookbook", featured: "Featured Pieces", viewAll: "View All", addCart: "Add to Cart", allProd: "All Products", filter: "Filter", aboutTitle: "Our Story", aboutText: "Luxuria was born from a desire to make true luxury accessible — not in price, but in the experience of wearing something that was made just for you. Each piece in our collection is sourced from the world's finest ateliers.", contactTitle: "Get in Touch", name: "Full Name", email: "Email Address", message: "Your Message", send: "Send Message", address: "123 Rue Saint-Honoré, Paris", phone: "+33 1 42 00 00 00",     hours: "Mon–Sat 10am–7pm", testimonialTitle: "The Luxuria Experience", testimonial1: "Exceptional quality and service. The attention to detail in every piece is remarkable. Truly world-class craftsmanship.", testimonialName1: "Victoria Ashford", testimonialRole1: "Fashion Editor", testimonial2: "I've never experienced such personalized service. The styling consultation was worth every penny.", testimonialName2: "Henrik Larsson", testimonialRole2: "CEO, Stockholm", testimonial3: "Each piece arrives like a gift — beautifully wrapped and presented. It makes every purchase feel special.", testimonialName3: "Camille Dubois", testimonialRole3: "Loyal Client", footer: "© 2024 Luxuria. All rights reserved.", badge: "New Collection 2024" },
  fr: { nav: ["Accueil", "Produits", "À Propos", "Contact"], hero: "Portez\nl'Invisible", sub: "Mode de luxe sélectionnée pour ceux qui définissent leur propre élégance.", shop: "Voir la Collection", explore: "Explorer le Lookbook", featured: "Pièces Vedettes", viewAll: "Voir Tout", addCart: "Ajouter au Panier", allProd: "Tous les Produits", filter: "Filtrer", aboutTitle: "Notre Histoire", aboutText: "Luxuria est née du désir de rendre le vrai luxe accessible. Chaque pièce est sourcée dans les meilleurs ateliers du monde.", contactTitle: "Nous Contacter", name: "Nom Complet", email: "Adresse Email", message: "Votre Message", send: "Envoyer", address: "123 Rue Saint-Honoré, Paris", phone: "+33 1 42 00 00 00", hours: "Lun–Sam 10h–19h", testimonialTitle: "L'Expérience Luxuria", testimonial1: "Qualité et service exceptionnels. Le souci du détail dans chaque pièce est remarquable.", testimonialName1: "Victoria Ashford", testimonialRole1: "Rédactrice de Mode", testimonial2: "Je n'ai jamais eu un service aussi personnalisé. La consultation stylistique en valait chaque centime.", testimonialName2: "Henrik Larsson", testimonialRole2: "PDG, Stockholm", testimonial3: "Chaque pièce arrive comme un cadeau — magnifiquement emballée. Chaque achat est spécial.", testimonialName3: "Camille Dubois", testimonialRole3: "Cliente Fidèle", footer: "© 2024 Luxuria. Tous droits réservés.", badge: "Nouvelle Collection 2024" },
  ar: { nav: ["الرئيسية", "المنتجات", "من نحن", "اتصل بنا"], hero: "ارتدِ\nاللامرئي", sub: "أزياء فاخرة منتقاة لمن يصنعون أناقتهم الخاصة.", shop: "تسوق المجموعة", explore: "استكشاف الكتاب", featured: "القطع المميزة", viewAll: "عرض الكل", addCart: "أضف إلى السلة", allProd: "جميع المنتجات", filter: "تصفية", aboutTitle: "قصتنا", aboutText: "وُلدت لوكسوريا من رغبة في جعل الفخامة الحقيقية في متناول الجميع. كل قطعة في مجموعتنا مصدرها أفضل دور الأزياء في العالم.", contactTitle: "تواصل معنا", name: "الاسم الكامل", email: "البريد الإلكتروني", message: "رسالتك", send: "إرسال", address: "123 شارع سانت أونوريه، باريس", phone: "+33 1 42 00 00 00", hours: "الاثنين–السبت 10ص–7م", testimonialTitle: "تجربة لوكسوريا", testimonial1: "جودة وخدمة استثنائية. الاهتمام بالتفاصيل في كل قطعة رائع. حرفية عالمية حقاً.", testimonialName1: "فيكتوريا أشفورد", testimonialRole1: "محررة أزياء", testimonial2: "لم أشهد أبداً خدمة مخصصة بهذا المستوى. استشارة التصميم كانت تستحق كل قرش.", testimonialName2: "هنريك لارسون", testimonialRole2: "رئيس تنفيذي، ستوكهولم", testimonial3: "كل قطعة تصل كهدية — مغلفة بشكل جميل. تجعل كل عملية شراء مميزة.", testimonialName3: "كاميل دوبوا", testimonialRole3: "زبونة وفية", footer: "© 2024 لوكسوريا. جميع الحقوق محفوظة.", badge: "مجموعة جديدة 2024" },
};

export default function Luxuria({ language, scheme, dark }: TemplateProps) {
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
  const bg = dark ? "#0a0a0a" : scheme.bg;
  const surf = dark ? "#1a1a1a" : scheme.surface;
  const txt = dark ? "#f5f5f5" : scheme.text;
  const mut = dark ? "#888" : scheme.muted;
  const brd = dark ? "#333" : scheme.border;

  const navBar = (
    <nav style={{ borderBottom: `1px solid ${brd}`, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: bg, zIndex: 50 }}>
      <button onClick={() => setPage("home")} style={{ fontSize: "1.5rem", fontWeight: 300, letterSpacing: "0.3em", textTransform: "uppercase", background: "none", border: "none", color: txt, cursor: "pointer" }}>LUXURIA</button>
      <div style={{ display: "flex", gap: "2rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
          <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 400, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "0.8rem" }}>{t.nav[i]}</button>
        ))}
      </div>
      <button onClick={() => setCartOpen(true)} style={{ background: "none", border: `1px solid ${brd}`, color: txt, cursor: "pointer", padding: "0.4rem 1rem", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", position: "relative" }}>
        Bag {cartCount > 0 && <span style={{ background: scheme.accent, color: scheme.accentText, borderRadius: "50%", width: "1.25rem", height: "1.25rem", fontSize: "0.65rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: "0.4rem" }}>{cartCount}</span>}
      </button>
    </nav>
  );

  const homePage = (
    <>
      <div style={{ position: "relative", height: "90vh", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/luxhero/1400/900" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4rem" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: scheme.accent, marginBottom: "1.5rem", border: `1px solid ${scheme.accent}`, display: "inline-block", padding: "0.4rem 1rem", width: "fit-content" }}>{t.badge}</div>
          <h1 style={{ fontSize: "clamp(3rem,8vw,7rem)", fontWeight: 300, lineHeight: 1.05, color: "#fff", marginBottom: "1.5rem", whiteSpace: "pre-line" }}>{t.hero}</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "420px", lineHeight: 1.7, marginBottom: "2.5rem" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setPage("products")} style={{ background: scheme.accent, color: scheme.accentText, padding: "1rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>{t.shop}</button>
            <button onClick={() => setPage("about")} style={{ background: "transparent", color: "#fff", padding: "1rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.5)", cursor: "pointer" }}>{t.explore}</button>
          </div>
        </div>
      </div>
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", borderBottom: `1px solid ${brd}`, paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>{t.featured}</h2>
          <button onClick={() => setPage("products")} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: scheme.accent, cursor: "pointer", background: "none", border: "none" }}>{t.viewAll} →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem" }}>
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id}>
              <div style={{ overflow: "hidden", aspectRatio: "4/5", marginBottom: "1rem", background: surf, position: "relative" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                <button onClick={() => addToCart(p)} style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", background: scheme.accent, color: scheme.accentText, border: "none", padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>{t.addCart}</button>
              </div>
              <div style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>{p.name}</div>
              <div style={{ fontSize: "0.8rem", color: mut }}>{p.price}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "2rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
        {["Free worldwide shipping", "Authenticity guaranteed", "14-day returns", "Exclusive members access"].map((tr, i) => (
          <div key={i} style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{tr}</div>
        ))}
      </div>
          {/* Testimonials */}
          <section style={{ padding: "4rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontWeight: 300, fontSize: "1.4rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2.5rem" }}>{t.testimonialTitle}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              {[
                { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
                { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
                { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
              ].map((item, i) => (
                <div key={i} style={{ borderTop: `1px solid ${brd}`, paddingTop: "1.5rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "0.2rem", marginBottom: "0.75rem" }}>
                    {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={12} style={{ color: "#d4a574", fill: "#d4a574" }} />)}
                  </div>
                  <p style={{ color: txt, fontSize: "0.85rem", lineHeight: 1.9, margin: "0 0 1.25rem", flex: 1, fontStyle: "italic", fontWeight: 300 }}>"{item.text}"</p>
                  <div>
                    <div style={{ fontWeight: 400, fontSize: "0.8rem", letterSpacing: "0.08em" }}>{item.name}</div>
                    <div style={{ color: mut, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.15rem" }}>{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
      <section style={{ padding: "6rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <img src="https://picsum.photos/seed/luxabout/700/500" alt="about" style={{ width: "100%", objectFit: "cover" }} />
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1.2, marginBottom: "1.5rem" }}>{t.aboutTitle}</h2>
          <p style={{ color: mut, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "1.5rem" }}>{t.aboutText}</p>
          <button onClick={() => setPage("about")} style={{ background: "transparent", border: `1px solid ${brd}`, color: txt, padding: "0.75rem 2rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Our Story →</button>
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 300, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{t.allProd}</h1>
        <p style={{ color: mut, fontSize: "0.85rem" }}>{filtered.length} pieces</p>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? scheme.accent : "transparent", color: activeCat === c ? scheme.accentText : txt, border: `1px solid ${activeCat === c ? scheme.accent : brd}`, padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem" }}>
        {filtered.map(p => (
          <div key={p.id}>
            <div style={{ overflow: "hidden", aspectRatio: "4/5", marginBottom: "1rem", background: surf }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ fontSize: "0.7rem", color: scheme.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{p.cat}</div>
            <div style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: mut }}>{p.price}</span>
              <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "0.375rem 0.875rem", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.addCart}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2rem 6rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ position: "relative", height: "400px", overflow: "hidden", marginBottom: "4rem" }}>
          <img src="https://picsum.photos/seed/luxabout2/1200/500" alt="about" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ color: "#fff", fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.aboutTitle}</h1>
          </div>
        </div>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.9, color: mut, marginBottom: "3rem", fontStyle: "italic" }}>{t.aboutText}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {["Heritage", "Craftsmanship", "Sustainability", "Exclusivity"].map(v => (
            <div key={v} style={{ padding: "2rem", border: `1px solid ${brd}` }}>
              <h3 style={{ fontWeight: 400, fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{v}</h3>
              <p style={{ color: mut, fontSize: "0.875rem", lineHeight: 1.7 }}>Deeply rooted in tradition, our commitment to {v.toLowerCase()} shapes every decision we make.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2rem 6rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", maxWidth: "1000px", margin: "0 auto" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 300, letterSpacing: "0.05em", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>Visit Us</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <Icon name={i.icon} size={20} />
              <span style={{ color: mut, fontSize: "0.9rem", lineHeight: 1.6 }}>{i.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Georgia', serif", minHeight: "100vh" }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer style={{ borderTop: `1px solid ${brd}`, padding: "0" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3.5rem 2rem 2.5rem", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "2.5rem" }}>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem", color: txt, fontFamily: "'Georgia',serif" }}>LUXURIA</div>
            <p style={{ color: mut, fontSize: "0.8rem", lineHeight: 1.9, margin: "0 0 1.25rem", fontWeight: 300, fontStyle: "italic" }}>Timeless elegance crafted for those who appreciate the finest things in life. Since 1998.</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Icon name="instagram" size={16} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="facebook" size={16} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="twitter" size={16} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="youtube" size={16} style={{ color: mut, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem", color: txt }}>Collections</div>
            {["Women", "Men", "Accessories", "Shoes", "Fine Jewelry"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.55rem", cursor: "pointer", fontWeight: 300 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem", color: txt }}>Client Care</div>
            {["Contact Us", "Shipping & Delivery", "Returns & Exchanges", "Size Guide", "Care Instructions"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.55rem", cursor: "pointer", fontWeight: 300 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem", color: txt }}>Boutique</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 300 }}><Icon name="pin" size={14} /> 384 Avenue des Champs-Élysées</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 300 }}><Icon name="phone" size={14} /> +33 1 44 55 66 77</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 300 }}><Icon name="mail" size={14} /> concierge@luxuria.com</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${brd}`, padding: "1.25rem 2rem", textAlign: "center", fontSize: "0.7rem", color: mut, letterSpacing: "0.12em", fontWeight: 300 }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
