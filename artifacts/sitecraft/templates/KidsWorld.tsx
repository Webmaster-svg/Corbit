import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

type Page = "home" | "products" | "about" | "contact";

const T = {
  en: {
    nav: ["Home", "Products", "About", "Contact"],
    hero: "Play. Learn.\nGrow.",
    sub: "Safe, educational toys and clothes that spark imagination and joy at every age.",
    shop: "Let's Play!",
    featured: "Top Picks",
    viewAll: "See All",
    addCart: "Add to Cart",
    allProd: "All Toys",
    cats: "Shop by Age",
    deal: "Free shipping on orders over $50",
    aboutTitle: "Our Mission",
    aboutText: "KidsWorld is on a mission to make playtime magical. We carefully select toys that are safe, educational, and endlessly fun. From babies to teens, every product is chosen to inspire creativity and spark joy.",
    contactTitle: "Say Hello",
    name: "Name",
    email: "Email",
    message: "Your Message",
    send: "Send Message",
    address: "42 Toy Lane, Imagination City",
    phone: "+1 (800) 555-KIDS",
    hours: "Mon–Sun 7am–9pm",
    testimonialTitle: "Happy Parents",
    testimonial1: "My kids absolutely love the coding robot! It's educational and they don't even realize they're learning.",
    testimonialName1: "Laura S.",
    testimonialRole1: "Mom of Two",
    testimonial2: "The quality is incredible. We've had our dinosaur set for over a year and it still looks new.",
    testimonialName2: "Michael T.",
    testimonialRole2: "Dad & Teacher",
    testimonial3: "Fast shipping and everything was exactly as described. My daughter is obsessed with her dress-up set!",
    testimonialName3: "Aisha R.",
    testimonialRole3: "Verified Buyer",
    footer: "© 2024 KidsWorld. Play, Learn, Grow."
  },
  fr: {
    nav: ["Accueil", "Produits", "À Propos", "Contact"],
    hero: "Jouer. Apprendre.\nGrandir.",
    sub: "Des jouets et vêtements sûrs et éducatifs qui éveillent l'imagination.",
    shop: "Jouons!",
    featured: "Meilleurs Choix",
    viewAll: "Voir Tout",
    addCart: "Ajouter au Panier",
    allProd: "Tous les Jouets",
    cats: "Acheter par Âge",
    deal: "Livraison gratuite pour les commandes de plus de 50€",
    aboutTitle: "Notre Mission",
    aboutText: "KidsWorld a pour mission de rendre le temps de jeu magique. Nous sélectionnons des jouets sûrs, éducatifs et amusants.",
    contactTitle: "Bonjour",
    name: "Nom",
    email: "Email",
    message: "Votre Message",
    send: "Envoyer",
    address: "42 Toy Lane, Imagination City",
    phone: "+1 (800) 555-KIDS",
    hours: "Lun–Dim 7h–21h",
    testimonialTitle: "Parents Heureux",
    testimonial1: "Mes enfants adorent le robot de codage! C'est éducatif sans même qu'ils s'en rendent compte.",
    testimonialName1: "Laura S.",
    testimonialRole1: "Maman de Deux",
    testimonial2: "La qualité est incroyable. Notre set de dinosaures est comme neuf après un an.",
    testimonialName2: "Michael T.",
    testimonialRole2: "Papa & Enseignant",
    testimonial3: "Livraison rapide et tout était exactement comme décrit. Ma fille est obsédée!",
    testimonialName3: "Aisha R.",
    testimonialRole3: "Acheteuse Confirmée",
    footer: "© 2024 KidsWorld. Jouer, Apprendre, Grandir."
  },
  ar: {
    nav: ["الرئيسية", "المنتجات", "من نحن", "اتصل بنا"],
    hero: "العب.تعلم.\nاكبر.",
    sub: "ألعاب وملابس آمنة وتعليمية توقد الخيال والفرح.",
    shop: "هيا نلعب!",
    featured: "أفضل الاختيارات",
    viewAll: "عرض الكل",
    addCart: "أضف إلى السلة",
    allProd: "جميع الألعاب",
    cats: "تسوق حسب العمر",
    deal: "شحن مجاني للطلبات فوق 50$",
    aboutTitle: "مهمتنا",
    aboutText: "كيدز وورلد في مهمة لجعل وقت اللعب سحرياً. نختار ألعاباً آمنة وتعليمية وممتعة بلا نهاية.",
    contactTitle: "قل مرحباً",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "رسالتك",
    send: "إرسال",
    address: "42 طريق اللعب، مدينة الخيال",
    phone: "+1 (800) 555-KIDS",
    hours: "الاثنين–الأحد 7ص–9م",
    testimonialTitle: "آباء سعداء",
    testimonial1: "أطفالي يحبون روبوت البرمجة! إنه تعليمي دون أن يدركوا ذلك.",
    testimonialName1: "لورا إس.",
    testimonialRole1: "أم لطفلين",
    testimonial2: "الجودة لا تصدق. مجموعة الديناصورات لدينا جديدة بعد عام.",
    testimonialName2: "مايكل تي.",
    testimonialRole2: "أب ومعلم",
    testimonial3: "شحن سريع وكل شيء كما هو موصوف. ابنتي مهووسة!",
    testimonialName3: "عائشة ر.",
    testimonialRole3: "مشتريه موثوقة",
    footer: "© 2024 كيدز وورلد. العب، تعلم، اكبر."
  }
};

const products = [
  { id: 1, name: "LEGO City Mega Set", price: "$59.99", priceNum: 59.99, img: "https://picsum.photos/seed/kid1/400/400", age: "6-12", color: "#fef9c3" },
  { id: 2, name: "Plush Rainbow Bear", price: "$24.99", priceNum: 24.99, img: "https://picsum.photos/seed/kid2/400/400", age: "0-3", color: "#fce7f3" },
  { id: 3, name: "Art & Craft Kit", price: "$34.99", priceNum: 34.99, img: "https://picsum.photos/seed/kid3/400/400", age: "4-8", color: "#dbeafe" },
  { id: 4, name: "Mini Dinosaur Set", price: "$19.99", priceNum: 19.99, img: "https://picsum.photos/seed/kid4/400/400", age: "3-7", color: "#dcfce7" },
  { id: 5, name: "Coding Robot Buddy", price: "$79.99", priceNum: 79.99, img: "https://picsum.photos/seed/kid5/400/400", age: "8-12", color: "#e0e7ff" },
  { id: 6, name: "Princess Dress-Up Set", price: "$29.99", priceNum: 29.99, img: "https://picsum.photos/seed/kid6/400/400", age: "3-8", color: "#fce7f3" },
  { id: 7, name: "Superhero Cape Set", price: "$24.99", priceNum: 24.99, img: "https://picsum.photos/seed/kid7/400/400", age: "3-7", color: "#fef3c7" },
  { id: 8, name: "Magnetic Building Tiles", price: "$49.99", priceNum: 49.99, img: "https://picsum.photos/seed/kid8/400/400", age: "4-10", color: "#e0e7ff" },
  { id: 9, name: "Kids Gardening Kit", price: "$29.99", priceNum: 29.99, img: "https://picsum.photos/seed/kid9/400/400", age: "5-12", color: "#d1fae5" },
  { id: 10, name: "Musical Play Mat", price: "$39.99", priceNum: 39.99, img: "https://picsum.photos/seed/kid10/400/400", age: "0-3", color: "#fce7f3" },
];

const ageGroups = [
  { label: "0-2 Years", emoji: "baby", color: "#fee2e2" },
  { label: "3-5 Years", emoji: "baby", color: "#fef9c3" },
  { label: "6-8 Years", emoji: "baby", color: "#dcfce7" },
  { label: "9-12 Years", emoji: "baby", color: "#dbeafe" },
  { label: "Teens", emoji: "baby", color: "#e0e7ff" },
];

const CATS = ["All", "0-3", "3-7", "4-8", "5-12", "6-12", "8-12"];

export default function KidsWorld({ language, scheme, dark }: TemplateProps) {
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
  const filtered = activeCat === "All" ? products : products.filter(p => p.age === activeCat);

  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const ac = scheme.accent;
  const bg = dark ? "#0f0f14" : "#ffffff";
  const surf = dark ? "#1c1c24" : "#f8f7fa";
  const txt = dark ? "#e8e6f0" : "#1e1b2e";
  const mut = dark ? "#7a77a0" : "#7a7599";
  const brd = dark ? "#2c2a3a" : "#e2e0ec";

  const navBar = (
    <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Icon name="teddy" size={24} style={{ color: ac }} />
        <span style={{ fontSize: "1.35rem", fontWeight: 700, color: txt, letterSpacing: "-0.02em" }}>KidsWorld</span>
      </button>
      <div style={{ display: "flex", gap: "2rem" }}>
        {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
          <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? ac : mut, fontWeight: page === p ? 600 : 400, fontSize: "0.875rem" }}>{t.nav[i]}</button>
        ))}
      </div>
      <button onClick={() => setCartOpen(true)} style={{ background: ac, color: "#fff", border: "none", padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
        <Icon name="bag" size={18} /> {cartCount > 0 && <span style={{ background: "#fff", color: ac, width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
      </button>
    </nav>
  );

  const heroBg = dark ? "#1a1728" : "#f5f3ff";

  const homePage = (
    <>
      <div style={{ background: heroBg }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", minHeight: "480px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: `${ac}15`, color: ac, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              <Icon name="sparkles" size={14} /> New Spring Collection
            </div>
            <h1 style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.25rem", color: txt, letterSpacing: "-0.02em", whiteSpace: "pre-line" }}>{t.hero}</h1>
            <p style={{ color: mut, lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.95rem", maxWidth: "380px" }}>{t.sub}</p>
            <button onClick={() => setPage("products")} style={{ background: ac, color: "#fff", border: "none", padding: "0.875rem 2rem", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" }}>{t.shop}</button>
          </div>
          <div style={{ overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
            <img src="https://picsum.photos/seed/kidhero2/600/480" alt="kids" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>

      <section style={{ padding: "4rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>{t.cats}</h2>
          <p style={{ color: mut, fontSize: "0.85rem" }}>Find the perfect toy for every stage</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
          {ageGroups.map(a => (
            <div key={a.label} style={{ background: surf, border: `1px solid ${brd}`, padding: "1.5rem 1rem", textAlign: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: "2.5rem", height: "2.5rem", background: `${ac}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>
                <Icon name="baby" size={20} style={{ color: ac }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{a.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "2rem 2rem 5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>{t.featured}</h2>
            <p style={{ color: mut, fontSize: "0.85rem", marginTop: "0.25rem" }}>Our most-loved toys this month</p>
          </div>
          <button onClick={() => setPage("products")} style={{ color: ac, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {t.viewAll} <Icon name="chevronRight" size={16} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem" }}>
          {products.slice(0, 5).map(p => (
            <div key={p.id} style={{ background: surf, overflow: "hidden", border: `1px solid ${brd}`, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ padding: "0.875rem" }}>
                <div style={{ fontSize: "0.6rem", color: ac, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Ages {p.age}</div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{p.price}</span>
                  <button onClick={() => addToCart(p)} style={{ background: ac, color: "#fff", border: "none", padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Icon name="plus" size={12} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: surf, borderTop: `1px solid ${brd}`, borderBottom: `1px solid ${brd}`, padding: "2rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center" }}>
        {[{ icon: "shield", text: "Safety Tested" }, { icon: "package", text: "Free Shipping $50+" }, { icon: "rotate", text: "30-Day Returns" }, { icon: "heart", text: "Parent Loved" }].map((tr, i) => (
          <div key={i}>
            <div style={{ marginBottom: "0.5rem" }}><Icon name={tr.icon} size={22} style={{ color: ac }} /></div>
            <div style={{ fontWeight: 600, fontSize: "0.8rem", color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      <section style={{ padding: "4rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: "1.3rem", marginBottom: "2.5rem", letterSpacing: "-0.02em" }}>{t.testimonialTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} style={{ background: surf, border: `1px solid ${brd}`, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <p style={{ color: txt, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem", flex: 1 }}>"{item.text}"</p>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.name}</div>
                <div style={{ color: mut, fontSize: "0.7rem" }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.875rem" }}>{filtered.length} products</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? ac : surf, color: activeCat === c ? "#fff" : mut, border: `1px solid ${activeCat === c ? ac : brd}`, padding: "0.5rem 1rem", cursor: "pointer", fontWeight: activeCat === c ? 600 : 500, fontSize: "0.8rem" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: surf, overflow: "hidden", border: `1px solid ${brd}` }}>
            <div style={{ aspectRatio: "1", overflow: "hidden" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ padding: "0.875rem" }}>
              <div style={{ fontSize: "0.6rem", color: ac, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Ages {p.age}</div>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{p.price}</span>
                <button onClick={() => addToCart(p)} style={{ background: ac, color: "#fff", border: "none", padding: "0.4rem 0.875rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>{t.addCart}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ position: "relative", height: "320px", overflow: "hidden", marginBottom: "3rem" }}>
        <img src="https://picsum.photos/seed/kidabout/1200/500" alt="about" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>{t.aboutTitle}</h1>
        </div>
      </div>
      <p style={{ color: mut, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "3rem" }}>{t.aboutText}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
        {[{ n: "500+", l: "Toys Curated" }, { n: "50K+", l: "Happy Kids" }, { n: "4.9", l: "Safety Rating" }].map(s => (
          <div key={s.l} style={{ background: surf, border: `1px solid ${brd}`, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: ac, marginBottom: "0.5rem" }}>{s.n}</div>
            <div style={{ color: mut, fontSize: "0.85rem" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
      <div>
        <h1 style={{ fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.02em", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: ac, color: "#fff", border: "none", padding: "1rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: "2rem" }}>Visit Us</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ width: "2.25rem", height: "2.25rem", background: `${ac}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={i.icon} size={16} style={{ color: ac }} />
              </div>
              <span style={{ color: mut, fontSize: "0.9rem" }}>{i.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}>
          <Icon name="instagram" size={20} style={{ color: mut, cursor: "pointer" }} />
          <Icon name="facebook" size={20} style={{ color: mut, cursor: "pointer" }} />
          <Icon name="youtube" size={20} style={{ color: mut, cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: "100vh" }}>
      <div style={{ background: ac, color: "#fff", textAlign: "center", padding: "0.5rem", fontSize: "0.78rem", fontWeight: 600 }}>{t.deal}</div>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer style={{ background: surf, borderTop: `1px solid ${brd}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem 2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Icon name="teddy" size={22} style={{ color: ac }} />
              <span style={{ fontSize: "1.3rem", fontWeight: 700, color: txt, letterSpacing: "-0.02em" }}>KidsWorld</span>
            </div>
            <p style={{ color: mut, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem" }}>Where play meets learning. Safe, fun toys for every age and stage.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Icon name="instagram" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="facebook" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="youtube" size={18} style={{ color: mut, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", color: txt }}>Shop</div>
            {["Toys", "Clothes", "Books", "Outdoor", "Sale"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", color: txt }}>Help</div>
            {["Shipping", "Returns", "Safety", "FAQ", "Contact"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", color: txt }}>Contact</div>
            <div style={{ color: mut, fontSize: "0.82rem", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="mail" size={14} /> hello@kidsworld.com</div>
            <div style={{ color: mut, fontSize: "0.82rem", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="phone" size={14} /> +1 (800) 555-KIDS</div>
            <div style={{ color: mut, fontSize: "0.82rem", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="clock" size={14} /> Mon–Sun 7am–9pm</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${brd}`, padding: "1.25rem 2rem", textAlign: "center", color: mut, fontSize: "0.8rem" }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
