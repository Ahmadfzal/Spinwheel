"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

const SEGMENTS = [
  { label: "Zonk", color: "#f44336" },
  { label: "JACKPOT X 2", color: "#ff9800" },
  { label: "Zonk", color: "#f44336" },
  { label: "FREE SPIN 1X", color: "#4caf50" },
  { label: "Zonk", color: "#f44336" },
  { label: "JACKPOT X 3", color: "#9c27b0" },
  { label: "FREE SPIN 2X", color: "#2196f3" },
  { label: "JACKPOT X 10", color: "#ffeb3b" }
];

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();
  const queryClient = useQueryClient();

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const res = await fetch("/api/spins", { method: "POST" });
    const { targetSegmentIndex } = await res.json();

    const angle = 360 / SEGMENTS.length;
    const rotation =
      360 * 5 + (360 - targetSegmentIndex * angle - angle / 2);

    await controls.start({
      rotate: rotation,
      transition: { duration: 4, ease: "circOut" }
    });

    setIsSpinning(false);
    queryClient.invalidateQueries();
  };

  const gradient = SEGMENTS.map((s, i) => {
    const start = i * (360 / SEGMENTS.length);
    const end = start + 360 / SEGMENTS.length;
    return `${s.color} ${start}deg ${end}deg`;
  }).join(", ");

  return (
    <div className="flex flex-col items-center gap-8 text-white">
      <div className="relative w-80 h-80">

        {/* JARUM */}
        <div className="absolute top-[-18px] left-1/2 -translate-x-1/2 z-10
          w-0 h-0 border-l-[12px] border-r-[12px]
          border-b-[22px] border-transparent border-b-white" />

        {/* RODA */}
        <motion.div
          animate={controls}
          className="w-full h-full rounded-full border-8 border-yellow-500 shadow-2xl"
          style={{
            background: `conic-gradient(${gradient})`
          }}
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="px-12 py-4 bg-yellow-500 text-black font-black rounded-full text-2xl"
      >
        {isSpinning ? "SPINNING..." : "SPIN"}
      </button>
    </div>
  );
}
