import { useThemeApply } from "@/lib/theme-context";
import { AlertTriangle, Loader2 } from "lucide-react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function ApplyThemeOverlay() {
  const {
    pendingTheme,
    showConfirmOverwrite,
    status,
    errorMessage,
    cancelApplyTheme,
    confirmApplyTheme,
  } = useThemeApply();

  return (
    <>
      {showConfirmOverwrite && pendingTheme && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={cancelApplyTheme} />
          <div
            className="relative w-full max-w-[420px] bg-background dark:bg-[#0B101B] border border-border/40 rounded-2xl p-8 shadow-lg z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon circle with glow */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 relative"
                style={{ background: "rgba(245, 124, 0, 0.1)", border: "1px solid rgba(245, 124, 0, 0.2)" }}
              >
                <div className="absolute inset-0 blur-xl rounded-full"
                  style={{ background: "rgba(245, 124, 0, 0.15)" }} />
                <AlertTriangle className="w-6 h-6 relative z-10" style={{ color: "#F57C00" }} />
              </div>

              {/* Heading */}
              <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">
                Overwrite current theme?
              </h2>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[320px] mb-6">
                Switching to{" "}
                <span className="font-semibold text-foreground">{pendingTheme.name}</span>{" "}
                will replace all sections, edits, and settings. This cannot be undone.
              </p>

              {/* Theme info card */}
              <div className="w-full bg-card border border-border/70 rounded-xl p-4 mb-6 flex items-center gap-3.5 shadow-xs">
                <div
                  className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "rgba(245, 124, 0, 0.12)",
                    color: "#F57C00",
                  }}
                >
                  {pendingTheme.name.charAt(0)}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-sm font-bold text-foreground truncate">
                    {pendingTheme.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {pendingTheme.category || "Website"} &middot; Starter sections
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex gap-3">
                <button
                  onClick={cancelApplyTheme}
                  className="flex-1 h-11 rounded-full bg-background dark:bg-transparent border border-border dark:border-white/10 hover:bg-accent dark:hover:bg-white/5 text-foreground dark:text-white font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApplyTheme}
                  className="flex-1 h-11 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-xs tracking-tight shadow-md hover:shadow-lg transition-all"
                >
                  Confirm Overwrite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay loading={status === "saving"} message="Applying theme..." />

      {/* ── Error Toast ── */}
      {status === "error" && errorMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-5 py-3 rounded-xl bg-card border border-red-500/20 shadow-md text-sm font-medium text-red-500">
          {errorMessage}
        </div>
      )}
    </>
  );
}
