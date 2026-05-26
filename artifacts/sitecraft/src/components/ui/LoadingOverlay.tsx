import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, Zap, Layers, Palette, Layout, Rocket } from "lucide-react";

function useMinDuration(loading: boolean, minMs: number): boolean {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (loading) {
      setVisible(true);
    }
  }, [loading]);

  useEffect(() => {
    if (visible && !loading) {
      timerRef.current = setTimeout(() => setVisible(false), minMs);
      return () => clearTimeout(timerRef.current);
    }
  }, [visible, loading, minMs]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return loading || visible;
}

const slides = [
  {
    icon: Layers,
    title: "Drag & Drop Builder",
    desc: "Assemble pages visually with intuitive drag-and-drop blocks.",
    gradient: "from-violet-500/20 to-purple-600/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Palette,
    title: "Custom Themes",
    desc: "Switch between professionally designed themes in one click.",
    gradient: "from-pink-500/20 to-rose-600/10",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Layout,
    title: "Responsive by Default",
    desc: "Every page looks stunning on desktop, tablet, and mobile.",
    gradient: "from-emerald-500/20 to-teal-600/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized builds with automatic image optimization and caching.",
    gradient: "from-amber-500/20 to-orange-600/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    desc: "Ship your site to production with a single click.",
    gradient: "from-blue-500/20 to-cyan-600/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
];

function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <div className="relative h-[200px] w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <div className={`rounded-2xl p-6 border ${slide.border} ${slide.gradient} backdrop-blur`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${slide.iconBg} flex items-center justify-center shrink-0`}>
                <slide.icon className={`w-6 h-6 ${slide.iconColor}`} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-white font-bold text-lg">{slide.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{slide.desc}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LoadingOverlay({
  message = "Loading...",
  minDurationMs = 60000,
  loading,
}: {
  message?: string;
  minDurationMs?: number;
  loading: boolean;
}) {
  const show = useMinDuration(loading, minDurationMs);
  const startTime = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      startTime.current = performance.now();
      let raf: number;
      const tick = () => {
        if (startTime.current !== null) {
          const elapsed = performance.now() - startTime.current;
          const pct = Math.min((elapsed / minDurationMs) * 100, 100);
          setProgress(pct);
          if (pct < 100) {
            raf = requestAnimationFrame(tick);
          }
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    } else {
      setProgress(0);
    }
  }, [show, minDurationMs]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[400] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-32 right-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 right-[15%] w-3 h-3 border border-slate-500/30 rotate-45"
          animate={{ y: [-8, 8, -8], rotate: [45, 90, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[10%] w-4 h-4 border border-white/10 rounded-full"
          animate={{ y: [0, -12, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div
          className="absolute top-[60%] left-[12%] w-2.5 h-2.5 bg-white/5 rounded-sm"
          animate={{ rotate: [0, 180, 360], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative">
          <motion.div
            className="text-white font-bold text-2xl flex items-center gap-2"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Globe className="w-6 h-6" />
            Corbit
          </motion.div>
        </div>

        <div className="relative space-y-8">
          <motion.h2
            className="text-4xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Building your project
          </motion.h2>
          <Slideshow />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          className="flex flex-col items-center gap-10"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-md shadow-primary/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Corbit</span>
          </div>

          {/* Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-[72px] h-[72px] rounded-full border-[3px] border-muted" />
            <motion.div
              className="w-[72px] h-[72px] rounded-full border-[3px] border-transparent border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-56 h-[3px] bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Message */}
          <motion.p
            className="text-sm font-medium text-muted-foreground tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {message}
            <span className="inline-flex ml-0.5 gap-[3px]">
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/60 animate-[dot-bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: "0ms" }} />
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/60 animate-[dot-bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: "200ms" }} />
              <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/60 animate-[dot-bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: "400ms" }} />
            </span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
