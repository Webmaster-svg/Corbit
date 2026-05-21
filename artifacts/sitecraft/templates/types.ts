export type Language = "en" | "fr" | "ar";

export type ColorScheme = {
  name: string;
  swatch: string;
  bg: string;
  surface: string;
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  border: string;
};

export interface TemplateProps {
  language: Language;
  scheme: ColorScheme;
  dark: boolean;
}

export interface TemplateEntry {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  schemes: ColorScheme[];
  component: React.ComponentType<TemplateProps>;
}
