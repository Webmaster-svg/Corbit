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
  const bg = dark ? "#0f1a12" : scheme.bg;
  const surf = dark ? "#1a2a1d" : scheme.surface;
  const txt = dark ? "#f0fdf4" : scheme.text;
  const mut = dark ? "#6b7280" : scheme.muted;
  const brd = dark ? "#1f3525" : scheme.border;

  const navBar = (
    <>
      <div className="text-center py-2 text-xs font-medium" style={{ background: scheme.accent, color: scheme.accentText }}>{t.promo}</div>
      <nav className="flex items-center justify-between px-6 py-4 md:px-8 border-b sticky top-0 z-50 backdrop-blur-md" style={{ background: `${bg}fa`, borderColor: brd }}>
        <button onClick={() => { setPage("home"); setMobileMenuOpen(false); }} className="flex items-center gap-2 bg-transparent border-none cursor-pointer">
          <Icon name="leaf" size={28} style={{ color: scheme.accent }} /><span className="text-xl md:text-2xl font-extrabold" style={{ color: scheme.accent }}>FreshMart</span>
        </button>
        <div className="hidden md:flex gap-6">
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} className="bg-transparent border-none cursor-pointer text-sm transition-colors hover:opacity-80" style={{ color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 500 }}>{t.nav[i]}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCartOpen(true)} className="border-none rounded-full px-5 py-2.5 cursor-pointer font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: scheme.accent, color: scheme.accentText }}>
            <Icon name="shoppingCart" size={18} /> {cartCount > 0 ? <span className="rounded-full w-5 h-5 text-[0.65rem] inline-flex items-center justify-center font-black" style={{ background: "#fff", color: scheme.accent }}>{cartCount}</span> : "Cart"}
          </button>
          <button className="md:hidden p-2 rounded-md bg-transparent border-none cursor-pointer" style={{ color: txt }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col border-b px-6 py-4" style={{ background: bg, borderColor: brd }}>
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => { setPage(p); setMobileMenuOpen(false); }} className="bg-transparent border-none cursor-pointer text-left py-3 text-sm font-medium border-b last:border-0" style={{ color: page === p ? scheme.accent : txt, borderColor: brd }}>{t.nav[i]}</button>
          ))}
        </div>
      )}
    </>
  );

  const homePage = (
    <>
      <div className="flex flex-col md:grid md:grid-cols-2 min-h-[480px] items-center">
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 self-start" style={{ background: `${scheme.accent}22`, color: scheme.accent }}><Icon name="truck" size={16} /> Same-Day Delivery</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-5 whitespace-pre-line">{t.hero}</h1>
          <p className="leading-[1.7] mb-8 max-w-sm text-sm md:text-base" style={{ color: mut }}>{t.sub}</p>
          <div className="flex gap-4">
            <button onClick={() => setPage("products")} className="border-none rounded-xl px-10 py-4 cursor-pointer font-bold text-sm md:text-base hover:opacity-90 transition-opacity" style={{ background: scheme.accent, color: scheme.accentText }}>{t.shop}</button>
          </div>
        </div>
        <div className="overflow-hidden h-[300px] md:h-[480px] w-full">
          <img src="https://picsum.photos/seed/freshhero/800/600" alt="fresh" className="w-full h-full object-cover" />
        </div>
      </div>
      <section className="px-6 py-12 md:px-8 md:py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-extrabold text-xl md:text-2xl">{t.featured}</h2>
          <button onClick={() => setPage("products")} className="cursor-pointer font-semibold text-sm bg-transparent border-none hover:opacity-80 transition-opacity" style={{ color: scheme.accent }}>{t.viewAll} →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCTS.slice(0, 6).map(p => (
            <div key={p.id} className="rounded-2xl overflow-hidden border group" style={{ background: surf, borderColor: brd }}>
              <div className="relative aspect-square overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute top-2 left-2 text-[0.65rem] font-bold px-2 py-1 rounded-full" style={{ background: scheme.accent, color: scheme.accentText }}>{p.badge}</span>
              </div>
              <div className="p-3">
                <div className="font-bold text-xs md:text-sm mb-2 line-clamp-1">{p.name}</div>
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm md:text-base" style={{ color: scheme.accent }}>{p.price}</span>
                  <button onClick={() => addToCart(p)} className="border-none rounded-lg px-2.5 py-1.5 cursor-pointer text-xs font-bold hover:opacity-90 transition-opacity" style={{ background: scheme.accent, color: scheme.accentText }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="py-10 px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center" style={{ background: scheme.accent, color: scheme.accentText }}>
        {[{ icon: "seedling", text: "100% Organic" }, { icon: "zap", text: "Same-day Delivery" }, { icon: "tractor", text: "Farm to Door" }, { icon: "heart", text: "Satisfaction Guaranteed" }].map((tr, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2"><Icon name={tr.icon} size={28} /></div>
            <div className="font-bold text-sm">{tr.text}</div>
          </div>
        ))}
      </div>
      {/* Testimonials */}
      <section className="px-6 py-12 md:p-16">
        <h2 className="text-center font-bold text-xl md:text-2xl mb-10">{t.testimonialTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} className="border rounded-2xl p-6 flex flex-col" style={{ background: surf, borderColor: brd }}>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} style={{ color: "#eab308", fill: "#eab308" }} />)}
              </div>
              <p className="text-[0.85rem] leading-[1.7] m-0 mb-4 flex-1" style={{ color: txt }}>"{item.text}"</p>
              <div>
                <div className="font-bold text-sm">{item.name}</div>
                <div className="text-xs mt-0.5" style={{ color: mut }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section className="px-6 py-12 md:px-8 md:py-20">
      <h1 className="font-black text-3xl md:text-4xl mb-2">{t.allProd}</h1>
      <p className="mb-8 text-sm" style={{ color: mut }}>{filtered.length} products</p>
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className="border rounded-full px-5 py-2 cursor-pointer font-semibold text-xs md:text-sm transition-colors hover:opacity-90" style={{ background: activeCat === c ? scheme.accent : surf, color: activeCat === c ? scheme.accentText : txt, borderColor: activeCat === c ? scheme.accent : brd }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl overflow-hidden border group" style={{ background: surf, borderColor: brd }}>
            <div className="relative aspect-square overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute top-2 left-2 text-[0.65rem] font-bold px-2.5 py-1 rounded-full shadow-sm" style={{ background: scheme.accent, color: scheme.accentText }}>{p.badge}</span>
            </div>
            <div className="p-4">
              <div className="text-[0.65rem] font-bold uppercase mb-1" style={{ color: scheme.accent }}>{p.cat}</div>
              <div className="font-bold text-sm md:text-base mb-3 line-clamp-1">{p.name}</div>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-base md:text-lg" style={{ color: scheme.accent }}>{p.price}</span>
                <button onClick={() => addToCart(p)} className="border-none rounded-lg px-4 py-2 cursor-pointer text-xs font-bold hover:opacity-90 transition-opacity" style={{ background: scheme.accent, color: scheme.accentText }}>{t.addCart}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div className="px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="font-black text-3xl md:text-4xl mb-6 leading-[1.1]">{t.aboutTitle}</h1>
            <p className="leading-[1.8] text-[0.95rem] md:text-base" style={{ color: mut }}>{t.aboutText}</p>
          </div>
          <img src="https://picsum.photos/seed/freshfarm/600/500" alt="farm" className="w-full rounded-2xl shadow-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[{ n: "200+", l: "Local Farms" }, { n: "24h", l: "From Harvest to Door" }, { n: "50K+", l: "Happy Customers" }].map(s => (
            <div key={s.l} className="rounded-2xl p-8 text-center border" style={{ background: surf, borderColor: brd }}>
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: scheme.accent }}>{s.n}</div>
              <div className="text-sm" style={{ color: mut }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const contactPage = (
    <div className="px-6 py-16 md:py-24 max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16">
      <div>
        <h1 className="font-black text-3xl md:text-4xl mb-8">{t.contactTitle}</h1>
        <div className="flex flex-col gap-4">
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} className="border p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow" style={{ background: surf, borderColor: brd, color: txt }} />
          ))}
          <textarea placeholder={t.message} rows={5} className="border p-4 rounded-xl text-sm outline-none resize-y focus:ring-2 focus:ring-opacity-50 transition-shadow" style={{ background: surf, borderColor: brd, color: txt }} />
          <button className="border-none rounded-xl p-4 cursor-pointer font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: scheme.accent, color: scheme.accentText }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-xl mb-6">Find Us</h2>
        <div className="flex flex-col gap-6">
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} className="flex gap-4 items-center">
              <Icon name={i.icon} size={20} style={{ color: scheme.accent }} /><span className="text-sm md:text-base leading-[1.6]" style={{ color: mut }}>{i.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} className="min-h-screen font-sans" style={{ background: bg, color: txt }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer className="border-t" style={{ background: surf, borderColor: brd }}>
        <div className="max-w-5xl mx-auto px-6 py-12 md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="leaf" size={24} style={{ color: scheme.accent }} />
              <span className="text-xl font-extrabold" style={{ color: scheme.accent }}>FreshMart</span>
            </div>
            <p className="text-[0.85rem] leading-[1.7] mb-4 max-w-xs" style={{ color: mut }}>Farm-fresh groceries delivered to your door. Supporting local farmers and sustainable agriculture since 2018.</p>
            <div className="flex gap-3">
              <Icon name="instagram" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="facebook" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="twitter" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
            </div>
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Shop</div>
            {["Fruits & Vegetables", "Dairy & Eggs", "Bakery", "Meat & Poultry", "Drinks"].map(l => (
              <div key={l} className="text-sm mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Help</div>
            {["Shipping Info", "Returns Policy", "FAQ", "Contact Us", "Track Order"].map(l => (
              <div key={l} className="text-sm mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Contact</div>
            <div className="text-sm mb-2 flex items-center gap-2" style={{ color: mut }}><Icon name="mail" size={14} /> hello@freshmart.com</div>
            <div className="text-sm mb-2 flex items-center gap-2" style={{ color: mut }}><Icon name="phone" size={14} /> +1 (888) 555-FARM</div>
            <div className="text-sm flex items-center gap-2" style={{ color: mut }}><Icon name="clock" size={14} /> 6am–10pm daily</div>
          </div>
        </div>
        <div className="border-t px-6 py-5 text-center text-sm" style={{ borderColor: brd, color: mut }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
