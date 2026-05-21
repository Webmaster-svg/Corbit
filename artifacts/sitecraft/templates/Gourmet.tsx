import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

const T = {
  en: { badge: "Exceptional Flavors Since 1998", hero: "Taste the\nExtraordinary", sub: "Premium artisan foods and fine wines curated by world-class chefs and sommeliers.", shop: "Explore the Cellar", featured: "Chef's Selection", viewAll: "View All", addCart: "Add to Cart", cats: "Shop by Category", deal: "🍷 Complimentary tasting notes with every wine order", trust1: "Expert Curation", trust2: "Temperature Controlled Delivery", trust3: "Satisfaction Guaranteed", trust4: "Exclusive Producers", testimonialTitle: "What Our Patrons Say", testimonial1: "The Barolo was absolutely exquisite. Perfect condition upon arrival and paired beautifully with our dinner.", testimonialName1: "James Whitfield", testimonialRole1: "Wine Collector", testimonial2: "Their truffle selection is unmatched. I've been a customer for years and they never disappoint.", testimonialName2: "Marie Dubois", testimonialRole2: "Chef", testimonial3: "The gift set arrived beautifully wrapped. My client was thoroughly impressed.", testimonialName3: "Alistair Finch", testimonialRole3: "Corporate Gifting", newsletterTitle: "The Art of Taste", newsletterText: "Subscribe for exclusive access to limited releases, tasting notes, and members-only pricing.", newsletterPlaceholder: "Your email", newsletterButton: "Join the Club", footer: "© 2024 Gourmet. The art of exceptional taste." },
  fr: { badge: "Saveurs Exceptionnelles depuis 1998", hero: "Goûtez\nl'Extraordinaire", sub: "Aliments artisanaux et vins fins sélectionnés par des chefs et sommeliers de classe mondiale.", shop: "Explorer la Cave", featured: "Sélection du Chef", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Catégorie", deal: "🍷 Notes de dégustation offertes avec chaque commande de vin", trust1: "Sélection d'Experts", trust2: "Livraison à Température Contrôlée", trust3: "Satisfaction Garantie", trust4: "Producteurs Exclusifs", testimonialTitle: "Ce Que Disent Nos Clients", testimonial1: "Le Barolo était absolument exquis. Arrivé en parfait état et s'est magnifiquement accordé avec notre dîner.", testimonialName1: "James Whitfield", testimonialRole1: "Collectionneur de Vins", testimonial2: "Leur sélection de truffes est inégalée. Je suis client depuis des années.", testimonialName2: "Marie Dubois", testimonialRole2: "Chef", testimonial3: "Le coffret cadeau est arrivé magnifiquement emballé. Mon client était ravi.", testimonialName3: "Alistair Finch", testimonialRole3: "Cadeaux d'Affaires", newsletterTitle: "L'Art du Goût", newsletterText: "Abonnez-vous pour un accès exclusif aux éditions limitées et aux prix membres.", newsletterPlaceholder: "Votre email", newsletterButton: "Rejoindre le Club", footer: "© 2024 Gourmet. L'art du goût exceptionnel." },
  ar: { badge: "نكهات استثنائية منذ 1998", hero: "ذُق\nالاستثنائي", sub: "أطعمة حرفية فاخرة ونبيذ راقي منتقى من قبل طهاة وخبراء عالميين.", shop: "استكشف القبو", featured: "اختيار الشيف", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوق حسب الفئة", deal: "🍷 ملاحظات تذوق مجانية مع كل طلب نبيذ", trust1: "انتقاء خبراء", trust2: "توصيل بتحكم بالحرارة", trust3: "ضمان الرضا", trust4: "منتجون حصريون", testimonialTitle: "ماذا يقول عملاؤنا", testimonial1: "بارولو كانت رائعة للغاية. وصلت في حالة مثالية وتناسقت بشكل جميل مع عشاءنا.", testimonialName1: "جيمس ويتفيلد", testimonialRole1: "جامع نبيذ", testimonial2: "تشكيلة الكمأ لا مثيل لها. أنا عميل منذ سنوات ولم يخيبوا ظني أبداً.", testimonialName2: "ماري دوبوا", testimonialRole2: "طاهية", testimonial3: "وصلت طقم الهدايا مغلفة بشكل جميل. كان عملي منبهراً تماماً.", testimonialName3: "أليستير فينش", testimonialRole3: "هدايا الشركات", newsletterTitle: "فن التذوق", newsletterText: "اشترك للوصول الحصري إلى الإصدارات المحدودة وأسعار الأعضاء.", newsletterPlaceholder: "بريدك الإلكتروني", newsletterButton: "انضم للنادي", footer: "© 2024 غورميه. فن الذوق الاستثنائي." },
};

const products = [
  { id: 1, name: "Truffle Reserve Collection", price: "$189", img: "https://picsum.photos/seed/gourmet1/400/500", sub: "Limited Edition" },
  { id: 2, name: "Grand Cru Bordeaux 2018", price: "$245", img: "https://picsum.photos/seed/gourmet2/400/500", sub: "Wine" },
  { id: 3, name: "Aged Parmigiano 36mo", price: "$68", img: "https://picsum.photos/seed/gourmet3/400/500", sub: "Italian" },
  { id: 4, name: "Kaluga Caviar 50g", price: "$320", img: "https://picsum.photos/seed/gourmet4/400/500", sub: "Delicacy" },
  { id: 5, name: "Aged Balsamic Vinegar", price: "$89", img: "https://picsum.photos/seed/gourmet5/400/400", sub: "Italian" },
  { id: 6, name: "Artisan Dark Chocolate Box", price: "$55", img: "https://picsum.photos/seed/gourmet6/400/400", sub: "Delicacy" },
  { id: 7, name: "Saffron Threads", price: "$120", img: "https://picsum.photos/seed/gourmet7/400/400", sub: "Limited Edition" },
  { id: 8, name: "Barolo Riserva 2016", price: "$185", img: "https://picsum.photos/seed/gourmet8/400/400", sub: "Wine" },
];

const categories = ["Fine Wines", "Charcuterie", "Cheeses", "Truffles", "Olive Oils", "Chocolates", "Spices", "Gift Sets"];

export default function Gourmet({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#0e0608" : scheme.bg;
  const surf = dark ? "#1c0e12" : scheme.surface;
  const txt = dark ? "#f5ece0" : scheme.text;
  const mut = dark ? "#8a6a5a" : scheme.muted;
  const brd = dark ? "#3d1c22" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontSize: "1.75rem", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase" }}>GOURMET</div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: scheme.accent, marginTop: "-2px" }}>Fine Foods & Wines</div>
        </div>
        <div style={{ display: "flex", gap: "2.5rem", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {["Wines", "Foods", "Gifts", "Membership"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: mut }}>
          <Icon name="search" size={16} style={{ cursor: "pointer", color: mut }} />
          <span style={{ cursor: "pointer", color: mut, display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="user" size={16} /> Account</span>
          <span style={{ cursor: "pointer", color: mut, display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="bag" size={16} /> (0)</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", height: "88vh", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/gourmethero/1400/900" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#f5ece0" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: scheme.accent, marginBottom: "2rem", border: `1px solid ${scheme.accent}`, padding: "0.5rem 1.5rem" }}>{t.badge}</div>
          <h1 style={{ fontSize: "clamp(3rem, 9vw, 8rem)", fontWeight: 400, lineHeight: 1.0, marginBottom: "1.5rem", whiteSpace: "pre-line", letterSpacing: "-0.01em" }}>{t.hero}</h1>
          <div style={{ width: "3rem", height: "1px", background: scheme.accent, margin: "0 auto 1.5rem" }} />
          <p style={{ color: "rgba(245,236,224,0.7)", maxWidth: "480px", lineHeight: 1.9, marginBottom: "3rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <button style={{ background: "transparent", color: "#f5ece0", border: `1px solid ${scheme.accent}`, padding: "1rem 3rem", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{t.shop}</button>
        </div>
      </div>

      {/* Categories strip */}
      <div style={{ background: surf, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2.5rem", display: "flex", gap: "2.5rem", justifyContent: "center" }}>
        {categories.map(c => (
          <span key={c} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", color: mut }}>{c}</span>
        ))}
      </div>

      {/* Featured */}
      <section style={{ padding: "5rem 2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", borderBottom: `1px solid ${brd}`, paddingBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontWeight: 400, fontSize: "2rem", letterSpacing: "0.05em" }}>{t.featured}</h2>
            <div style={{ width: "2rem", height: "1px", background: scheme.accent, marginTop: "0.75rem" }} />
          </div>
          <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ overflow: "hidden", aspectRatio: "4/5", marginBottom: "1.25rem", background: surf }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: scheme.accent, marginBottom: "0.4rem" }}>{p.sub}</div>
              <div style={{ fontWeight: 400, fontSize: "0.95rem", marginBottom: "0.75rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>{p.price}</span>
                <button style={{ background: "transparent", border: `1px solid ${brd}`, color: txt, padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.addCart}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "1.4rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2.5rem" }}>{t.testimonialTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { text: t.testimonial1, name: t.testimonialName1, role: t.testimonialRole1 },
            { text: t.testimonial2, name: t.testimonialName2, role: t.testimonialRole2 },
            { text: t.testimonial3, name: t.testimonialName3, role: t.testimonialRole3 },
          ].map((item, i) => (
            <div key={i} style={{ background: surf, border: `1px solid ${brd}`, borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.75rem" }}>
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
              </div>
              <p style={{ color: txt, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem", flex: 1, fontStyle: "italic" }}>"{item.text}"</p>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>{item.name}</div>
                <div style={{ color: mut, fontSize: "0.7rem" }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "3rem 2.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: "1.5rem" }}>
        {[t.trust1, t.trust2, t.trust3, t.trust4].map((tr, i) => (
          <div key={i} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.6 }}>{tr}</div>
        ))}
      </div>

      {/* Newsletter */}
      <div style={{ background: scheme.accent, color: scheme.accentText, padding: "3.5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontWeight: 400, fontSize: "1.6rem", marginBottom: "0.75rem", letterSpacing: "0.04em" }}>{t.newsletterTitle}</h2>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem", fontSize: "0.9rem", maxWidth: "450px", marginLeft: "auto", marginRight: "auto" }}>{t.newsletterText}</p>
        <div style={{ display: "flex", gap: "0.5rem", maxWidth: "400px", margin: "0 auto" }}>
          <input type="email" placeholder={t.newsletterPlaceholder} style={{ flex: 1, background: `${scheme.accentText}22`, border: `1px solid ${scheme.accentText}44`, borderRadius: "2rem", padding: "0.75rem 1.25rem", color: scheme.accentText, fontSize: "0.85rem", outline: "none" }} />
          <button style={{ background: scheme.accentText, color: scheme.accent, border: "none", borderRadius: "2rem", padding: "0.75rem 1.5rem", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>{t.newsletterButton}</button>
        </div>
      </div>

      <footer style={{ background: dark ? "#0a0506" : "#1a1410", borderTop: `1px solid ${scheme.accent}33`, color: "#c8b8a8" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3.5rem 2rem 2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2.5rem" }}>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 400, letterSpacing: "0.15em", marginBottom: "0.5rem", fontFamily: "'Palatino',serif", color: "#f5ece0" }}>GOURMET</div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: scheme.accent, marginBottom: "0.75rem" }}>Exceptional Flavors Since 1998</div>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.8, opacity: 0.7, margin: "0 0 1.25rem", fontFamily: "'Palatino',serif" }}>Curating the world's finest wines, cheeses, and artisanal delicacies for those who appreciate the art of exceptional taste.</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Icon name="instagram" size={16} style={{ opacity: 0.6, cursor: "pointer" }} />
              <Icon name="facebook" size={16} style={{ opacity: 0.6, cursor: "pointer" }} />
              <Icon name="twitter" size={16} style={{ opacity: 0.6, cursor: "pointer" }} />
              <Icon name="youtube" size={16} style={{ opacity: 0.6, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem", color: "#f5ece0" }}>Selection</div>
            {["Fine Wines", "Charcuterie", "Artisan Cheeses", "Truffles", "Gift Sets"].map(l => (
              <div key={l} style={{ fontSize: "0.8rem", marginBottom: "0.6rem", cursor: "pointer", opacity: 0.65, fontFamily: "'Palatino',serif" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem", color: "#f5ece0" }}>Maison</div>
            {["Our Story", "Press & Awards", "Events", "Partnerships", "Careers"].map(l => (
              <div key={l} style={{ fontSize: "0.8rem", marginBottom: "0.6rem", cursor: "pointer", opacity: 0.65, fontFamily: "'Palatino',serif" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem", color: "#f5ece0" }}>Contact</div>
            <div style={{ fontSize: "0.8rem", marginBottom: "0.5rem", opacity: 0.65, display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon name="pin" size={14} style={{ opacity: 0.5 }} /> 24 Rue de la Paix, Paris</div>
            <div style={{ fontSize: "0.8rem", marginBottom: "0.5rem", opacity: 0.65, display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon name="phone" size={14} style={{ opacity: 0.5 }} /> +33 1 55 55 00 00</div>
            <div style={{ fontSize: "0.8rem", marginBottom: "0.5rem", opacity: 0.65, display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon name="mail" size={14} style={{ opacity: 0.5 }} /> contact@gourmet.com</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, padding: "1.25rem 2rem", textAlign: "center", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4 }}>{t.footer}</div>
      </footer>
    </div>
  );
}
