import type { TemplateEntry, ColorScheme } from "./types";
import Luxuria from "./Luxuria";
import FreshMart from "./FreshMart";
import TechZone from "./TechZone";
import Artisan from "./Artisan";
import SportsPro from "./SportsPro";
import BeautyGlow from "./BeautyGlow";
import HomeNest from "./HomeNest";
import KidsWorld from "./KidsWorld";
import Gourmet from "./Gourmet";
import DigitalShop from "./DigitalShop";

const s = (name: string, swatch: string, bg: string, surface: string, accent: string, accentText: string, text: string, muted: string, border: string): ColorScheme =>
  ({ name, swatch, bg, surface, accent, accentText, text, muted, border });

export const TEMPLATES: TemplateEntry[] = [
  { id: 1, slug: "luxuria",
    name: "Luxuria",
    category: "Fashion",
    description: "Editorial luxury fashion store with a minimal black-and-gold aesthetic.",
    thumbnail: "https://picsum.photos/seed/luxhero/600/400",
    component: Luxuria,
    schemes: [
      s("Gold", "#b8965a", "#fafaf8", "#f3f0ea", "#b8965a", "#fff", "#111", "#888", "#ddd"),
      s("Noir", "#e5e5e5", "#0a0a0a", "#141414", "#e5e5e5", "#0a0a0a", "#f5f5f5", "#666", "#333"),
      s("Navy", "#c9a96e", "#0d1b35", "#152440", "#c9a96e", "#0d1b35", "#edf0f7", "#6a7a99", "#1e3055"),
    ],
  },
  { id: 2, slug: "freshmart",
    name: "FreshMart",
    category: "Grocery",
    description: "Vibrant organic grocery store with a clean, fresh green palette.",
    thumbnail: "https://picsum.photos/seed/freshhero/600/400",
    component: FreshMart,
    schemes: [
      s("Green", "#22c55e", "#f0fdf4", "#dcfce7", "#22c55e", "#fff", "#0f2a1d", "#4a7c5c", "#bbf7d0"),
      s("Orange", "#f97316", "#fff7ed", "#ffedd5", "#f97316", "#fff", "#1a0f05", "#7a4a1e", "#fed7aa"),
      s("Earth", "#78716c", "#fafaf9", "#f5f5f4", "#78716c", "#fff", "#1c1917", "#6b7280", "#e7e5e4"),
    ],
  },
  { id: 3, slug: "techzone",
    name: "TechZone",
    category: "Electronics",
    description: "Sleek dark electronics store with a tech-forward blue accent design.",
    thumbnail: "https://picsum.photos/seed/techhero/600/400",
    component: TechZone,
    schemes: [
      s("Cyan", "#06b6d4", "#f0f9ff", "#e0f2fe", "#06b6d4", "#fff", "#0c1a2e", "#4a6a7a", "#bae6fd"),
      s("Blue", "#3b82f6", "#eff6ff", "#dbeafe", "#3b82f6", "#fff", "#0f172a", "#4a5a7a", "#bfdbfe"),
      s("Purple", "#8b5cf6", "#f5f3ff", "#ede9fe", "#8b5cf6", "#fff", "#150d2a", "#5a4a7a", "#ddd6fe"),
    ],
  },
  { id: 4, slug: "artisan",
    name: "Artisan",
    category: "Handmade",
    description: "Warm, earthy handmade marketplace with a rustic artisanal feel.",
    thumbnail: "https://picsum.photos/seed/arthero/600/400",
    component: Artisan,
    schemes: [
      s("Amber", "#d97706", "#fefce8", "#fef9c3", "#d97706", "#fff", "#1c1008", "#7a6030", "#fde68a"),
      s("Clay", "#b45309", "#fdf4e7", "#fde8c8", "#b45309", "#fff", "#1a0c04", "#7a4020", "#fcd1a0"),
      s("Sage", "#4d7c5f", "#f0fdf4", "#dcfce7", "#4d7c5f", "#fff", "#0a1a10", "#4a6a58", "#a7f3d0"),
    ],
  },
  { id: 5, slug: "sportspro",
    name: "SportsPro",
    category: "Sports",
    description: "Bold, energetic sports gear store with high-impact typography.",
    thumbnail: "https://picsum.photos/seed/sporthero/600/400",
    component: SportsPro,
    schemes: [
      s("Orange", "#f97316", "#fff7ed", "#ffedd5", "#f97316", "#fff", "#0c0c0c", "#5a5a5a", "#2a2a2a"),
      s("Red", "#ef4444", "#fef2f2", "#fee2e2", "#ef4444", "#fff", "#0c0808", "#5a3a3a", "#2a1010"),
      s("Lime", "#84cc16", "#f7fee7", "#ecfccb", "#84cc16", "#fff", "#0a0c08", "#4a5a3a", "#d9f99d"),
    ],
  },
  { id: 6, slug: "beautyglow",
    name: "BeautyGlow",
    category: "Beauty",
    description: "Elegant skincare brand with a soft rose-gold and blush aesthetic.",
    thumbnail: "https://picsum.photos/seed/beautyhero/600/400",
    component: BeautyGlow,
    schemes: [
      s("Rose", "#f43f5e", "#fff1f2", "#ffe4e6", "#f43f5e", "#fff", "#1a0a10", "#7a4a5a", "#fecdd3"),
      s("Blush", "#fb7185", "#fff1f2", "#fde8ec", "#fb7185", "#fff", "#1a0a0e", "#7a3a4a", "#fecdd3"),
      s("Mauve", "#c084fc", "#faf5ff", "#f3e8ff", "#c084fc", "#fff", "#140a1e", "#6a4a7a", "#e9d5ff"),
    ],
  },
  { id: 7, slug: "homenest",
    name: "HomeNest",
    category: "Furniture",
    description: "Warm Scandinavian home decor store with a minimal, timeless style.",
    thumbnail: "https://picsum.photos/seed/homehero/600/400",
    component: HomeNest,
    schemes: [
      s("Oak", "#a16207", "#fefce8", "#fef9c3", "#a16207", "#fff", "#1c160a", "#7a6530", "#fde68a"),
      s("Stone", "#78716c", "#fafaf9", "#f5f5f4", "#78716c", "#fff", "#1c1917", "#7a7268", "#e7e5e4"),
      s("Teal", "#0f766e", "#f0fdfa", "#ccfbf1", "#0f766e", "#fff", "#0a1e1c", "#4a7a78", "#99f6e4"),
    ],
  },
  { id: 8, slug: "kidsworld",
    name: "KidsWorld",
    category: "Children",
    description: "Bright, playful children's toy and clothing store with a fun vibe.",
    thumbnail: "https://picsum.photos/seed/kidhero/600/400",
    component: KidsWorld,
    schemes: [
      s("Violet", "#7c3aed", "#f5f3ff", "#ede9fe", "#7c3aed", "#fff", "#0d0a1a", "#5a4a7a", "#ddd6fe"),
      s("Pink", "#ec4899", "#fdf2f8", "#fce7f3", "#ec4899", "#fff", "#1a0a12", "#7a4a64", "#fbcfe8"),
      s("Sky", "#0284c7", "#f0f9ff", "#e0f2fe", "#0284c7", "#fff", "#040e1c", "#3a6a8a", "#bae6fd"),
    ],
  },
  { id: 9, slug: "gourmet",
    name: "Gourmet",
    category: "Food & Wine",
    description: "Sophisticated premium food and fine wine boutique with deep burgundy tones.",
    thumbnail: "https://picsum.photos/seed/gourmethero/600/400",
    component: Gourmet,
    schemes: [
      s("Burgundy", "#9f1239", "#fff1f2", "#ffe4e6", "#9f1239", "#fff5f5", "#1a0408", "#7a4a50", "#fecdd3"),
      s("Gold", "#b45309", "#fdf4e7", "#fde8c8", "#b45309", "#fffbf0", "#1a0c04", "#7a5030", "#fcd1a0"),
      s("Forest", "#166534", "#f0fdf4", "#dcfce7", "#166534", "#f0fdf4", "#0a1e10", "#4a6a50", "#bbf7d0"),
    ],
  },
  { id: 10, slug: "digitalshop",
    name: "DigitalShop",
    category: "Digital",
    description: "Modern digital marketplace with vibrant gradients for creators and makers.",
    thumbnail: "https://picsum.photos/seed/dighero/600/400",
    component: DigitalShop,
    schemes: [
      s("Violet", "#7c3aed", "#faf5ff", "#f3e8ff", "#7c3aed", "#fff", "#06050f", "#5a4a7a", "#1e1c3a"),
      s("Blue", "#2563eb", "#eff6ff", "#dbeafe", "#2563eb", "#fff", "#050a14", "#3a4a6a", "#1e2a4a"),
      s("Indigo", "#4338ca", "#eef2ff", "#e0e7ff", "#4338ca", "#fff", "#07060f", "#4a4a7a", "#1e1c3a"),
    ],
  },
];

export function getTemplate(slug: string): TemplateEntry | undefined {
  return TEMPLATES.find(t => t.slug === slug);
}
