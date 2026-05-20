import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlatformLoaderProps {
  className?: string;
  size?: number;
  fullScreen?: boolean;
}

export function PlatformLoader({ className, size = 80, fullScreen = false }: PlatformLoaderProps) {
  const controls = useAnimation();

  useEffect(() => {
    async function sequence() {
      // 1. Play the assembly animation (scattered dots converging)
      await controls.start("assemble");

      // 2. Start the continuous spinning animation
      controls.start("continuous");
    }
    sequence();
  }, [controls]);

  // Wrapper for the whole SVG
  const containerVariants = {
    initial: { rotate: -90, scale: 0.5, opacity: 0 },
    assemble: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" as const }
    },
    continuous: {
      rotate: 360,
      transition: {
        rotate: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear" as const
        }
      }
    }
  };

  // Flying Dots animation (only applied to the dots, NOT the paths!)
  const dotVariants = {
    initial: (i: number) => {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 60 + (i % 4) * 40;
      return {
        opacity: 0,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    },
    assemble: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        delay: i * 0.05,
      }
    }),
    continuous: { opacity: 1 }
  };

  // Paths animation (fade in gently, do NOT fly in, to avoid looking like columns)
  const pathVariants = {
    initial: { opacity: 0 },
    assemble: {
      opacity: 1,
      transition: { duration: 1, delay: 0.5 }
    },
    continuous: { opacity: 1 }
  };

  const loaderContent = (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <motion.div className="relative">
        {/* Subtle glowing backdrop */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500/20 blur-[24px] rounded-full scale-[0.9]"
          style={{ zIndex: -1 }}
        />

        <motion.svg
          variants={containerVariants}
          initial="initial"
          animate={controls}
          width={size}
          height={size}
          viewBox="0 0 158 158"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Paths (Fade in only) */}
          <motion.g variants={pathVariants} initial="initial" animate={controls}>
            <path d="M130.803 47.5284L108.139 28.2602L96.3541 51.6711L107.2 62.4293L130.803 47.5284Z" fill="#B1C9FD" />
            <path d="M130.803 111.033L108.139 130.302L96.3541 106.891L107.2 96.1327L130.803 111.033Z" fill="#B1C9FD" />
            <path d="M27.569 111.033L50.233 130.302L62.0182 106.891L51.1719 96.1327L27.569 111.033Z" fill="#B1C9FD" />
            <path d="M27.569 47.5284L50.233 28.2602L62.0182 51.6711L51.1719 62.4293L27.569 47.5284Z" fill="#B1C9FD" />
          </motion.g>

          {/* Inner Nodes (Dark Blue) */}
          {[
            <rect x="95.2695" y="47.3679" width="16.2695" height="16.1372" rx="8.0686" fill="#447AEE" />,
            <rect x="106.197" y="19.1559" width="31.4543" height="31.1986" rx="15.5993" fill="#447AEE" />,
            <rect width="16.2695" height="16.1372" rx="8.0686" transform="matrix(1 0 0 -1 95.2695 111.194)" fill="#447AEE" />,
            <rect width="31.4543" height="31.1986" rx="15.5993" transform="matrix(1 0 0 -1 106.197 139.406)" fill="#447AEE" />,
            <rect x="63.1028" y="111.194" width="16.2695" height="16.1372" rx="8.0686" transform="rotate(180 63.1028 111.194)" fill="#447AEE" />,
            <rect x="52.1756" y="139.406" width="31.4543" height="31.1986" rx="15.5993" transform="rotate(180 52.1756 139.406)" fill="#447AEE" />,
            <rect width="16.2695" height="16.1372" rx="8.0686" transform="matrix(-1 0 0 1 63.1028 47.3679)" fill="#447AEE" />,
            <rect width="31.4543" height="31.1986" rx="15.5993" transform="matrix(-1 0 0 1 52.1756 19.1559)" fill="#447AEE" />,
          ].map((el, i) => (
            <motion.g key={`node-${i}`} custom={i} variants={dotVariants} initial="initial" animate={controls}>
              {el}
            </motion.g>
          ))}

          {/* Outer Accent Orbs (White) */}
          {[
            <rect y="63.5051" width="31.4543" height="31.1986" rx="15.5993" fill="white" />,
            <rect x="63.8152" width="31.4543" height="31.1986" rx="15.5993" fill="white" />,
            <rect x="126.546" y="63.5051" width="31.4543" height="31.1986" rx="15.5993" fill="white" />,
            <rect x="63.8152" y="126.801" width="31.4543" height="31.1986" rx="15.5993" fill="white" />,
          ].map((el, i) => (
            <motion.g key={`orb-${i}`} custom={i + 8} variants={dotVariants} initial="initial" animate={controls}>
              {el}
            </motion.g>
          ))}

          {/* Central Pulsing Dots (White) */}
          {[
            <rect x="72.4922" y="101.48" width="16.2695" height="16.1372" rx="8.0686" fill="white" />,
            <rect x="72.4922" y="39.8211" width="16.2695" height="16.1372" rx="8.0686" fill="white" />,
            <rect x="102.311" y="71.0358" width="16.2695" height="16.1372" rx="8.0686" fill="white" />,
            <rect x="40.1475" y="71.0358" width="16.2695" height="16.1372" rx="8.0686" fill="white" />,
          ].map((el, i) => (
            <motion.g key={`center-${i}`} custom={i + 12} variants={dotVariants} initial="initial" animate={controls}>
              {el}
            </motion.g>
          ))}

        </motion.svg>
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
        <span className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          Loading...
        </span>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
      >
        {loaderContent}
      </motion.div>
    );
  }

  return loaderContent;
}
