import { AnimatePresence, motion } from "framer-motion";
import type { ColorScheme } from "../types";
import { Icon } from "./Icons";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  img: string;
  qty: number;
};

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdate: (id: number, qty: number) => void;
  scheme: ColorScheme;
  dark: boolean;
  lang?: "en" | "fr" | "ar";
}

const CT = {
  en: { title: "Shopping Cart", empty: "Your cart is empty", emptySub: "Add items to get started", continue: "Continue Shopping", items: "items", item: "item", subtotal: "Subtotal", shipping: "Shipping", free: "FREE", total: "Total", checkout: "Proceed to Checkout →", remove: "Remove" },
  fr: { title: "Panier", empty: "Votre panier est vide", emptySub: "Ajoutez des articles pour commencer", continue: "Continuer les achats", items: "articles", item: "article", subtotal: "Sous-total", shipping: "Livraison", free: "GRATUIT", total: "Total", checkout: "Passer à la caisse →", remove: "Supprimer" },
  ar: { title: "سلة التسوق", empty: "سلتك فارغة", emptySub: "أضف عناصر للبدء", continue: "مواصلة التسوق", items: "عناصر", item: "عنصر", subtotal: "المجموع الفرعي", shipping: "الشحن", free: "مجاني", total: "الإجمالي", checkout: "المتابعة للدفع ←", remove: "إزالة" },
};

export function CartDrawer({ open, onClose, items, onRemove, onUpdate, scheme, dark, lang = "en" }: CartDrawerProps) {
  const ct = CT[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const bg = dark ? "#1a1a1a" : "#ffffff";
  const surf = dark ? "#252525" : "#f7f7f7";
  const brd = dark ? "#333" : "#e5e5e5";
  const txt = dark ? "#f5f5f5" : "#111";
  const mut = dark ? "#888" : "#666";
  const subtotal = items.reduce((s, i) => s + i.priceNum * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300 }}
          />
          <motion.div
            initial={{ x: lang === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            dir={dir}
            style={{ position: "fixed", top: 0, [lang === "ar" ? "left" : "right"]: 0, bottom: 0, width: "min(400px, 90vw)", background: bg, color: txt, zIndex: 301, display: "flex", flexDirection: "column", boxShadow: lang === "ar" ? "4px 0 24px rgba(0,0,0,0.2)" : "-4px 0 24px rgba(0,0,0,0.2)", fontFamily: "inherit" }}
          >
            {/* Header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>{ct.title}</h2>
                <p style={{ color: mut, fontSize: "0.78rem", margin: "0.2rem 0 0" }}>{count} {count === 1 ? ct.item : ct.items}</p>
              </div>
              <button onClick={onClose} style={{ background: surf, border: "none", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: txt, fontSize: "1.2rem", fontWeight: 300 }}>×</button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {items.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "0.875rem", color: mut }}>
                  <Icon name="bag" size={56} />
                  <p style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>{ct.empty}</p>
                  <p style={{ fontSize: "0.85rem", textAlign: "center", margin: 0 }}>{ct.emptySub}</p>
                  <button onClick={onClose} style={{ background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.5rem", padding: "0.625rem 1.5rem", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.5rem" }}>{ct.continue}</button>
                </div>
              ) : items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "0.75rem", background: surf, borderRadius: "0.75rem", padding: "0.75rem", border: `1px solid ${brd}` }}>
                  <img src={item.img} alt={item.name} style={{ width: "4.5rem", height: "4.5rem", objectFit: "cover", borderRadius: "0.5rem", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ color: scheme.accent, fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.5rem" }}>{item.price}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", border: `1px solid ${brd}`, borderRadius: "0.4rem", overflow: "hidden" }}>
                        <button onClick={() => onUpdate(item.id, item.qty - 1)} style={{ background: surf, border: "none", width: "1.75rem", height: "1.75rem", cursor: "pointer", color: txt, fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <span style={{ minWidth: "1.5rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, background: bg, padding: "0 0.25rem" }}>{item.qty}</span>
                        <button onClick={() => onUpdate(item.id, item.qty + 1)} style={{ background: surf, border: "none", width: "1.75rem", height: "1.75rem", cursor: "pointer", color: txt, fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>
                      <button onClick={() => onRemove(item.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0" }}>{ct.remove}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: "1.25rem 1.5rem", borderTop: `1px solid ${brd}`, flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem", fontSize: "0.85rem", color: mut }}>
                  <span>{ct.subtotal}</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.875rem", fontSize: "0.85rem" }}>
                  <span style={{ color: mut }}>{ct.shipping}</span><span style={{ color: "#22c55e", fontWeight: 700 }}>{ct.free}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.1rem", paddingTop: "0.75rem", borderTop: `1px solid ${brd}`, marginBottom: "1rem" }}>
                  <span>{ct.total}</span><span style={{ color: scheme.accent }}>${subtotal.toFixed(2)}</span>
                </div>
                <button style={{ width: "100%", background: scheme.accent, color: scheme.accentText, border: "none", borderRadius: "0.5rem", padding: "0.875rem", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>{ct.checkout}</button>
                <button onClick={onClose} style={{ width: "100%", background: "transparent", color: mut, border: `1px solid ${brd}`, borderRadius: "0.5rem", padding: "0.625rem", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>{ct.continue}</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
