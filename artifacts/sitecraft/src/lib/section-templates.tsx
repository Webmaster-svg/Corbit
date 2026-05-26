import React from "react";

export interface FormFieldDef {
  id: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "number";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface SectionContent {
  [key: string]: string;
}

export interface SectionSettings {
  backgroundColor: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  textColor?: string;
  accentColor?: string;
}

export interface SectionTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  layout: number[];
  defaultContent: SectionContent;
  contentFields?: { key: string; label: string; type: "text" | "textarea" | "image" | "color" }[];
  fields?: Omit<FormFieldDef, "id">[];
  isForm?: boolean;
  render: (content: SectionContent, settings: SectionSettings) => React.ReactNode;
}

const wrapSection = (children: React.ReactNode, settings: SectionSettings, cls = "") => (
  <section className={`w-full ${cls}`} style={{
    backgroundColor: settings.backgroundColor || "transparent",
    padding: `${settings.paddingTop} ${settings.paddingRight} ${settings.paddingBottom} ${settings.paddingLeft}`,
    color: settings.textColor || "#111827",
  }}>
    <div className="w-full md:px-8">{children}</div>
  </section>
);

const s = {
  h2: "text-3xl sm:text-4xl font-bold tracking-tight",
  h3: "text-xl sm:text-2xl font-semibold",
  sub: "text-base sm:text-lg max-w-2xl leading-relaxed",
};

export const sectionTemplates: SectionTemplate[] = [
  /* ── 0. Navbar ── */
  {
    type: "navbar", label: "Navbar", description: "Sticky navigation bar with brand and links", icon: "Layout",
    layout: [12],
    defaultContent: {
      brand: "LUXURIA",
      link1: "Home",
      link1Url: "#",
      link2: "Products",
      link2Url: "#",
      link3: "About",
      link3Url: "#",
      link4: "Contact",
      link4Url: "#",
      ctaText: "Bag",
    },
    contentFields: [
      { key: "brand", label: "Brand Name", type: "text" },
      { key: "link1", label: "Link 1", type: "text" },
      { key: "link2", label: "Link 2", type: "text" },
      { key: "link3", label: "Link 3", type: "text" },
      { key: "link4", label: "Link 4", type: "text" },
      { key: "ctaText", label: "CTA Button Text", type: "text" },
    ],
    render: (c, s) => (
      <nav className="w-full sticky top-0 z-50" style={{
        background: s.backgroundColor && s.backgroundColor !== "transparent" ? s.backgroundColor : (s.textColor === "#f5f5f5" ? "#0a0a0a" : "#fafaf8"),
        borderBottom: `1px solid ${(s.textColor || "#111")}20`,
      }}>
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <a href="#" style={{ fontSize: "1.5rem", fontWeight: 300, letterSpacing: "0.3em", textTransform: "uppercase", color: s.textColor || "#111", textDecoration: "none" }}>{c.brand}</a>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: c.link1, url: c.link1Url },
              { label: c.link2, url: c.link2Url },
              { label: c.link3, url: c.link3Url },
              { label: c.link4, url: c.link4Url },
            ].filter(x => x.label).map((link, i) => (
              <a key={i} href={link.url || "#"} style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: (s.textColor || "#111") + "cc", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = s.accentColor || "#b8965a"}
                onMouseLeave={e => e.currentTarget.style.color = (s.textColor || "#111") + "cc"}>{link.label}</a>
            ))}
          </div>
          <div style={{ border: `1px solid ${(s.textColor || "#111")}30`, padding: "0.4rem 1rem", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: s.textColor || "#111", cursor: "pointer" }}>
            {c.ctaText}
          </div>
        </div>
      </nav>
    ),
  },

  /* ── 1. Luxuria Hero ── */
  {
    type: "hero", label: "Hero", description: "Full-screen hero with image background", icon: "Layout",
    layout: [12],
    defaultContent: {
      heading: "Wear the\nUnseen",
      subtext: "Curated luxury fashion for those who define their own elegance.",
      cta: "Shop Collection",
      cta2: "Explore Lookbook",
      badge: "New Collection 2024",
      bgImage: "https://picsum.photos/seed/luxhero/1400/900",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subtext", label: "Subtext", type: "textarea" },
      { key: "cta", label: "Button 1", type: "text" },
      { key: "cta2", label: "Button 2", type: "text" },
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "bgImage", label: "Background Image", type: "image" },
    ],
    render: (c, s) => (
      <div className="w-full relative overflow-hidden" style={{ height: "90vh", minHeight: "500px" }}>
        <img src={c.bgImage} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.55)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16">
          <div className="inline-block mb-6" style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: (s.accentColor || "#d4a574"), border: `1px solid ${s.accentColor || "#d4a574"}`, padding: "0.4rem 1rem" }}>{c.badge}</div>
          <h1 style={{ fontSize: "clamp(3rem,8vw,7rem)", fontWeight: 300, lineHeight: 1.05, color: "#fff", marginBottom: "1.5rem", whiteSpace: "pre-line", fontFamily: "'Georgia',serif" }}>{c.heading}</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "420px", lineHeight: 1.7, marginBottom: "2.5rem", fontSize: "0.95rem" }}>{c.subtext}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" style={{ background: s.accentColor || "#d4a574", color: "#fff", padding: "1rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", display: "inline-block" }}>{c.cta}</a>
            <a href="#" style={{ background: "transparent", color: "#fff", padding: "1rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.5)", display: "inline-block" }}>{c.cta2}</a>
          </div>
        </div>
      </div>
    ),
  },

  /* ── 2. Featured Products ── */
  {
    type: "featured-products", label: "Featured Products", description: "Product grid showcase", icon: "Layout",
    layout: [12],
    defaultContent: {
      heading: "Featured Pieces",
      p1Name: "Silk Draped Gown", p1Price: "$1,240", p1Img: "https://picsum.photos/seed/lux1/400/500",
      p2Name: "Tailored Wool Coat", p2Price: "$890", p2Img: "https://picsum.photos/seed/lux2/400/500",
      p3Name: "Leather Envelope Clutch", p3Price: "$420", p3Img: "https://picsum.photos/seed/lux3/400/500",
      p4Name: "Crystal Heel Mule", p4Price: "$680", p4Img: "https://picsum.photos/seed/lux4/400/500",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "p1Name", label: "Product 1 Name", type: "text" }, { key: "p1Price", label: "Product 1 Price", type: "text" }, { key: "p1Img", label: "Product 1 Image", type: "image" },
      { key: "p2Name", label: "Product 2 Name", type: "text" }, { key: "p2Price", label: "Product 2 Price", type: "text" }, { key: "p2Img", label: "Product 2 Image", type: "image" },
      { key: "p3Name", label: "Product 3 Name", type: "text" }, { key: "p3Price", label: "Product 3 Price", type: "text" }, { key: "p3Img", label: "Product 3 Image", type: "image" },
      { key: "p4Name", label: "Product 4 Name", type: "text" }, { key: "p4Price", label: "Product 4 Price", type: "text" }, { key: "p4Img", label: "Product 4 Image", type: "image" },
    ],
    render: (c, s) => wrapSection(
      <div className="py-16 sm:py-20">
        <div className="flex justify-between items-center mb-10 border-b pb-4" style={{ borderColor: (s.textColor || "#111") + "20" }}>
          <h2 className="text-sm tracking-[0.25em] uppercase font-medium">{c.heading}</h2>
          <span className="text-xs tracking-[0.15em] uppercase" style={{ color: s.accentColor || "#d4a574" }}>View All →</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: c.p1Name, p: c.p1Price, i: c.p1Img },
            { n: c.p2Name, p: c.p2Price, i: c.p2Img },
            { n: c.p3Name, p: c.p3Price, i: c.p3Img },
            { n: c.p4Name, p: c.p4Price, i: c.p4Img },
          ].filter(x => x.n).map((pr, i) => (
            <div key={i}>
              <div className="overflow-hidden mb-4" style={{ aspectRatio: "4/5" }}>
                <img src={pr.i} alt={pr.n} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="text-sm mb-1" style={{ fontFamily: "'Georgia',serif" }}>{pr.n}</div>
              <div className="text-sm">{pr.p}</div>
            </div>
          ))}
        </div>
      </div>,
      s
    ),
  },

  /* ── 3. Trust Bar ── */
  {
    type: "trust-bar", label: "Trust Bar", description: "Brand trust signals row", icon: "Layout",
    layout: [12],
    defaultContent: {
      t1: "Free worldwide shipping", t2: "Authenticity guaranteed", t3: "14-day returns", t4: "Exclusive members access",
    },
    contentFields: [
      { key: "t1", label: "Trust Item 1", type: "text" },
      { key: "t2", label: "Trust Item 2", type: "text" },
      { key: "t3", label: "Trust Item 3", type: "text" },
      { key: "t4", label: "Trust Item 4", type: "text" },
    ],
    render: (c, settings) => (
      <div className="w-full py-8 px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center"
        style={{ backgroundColor: settings.accentColor || "#d4a574", color: "#fff" }}>
        {[c.t1, c.t2, c.t3, c.t4].filter(Boolean).map((t, i) => (
          <div key={i} className="text-xs tracking-[0.12em] uppercase py-2">{t}</div>
        ))}
      </div>
    ),
  },

  /* ── 4. Testimonials ── */
  {
    type: "testimonials", label: "Testimonials", description: "Client testimonials grid", icon: "MessageSquare",
    layout: [12],
    defaultContent: {
      heading: "The Luxuria Experience",
      t1Text: "Exceptional quality and service. The attention to detail in every piece is remarkable.",
      t1Name: "Victoria Ashford", t1Role: "Fashion Editor",
      t2Text: "I've never experienced such personalized service. The styling consultation was worth it.",
      t2Name: "Henrik Larsson", t2Role: "CEO, Stockholm",
      t3Text: "Each piece arrives like a gift — beautifully wrapped and presented.",
      t3Name: "Camille Dubois", t3Role: "Loyal Client",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "t1Text", label: "Testimonial 1", type: "textarea" }, { key: "t1Name", label: "Name 1", type: "text" }, { key: "t1Role", label: "Role 1", type: "text" },
      { key: "t2Text", label: "Testimonial 2", type: "textarea" }, { key: "t2Name", label: "Name 2", type: "text" }, { key: "t2Role", label: "Role 2", type: "text" },
      { key: "t3Text", label: "Testimonial 3", type: "textarea" }, { key: "t3Name", label: "Name 3", type: "text" }, { key: "t3Role", label: "Role 3", type: "text" },
    ],
    render: (c, s) => wrapSection(
      <div className="py-16 sm:py-20 max-w-5xl mx-auto px-8">
        <h2 className="text-center text-2xl sm:text-3xl font-light tracking-[0.12em] uppercase mb-10" style={{ fontFamily: "'Georgia',serif" }}>{c.heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { text: c.t1Text, name: c.t1Name, role: c.t1Role },
            { text: c.t2Text, name: c.t2Name, role: c.t2Role },
            { text: c.t3Text, name: c.t3Name, role: c.t3Role },
          ].filter(x => x.name).map((item, i) => (
            <div key={i} className="flex flex-col pt-6" style={{ borderTop: `1px solid ${(s.textColor || "#111")}20` }}>
              <div className="flex gap-1 mb-3" style={{ color: s.accentColor || "#d4a574" }}>
                {[1, 2, 3, 4, 5].map(st => <span key={st}>★</span>)}
              </div>
              <p className="text-sm leading-relaxed mb-5 flex-1 italic font-light" style={{ lineHeight: 1.9 }}>"{item.text}"</p>
              <div>
                <div className="text-sm tracking-wide">{item.name}</div>
                <div className="text-xs mt-1 tracking-[0.1em] uppercase" style={{ color: (s.textColor || "#111") + "99" }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>,
      s
    ),
  },

  /* ── 5. About Section ── */
  {
    type: "about", label: "About", description: "Image + text about section", icon: "FileText",
    layout: [6, 6],
    defaultContent: {
      heading: "Our Story",
      text: "Luxuria was born from a desire to make true luxury accessible — not in price, but in the experience of wearing something made just for you. Each piece in our collection is sourced from the world's finest ateliers.",
      cta: "Our Story →",
      imageUrl: "https://picsum.photos/seed/luxabout/700/500",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "text", label: "Text", type: "textarea" },
      { key: "cta", label: "Button Text", type: "text" },
      { key: "imageUrl", label: "Image URL", type: "image" },
    ],
    render: (c, s) => wrapSection(
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center py-12 sm:py-16">
        <img src={c.imageUrl} alt="" className="w-full object-cover rounded-sm" />
        <div>
          <h2 className="text-3xl sm:text-4xl font-light leading-tight mb-6" style={{ fontFamily: "'Georgia',serif" }}>{c.heading}</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ lineHeight: 1.9 }}>{c.text}</p>
          <a href="#" style={{ background: "transparent", border: `1px solid ${(s.textColor || "#111")}40`, color: s.textColor || "#111", padding: "0.75rem 2rem", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block" }}>{c.cta}</a>
        </div>
      </div>,
      s
    ),
  },

  /* ── 6. Values Grid ── */
  {
    type: "values", label: "Values", description: "Brand values grid", icon: "Heart",
    layout: [12],
    defaultContent: {
      heading: "What We Stand For",
      v1Title: "Heritage", v1Text: "Deeply rooted in tradition since 1998.",
      v2Title: "Craftsmanship", v2Text: "Every stitch tells a story of expertise.",
      v3Title: "Sustainability", v3Text: "Ethical sourcing and responsible luxury.",
      v4Title: "Exclusivity", v4Text: "Private client experiences worldwide.",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "v1Title", label: "Value 1 Title", type: "text" }, { key: "v1Text", label: "Value 1 Text", type: "text" },
      { key: "v2Title", label: "Value 2 Title", type: "text" }, { key: "v2Text", label: "Value 2 Text", type: "text" },
      { key: "v3Title", label: "Value 3 Title", type: "text" }, { key: "v3Text", label: "Value 3 Text", type: "text" },
      { key: "v4Title", label: "Value 4 Title", type: "text" }, { key: "v4Text", label: "Value 4 Text", type: "text" },
    ],
    render: (c, s) => wrapSection(
      <div className="py-16 sm:py-20 max-w-5xl mx-auto px-8">
        <h2 className="text-center text-2xl sm:text-3xl font-light tracking-[0.1em] uppercase mb-12" style={{ fontFamily: "'Georgia',serif" }}>{c.heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { t: c.v1Title, d: c.v1Text },
            { t: c.v2Title, d: c.v2Text },
            { t: c.v3Title, d: c.v3Text },
            { t: c.v4Title, d: c.v4Text },
          ].filter(x => x.t).map((v, i) => (
            <div key={i} className="p-6 sm:p-8" style={{ border: `1px solid ${(s.textColor || "#111")}20` }}>
              <h3 className="text-base font-normal tracking-[0.1em] uppercase mb-3">{v.t}</h3>
              <p className="text-sm leading-relaxed" style={{ color: (s.textColor || "#111") + "99" }}>{v.d}</p>
            </div>
          ))}
        </div>
      </div>,
      s
    ),
  },

  /* ── 7. Newsletter ── */
  {
    type: "newsletter", label: "Newsletter", description: "Email signup", icon: "Mail",
    layout: [12],
    defaultContent: {
      heading: "Join the Inner Circle",
      subtext: "Be first to know about exclusive drops, private sales, and collection previews.",
      placeholder: "Your email address",
      buttonText: "Subscribe",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subtext", label: "Subtext", type: "textarea" },
      { key: "placeholder", label: "Input Placeholder", type: "text" },
      { key: "buttonText", label: "Button Text", type: "text" },
    ],
    isForm: true,
    fields: [{ type: "email", label: "Email", placeholder: "Your email address", required: true }],
    render: (c, s) => wrapSection(
      <div className="text-center py-16 sm:py-20 max-w-xl mx-auto px-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-4" style={{ fontFamily: "'Georgia',serif" }}>{c.heading}</h2>
        <p className="text-sm mb-8 leading-relaxed">{c.subtext}</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 mx-auto">
          <input type="email" placeholder={c.placeholder} className="flex-1 px-4 py-3 text-sm border" style={{ borderColor: (s.textColor || "#111") + "30", background: "transparent", color: s.textColor || "#111" }} required />
          <button type="submit" className="px-6 py-3 text-xs tracking-[0.15em] uppercase font-semibold" style={{ background: s.accentColor || "#d4a574", color: "#fff", border: "none" }}>{c.buttonText}</button>
        </form>
      </div>,
      s
    ),
  },

  /* ── 8. Contact Form ── */
  {
    type: "contact", label: "Contact", description: "Contact form + info", icon: "Mail",
    layout: [6, 6],
    defaultContent: {
      heading: "Get in Touch",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      messageLabel: "Your Message",
      buttonText: "Send Message",
      address: "123 Rue Saint-Honoré, Paris",
      phone: "+33 1 42 00 00 00",
      hours: "Mon–Sat 10am–7pm",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "nameLabel", label: "Name Field Label", type: "text" },
      { key: "emailLabel", label: "Email Field Label", type: "text" },
      { key: "messageLabel", label: "Message Field Label", type: "text" },
      { key: "buttonText", label: "Button Text", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "hours", label: "Hours", type: "text" },
    ],
    isForm: true,
    fields: [
      { type: "text", label: "Full Name", placeholder: "Full Name", required: true },
      { type: "email", label: "Email", placeholder: "Email Address", required: true },
      { type: "textarea", label: "Message", placeholder: "Your Message", required: true },
    ],
    render: (c, s) => wrapSection(
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 py-12 sm:py-16">
        <div>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Georgia',serif" }}>{c.heading}</h2>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <input type="text" placeholder={c.nameLabel} className="w-full px-4 py-3 text-sm border" style={{ borderColor: (s.textColor || "#111") + "30", background: "transparent", color: s.textColor || "#111" }} required />
            <input type="email" placeholder={c.emailLabel} className="w-full px-4 py-3 text-sm border" style={{ borderColor: (s.textColor || "#111") + "30", background: "transparent", color: s.textColor || "#111" }} required />
            <textarea rows={5} placeholder={c.messageLabel} className="w-full px-4 py-3 text-sm border resize-vertical" style={{ borderColor: (s.textColor || "#111") + "30", background: "transparent", color: s.textColor || "#111" }} required />
            <button type="submit" className="w-full px-6 py-4 text-xs tracking-[0.15em] uppercase font-semibold" style={{ background: s.accentColor || "#d4a574", color: "#fff", border: "none" }}>{c.buttonText}</button>
          </form>
        </div>
        <div>
          <h3 className="text-base font-normal tracking-[0.1em] uppercase mb-8">Visit Us</h3>
          <div className="flex flex-col gap-6">
            {[
              { icon: "📍", text: c.address },
              { icon: "📞", text: c.phone },
              { icon: "🕐", text: c.hours },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-lg shrink-0">{item.icon}</span>
                <span className="text-sm leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>,
      s
    ),
  },

  /* ── 9. CTA Banner ── */
  {
    type: "cta", label: "CTA Banner", description: "Full-width call to action", icon: "Bell",
    layout: [12],
    defaultContent: {
      heading: "Discover Your Signature Style",
      subtext: "Book a complimentary personal styling session with our experts.",
      buttonText: "Book Consultation",
    },
    contentFields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subtext", label: "Subtext", type: "textarea" },
      { key: "buttonText", label: "Button Text", type: "text" },
    ],
    render: (c, s) => wrapSection(
      <div className="text-center py-16 sm:py-20">
        <div className="max-w-xl mx-auto px-6 py-12 sm:py-16" style={{ border: `1px solid ${(s.textColor || "#111")}20` }}>
          <h2 className="text-2xl sm:text-3xl font-light mb-4" style={{ fontFamily: "'Georgia',serif" }}>{c.heading}</h2>
          <p className="text-sm mb-8 leading-relaxed">{c.subtext}</p>
          <a href="#" className="inline-block px-8 py-3 text-xs tracking-[0.15em] uppercase font-semibold" style={{ background: s.accentColor || "#d4a574", color: "#fff" }}>{c.buttonText}</a>
        </div>
      </div>,
      s
    ),
  },

  /* ── 10. Footer ── */
  {
    type: "footer", label: "Footer", description: "Site footer with links", icon: "Layout",
    layout: [12],
    defaultContent: {
      brand: "LUXURIA",
      tagline: "Timeless elegance crafted for those who appreciate the finest things in life. Since 1998.",
      copyright: "© 2024 Luxuria. All rights reserved.",
      col1Title: "Collections",
      col1Items: "Women,Men,Accessories,Shoes,Fine Jewelry",
      col2Title: "Client Care",
      col2Items: "Contact Us,Shipping & Delivery,Returns & Exchanges,Size Guide",
      col3Title: "Boutique",
      col3Address: "384 Avenue des Champs-Élysées",
      col3Phone: "+33 1 44 55 66 77",
      col3Email: "concierge@luxuria.com",
    },
    contentFields: [
      { key: "brand", label: "Brand Name", type: "text" },
      { key: "tagline", label: "Tagline", type: "textarea" },
      { key: "copyright", label: "Copyright", type: "text" },
      { key: "col1Title", label: "Column 1 Title", type: "text" },
      { key: "col1Items", label: "Column 1 Items (comma-separated)", type: "text" },
      { key: "col2Title", label: "Column 2 Title", type: "text" },
      { key: "col2Items", label: "Column 2 Items (comma-separated)", type: "text" },
      { key: "col3Title", label: "Column 3 Title", type: "text" },
      { key: "col3Address", label: "Column 3 Address", type: "text" },
      { key: "col3Phone", label: "Column 3 Phone", type: "text" },
      { key: "col3Email", label: "Column 3 Email", type: "text" },
    ],
    render: (c, s) => (
      <footer className="w-full border-t" style={{ borderColor: (s.textColor || "#111") + "20", backgroundColor: s.backgroundColor || "transparent", color: s.textColor || "#111" }}>
        <div className="w-full px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            <div>
              <div className="text-xl font-light tracking-[0.12em] uppercase mb-3" style={{ fontFamily: "'Georgia',serif" }}>{c.brand}</div>
              <p className="text-xs leading-relaxed font-light italic" style={{ color: (s.textColor || "#111") + "99" }}>{c.tagline}</p>
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-[0.15em] uppercase mb-5">{c.col1Title}</div>
              {c.col1Items.split(",").filter(Boolean).map((item, i) => (
                <div key={i} className="text-xs mb-2 font-light" style={{ color: (s.textColor || "#111") + "99" }}>{item.trim()}</div>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-[0.15em] uppercase mb-5">{c.col2Title}</div>
              {c.col2Items.split(",").filter(Boolean).map((item, i) => (
                <div key={i} className="text-xs mb-2 font-light" style={{ color: (s.textColor || "#111") + "99" }}>{item.trim()}</div>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-[0.15em] uppercase mb-5">{c.col3Title}</div>
              <div className="flex items-center gap-2 text-xs mb-2 font-light" style={{ color: (s.textColor || "#111") + "99" }}><span>📍</span> {c.col3Address}</div>
              <div className="flex items-center gap-2 text-xs mb-2 font-light" style={{ color: (s.textColor || "#111") + "99" }}><span>📞</span> {c.col3Phone}</div>
              <div className="flex items-center gap-2 text-xs mb-2 font-light" style={{ color: (s.textColor || "#111") + "99" }}><span>✉️</span> {c.col3Email}</div>
            </div>
          </div>
        </div>
        <div className="border-t py-5 text-center text-[10px] font-light tracking-wider" style={{ borderColor: (s.textColor || "#111") + "20", color: (s.textColor || "#111") + "99" }}>{c.copyright}</div>
      </footer>
    ),
  },
];

export function getTemplate(type: string): SectionTemplate | undefined {
  return sectionTemplates.find(t => t.type === type);
}
