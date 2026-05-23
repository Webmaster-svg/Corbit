import { useState, useEffect } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

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
  { id: 13, name: "Sprint Training Resistance Bands", price: "$29", priceNum: 29, img: "https://picsum.photos/seed/sport13/400/400", cat: "Training", hot: false },
  { id: 14, name: "Pro Weightlifting Belt", price: "$89", priceNum: 89, img: "https://picsum.photos/seed/sport14/400/400", cat: "Training", hot: false },
  { id: 15, name: "Running Hydration Vest", price: "$119", priceNum: 119, img: "https://picsum.photos/seed/sport15/400/400", cat: "Running", hot: true },
  { id: 16, name: "Cycling Helmet Aero", price: "$249", priceNum: 249, img: "https://picsum.photos/seed/sport16/400/400", cat: "Cycling", hot: false },
];

const CATS = ["All", "Running", "Training", "Tennis", "Boxing", "Cycling", "Basketball", "Football", "Swimming", "Essentials"];

const T = {
  en: { nav: ["Home", "Shop", "About", "Contact"], hero: "BUILT FOR\nCHAMPIONS", sub: "Performance gear engineered for those who refuse to settle. Train harder. Go further.", shop: "Shop Now", viewAll: "View All", addCart: "Add to Cart", allProd: "All Products", deal: "🏷️ MEMBERS SAVE 20% — Join Free Today", aboutTitle: "About SportsPro", aboutText: "SportsPro was built by athletes, for athletes. Since 2012 we've been delivering pro-grade equipment to amateurs and professionals alike. Every product is tested by our team of elite coaches and athletes before it reaches you.", contactTitle: "Talk to Us", name: "Name", email: "Email", message: "Your message", send: "Send", address: "SportsPro HQ, Los Angeles, CA", phone: "+1 (310) 555-0001",     hours: "Mon–Fri 8am–8pm", testimonialTitle: "From Athletes Like You", testimonial1: "The ProRun X5 completely changed my training. Lightweight, responsive, and incredibly durable. Worth every mile.", testimonialName1: "Marcus Johnson", testimonialRole1: "Marathon Runner", testimonial2: "I've tested gear from every major brand and SportsPro consistently delivers the best value and performance.", testimonialName2: "Coach Rivera", testimonialRole2: "Head Coach, NYC", testimonial3: "Customer for life. The quality is unmatched and their support team actually knows what they're talking about.", testimonialName3: "Tina Zhang", testimonialRole3: "CrossFit Athlete", footer: "© 2024 SportsPro. No limits." },
  fr: { nav: ["Accueil", "Boutique", "À Propos", "Contact"], hero: "CONÇU POUR\nLES CHAMPIONS", sub: "Équipement de performance conçu pour ceux qui refusent de se contenter de peu.", shop: "Acheter Maintenant", viewAll: "Voir Tout", addCart: "Ajouter", allProd: "Tous les Produits", deal: "🏷️ LES MEMBRES ÉCONOMISENT 20%", aboutTitle: "À Propos de SportsPro", aboutText: "SportsPro a été créé par des athlètes, pour des athlètes.", contactTitle: "Nous Contacter", name: "Nom", email: "Email", message: "Votre message", send: "Envoyer", address: "SportsPro HQ, Los Angeles, CA", phone: "+1 (310) 555-0001", hours: "Lun–Ven 8h–20h", testimonialTitle: "Par des Athlètes Comme Vous", testimonial1: "La ProRun X5 a complètement changé mon entraînement. Légère, réactive et incroyablement durable.", testimonialName1: "Marcus Johnson", testimonialRole1: "Coureur de Marathon", testimonial2: "J'ai testé du matériel de toutes les grandes marques. SportsPro offre le meilleur rapport qualité-prix.", testimonialName2: "Coach Rivera", testimonialRole2: "Entraîneur Principal, NYC", testimonial3: "Client à vie. La qualité est inégalée et l'équipe de support s'y connaît vraiment.", testimonialName3: "Tina Zhang", testimonialRole3: "Athlète CrossFit", footer: "© 2024 SportsPro. Sans limites." },
  ar: { nav: ["الرئيسية", "المتجر", "من نحن", "اتصل بنا"], hero: "صُنع\nللأبطال", sub: "معدات أداء مصممة لمن لا يقبلون بأقل من الأفضل.", shop: "تسوق الآن", viewAll: "عرض الكل", addCart: "أضف للسلة", allProd: "جميع المنتجات", deal: "🏷️ الأعضاء يوفرون 20%", aboutTitle: "عن سبورتس برو", aboutText: "بُنيت سبورتس برو من قِبل رياضيين، لأجل الرياضيين.", contactTitle: "تحدث إلينا", name: "الاسم", email: "البريد الإلكتروني", message: "رسالتك", send: "إرسال", address: "المقر الرئيسي، لوس أنجلوس، كاليفورنيا", phone: "+1 (310) 555-0001", hours: "الاثنين–الجمعة 8ص–8م", testimonialTitle: "من رياضيين مثلك", testimonial1: "ProRun X5 غيرت تدريبي تماماً. خفيفة وسريعة الاستجابة ومتينة بشكل لا يصدق.", testimonialName1: "ماركوس جونسون", testimonialRole1: "عداء ماراثون", testimonial2: "لقد اختبرت معدات من كل العلامات التجارية الكبرى. سبورتس برو تقدم أفضل قيمة وأداء.", testimonialName2: "المدرب ريفيرا", testimonialRole2: "مدرب رئيسي، نيويورك", testimonial3: "زبون مدى الحياة. الجودة لا تضاهى وفريق الدعم يعرف ما يتحدث عنه حقاً.", testimonialName3: "تينا تشانغ", testimonialRole3: "رياضية كروس فيت", footer: "© 2024 سبورتس برو. بلا حدود." },
};

export default function SportsPro({ language, scheme, dark }: TemplateProps) {
  const [page, setPage] = useState<Page>("home");
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [slide, setSlide] = useState(0);

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
  const ac = scheme.accent;
  const bg = dark ? "#0a0a0a" : scheme.bg;
  const surf = dark ? "#161616" : scheme.surface;
  const txt = dark ? "#f0f0f0" : scheme.text;
  const mut = dark ? "#666" : scheme.muted;
  const brd = dark ? "#222" : scheme.border;

  const slides = [
    { img: "https://picsum.photos/seed/sporthero/1400/800", title: t.hero.split('\n')[0], subtitle: t.hero.split('\n')[1] || "", text: t.sub },
    { img: "https://picsum.photos/seed/sporthero2/1400/800", title: "DOMINATE", subtitle: "YOUR GAME", text: "From the field to the gym — gear that gives you the edge when it matters most." },
    { img: "https://picsum.photos/seed/sporthero3/1400/800", title: "TRAIN LIKE", subtitle: "A PRO", text: "Premium equipment trusted by Olympic athletes and professional teams worldwide." },
  ];

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const navBar = (
    <>
      <div style={{ background: `linear-gradient(90deg,${ac},#ef4444)`, color: "#fff", textAlign: "center", padding: "0.5rem", fontSize: "0.8rem", fontWeight: 700 }}>
        {t.deal}
      </div>
      <nav className="sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between p-4 md:px-8 border-b gap-4" style={{ background: bg, borderColor: brd }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 900, fontSize: "1.5rem", color: txt, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Icon name="trophy" size={22} style={{ color: ac }} />SPORTS<span style={{ color: ac }}>PRO</span>
        </button>
        <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? ac : mut, fontWeight: page === p ? 800 : 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: page === p ? `2px solid ${ac}` : "2px solid transparent", paddingBottom: "0.25rem" }}>
              {t.nav[i]}
            </button>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{ background: ac, color: "#fff", border: "none", padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 800, fontSize: "0.875rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Icon name="bag" size={18} /> {cartCount > 0 && <span style={{ background: "#fff", color: ac, width: "1.2rem", height: "1.2rem", fontSize: "0.65rem", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
      </nav>
    </>
  );

  const homePage = (
    <>
      <div style={{ position: "relative", overflow: "hidden", minHeight: "560px" }}>
        <div style={{ display: "flex", transition: "transform 0.5s ease", transform: `translateX(-${slide * 100}%)`, width: `${slides.length * 100}%` }}>
          {slides.map((s, i) => (
            <div key={i} style={{ width: `${100 / slides.length}%` }} className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[560px] shrink-0">
              <div className="p-8 md:p-16 z-10 relative">
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${ac}22`, color: ac, border: `1px solid ${ac}44`, padding: "0.375rem 1.125rem", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
                  <Icon name="flame" size={14} /> {i === 0 ? "New Arrivals" : i === 1 ? "Pro Series" : "Elite Gear"}
                </div>
                <h1 style={{ fontSize: "clamp(2.2rem,4.5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
                  <span style={{ color: txt }}>{s.title}</span>
                </h1>
                <h1 style={{ fontSize: "clamp(2.2rem,4.5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
                  <span style={{ color: ac }}>{s.subtitle}</span>
                </h1>
                <div style={{ width: "4rem", height: "4px", background: ac, marginBottom: "1.5rem" }} />
                <p style={{ color: mut, maxWidth: "400px", lineHeight: 1.7, marginBottom: "2.5rem", fontSize: "0.95rem" }}>{s.text}</p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={() => setPage("products")} style={{ background: ac, color: "#fff", border: "none", padding: "0.875rem 2rem", cursor: "pointer", fontWeight: 800, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.shop}</button>
                  <button onClick={() => setPage("about")} style={{ background: "transparent", color: txt, border: `1px solid ${brd}`, padding: "0.875rem 2rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Story</button>
                </div>
              </div>
              <div style={{ position: "relative" }} className="overflow-hidden h-[300px] md:h-[560px]">
                <img src={s.img} alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${bg}, transparent)` }} className="hidden md:block" />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${bg}, transparent)` }} className="block md:hidden" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `${bg}88`, border: "none", color: "#fff", width: "2.5rem", height: "2.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
          <Icon name="chevronLeft" size={22} />
        </button>
        <button onClick={() => setSlide(s => (s + 1) % slides.length)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `${bg}88`, border: "none", color: "#fff", width: "2.5rem", height: "2.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
          <Icon name="chevronRight" size={22} />
        </button>
        <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", gap: "0.5rem" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: "0.625rem", height: "0.625rem", border: "none", cursor: "pointer", background: slide === i ? ac : `${mut}66`, padding: 0 }} />
          ))}
        </div>
      </div>
      <div style={{ background: surf, borderTop: `1px solid ${brd}`, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2rem" }} className="flex gap-8 flex-wrap justify-center">
        {CATS.filter(c => c !== "All").map(s => (
          <button key={s} onClick={() => { setPage("products"); setActiveCat(s); }} style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", whiteSpace: "nowrap", background: "none", border: "none", color: mut, display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Icon name="shoe" size={14} style={{ color: ac }} />{s}
          </button>
        ))}
      </div>
      <section style={{ padding: "4rem 2rem 5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 900, fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Top Performers</h2>
          <button onClick={() => setPage("products")} style={{ color: ac, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.8rem", background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            {t.viewAll} <Icon name="chevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id} style={{ background: surf, overflow: "hidden", border: `1px solid ${brd}`, position: "relative", transition: "transform 0.2s" }}>
              {p.hot && <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: ac, color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "0.2rem 0.6rem", textTransform: "uppercase", letterSpacing: "0.05em", zIndex: 1 }}>HOT</div>}
              <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ fontSize: "0.65rem", color: ac, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>{p.cat}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 900, fontSize: "1rem", color: ac }}>{p.price}</span>
                  <button onClick={() => addToCart(p)} style={{ background: ac, color: "#fff", border: "none", padding: "0.4rem 0.875rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Icon name="plus" size={14} /> {t.addCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ borderTop: `1px solid ${brd}`, borderBottom: `1px solid ${brd}`, background: surf }} className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 text-center">
        {[{ icon: "trophy", text: "Pro-Grade Materials" }, { icon: "package", text: "Free Shipping $50+" }, { icon: "rotate", text: "Easy Returns" }, { icon: "shoe", text: "Expert Athletes" }].map((tr, i) => (
          <div key={i}>
            <div style={{ width: "3rem", height: "3rem", background: `${ac}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>
              <Icon name={tr.icon} size={22} style={{ color: ac }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.82rem", color: txt }}>{tr.text}</div>
          </div>
        ))}
      </div>
      <section style={{ padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2.5rem" }}>{t.testimonialTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} style={{ background: surf, border: `1px solid ${brd}`, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "0.75rem" }}>
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} style={{ color: ac, fill: ac }} />)}
              </div>
              <p style={{ color: txt, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem", flex: 1 }}>"{item.text}"</p>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.name}</div>
                <div style={{ color: mut, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.1rem" }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section style={{ padding: "3rem 2rem 5rem" }}>
      <h1 style={{ fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.allProd}</h1>
      <p style={{ color: mut, marginBottom: "2rem", fontSize: "0.875rem" }}>{filtered.length} products</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ background: activeCat === c ? ac : surf, color: activeCat === c ? "#fff" : txt, border: `1px solid ${activeCat === c ? ac : brd}`, padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {filtered.map(p => (
          <div key={p.id} style={{ background: surf, overflow: "hidden", border: `1px solid ${brd}`, position: "relative" }}>
            {p.hot && <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: ac, color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "0.2rem 0.6rem", textTransform: "uppercase", zIndex: 1 }}>HOT</div>}
            <div style={{ aspectRatio: "1", overflow: "hidden" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", color: ac, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{p.cat}</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900, fontSize: "1.05rem", color: ac }}>{p.price}</span>
                <button onClick={() => addToCart(p)} style={{ background: ac, color: "#fff", border: "none", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>{t.addCart}</button>
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
        <div style={{ position: "relative", height: "360px", overflow: "hidden", marginBottom: "3rem" }}>
          <img src="https://picsum.photos/seed/sportabout/1200/500" alt="about" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <h1 style={{ color: "#fff", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em" }}>{t.aboutTitle}</h1>
            <div style={{ width: "3rem", height: "3px", background: ac, marginTop: "0.75rem" }} />
          </div>
        </div>
        <p style={{ color: mut, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "3rem" }}>{t.aboutText}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[{ n: "12+", l: "Years Experience" }, { n: "500K+", l: "Athletes Served" }, { n: "40+", l: "Countries" }].map(s => (
            <div key={s.l} style={{ background: surf, border: `1px solid ${brd}`, padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: ac, marginBottom: "0.5rem" }}>{s.n}</div>
              <div style={{ color: mut, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Performance Driven", "Pro Athlete Tested", "Sustainable Materials", "Community Focused"].map(v => (
            <div key={v} style={{ padding: "1.5rem", border: `1px solid ${brd}` }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{v}</h3>
              <p style={{ color: mut, fontSize: "0.85rem", lineHeight: 1.7 }}>Every product is engineered for peak performance, rigorously tested by our team of elite athletes before reaching your hands.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const contactPage = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto py-16 px-4 md:px-8">
      <div>
        <h1 style={{ fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", marginBottom: "2rem" }}>{t.contactTitle}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none" }} />
          ))}
          <textarea placeholder={t.message} rows={5} style={{ background: surf, border: `1px solid ${brd}`, color: txt, padding: "0.875rem 1rem", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
          <button style={{ background: ac, color: "#fff", border: "none", padding: "1rem", cursor: "pointer", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 style={{ fontWeight: 800, fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "2rem" }}>HQ</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", background: `${ac}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={i.icon} size={18} style={{ color: ac }} />
              </div>
              <span style={{ color: mut, fontSize: "0.9rem", lineHeight: 1.6 }}>{i.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}>
          <Icon name="instagram" size={20} style={{ color: mut, cursor: "pointer" }} />
          <Icon name="twitter" size={20} style={{ color: mut, cursor: "pointer" }} />
          <Icon name="youtube" size={20} style={{ color: mut, cursor: "pointer" }} />
          <Icon name="facebook" size={20} style={{ color: mut, cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} className="min-h-screen font-sans w-full" style={{ background: bg, color: txt }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer style={{ background: surf, borderTop: `1px solid ${brd}`, marginTop: "2rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-5xl mx-auto py-12 px-4 md:px-8">
          <div className="md:col-span-2">
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem", color: txt }}>
              <Icon name="trophy" size={22} style={{ color: ac }} />SPORTS<span style={{ color: ac }}>PRO</span>
            </div>
            <p style={{ color: mut, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem" }}>Built by athletes, for athletes. Pro-grade equipment engineered for those who refuse to settle. Train harder. Go further.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Icon name="instagram" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="twitter" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="youtube" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="facebook" size={18} style={{ color: mut, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: txt }}>Shop</div>
            {["Running", "Training", "Tennis", "Basketball", "All Sports"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer", fontWeight: 600 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: txt }}>Support</div>
            {["Track Order", "Shipping Info", "Returns", "Size Guide", "FAQ"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer", fontWeight: 600 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: txt }}>Company</div>
            {["About Us", "Team & Coaches", "Careers", "Sponsorships", "Contact"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer", fontWeight: 600 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${brd}`, padding: "1.25rem 2rem", textAlign: "center", color: mut, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
