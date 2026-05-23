import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

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
  { id: 13, name: "Wireless Charging Station", price: "$69", priceNum: 69, old: "$89", img: "https://picsum.photos/seed/tech13/400/400", cat: "Accessories", rating: 4.7 },
  { id: 14, name: "4K Webcam Pro", price: "$199", priceNum: 199, old: "$249", img: "https://picsum.photos/seed/tech14/400/400", cat: "Laptops", rating: 4.8 },
  { id: 15, name: "Noise-Canceling Earbuds", price: "$149", priceNum: 149, old: "$179", img: "https://picsum.photos/seed/tech15/400/400", cat: "Audio", rating: 4.9 },
  { id: 16, name: "Smart Thermostat", price: "$129", priceNum: 129, old: "$159", img: "https://picsum.photos/seed/tech16/400/400", cat: "Smart Home", rating: 4.6 },
];

const CATS = ["All", "Phones", "Laptops", "Audio", "Wearables", "Gaming", "Cameras", "Smart Home", "Accessories"];

const T = {
  en: { nav: ["Home", "Products", "About", "Contact"], hero: "Next-Level Tech\nAt Your Fingertips", sub: "The latest smartphones, laptops, and gadgets — shipped fast, backed by expert support.", shop: "Browse Deals", viewAll: "View All", addCart: "Add to Cart", allProd: "All Products", flash: "⚡ Flash Sale — Up to 40% OFF", aboutTitle: "About TechZone", aboutText: "Founded in 2015, TechZone has grown to become the most trusted electronics destination for tech enthusiasts. We offer curated selections of the world's best gadgets with expert support and fast shipping.", contactTitle: "Contact Support", name: "Name", email: "Email", message: "Describe your issue or question", send: "Send Message", address: "Tech Tower, Silicon Valley, CA", phone: "+1 (800) TECHZONE", hours: "24/7 Customer Support", testimonialTitle: "Rave Reviews", testimonial1: "The gaming laptop exceeded every expectation. Handles everything I throw at it at max settings. Absolute beast.", testimonialName1: "Derek Chen", testimonialRole1: "Pro Gamer", testimonial2: "Fastest shipping I've ever experienced. Ordered late Monday night and it arrived Tuesday afternoon. Incredible.", testimonialName2: "Samantha Wells", testimonialRole2: "Tech Enthusiast", testimonial3: "Their customer support is phenomenal. Helped me set up my entire home office within hours of delivery.", testimonialName3: "Ali Hassan", testimonialRole3: "Small Business Owner", footer: "© 2024 TechZone. Power your life." },
  fr: { nav: ["Accueil", "Produits", "À Propos", "Contact"], hero: "Tech de Pointe\nÀ Portée de Main", sub: "Les derniers smartphones, laptops et gadgets.", shop: "Voir les Offres", viewAll: "Voir Tout", addCart: "Ajouter", allProd: "Tous les Produits", flash: "⚡ Vente Flash — Jusqu'à 40% de réduction", aboutTitle: "À Propos de TechZone", aboutText: "Fondé en 2015, TechZone est devenu la destination électronique la plus fiable.", contactTitle: "Contacter le Support", name: "Nom", email: "Email", message: "Décrivez votre question", send: "Envoyer", address: "Tech Tower, Silicon Valley, CA", phone: "+1 (800) TECHZONE", hours: "Support client 24/7", testimonialTitle: "Avis Élogieux", testimonial1: "Le PC portable gaming a dépassé toutes mes attentes. Il gère tout en paramètres maximum. Une bête de course.", testimonialName1: "Derek Chen", testimonialRole1: "Pro Gamer", testimonial2: "La livraison la plus rapide que j'aie jamais vue. Commandé lundi tard dans la nuit, arrivé mardi après-midi.", testimonialName2: "Samantha Wells", testimonialRole2: "Passionnée de Tech", testimonial3: "Leur service client est phénoménal. Ils m'ont aidé à installer tout mon bureau en quelques heures.", testimonialName3: "Ali Hassan", testimonialRole3: "Propriétaire de PME", footer: "© 2024 TechZone. Alimentez votre vie." },
  ar: { nav: ["الرئيسية", "المنتجات", "من نحن", "اتصل بنا"], hero: "أحدث التقنيات\nبين يديك", sub: "أحدث الهواتف الذكية وأجهزة الكمبيوتر.", shop: "تصفح العروض", viewAll: "عرض الكل", addCart: "أضف للسلة", allProd: "جميع المنتجات", flash: "⚡ تخفيضات فلاش — حتى 40% خصم", aboutTitle: "عن تك زون", aboutText: "تأسست عام 2015، وأصبحت تك زون الوجهة الإلكترونية الأكثر ثقة.", contactTitle: "تواصل مع الدعم", name: "الاسم", email: "البريد الإلكتروني", message: "صف مشكلتك أو سؤالك", send: "إرسال", address: "برج تك، سيليكون فالي، كاليفورنيا", phone: "+1 (800) TECHZONE", hours: "دعم عملاء 24/7", testimonialTitle: "مراجعات رائعة", testimonial1: "لابتوب الألعاب تجاوز كل التوقعات. يتعامل مع كل شيء بأقصى الإعدادات. وحش حقيقي.", testimonialName1: "ديريك تشين", testimonialRole1: "لاعب محترف", testimonial2: "أسرع شحن اختبرته على الإطلاق. طلبت متأخراً ليلة الاثنين ووصل بعد ظهر الثلاثاء.", testimonialName2: "سامانثا ويلز", testimonialRole2: "مهتمة بالتكنولوجيا", testimonial3: "دعم العملاء استثنائي. ساعدوني في إعداد مكتبي المنزلي بالكامل في غضون ساعات من التوصيل.", testimonialName3: "علي حسن", testimonialRole3: "صاحب شركة صغيرة", footer: "© 2024 تك زون. أطلق قدراتك." },
};

export default function TechZone({ language, scheme, dark }: TemplateProps) {
  const [page, setPage] = useState<Page>("home");
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="text-center py-2 text-xs font-bold text-white" style={{ background: `linear-gradient(90deg,${scheme.accent},#8b5cf6)` }}>{t.flash}</div>
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 sticky top-0 z-50 border-b" style={{ background: bg, borderColor: brd }}>
        <button onClick={() => setPage("home")} className="font-black text-xl md:text-2xl flex items-center gap-1.5" style={{ color: scheme.accent }}>
          TechZone<Icon name="zap" size={22} />
        </button>
        <div className="hidden md:flex flex-1 justify-center gap-6">
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} className="text-sm transition-colors" style={{ color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 400 }}>{t.nav[i]}</button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCartOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm text-white" style={{ background: scheme.accent }}>
            <Icon name="bag" size={18} /> {cartCount > 0 && <span className="bg-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-black" style={{ color: scheme.accent }}>{cartCount}</span>}
          </button>
          <button className="md:hidden p-2 rounded-md" style={{ color: txt }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col border-b px-4 py-2" style={{ background: bg, borderColor: brd }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => { setPage(p); setMobileMenuOpen(false); }} className="text-left py-3 text-sm font-medium border-b last:border-0" style={{ color: page === p ? scheme.accent : txt, borderColor: brd }}>{t.nav[i]}</button>
          ))}
        </div>
      )}
    </>
  );

  const homePage = (
    <>
      <div className="relative overflow-hidden min-h-[520px] grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="p-6 md:p-16 z-10 order-2 md:order-1">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ background: `${scheme.accent}22`, color: scheme.accent, borderColor: `${scheme.accent}44` }}>
            <Icon name="flame" size={16} /> Best Sellers 2024
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-5 whitespace-pre-line">
            {t.hero.split('\n').map((line, i) => <span key={i} className="block" style={{ color: i === 1 ? scheme.accent : txt }}>{line}</span>)}
          </h1>
          <p className="leading-relaxed mb-8 max-w-sm" style={{ color: mut }}>{t.sub}</p>
          <div className="flex gap-4">
            <button onClick={() => setPage("products")} className="text-white px-8 py-3.5 rounded-xl font-bold transition-transform hover:scale-105" style={{ background: scheme.accent }}>{t.shop}</button>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[520px] overflow-hidden order-1 md:order-2">
          <img src="https://picsum.photos/seed/techhero/700/600" alt="tech" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hidden md:block" style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
          <div className="absolute inset-0 md:hidden" style={{ background: `linear-gradient(to bottom, transparent, ${bg})` }} />
        </div>
      </div>
      
      <section className="px-6 py-12 md:p-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-extrabold text-xl md:text-2xl">Trending Now</h2>
          <button onClick={() => setPage("products")} className="font-semibold text-sm transition-opacity hover:opacity-80" style={{ color: scheme.accent }}>{t.viewAll} →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id} className="border rounded-2xl overflow-hidden transition-transform hover:-translate-y-1" style={{ background: surf, borderColor: brd }}>
              <div className="aspect-square overflow-hidden"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="p-4">
                <div className="font-bold mb-2 text-sm">{p.name}</div>
                <div className="text-xs mb-3" style={{ color: mut }}>⭐ {p.rating}</div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-extrabold" style={{ color: scheme.accent }}>{p.price}</span>
                  <span className="text-xs line-through" style={{ color: mut }}>{p.old}</span>
                </div>
                <button onClick={() => addToCart(p)} className="w-full text-white py-2 rounded-lg font-bold text-sm" style={{ background: scheme.accent }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-y py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" style={{ background: surf, borderColor: brd }}>
        {[{ icon: "shield", text: "2-Year Warranty" }, { icon: "rocket", text: "Free Express Shipping" }, { icon: "rotate", text: "30-Day Returns" }, { icon: "message", text: "Expert Support 24/7" }].map((tr, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2"><Icon name={tr.icon} size={24} /></div>
            <div className="font-semibold text-xs md:text-sm" style={{ color: mut }}>{tr.text}</div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <section className="px-6 py-12 md:p-12">
        <h2 className="text-center font-extrabold text-xl md:text-2xl mb-10">{t.testimonialTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} className="border rounded-2xl p-6 flex flex-col" style={{ background: surf, borderColor: brd }}>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} className="text-blue-500 fill-blue-500" />)}
              </div>
              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: txt }}>"{item.text}"</p>
              <div>
                <div className="font-bold text-sm">{item.name}</div>
                <div className="text-xs" style={{ color: mut }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section className="px-6 py-12 md:p-12 pb-20">
      <h1 className="font-extrabold text-3xl mb-2">{t.allProd}</h1>
      <p className="text-sm mb-8" style={{ color: mut }}>{filtered.length} products</p>
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className="border rounded-lg px-4 py-2 font-semibold text-xs transition-colors" style={{ background: activeCat === c ? scheme.accent : surf, color: activeCat === c ? "#fff" : mut, borderColor: activeCat === c ? scheme.accent : brd }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(p => (
          <div key={p.id} className="border rounded-2xl overflow-hidden" style={{ background: surf, borderColor: brd }}>
            <div className="aspect-square overflow-hidden"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="text-[10px] font-bold uppercase mb-1" style={{ color: scheme.accent }}>{p.cat}</div>
              <div className="font-bold mb-2 text-sm">{p.name}</div>
              <div className="text-xs mb-3" style={{ color: mut }}>⭐ {p.rating}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-extrabold" style={{ color: scheme.accent }}>{p.price}</span>
                <span className="text-xs line-through" style={{ color: mut }}>{p.old}</span>
              </div>
              <button onClick={() => addToCart(p)} className="w-full text-white py-2 rounded-lg font-bold text-sm" style={{ background: scheme.accent }}>{t.addCart}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div className="px-6 py-16 md:py-24 max-w-4xl mx-auto">
      <h1 className="font-black text-4xl md:text-5xl mb-6">{t.aboutTitle}</h1>
      <p className="leading-relaxed text-base md:text-lg mb-12" style={{ color: mut }}>{t.aboutText}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[{ n: "2M+", l: "Products Sold" }, { n: "4.9★", l: "Average Rating" }, { n: "50+", l: "Countries" }].map(s => (
          <div key={s.l} className="border rounded-2xl p-8 text-center" style={{ background: surf, borderColor: brd }}>
            <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: scheme.accent }}>{s.n}</div>
            <div className="text-sm" style={{ color: mut }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div className="px-6 py-16 md:py-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      <div>
        <h1 className="font-black text-3xl md:text-4xl mb-8">{t.contactTitle}</h1>
        <div className="flex flex-col gap-4">
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} className="border p-3.5 rounded-lg text-sm outline-none" style={{ background: surf, borderColor: brd, color: txt }} />
          ))}
          <textarea placeholder={t.message} rows={5} className="border p-3.5 rounded-lg text-sm outline-none resize-y" style={{ background: surf, borderColor: brd, color: txt }} />
          <button className="text-white p-4 rounded-lg font-bold" style={{ background: scheme.accent }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-xl md:text-2xl mb-8">Support Info</h2>
        <div className="flex flex-col gap-6">
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} className="flex gap-4 items-center">
              <Icon name={i.icon} size={24} /><span className="text-sm md:text-base leading-relaxed" style={{ color: mut }}>{i.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} className="font-sans min-h-screen" style={{ background: bg, color: txt, fontFamily: "'Inter', sans-serif" }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer className="border-t rounded-t-[24px] mt-8" style={{ background: surf, borderColor: brd }}>
        <div className="max-w-6xl mx-auto px-6 py-12 md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-black text-xl" style={{ color: scheme.accent }}>TechZone</span>
              <Icon name="zap" size={20} style={{ color: scheme.accent }} />
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: mut }}>Your destination for cutting-edge technology. Curated gadgets, expert reviews, and unbeatable prices on top brands.</p>
            <div className="flex gap-3">
              <Icon name="twitter" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="instagram" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="youtube" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="message" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
            </div>
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Shop</div>
            {["Phones", "Laptops", "Audio", "Gaming", "Smart Home"].map(l => (
              <div key={l} className="text-sm mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Support</div>
            {["Warranty", "Returns", "Shipping", "Product Support", "Contact"].map(l => (
              <div key={l} className="text-sm mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Contact</div>
            <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: mut }}><Icon name="mail" size={14} /> support@techzone.com</div>
            <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: mut }}><Icon name="phone" size={14} /> +1 (888) 555-TECH</div>
            <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: mut }}><Icon name="pin" size={14} /> 1 Infinite Loop, Cupertino</div>
          </div>
        </div>
        <div className="border-t px-6 py-5 text-center text-xs" style={{ borderColor: brd, color: mut }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
