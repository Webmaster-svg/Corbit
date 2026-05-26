import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import type { TemplateEntry } from "../../templates/types";
import { applyTheme, saveSections } from "@/lib/local-storage";
import { sectionTemplates, type SectionContent, type SectionSettings, type FormFieldDef } from "@/lib/section-templates";
import { getThemeContent } from "@/lib/section-theme-content";

type ThemeApplyStatus = "idle" | "saving" | "error";

interface ThemeApplyState {
  pendingTheme: TemplateEntry | null;
  showConfirmOverwrite: boolean;
  status: ThemeApplyStatus;
  errorMessage: string | null;
}

interface ThemeApplyContextValue extends ThemeApplyState {
  openApplyThemeFlow: (theme: TemplateEntry, onSuccess?: () => void) => void;
  cancelApplyTheme: () => void;
  confirmApplyTheme: () => void;
}

const ThemeApplyContext = createContext<ThemeApplyContextValue | null>(null);

export function useThemeApply(): ThemeApplyContextValue {
  const ctx = useContext(ThemeApplyContext);
  if (!ctx) throw new Error("useThemeApply must be used within ThemeApplyProvider");
  return ctx;
}

function freshId(): string {
  return crypto.randomUUID();
}

const defaultSettings = (): SectionSettings => ({
  backgroundColor: "transparent",
  paddingTop: "0px", paddingBottom: "0px",
  paddingLeft: "0px", paddingRight: "0px",
  textColor: "", accentColor: "",
});

const STARTER_TYPES = ["navbar", "hero", "featured-products", "trust-bar", "testimonials", "about", "newsletter", "footer"];

function createStarterSections(tmpl: TemplateEntry) {
  const slug = tmpl.slug;
  const accent = tmpl.schemes?.[0]?.accent || "#d4a574";
  return STARTER_TYPES.map(type => {
    const secTmpl = sectionTemplates.find(t => t.type === type);
    const themeContent = getThemeContent(slug, type);
    return {
      id: freshId(),
      type,
      content: themeContent || (secTmpl ? { ...secTmpl.defaultContent } : {}),
      settings: { ...defaultSettings(), accentColor: accent },
      formFields: secTmpl?.fields ? secTmpl.fields.map((f, i) => ({ ...f, id: `f-${i}-${freshId()}` })) : undefined,
    };
  });
}

export function ThemeApplyProvider({ children }: { children: ReactNode }) {
  const [pendingTheme, setPendingTheme] = useState<TemplateEntry | null>(null);
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);
  const [status, setStatus] = useState<ThemeApplyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSuccessRef = useRef<(() => void) | null>(null);

  const openApplyThemeFlow = useCallback((theme: TemplateEntry, onSuccess?: () => void) => {
    setPendingTheme(theme);
    setShowConfirmOverwrite(true);
    setStatus("idle");
    setErrorMessage(null);
    onSuccessRef.current = onSuccess ?? null;
  }, []);

  const cancelApplyTheme = useCallback(() => {
    setPendingTheme(null);
    setShowConfirmOverwrite(false);
    setStatus("idle");
    setErrorMessage(null);
    onSuccessRef.current = null;
  }, []);

  const confirmApplyTheme = useCallback(() => {
    if (!pendingTheme) return;
    setShowConfirmOverwrite(false);
    setStatus("saving");

    let step = "apply-theme";
    applyTheme({ themeId: pendingTheme.id })
      .then((result) => {
        if (!result) return;
        step = "save-sections";
        const starter = createStarterSections(pendingTheme);
        return saveSections({
          sections: starter,
          language: "en",
          scheme: pendingTheme.schemes?.[0],
          dark: false,
          themeId: pendingTheme.id,
        });
      })
      .then(() => {
        setStatus("idle");
        const cb = onSuccessRef.current;
        onSuccessRef.current = null;
        setPendingTheme(null);
        if (cb) cb();
      })
      .catch((e: Error) => {
        setErrorMessage(`[${step}] ${e?.message || "Internal Server Error"}`);
        setStatus("error");
        setPendingTheme(null);
      });
  }, [pendingTheme]);

  return (
    <ThemeApplyContext.Provider
      value={{
        pendingTheme,
        showConfirmOverwrite,
        status,
        errorMessage,
        openApplyThemeFlow,
        cancelApplyTheme,
        confirmApplyTheme,
      }}
    >
      {children}
    </ThemeApplyContext.Provider>
  );
}
