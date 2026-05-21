import type { TemplateProps } from "./types";
import { Icon } from "./shared/Icons";

const T = {
  en: { hero: "Your Skin\nDeserves Better", sub: "Science-backed skincare formulated with natural ingredients for every skin type.", shop: "Discover Your Routine", featured: "Best Sellers", viewAll: "View All", addCart: "Add to Cart", cats: "Shop by Concern", quiz: "Find Your Skin Type →", deal: "🌸 Free gift with orders over $60", trust1: "Dermatologist Tested", trust2: "Cruelty Free", trust3: "Clean Ingredients", trust4: "Free Samples", testimonialTitle: "Real Results, Real People", testimonial1: "My skin has never looked better. The Vitamin C serum completely transformed my complexion!", testimonialName1: "Emma Richards", testimonialRole1: "Verified Buyer", testimonial2: "Finally, a skincare routine that actually works. My dark spots have faded significantly.", testimonialName2: "Sophie Laurent", testimonialRole2: "Skincare Enthusiast", testimonial3: "The personalized routine quiz made all the difference. My skin feels amazing.", testimonialName3: "Jessica Kim", testimonialRole3: "Regular Customer", newsletterTitle: "Glow In Your Inbox", newsletterText: "Get 10% off your first order when you subscribe to our weekly skincare tips and exclusive offers.", newsletterPlaceholder: "Enter your email", newsletterButton: "Subscribe", footer: "© 2024 BeautyGlow. Glow naturally." },
  fr: { hero: "Votre Peau\nMérite Mieux", sub: "Soins de la peau scientifiques formulés avec des ingrédients naturels.", shop: "Découvrir votre Routine", featured: "Meilleures Ventes", viewAll: "Voir Tout", addCart: "Ajouter au Panier", cats: "Acheter par Préoccupation", quiz: "Trouvez votre type de peau →", deal: "🌸 Cadeau gratuit pour les commandes de plus de 60€", trust1: "Testé par des Dermatologues", trust2: "Sans Cruauté", trust3: "Ingrédients Propres", trust4: "Échantillons Gratuits", testimonialTitle: "Des Résultats Réels, De Vraies Personnes", testimonial1: "Ma peau n'a jamais été aussi belle. Le sérum à la vitamine C a complètement transformé mon teint !", testimonialName1: "Emma Richards", testimonialRole1: "Acheteuse Confirmée", testimonial2: "Enfin une routine de soins qui fonctionne. Mes taches brunes ont considérablement diminué.", testimonialName2: "Sophie Laurent", testimonialRole2: "Passionnée de Soins", testimonial3: "Le test de routine personnalisée a fait toute la différence. Ma peau est incroyable.", testimonialName3: "Jessica Kim", testimonialRole3: "Cliente Fidèle", newsletterTitle: "Recevez Notre Newsletter", newsletterText: "Obtenez 10% de réduction sur votre première commande en vous abonnant à nos conseils beauté.", newsletterPlaceholder: "Votre email", newsletterButton: "S'abonner", footer: "© 2024 BeautyGlow. Brillez naturellement." },
  ar: { hero: "بشرتك\nتستحق الأفضل", sub: "عناية بالبشرة مدعومة علمياً من مكونات طبيعية لكل أنواع البشرة.", shop: "اكتشفي روتينك", featured: "الأكثر مبيعاً", viewAll: "عرض الكل", addCart: "أضف إلى السلة", cats: "تسوقي حسب الاهتمام", quiz: "اعرفي نوع بشرتك →", deal: "🌸 هدية مجانية للطلبات فوق 60$", trust1: "اختبرته الأطباء", trust2: "خالية من القسوة", trust3: "مكونات نظيفة", trust4: "عينات مجانية", testimonialTitle: "نتائج حقيقية، أشخاص حقيقيون", testimonial1: "بشرتي لم تكن أفضل من أي وقت مضى. سيروم فيتامين سي غير بشرتي تماماً!", testimonialName1: "إيما ريتشاردز", testimonialRole1: "مشتر موثوق", testimonial2: "أخيراً روتين عناية يعمل بالفعل. بقعي الداكنة تلاشت بشكل ملحوظ.", testimonialName2: "صوفي لوران", testimonialRole2: "مهتمة بالعناية بالبشرة", testimonial3: "اختبار الروتين المخصص أحدث فرقاً كبيراً. بشرتي مذهلة.", testimonialName3: "جيسيكا كيم", testimonialRole3: "زبونة دائمة", newsletterTitle: "أشرقي مع نشرتنا", newsletterText: "احصلي على خصم 10% عند الاشتراك في نصائحنا الأسبوعية للعناية بالبشرة.", newsletterPlaceholder: "أدخلي بريدك الإلكتروني", newsletterButton: "اشتراك", footer: "© 2024 بيوتي غلو. تألقي بشكل طبيعي." },
};

const products = [
  { id: 1, name: "Vitamin C Serum", price: "$48", img: "https://picsum.photos/seed/beauty1/400/500", tag: "Best Seller", steps: "Step 2" },
  { id: 2, name: "Hyaluronic Moisturiser", price: "$54", img: "https://picsum.photos/seed/beauty2/400/500", tag: "Editor's Pick", steps: "Step 3" },
  { id: 3, name: "Rose Glow Oil", price: "$62", img: "https://picsum.photos/seed/beauty3/400/500", tag: "New", steps: "Step 4" },
  { id: 4, name: "SPF 50 Daily Sunscreen", price: "$36", img: "https://picsum.photos/seed/beauty4/400/500", tag: "Essential", steps: "Step 5" },
  { id: 5, name: "Vitamin C Serum", price: "$48", img: "https://picsum.photos/seed/beauty5/400/400", tag: "Best Seller", steps: "Step 1" },
  { id: 6, name: "Retinol Night Cream", price: "$72", img: "https://picsum.photos/seed/beauty6/400/400", tag: "New", steps: "Step 4" },
  { id: 7, name: "SPF 50 Sunscreen", price: "$38", img: "https://picsum.photos/seed/beauty7/400/400", tag: "Essential", steps: "Step 5" },
  { id: 8, name: "Lip Sleeping Mask", price: "$26", img: "https://picsum.photos/seed/beauty8/400/400", tag: "Editor's Pick", steps: "Step 5" },
];

const concerns = ["Anti-Aging", "Hydration", "Brightening", "Acne", "Sensitive", "Dark Spots"];

export default function BeautyGlow({ language, scheme, dark }: TemplateProps) {
  const t = T[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#120a10" : scheme.bg;
  const surf = dark ? "#1e1018" : scheme.surface;
  const txt = dark ? "#fce7f3" : scheme.text;
  const mut = dark ? "#9b7595" : scheme.muted;
  const brd = dark ? "#3d1f33" : scheme.border;

  return (
    <div dir={dir} style={{ background: bg, color: txt, fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh" }}>
      {/* Promo */}
      <div style={{ background: scheme.accent, color: scheme.accentText, textAlign: "center", padding: "0.625rem", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.05em" }}>{t.deal}</div>

      {/* Nav */}
      <nav style={{ background: bg, borderBottom: `1px solid ${brd}`, padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontWeight: 400, fontSize: "1.6rem", letterSpacing: "0.15em" }}>beautyGlow</div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
          {["Skincare", "Makeup", "Body", "Sets", "Journal"].map(item => (
            <span key={item} style={{ cursor: "pointer", color: mut }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", alignItems: "center" }}>
          <Icon name="search" size={16} style={{ cursor: "pointer", color: mut }} />
          <Icon name="user" size={16} style={{ cursor: "pointer", color: mut }} />
          <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}><Icon name="bag" size={16} /> Bag</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "550px", alignItems: "stretch" }}>
        <div style={{ overflow: "hidden" }}>
          <img src="https://picsum.photos/seed/beautyhero/700/600" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "4rem 4rem", display: "flex", flexDirection: "column", justifyContent: "center", background: surf }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: scheme.accent, textTransform: "uppercase", marginBottom: "1.5rem" }}>The New Ritual</div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: "1.5rem", whiteSpace: "pre-line" }}>{t.hero}</h1>
          <p style={{ color: mut, lineHeight: 1.8, marginBottom: "2rem", fontSize: "0.95rem" }}>{t.sub}</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "1rem 2rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>{t.shop}</button>
            <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>{t.quiz}</span>
          </div>
        </div>
      </div>

      {/* Shop by concern */}
      <section style={{ padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontWeight: 400, fontSize: "1.75rem", marginBottom: "2rem", letterSpacing: "0.05em" }}>{t.cats}</h2>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {concerns.map(c => (
            <button key={c} style={{ background: "transparent", border: `1px solid ${brd}`, borderRadius: "2rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontSize: "0.875rem", color: txt, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = scheme.accent; (e.target as HTMLElement).style.color = scheme.accentText; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = txt; }}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "0 2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 400, fontSize: "1.75rem", letterSpacing: "0.03em" }}>{t.featured}</h2>
          <span style={{ color: scheme.accent, cursor: "pointer", fontSize: "0.875rem" }}>{t.viewAll} →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ cursor: "pointer" }}>
              <div style={{ position: "relative", marginBottom: "1rem", overflow: "hidden", aspectRatio: "4/5", background: surf }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: scheme.accent, color: scheme.accentText, fontSize: "0.7rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "2rem" }}>{p.tag}</div>
                <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: `${bg}cc`, color: txt, fontSize: "0.65rem", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>{p.steps}</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{p.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: scheme.accent, fontWeight: 700 }}>{p.price}</span>
                <button style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "2rem", padding: "0.375rem 1rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>{t.addCart}</button>
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
      <div style={{ background: surf, borderTop: `1px solid ${brd}`, padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", gap: "1rem" }}>
        {[{ icon: "flask", text: t.trust1 }, { icon: "rabbit", text: t.trust2 }, { icon: "leaf", text: t.trust3 }, { icon: "gift", text: t.trust4 }].map((tr, i) => (
          <div key={i}>
            <div style={{ marginBottom: "0.5rem" }}><Icon name={tr.icon} size={28} /></div>
            <div style={{ fontSize: "0.8rem", color: mut }}>{tr.text}</div>
          </div>
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

      <footer style={{ background: surf, borderTop: `1px solid ${brd}`, marginTop: "2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem 2rem", display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", gap: "2.5rem" }}>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem", color: txt, fontFamily: "'Georgia',serif" }}>BeautyGlow</div>
            <div style={{ color: scheme.accent, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Clean Beauty, Real Results</div>
            <p style={{ color: mut, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 1rem" }}>Cruelty-free, dermatologist-tested skincare crafted with clean ingredients for every skin type.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Icon name="instagram" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="facebook" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="twitter" size={18} style={{ color: mut, cursor: "pointer" }} />
              <Icon name="youtube" size={18} style={{ color: mut, cursor: "pointer" }} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", color: txt }}>Shop</div>
            {["Skincare", "Makeup", "Body Care", "Sets & Kits", "Gift Cards"].map(l => (
              <div key={l} style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", color: txt }}>Connect</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon name="mail" size={14} /> hello@beautyglow.com</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon name="phone" size={14} /> +1 (800) 555-GLOW</div>
            <div style={{ color: mut, fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon name="clock" size={14} /> Mon–Fri 9am–6pm</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${brd}`, padding: "1.25rem 2rem", textAlign: "center", color: mut, fontSize: "0.75rem", letterSpacing: "0.08em" }}>{t.footer}</div>
      </footer>
    </div>
  );
}
