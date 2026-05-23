import { useState } from "react";
import { CartDrawer, type CartItem } from "./shared/CartDrawer";
import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

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
  { id: 13, name: "Hammered Copper Mug", price: "$52", priceNum: 52, img: "https://picsum.photos/seed/art13/400/400", cat: "Metalwork", maker: "Yuki Tanaka, Japan" },
  { id: 14, name: "Indigo Dyed Scarf", price: "$68", priceNum: 68, img: "https://picsum.photos/seed/art14/400/400", cat: "Textiles", maker: "Aisha Diop, Senegal" },
  { id: 15, name: "Carved Wooden Bowl", price: "$95", priceNum: 95, img: "https://picsum.photos/seed/art15/400/400", cat: "Woodwork", maker: "Elena Voss, Germany" },
  { id: 16, name: "Hand-painted Vase", price: "$78", priceNum: 78, img: "https://picsum.photos/seed/art16/400/400", cat: "Ceramics", maker: "Carlos Ruiz, Mexico" },
];

const CATS = ["All", "Ceramics", "Weaving", "Woodwork", "Leather", "Candles", "Textiles", "Jewelry", "Metalwork"];

const T = {
  en: { nav: ["Home", "Shop", "Our Story", "Contact"], hero: "Made by Hand,\nMade to Last", sub: "Discover unique handcrafted goods made by independent artisans from around the world.", shop: "Shop Handmade", viewAll: "View All", addCart: "Add to Cart", allProd: "All Handmade Goods", deal: "🌿 10% off your first order — Code HANDMADE10", aboutTitle: "The Artisan Story", aboutText: "Artisan Marketplace was founded to connect skilled craftspeople with people who truly appreciate handmade goods. Every maker on our platform goes through a rigorous quality review. When you buy from Artisan, you directly support the livelihoods of independent creators worldwide.", contactTitle: "Say Hello", name: "Your Name", email: "Your Email", message: "Tell us how we can help", send: "Send Message", address: "The Craft House, Amsterdam", phone: "+31 20 000 0000", hours: "Mon–Fri 9am–6pm", testimonialTitle: "Stories from Our Community", testimonial1: "I bought the handwoven rug for my studio and it's absolutely stunning. You can feel the craftsmanship in every thread.", testimonialName1: "Claire Beaumont", testimonialRole1: "Interior Designer", testimonial2: "Knowing exactly which artisan made my pottery makes it so much more special. The story behind each piece is incredible.", testimonialName2: "James Okonkwo", testimonialRole2: "Collector", testimonial3: "The quality of craftsmanship is unmatched. I've bought several pieces and each one feels like a work of art.", testimonialName3: "Priya Sharma", testimonialRole3: "Loyal Customer", footer: "© 2024 Artisan. Crafted with care." },
  fr: { nav: ["Accueil", "Boutique", "Notre Histoire", "Contact"], hero: "Fait à la Main,\nFait pour Durer", sub: "Découvrez des articles artisanaux uniques faits par des artisans indépendants.", shop: "Acheter Artisanal", viewAll: "Voir Tout", addCart: "Ajouter au Panier", allProd: "Tous les Articles Artisanaux", deal: "🌿 10% sur votre première commande — Code HANDMADE10", aboutTitle: "L'Histoire Artisan", aboutText: "Artisan Marketplace a été fondé pour connecter les artisans avec les personnes qui apprécient vraiment les articles faits à la main.", contactTitle: "Nous Dire Bonjour", name: "Votre Nom", email: "Votre Email", message: "Comment pouvons-nous vous aider?", send: "Envoyer", address: "The Craft House, Amsterdam", phone: "+31 20 000 0000", hours: "Lun–Ven 9h–18h", testimonialTitle: "Témoignages de Notre Communauté", testimonial1: "J'ai acheté le tapis tissé à la main pour mon studio et il est absolument magnifique.", testimonialName1: "Claire Beaumont", testimonialRole1: "Architecte d'Intérieur", testimonial2: "Savoir exactement quel artisan a fabriqué ma poterie la rend tellement plus spéciale.", testimonialName2: "James Okonkwo", testimonialRole2: "Collectionneur", testimonial3: "La qualité de l'artisanat est inégalée. Chaque pièce est une œuvre d'art.", testimonialName3: "Priya Sharma", testimonialRole3: "Cliente Fidèle", footer: "© 2024 Artisan. Fait avec soin." },
  ar: { nav: ["الرئيسية", "المتجر", "قصتنا", "اتصل بنا"], hero: "صُنع باليد،\nصُنع ليدوم", sub: "اكتشف منتجات حرفية فريدة من صنع حرفيين مستقلين من جميع أنحاء العالم.", shop: "تسوق المصنوع يدوياً", viewAll: "عرض الكل", addCart: "أضف إلى السلة", allProd: "جميع المنتجات اليدوية", deal: "🌿 10% خصم على طلبك الأول — الرمز HANDMADE10", aboutTitle: "قصة أرتيزان", aboutText: "تأسست أرتيزان ماركت بليس للربط بين الحرفيين الماهرين والأشخاص الذين يقدرون حقاً المنتجات المصنوعة يدوياً.", contactTitle: "قل مرحباً", name: "اسمك", email: "بريدك الإلكتروني", message: "كيف يمكننا مساعدتك؟", send: "إرسال", address: "بيت الحرف، أمستردام", phone: "+31 20 000 0000", hours: "الاثنين–الجمعة 9ص–6م", testimonialTitle: "قصص من مجتمعنا", testimonial1: "اشتريت السجادة المنسوجة يدوياً لاستوديوهي وهي مذهلة. يمكنك الشعور بالحرفية في كل خيط.", testimonialName1: "كلير بومونت", testimonialRole1: "مصممة داخلية", testimonial2: "معرفة الحرفي الذي صنع الفخار يجعله أكثر خصوصية. القصة وراء كل قطعة لا تصدق.", testimonialName2: "جيمس أوكونكو", testimonialRole2: "جامع تحف", testimonial3: "جودة الحرفية لا تضاهى. كل قطعة تشعر وكأنها عمل فني.", testimonialName3: "بريا شارما", testimonialRole3: "زبونة وفية", footer: "© 2024 أرتيزان. مصنوع بعناية." },
};

export default function Artisan({ language, scheme, dark }: TemplateProps) {
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
  const bg = dark ? "#100c06" : scheme.bg;
  const surf = dark ? "#1c160e" : scheme.surface;
  const txt = dark ? "#f5ede0" : scheme.text;
  const mut = dark ? "#8a7a68" : scheme.muted;
  const brd = dark ? "#302418" : scheme.border;

  const navBar = (
    <>
      <div className="text-center py-2.5 text-xs" style={{ background: scheme.accent, color: scheme.accentText }}>{t.deal}</div>
      <nav className="flex items-center justify-between px-6 py-5 md:px-8 sticky top-0 z-50 border-b" style={{ background: bg, borderColor: brd }}>
        <button onClick={() => setPage("home")} className="bg-none border-none cursor-pointer text-left">
          <div className="text-2xl font-normal tracking-[0.15em]" style={{ color: txt }}>ARTISAN</div>
          <div className="text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: mut }}>Handcrafted Marketplace</div>
        </button>
        <div className="hidden md:flex gap-8">
          {(["home", "products", "about", "contact"] as Page[]).map((p, i) => (
            <button key={p} onClick={() => setPage(p)} className="bg-none border-none cursor-pointer text-xs tracking-[0.08em]" style={{ color: page === p ? scheme.accent : mut, fontWeight: page === p ? 700 : 400 }}>{t.nav[i]}</button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCartOpen(true)} className="border-none py-2.5 px-6 cursor-pointer text-xs flex items-center gap-1.5" style={{ background: scheme.accent, color: scheme.accentText }}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
        <div className="overflow-hidden order-1 md:order-none h-[300px] md:h-auto"><img src="https://picsum.photos/seed/arthero/700/600" alt="artisan" className="w-full h-full object-cover" /></div>
        <div className="p-8 md:p-14 flex flex-col justify-center order-2 md:order-none" style={{ background: surf }}>
          <div className="text-xs tracking-[0.25em] uppercase mb-5" style={{ color: scheme.accent }}>Handcrafted with ❤️</div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.2] mb-6 whitespace-pre-line" style={{ color: txt }}>{t.hero}</h1>
          <p className="leading-[1.9] mb-8 text-[0.95rem]" style={{ color: mut }}>{t.sub}</p>
          <button onClick={() => setPage("products")} className="border-none py-4 px-10 cursor-pointer text-sm tracking-[0.08em] w-fit" style={{ background: scheme.accent, color: scheme.accentText }}>{t.shop}</button>
        </div>
      </div>
      <section className="px-6 py-16 md:p-16 md:pb-20">
        <div className="flex justify-between items-center border-b pb-4 mb-10" style={{ borderColor: brd }}>
          <h2 className="font-normal text-xl md:text-2xl tracking-[0.08em] uppercase" style={{ color: txt }}>Maker's Picks</h2>
          <button onClick={() => setPage("products")} className="cursor-pointer text-xs tracking-[0.12em] uppercase bg-none border-none" style={{ color: scheme.accent }}>{t.viewAll} →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map(p => (
            <div key={p.id} className="cursor-pointer group">
              <div className="overflow-hidden aspect-[4/5] mb-4">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="text-[0.65rem] tracking-[0.1em] mb-1" style={{ color: scheme.accent }}>by {p.maker}</div>
              <div className="text-[0.9rem] mb-3" style={{ color: txt }}>{p.name}</div>
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color: txt }}>{p.price}</span>
                <button onClick={() => addToCart(p)} className="bg-transparent border py-1.5 px-3.5 cursor-pointer text-[0.7rem]" style={{ borderColor: brd, color: txt }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="p-8 grid grid-cols-2 md:grid-cols-4 text-center gap-4" style={{ background: scheme.accent, color: scheme.accentText }}>
        {["Handmade Guarantee", "Support Artisans", "Eco Packaging", "Free Returns"].map((tr, i) => (
          <div key={i} className="text-xs tracking-[0.12em] uppercase">{tr}</div>
        ))}
      </div>
      {/* Testimonials */}
      <section className="px-6 py-16 md:p-16">
        <h2 className="text-center font-normal text-xl md:text-2xl tracking-[0.1em] uppercase mb-10" style={{ color: txt }}>{t.testimonialTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} className="border p-7 flex flex-col" style={{ background: surf, borderColor: brd }}>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} style={{ color: "#d97706", fill: "#d97706" }} />)}
              </div>
              <p className="text-[0.85rem] leading-[1.8] m-0 mb-5 flex-1 italic" style={{ color: txt }}>"{item.text}"</p>
              <div className="border-t pt-3" style={{ borderColor: brd }}>
                <div className="font-semibold text-sm" style={{ fontFamily: "'Georgia',serif", color: txt }}>{item.name}</div>
                <div className="text-[0.7rem] tracking-[0.08em] uppercase" style={{ color: mut }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const productsPage = (
    <section className="px-6 py-12 md:p-12 md:pb-20">
      <h1 className="font-normal text-3xl md:text-4xl tracking-[0.05em] mb-2" style={{ color: txt }}>{t.allProd}</h1>
      <p className="mb-8 text-sm" style={{ color: mut }}>{filtered.length} items</p>
      <div className="flex gap-3 mb-10 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className="border px-5 py-2 cursor-pointer text-xs tracking-[0.1em] uppercase transition-colors" style={{ background: activeCat === c ? scheme.accent : "transparent", color: activeCat === c ? scheme.accentText : txt, borderColor: activeCat === c ? scheme.accent : brd }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map(p => (
          <div key={p.id} className="group">
            <div className="overflow-hidden aspect-[4/5] mb-4">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="text-[0.65rem] tracking-[0.1em] mb-1" style={{ color: scheme.accent }}>by {p.maker}</div>
            <div className="text-[0.65rem] mb-1 tracking-[0.08em] uppercase" style={{ color: mut }}>{p.cat}</div>
            <div className="text-[0.9rem] mb-3" style={{ color: txt }}>{p.name}</div>
            <div className="flex justify-between items-center">
              <span className="font-semibold" style={{ color: txt }}>{p.price}</span>
              <button onClick={() => addToCart(p)} className="border-none py-1.5 px-3.5 cursor-pointer text-[0.7rem] tracking-[0.08em]" style={{ background: scheme.accent, color: scheme.accentText }}>{t.addCart}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const aboutPage = (
    <div className="px-6 py-16 md:py-24 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="font-normal text-4xl md:text-[2.5rem] mb-6 leading-[1.1]" style={{ color: txt }}>{t.aboutTitle}</h1>
          <p className="leading-[1.9] text-[0.95rem]" style={{ color: mut }}>{t.aboutText}</p>
        </div>
        <img src="https://picsum.photos/seed/artabout/600/500" alt="artisans" className="w-full object-cover" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[{ n: "500+", l: "Makers Worldwide" }, { n: "12K+", l: "Handmade Products" }, { n: "98%", l: "Happy Customers" }].map(s => (
          <div key={s.l} className="border p-8 text-center" style={{ background: surf, borderColor: brd }}>
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: scheme.accent }}>{s.n}</div>
            <div className="text-sm" style={{ color: mut }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const contactPage = (
    <div className="px-6 py-16 md:py-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      <div>
        <h1 className="font-normal text-3xl md:text-4xl mb-8" style={{ color: txt }}>{t.contactTitle}</h1>
        <div className="flex flex-col gap-4">
          {[{ label: t.name, type: "text" }, { label: t.email, type: "email" }].map(f => (
            <input key={f.label} type={f.type} placeholder={f.label} className="border p-3.5 text-sm outline-none" style={{ background: surf, borderColor: brd, color: txt }} />
          ))}
          <textarea placeholder={t.message} rows={5} className="border p-3.5 text-sm outline-none resize-y" style={{ background: surf, borderColor: brd, color: txt }} />
          <button className="border-none p-4 cursor-pointer text-sm tracking-[0.1em]" style={{ background: scheme.accent, color: scheme.accentText }}>{t.send}</button>
        </div>
      </div>
      <div>
        <h2 className="font-normal text-xl md:text-2xl mb-8 tracking-[0.08em] uppercase" style={{ color: txt }}>Find Us</h2>
        <div className="flex flex-col gap-6">
          {[{ icon: "pin", text: t.address }, { icon: "phone", text: t.phone }, { icon: "clock", text: t.hours }].map(i => (
            <div key={i.icon} className="flex gap-4 items-center">
              <Icon name={i.icon} size={24} /><span className="text-sm md:text-base leading-[1.6]" style={{ color: mut }}>{i.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} className="min-h-screen" style={{ background: bg, color: txt, fontFamily: "'Georgia','Times New Roman',serif" }}>
      {navBar}
      {page === "home" && homePage}
      {page === "products" && productsPage}
      {page === "about" && aboutPage}
      {page === "contact" && contactPage}
      <footer className="border-t mt-12" style={{ background: surf, borderColor: brd }}>
        <div className="max-w-5xl mx-auto px-6 py-12 md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <div className="font-bold text-xl mb-3 font-serif" style={{ color: txt }}>Artisan</div>
            <p className="text-sm leading-relaxed italic mb-4 max-w-sm" style={{ color: mut }}>A marketplace for handmade goods crafted with care by skilled artisans from around the world.</p>
            <div className="flex gap-3">
              <Icon name="twitter" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="instagram" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="facebook" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
              <Icon name="pinterest" size={18} className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }} />
            </div>
          </div>
          <div>
            <div className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Links</div>
            {["Shop All", "About Us", "Our Makers", "Contact", "FAQs"].map(l => (
              <div key={l} className="text-sm mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
          <div>
            <div className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: txt }}>Support</div>
            {["Shipping Info", "Returns", "Care Guide", "Bulk Orders", "Gift Cards"].map(l => (
              <div key={l} className="text-sm mb-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mut }}>{l}</div>
            ))}
          </div>
        </div>
        <div className="border-t px-6 py-5 text-center text-xs tracking-widest" style={{ borderColor: brd, color: mut }}>{t.footer}</div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdate={updateQty} scheme={scheme} dark={dark} lang={language} />
    </div>
  );
}
