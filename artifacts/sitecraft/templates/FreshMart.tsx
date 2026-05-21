import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

type Page = "home" | "products" | "about" | "contact";

const PRODUCTS = [
  { id: 1, name: "Heirloom Tomatoes", price: "$4.99", priceNum: 4.99, img: "https://picsum.photos/seed/fresh1/400/400", cat: "Vegetables", badge: "Organic" },
  { id: 2, name: "Baby Spinach", price: "$3.49", priceNum: 3.49, img: "https://picsum.photos/seed/fresh2/400/400", cat: "Vegetables", badge: "Local" },
  { id: 3, name: "Mixed Berry Box", price: "$8.99", priceNum: 8.99, img: "https://picsum.photos/seed/fresh3/400/400", cat: "Fruits", badge: "New" },
  { id: 4, name: "Avocados (4 pack)", price: "$5.99", priceNum: 5.99, img: "https://picsum.photos/seed/fresh4/400/400", cat: "Fruits", badge: "Ripe" },
  { id: 5, name: "Free Range Eggs", price: "$6.49", priceNum: 6.49, img: "https://picsum.photos/seed/fresh5/400/400", cat: "Dairy", badge: "Farm" },
  { id: 6, name: "Sourdough Bread", price: "$7.99", priceNum: 7.99, img: "https://picsum.photos/seed/fresh6/400/400", cat: "Bakery", badge: "Baked" },
  { id: 7, name: "Greek Yogurt 500g", price: "$4.29", priceNum: 4.29, img: "https://picsum.photos/seed/fresh7/400/400", cat: "Dairy", badge: "Probiotic" },
  { id: 8, name: "Fresh Salmon Fillet", price: "$14.99", priceNum: 14.99, img: "https://picsum.photos/seed/fresh8/400/400", cat: "Meat", badge: "Wild" },
  { id: 9, name: "Cold Press Orange Juice", price: "$5.49", priceNum: 5.49, img: "https://picsum.photos/seed/fresh9/400/400", cat: "Drinks", badge: "Fresh" },
  { id: 10, name: "Broccoli Crown", price: "$2.99", priceNum: 2.99, img: "https://picsum.photos/seed/fresh10/400/400", cat: "Vegetables", badge: "Organic" },
  { id: 11, name: "Strawberries 500g", price: "$6.99", priceNum: 6.99, img: "https://picsum.photos/seed/fresh11/400/400", cat: "Fruits", badge: "Local" },
  { id: 12, name: "Whole Milk 2L", price: "$3.79", priceNum: 3.79, img: "https://picsum.photos/seed/fresh12/400/400", cat: "Dairy", badge: "Farm" },
  { id: 13, name: "Free-Range Eggs (12pk)", price: "$6.99", priceNum: 6.99, img: "https://picsum.photos/seed/fresh13/400/400", cat: "Dairy", badge: "Farm Fresh" },
  { id: 14, name: "Sourdough Boule", price: "$5.99", priceNum: 5.99, img: "https://picsum.photos/seed/fresh14/400/400", cat: "Bakery", badge: "Baked Today" },
  { id: 15, name: "Organic Avocados (4pk)", price: "$7.99", priceNum: 7.99, img: "https://picsum.photos/seed/fresh15/400/400", cat: "Vegetables", badge: "Organic" },
  { id: 16, name: "Grass-Fed Ground Beef", price: "$9.99", priceNum: 9.99, img: "https://picsum.photos/seed/fresh16/400/400", cat: "Meat", badge: "Local" },
];

const CATS = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Meat", "Drinks"];

const T = {
  en: { nav: ["Home", "Products", "About", "Contact"], hero: "Farm Fresh,\nDelivered Daily", sub: "Organic produce sourced directly from local farms. No preservatives, just pure goodness.", shop: "Shop Now", featured: "Today's Fresh Picks", viewAll: "View All", addCart: "Add", allProd: "All Products", promo: "🚚 Free delivery on orders over $35", aboutTitle: "Our Farm Story", aboutText: "FreshMart was founded in 2010 by a group of local farmers who wanted to bring the freshest produce directly to your table — without the middleman. Every item is harvested within 24 hours of delivery.", contactTitle: "We'd Love to Hear From You", name: "Name", email: "Email", message: "Message", send: "Send Message", address: "42 Green Valley Road, CA", phone: "+1 (555) 234-5678", hours: "Daily 7am–9pm", testimonialTitle: "What Our Customers Say", testimonial1: "The quality of produce is incredible. Everything arrives fresh and lasts so much longer than supermarket food.", testimonialName1: "Emma Thompson", testimonialRole1: "Weekly Subscriber", testimonial2: "Being able to support local farms while getting same-day delivery is a game changer for our family.", testimonialName2: "Carlos Mendez", testimonialRole2: "Busy Parent", testimonial3: "The farm-to-door concept is amazing. You can literally taste the difference in every bite.", testimonialName3: "Fatima Al-Rashid", testimonialRole3: "Home Cook", footer: "© 2024 FreshMart. Eat better, live better." },
  fr: { nav: ["Accueil", "Produits", "À Propos", "Contact"], hero: "Frais de la Ferme,\nLivré Chaque Jour", sub: "Produits biologiques sourcés directement des fermes locales.", shop: "Acheter Maintenant", featured: "Sélections Fraîches du Jour", viewAll: "Voir Tout", addCart: "Ajouter", allProd: "Tous les Produits", promo: "🚚 Livraison gratuite pour les commandes de plus de 35€", aboutTitle: "Notre Histoire de Ferme", aboutText: "FreshMart a été fondé en 2010 par un groupe d'agriculteurs locaux souhaitant apporter les produits les plus frais directement à votre table.", contactTitle: "Nous Contacter", name: "Nom", email: "Email", message: "Message", send: "Envoyer", address: "42 Green Valley Road, CA", phone: "+1 (555) 234-5678", hours: "Tous les jours 7h–21h", testimonialTitle: "Ce Que Disent Nos Clients", testimonial1: "La qualité des produits est incroyable. Tout arrive frais et dure bien plus longtemps.", testimonialName1: "Emma Thompson", testimonialRole1: "Abonnée Hebdomadaire", testimonial2: "Soutenir les fermes locales avec une livraison le jour même change tout pour notre famille.", testimonialName2: "Carlos Mendez", testimonialRole2: "Parent Occupé", testimonial3: "Le concept de la ferme à la porte est incroyable. On goûte vraiment la différence.", testimonialName3: "Fatima Al-Rashid", testimonialRole3: "Cuisinière", footer: "© 2024 FreshMart. Mangez mieux, vivez mieux." },
  ar: { nav: ["الرئيسية", "المنتجات", "من نحن", "اتصل بنا"], hero: "طازج من المزرعة،\nيُوصَّل يومياً", sub: "منتجات عضوية مصدرها مباشرة من المزارع المحلية.", shop: "تسوق الآن", featured: "اختيارات اليوم الطازجة", viewAll: "عرض الكل", addCart: "أضف", allProd: "جميع المنتجات", promo: "🚚 توصيل مجاني للطلبات فوق 35$", aboutTitle: "قصة مزرعتنا", aboutText: "تأسست فريش مارت عام 2010 من قِبل مجموعة من المزارعين المحليين لإيصال أطازج المنتجات مباشرة إلى مائدتك.", contactTitle: "نسعد بتواصلك معنا", name: "الاسم", email: "البريد الإلكتروني", message: "الرسالة", send: "إرسال", address: "42 طريق الوادي الأخضر، CA", phone: "+1 (555) 234-5678", hours: "يومياً 7ص–9م", testimonialTitle: "ماذا يقول عملاؤنا", testimonial1: "جودة المنتجات لا تصدق. كل شيء يصل طازجاً ويدوم لفترة أطول من طعام السوبرماركت.", testimonialName1: "إيما تومبسون", testimonialRole1: "مشترك أسبوعي", testimonial2: "دعم المزارع المحلية مع التوصيل في نفس اليوم يغير قواعد اللعبة لعائلتنا.", testimonialName2: "كارلوس مينديز", testimonialRole2: "والد مشغول", testimonial3: "مفهوم من المزرعة إلى الباب رائع. يمكنك تذوق الفرق في كل قضمة.", testimonialName3: "فاطمة الرشيد", testimonialRole3: "طباخة منزلية", footer: "© 2024 فريش مارت. كل أفضل، عيش أفضل." },
};

export default function FreshMart({ language, scheme, dark }: TemplateProps) {
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
  const bg = dark ? "#0f1a12" : scheme.bg;
  const surf = dark ? "#1a2a1d" : scheme.surface;
  const txt = dark ? "#f0fdf4" : scheme.text;
  const mut = dark ? "#6b7280" : scheme.muted;
  const brd = dark ? "#1f3525" : scheme.border;

  const navBar = (
    <>
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.5rem", fontSize: "0.8rem", fontWeight: 500 }}>{t.promo}</div>
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer" }}>
          <Icon name="leaf" size={28} /><span style={{ fontSize: "1.4rem", fontWeight: 800, color: scheme.accent }}>FreshMart</span>
        </button>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 500, fontSize: "0.875rem" }}>{t.nav[i]}</button>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Icon name="shoppingCart" size={18} /> {cartCount > 0 ? <span style={{ background: "#fff", color: scheme.accent, borderRadius: "50%", width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{cartCount}</span> : "Cart"}
        </button>
      </nav>
    </>
  );

  const homePage = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "480px", alignItems: "center" }}>
        <div style={{ padding: "4rem" }}>
          <div style={{ background: `${scheme.accent}22`, color: scheme.accent, display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.375rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}><Icon name="truck" size={16} /> Same-Day Delivery</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem", whiteSpace: "pre-line" }}>{t.hero}</h1>
          <p style={{ color: mut, lineHeight: 1.7, marginBottom: "2rem", maxWidth: "380px" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setPage("products")} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.75rem", padding: "1rem 2.5rem", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}>{t.shop}</button>
          </div>
        </div>
        <div style={{ overflow: "hidden", height: "480px" }}>
          <img src="https://picsum.photos/seed/freshhero/800/600" alt="fresh" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <section style={{ padding: "3rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.5rem" }}>{t.featured}</h2>
          <button onClick={() => setPage("products")} style={{ color: scheme.accent, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", background: "none", border: "none" }}>{t.viewAll} →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "1rem" }}>
          {PRODUCTS.slice(0, 6).map(p => (
            <div key={p.id} style={{ background: surf, borderRadius: "1rem", overflow: "hidden", border: `1px solid ${brd}` }}>
              <div style={{ position: "relative", aspectRatio: "1" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: scheme.accent, color: scheme.accentText, fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "1rem" }}>{p.badge}</span>
              </div>
              <div style={{ padding: "0.75rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.5rem" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: scheme.accent, fontSize: "0.9rem" }}>{p.price}</span>
                  <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.5rem", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center" }}>
        {[{ icon: "seedling", text: "100% Organic" }, { icon: "zap", text: "Same-day Delivery" }, { icon: "tractor", text: "Farm to Door" }, { icon: "heart", text: "Satisfaction Guaranteed" }].map((tr, i) => (
          <div key={i}><div style={{ marginBottom: "0.5rem" }}><Icon name={tr.icon} size={28} /></div><div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{tr.text}</div></div>
        ))}
      </div>
      {/* Testimonials */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: "1.5rem", marginBottom: "2.5rem" }}>{t.testimonialTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.75rem" }}>
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} style={{ color: "#eab308", fill: "#eab308" }} />)}
              </div>
              <p style={{ color: txt, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem", flex: 1 }}>"{item.text}"</p>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>{item.name}</div>
                <div style={{ color: mut, fontSize: "0.7rem" }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem" }}>
      <h1 style={{ fontWeight: 900, fontSize: "2rem", marginBottom: "0.5rem" }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.875rem" }}>{filtered.length} products</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? scheme.accent : surf, color: activeCat === c ? scheme.accentText : txt, border: `1px solid ${activeCat === c ? scheme.accent : brd}`, borderRadius: "2rem", padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: surf, borderRadius: "1rem", overflow: "hidden", border: `1px solid ${brd}` }}>
            <div style={{ position: "relative", aspectRatio: "1" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: scheme.accent, color: scheme.accentText, fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "1rem" }}>{p.badge}</span>
            </div>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", color: scheme.accent, fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>{p.cat}</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: scheme.accent, fontSize: "1.05rem" }}>{p.price}</span>
                <button onClick={() => addToCart(p)} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>{t.addCart}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div style={{ padding: "4rem 2rem 6rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", marginBottom: "4rem" }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "2.5rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>{t.aboutTitle}</h1>
            <p style={{ color: mut, lineHeight: 1.8, fontSize: "0.95rem" }}>{t.aboutText}</p>
          </div>
          <img src="https://picsum.photos/seed/freshfarm/600/500" alt="farm" style={{ width: "100%", borderRadius: "1rem" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
          {[{ n: "200+", l: "Local Farms" }, { n: "24h", l: "From Harvest to Door" }, { n: "50K+", l: "Happy Customers" }].map(s => (
            <div key={s.l} style={{ background: surf, borderRadius: "1rem", padding: "2rem", textAlign: "center", border: `1px solid ${brd}` }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: scheme.accent, marginBottom: "0.5rem" }}>{s.n}</div>
              <div style={{ color: mut, fontSize: "0.875rem" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const contactPage = (
    <div style={{ padding: "4rem 2rem 6rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
      <div>
        <h1 style={{ fontWeight: 900, fontSize: "2rem", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.75rem", padding: "1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "2rem" }}>Find Us</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Icon name={i.icon} size={20} /><span style={{ color: mut, fontSize: "0.9rem", lineHeight: 1.6 }}>{i.text}</span>
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
      <footer style={{ background: surf, borderTop: `1px solid ${brd}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem 2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Icon name="leaf" size={24} style={{ color: scheme.accent }} />
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: scheme.accent }}>FreshMart</span>
            </div>
            <p style={{ color: mut, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem" }}>Farm-fresh groceries delivered to your door. Supporting local farmers and sustainable agriculture since 2018.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Icon name="instagram" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="facebook" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="twitter" size={18} style={{ color: mut, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: txt }}>Shop</div>
            {["Fruits & Vegetables", "Dairy & Eggs", "Bakery", "Meat & Poultry", "Drinks"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: txt }}>Help</div>
            {["Shipping Info", "Returns Policy", "FAQ", "Contact Us", "Track Order"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: txt }}>Contact</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="mail" size={14} /> hello@freshmart.com</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="phone" size={14} /> +1 (888) 555-FARM</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="clock" size={14} /> 6am–10pm daily</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${brd}`, padding: "1.25rem 2rem", textAlign: "center", color: mut, fontSize: "0.8rem" }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
