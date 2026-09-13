import React from "react";

interface WaveformProps {
  active: boolean;
  color?: string;
  count?: number;
}

export default function Waveform({ active, color = "bg-teal-500", count = 6 }: WaveformProps) {
  const bars = Array.from({ length: count });

  return (
    <div className="flex items-center gap-1 h-6">
      {bars.map((_, index) => {
        // Staggered delays and heights
        const delays = ["0.1s", "0.4s", "0.2s", "0.5s", "0.3s", "0.6s", "0.2s"];
        const heights = ["h-3", "h-5", "h-4", "h-6", "h-3.5", "h-5", "h-4"];
        
        return (
          <div
            key={index}
            className={`w-0.75 ${heights[index % heights.length]} ${color} rounded-full transition-all duration-300 origin-center`}
            style={{
              animationName: active ? "waveform" : "none",
              animationDuration: "1.2s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: delays[index % delays.length],
              transform: active ? undefined : "scaleY(0.25)",
            }}
          />
        );
      })}
    </div>
  );
}
