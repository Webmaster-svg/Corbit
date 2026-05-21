import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

type Page = "home" | "products" | "about" | "contact";

const T = {
  en: {
    nav: ["Home", "Products", "About", "Contact"],
    hero: "Make Your\nHouse a Home",
    sub: "Curated furniture and decor that brings warmth and personality to every room.",
    shop: "Explore Collection",
    featured: "Featured Pieces",
    viewAll: "View All",
    addCart: "Add to Cart",
    allProd: "All Furniture",
    cats: "Shop by Room",
    deal: "Free shipping on orders over $500",
    aboutTitle: "Our Story",
    aboutText: "HomeNest was born from a simple belief: your home should be your sanctuary. Since 2015, we've been curating furniture and decor that blends timeless design with modern comfort. Every piece is selected for its quality, craftsmanship, and ability to transform a space.",
    contactTitle: "Get in Touch",
    name: "Name",
    email: "Email",
    message: "Your Message",
    send: "Send Message",
    address: "42 Crosby St, New York, NY 10012",
    phone: "+1 (212) 555-NEST",
    hours: "Mon\u2013Sat 10am\u20137pm",
    testimonialTitle: "From Our Customers",
    testimonial1: "The quality is outstanding. My new sofa is the centerpiece of our living room.",
    testimonialName1: "Emma L.",
    testimonialRole1: "Interior Designer",
    testimonial2: "Incredible selection and the delivery team was amazing. They set everything up perfectly.",
    testimonialName2: "James K.",
    testimonialRole2: "Homeowner",
    testimonial3: "I love that everything is sustainably sourced. Beautiful furniture with a clear conscience.",
    testimonialName3: "Olivia G.",
    testimonialRole3: "Regular Customer",
    footer: "\u00a9 2024 HomeNest. Where life happens."
  },
  fr: {
    nav: ["Accueil", "Produits", "\u00c0 Propos", "Contact"],
    hero: "Faites de\nVotre Maison un Foyer",
    sub: "Mobilier et d\u00e9coration qui apportent chaleur et personnalit\u00e9 \u00e0 chaque pi\u00e8ce.",
    shop: "D\u00e9couvrir la Collection",
    featured: "Pi\u00e8ces Vedettes",
    viewAll: "Voir Tout",
    addCart: "Ajouter au Panier",
    allProd: "Tous les Meubles",
    cats: "Acheter par Pi\u00e8ce",
    deal: "Livraison gratuite pour les commandes de plus de 500\u20ac",
    aboutTitle: "Notre Histoire",
    aboutText: "HomeNest est n\u00e9 d'une conviction simple : votre maison doit \u00eatre votre sanctuaire.",
    contactTitle: "Contactez-Nous",
    name: "Nom",
    email: "Email",
    message: "Votre Message",
    send: "Envoyer",
    address: "42 Crosby St, New York, NY 10012",
    phone: "+1 (212) 555-NEST",
    hours: "Lun\u2013Sam 10h\u201319h",
    testimonialTitle: "Avis de Nos Clients",
    testimonial1: "La qualit\u00e9 est exceptionnelle. Mon nouveau canap\u00e9 est la pi\u00e8ce ma\u00eetresse de notre salon.",
    testimonialName1: "Emma L.",
    testimonialRole1: "Architecte d'Int\u00e9rieur",
    testimonial2: "S\u00e9lection incroyable et l'\u00e9quipe de livraison \u00e9tait formidable.",
    testimonialName2: "James K.",
    testimonialRole2: "Propri\u00e9taire",
    testimonial3: "J'adore que tout soit sourc\u00e9 durablement. De beaux meubles en toute conscience.",
    testimonialName3: "Olivia G.",
    testimonialRole3: "Cliente Fid\u00e8le",
    footer: "\u00a9 2024 HomeNest. L\u00e0 o\u00f9 la vie se passe."
  },
  ar: {
    nav: ["\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629", "\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a", "\u0645\u0646 \u0646\u062d\u0646", "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627"],
    hero: "\u0627\u062c\u0639\u0644\n\u0645\u0646\u0632\u0644\u0643 \u0648\u0637\u0646\u0627\u064b",
    sub: "\u0623\u062b\u0627\u062b \u0648\u062f\u064a\u0643\u0648\u0631 \u0645\u0646\u062a\u0642\u0649 \u064a\u0636\u0641\u064a \u0627\u0644\u062f\u0641\u0621 \u0648\u0627\u0644\u0634\u062e\u0635\u064a\u0629 \u0639\u0644\u0649 \u0643\u0644 \u063a\u0631\u0641\u0629.",
    shop: "\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629",
    featured: "\u0642\u0637\u0639 \u0645\u0645\u064a\u0632\u0629",
    viewAll: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",
    addCart: "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",
    allProd: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u062b\u0627\u062b",
    cats: "\u062a\u0633\u0648\u0642 \u062d\u0633\u0628 \u0627\u0644\u063a\u0631\u0641\u0629",
    deal: "\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a \u0644\u0644\u0637\u0644\u0628\u0627\u062a \u0641\u0648\u0642 500$",
    aboutTitle: "\u0642\u0635\u062a\u0646\u0627",
    aboutText: "\u0628\u062f\u0623\u062a \u0647\u0648\u0645 \u0646\u064a\u0633\u062a \u0645\u0646 \u0625\u064a\u0645\u0627\u0646 \u0628\u0633\u064a\u0637: \u0645\u0646\u0632\u0644\u0643 \u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0645\u0644\u0627\u0630\u0643.",
    contactTitle: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
    name: "\u0627\u0644\u0627\u0633\u0645",
    email: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    message: "\u0631\u0633\u0627\u0644\u062a\u0643",
    send: "\u0625\u0631\u0633\u0627\u0644",
    address: "42 \u0643\u0631\u0648\u0633\u0628\u064a \u0633\u062a\u0631\u064a\u062a\u060c \u0646\u064a\u0648\u064a\u0648\u0631\u0643",
    phone: "+1 (212) 555-NEST",
    hours: "\u0627\u0644\u0633\u0628\u062a\u2013\u0627\u0644\u0627\u062b\u0646\u064a\u0646 10\u0635\u20137\u0645",
    testimonialTitle: "\u0645\u0646 \u0639\u0645\u0644\u0627\u0626\u0646\u0627",
    testimonial1: "\u0627\u0644\u062c\u0648\u062f\u0629 \u0631\u0627\u0626\u0639\u0629. \u0623\u0631\u064a\u0643\u062a\u064a \u0627\u0644\u062c\u062f\u064a\u062f\u0629 \u0647\u064a \u0642\u0637\u0639\u0629 \u0627\u0644\u0645\u0631\u0643\u0632 \u0641\u064a \u063a\u0631\u0641\u0629 \u0627\u0644\u0645\u0639\u064a\u0634\u0629.",
    testimonialName1: "\u0625\u064a\u0645\u0627 \u0625\u0644.",
    testimonialRole1: "\u0645\u0635\u0645\u0645\u0629 \u062f\u0627\u062e\u0644\u064a\u0629",
    testimonial2: "\u062a\u0634\u0643\u064a\u0644\u0629 \u0645\u0630\u0647\u0644\u0629 \u0648\u0641\u0631\u064a\u0642 \u0627\u0644\u062a\u0648\u0635\u064a\u0644 \u0643\u0627\u0646 \u0631\u0627\u0626\u0639\u0627\u064b.",
    testimonialName2: "\u062c\u064a\u0645\u0633 \u0643\u064a\u0647.",
    testimonialRole2: "\u0635\u0627\u062d\u0628 \u0645\u0646\u0632\u0644",
    testimonial3: "\u0623\u062d\u0628 \u0623\u0646 \u0643\u0644 \u0634\u064a\u0621 \u0645\u0633\u062a\u062f\u0627\u0645 \u0627\u0644\u0645\u0635\u062f\u0631. \u0623\u062b\u0627\u062b \u062c\u0645\u064a\u0644 \u0628\u0636\u0645\u064a\u0631 \u0645\u0631\u062a\u0627\u062d.",
    testimonialName3: "\u0623\u0648\u0644\u064a\u0641\u064a\u0627 \u062c\u064a.",
    testimonialRole3: "\u0632\u0628\u0648\u0646\u0629 \u062f\u0627\u0626\u0645\u0629",
    footer: "\u00a9 2024 \u0647\u0648\u0645 \u0646\u064a\u0633\u062a. \u062d\u064a\u062b \u062a\u062d\u062f\u062b \u0627\u0644\u062d\u064a\u0627\u0629."
  }
};

const products = [
  { id: 1, name: "Nordic Lounge Chair", price: "$649", priceNum: 649, img: "https://picsum.photos/seed/home1/500/400", room: "Living Room" },
  { id: 2, name: "Oak Dining Table", price: "$1,299", priceNum: 1299, img: "https://picsum.photos/seed/home2/500/400", room: "Dining" },
  { id: 3, name: "Linen Bed Frame", price: "$899", priceNum: 899, img: "https://picsum.photos/seed/home3/500/400", room: "Bedroom" },
  { id: 4, name: "Terrazzo Side Table", price: "$299", priceNum: 299, img: "https://picsum.photos/seed/home4/500/400", room: "Living Room" },
  { id: 5, name: "Wool Throw Blanket", price: "$89", priceNum: 89, img: "https://picsum.photos/seed/home5/500/400", room: "Bedroom" },
  { id: 6, name: "Rattan Pendant Light", price: "$199", priceNum: 199, img: "https://picsum.photos/seed/home6/500/400", room: "Dining" },
  { id: 7, name: "Marble Coffee Table", price: "$1,199", priceNum: 1199, img: "https://picsum.photos/seed/home7/500/400", room: "Living Room" },
  { id: 8, name: "Ceramic Table Lamp", price: "$249", priceNum: 249, img: "https://picsum.photos/seed/home8/500/400", room: "Bedroom" },
  { id: 9, name: "Teak Outdoor Bench", price: "$599", priceNum: 599, img: "https://picsum.photos/seed/home9/500/400", room: "Outdoor" },
];

const rooms = [
  { name: "Living Room", icon: "sofa", img: "https://picsum.photos/seed/roomliving/600/500" },
  { name: "Bedroom", icon: "bed", img: "https://picsum.photos/seed/roombed/600/500" },
  { name: "Dining", icon: "cook", img: "https://picsum.photos/seed/roomdining/600/500" },
  { name: "Kitchen", icon: "chair", img: "https://picsum.photos/seed/roomkitchen/600/500" },
  { name: "Office", icon: "briefcase", img: "https://picsum.photos/seed/roomoffice/600/500" },
  { name: "Outdoor", icon: "tree", img: "https://picsum.photos/seed/roomoutdoor/600/500" },
];

const CATS = ["All", ...new Set(products.map(p => p.room))];

export default function HomeNest({ language, scheme, dark }: TemplateProps) {
  const [page, setPage] = useState<Page>("home");
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (p: typeof products[0]) => {
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
  const filtered = activeCat === "All" ? products : products.filter(p => p.room === activeCat);

  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#0e0d0b" : "#faf8f5";
  const surf = dark ? "#1a1815" : "#f0ece6";
  const txt = dark ? "#f5f0ea" : "#2c2822";
  const mut = dark ? "#7a7268" : "#8a8278";
  const brd = dark ? "#2e2a24" : "#d8d2cc";

  const navBar = (
    <>
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.5rem 1rem", fontSize: "0.78rem" }}>{t.deal}</div>
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => setPage("home")} style={{ fontWeight: 400, fontSize: "1.4rem", letterSpacing: "0.18em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", color: txt }}>HomeNest</button>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? scheme.accent : mut, fontWeight: page === p ? 600 : 400, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{t.nav[i]}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <Icon name="heart" size={18} style={{ color: mut, cursor: "pointer" }} />
          <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: txt, display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}>
            <Icon name="bag" size={18} /> {cartCount > 0 && <span style={{ background: scheme.accent, color: scheme.accentText, width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
        </div>
      </nav>
    </>
  );

  const homePage = (
    <>
      <div style={{ position: "relative", height: "85vh", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/homenest/1400/900" alt="home" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5rem", color: "#fff" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.7 }}>New Collection Available</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1.25rem", whiteSpace: "pre-line" }}>{t.hero}</h1>
          <p style={{ opacity: 0.8, maxWidth: "420px", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <button onClick={() => setPage("products")} style={{ width: "fit-content", background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem 2.5rem", cursor: "pointer", fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.shop}</button>
        </div>
      </div>

      <section style={{ padding: "4rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 300, fontSize: "1.6rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.cats}</h2>
          <p style={{ color: mut, fontSize: "0.85rem" }}>Find the perfect pieces for every space in your home</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {rooms.map(r => (
            <div key={r.name} style={{ position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "6/5", transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
              <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem", display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "2.2rem", height: "2.2rem", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={r.icon} size={16} style={{ color: "#fff" }} />
                </div>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.05em" }}>{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "2rem 2.5rem 5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${brd}`, paddingBottom: "1rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 400, fontSize: "1.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.featured}</h2>
          <button onClick={() => setPage("products")} style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "none" }}>{t.viewAll} \u2192</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          {products.slice(0, 6).map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ overflow: "hidden", aspectRatio: "5/4", marginBottom: "1rem", background: surf }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ fontSize: "0.68rem", color: scheme.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{p.room}</div>
              <div style={{ fontWeight: 400, fontSize: "0.95rem", marginBottom: "0.5rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>{p.price}</span>
                <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "0.4rem 1.1rem", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.08em" }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "4rem 2rem", background: surf }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "1.2rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2.5rem" }}>{t.testimonialTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} style={{ background: bg, border: `1px solid ${brd}`, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <p style={{ color: txt, fontSize: "0.85rem", lineHeight: 1.8, margin: "0 0 1rem", flex: 1, fontStyle: "italic", fontFamily: "'Georgia', serif" }}>"<span>{item.text}</span>"</p>
              <div style={{ borderTop: `1px solid ${brd}`, paddingTop: "0.75rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}>{item.name}</div>
                <div style={{ color: mut, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2.5rem 5rem" }}>
      <h1 style={{ fontWeight: 400, fontSize: "2rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.85rem" }}>{filtered.length} products</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? scheme.accent : "transparent", color: activeCat === c ? scheme.accentText : mut, border: `1px solid ${activeCat === c ? scheme.accent : brd}`, padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: activeCat === c ? 600 : 400 }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
        {filtered.map(p => (
          <div key={p.id}>
            <div style={{ overflow: "hidden", aspectRatio: "5/4", marginBottom: "1rem", background: surf }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ fontSize: "0.68rem", color: scheme.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{p.room}</div>
            <div style={{ fontWeight: 400, fontSize: "0.95rem", marginBottom: "0.5rem" }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{p.price}</span>
              <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.08em" }}>{t.addCart}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2.5rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontWeight: 400, fontSize: "2.5rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>{t.aboutTitle}</h1>
      <p style={{ color: mut, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "3rem" }}>{t.aboutText}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2rem" }}>
        {[{ n: "200+", l: "Designs Curated" }, { n: "15K+", l: "Happy Homes" }, { n: "4.9", l: "Average Rating" }].map(s => (
          <div key={s.l} style={{ background: surf, border: `1px solid ${brd}`, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 400, color: scheme.accent, marginBottom: "0.5rem" }}>{s.n}</div>
            <div style={{ color: mut, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2.5rem 6rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
      <div>
        <h1 style={{ fontWeight: 400, fontSize: "1.8rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", padding: "1rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 400, fontSize: "1.1rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem" }}>Showroom</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Icon name={i.icon} size={18} /><span style={{ color: mut, fontSize: "0.88rem", lineHeight: 1.6 }}>{i.text}</span>
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
      <footer style={{ background: dark ? "#0e0d0b" : "#f8f5f0", borderTop: `1px solid ${brd}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem 2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ fontWeight: 400, fontSize: "1.3rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem", color: txt }}>HomeNest</div>
            <p style={{ color: mut, fontSize: "0.85rem", lineHeight: 1.8, margin: "0 0 1rem" }}>Curated furniture and home decor designed to transform your space.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Icon name="instagram" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="facebook" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="twitter" size={18} style={{ color: mut, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", color: txt }}>Shop</div>
            {["Furniture", "Lighting", "Decor", "Outdoor", "Sale"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", color: txt }}>Support</div>
            {["Delivery", "Returns", "Warranty", "Care Guide", "Contact"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", color: txt }}>Visit</div>
            <div style={{ color: mut, fontSize: "0.82rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="pin" size={14} /> 42 Crosby St, New York</div>
            <div style={{ color: mut, fontSize: "0.82rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="clock" size={14} /> Mon\u2013Sat 10am\u20137pm</div>
            <div style={{ color: mut, fontSize: "0.82rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="phone" size={14} /> +1 (212) 555-NEST</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${brd}`, padding: "1.25rem 2rem", textAlign: "center", color: mut, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
