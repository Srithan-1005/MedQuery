import React, { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface SparklesProps {
  trigger: boolean;
}

export default function Sparkles({ trigger }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // Drift left/right
        y: Math.random() * -80 - 20, // Float up
        size: Math.random() * 12 + 6,
        delay: Math.random() * 0.4,
      }));
      setSparkles(newSparkles);

      // Clean up after animation finishes
      const timer = setTimeout(() => {
        setSparkles([]);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (sparkles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 flex items-center justify-center">
      {sparkles.map(sp => (
        <svg
          key={sp.id}
          className="absolute text-teal-400 dark:text-teal-300 animate-fade-in"
          style={{
            width: sp.size,
            height: sp.size,
            animation: `floatUp 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
            animationDelay: `${sp.delay}s`,
            "--drift-x": `${sp.x}px`,
            "--drift-y": `${sp.y}px`,
          } as React.CSSProperties}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
        </svg>
      ))}
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translate(calc(var(--drift-x) * 0.2), calc(var(--drift-y) * 0.2)) scale(1.1);
          }
          100% {
            transform: translate(var(--drift-x), var(--drift-y)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
