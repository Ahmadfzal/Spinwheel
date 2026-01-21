"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

const SEGMENTS = [
  { label: "Zonk", color: "#f44336" },
  { label: "JACKPOT X2", color: "#ff9800" },
  { label: "Zonk", color: "#f44336" },
  { label: "FREE SPIN", color: "#4caf50" },
  { label: "Zonk", color: "#f44336" },
  { label: "JACKPOT X3", color: "#9c27b0" },
  { label: "FREE SPIN 2X", color: "#2196f3" },
  { label: "JACKPOT X10", color: "#ffeb3b" }
];

export function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const controls = useAnimation();

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);

    const res = await fetch("/api/spins", { method: "POST" });
    const { targetSegmentIndex } = await res.json();

    const rotate =
      360 * 5 + (360 - targetSegmentIndex * 45 - 22.5);

    await controls.start({
      rotate,
      transition: { duration: 4, ease: "circOut" }
    });

    setSpinning(false);
  };

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <div style={{ position: "relative", width: 300, height: 300 }}>
        <div style={{
          position: "absolute",
          top: -15,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "20px solid white",
          zIndex: 10
        }} />

        <motion.div
          animate={controls}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "8px solid gold",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {SEGMENTS.map((s, i) => (
            <div
              key={i}
              style={{
                background: s.color,
                position: "absolute",
                width: "50%",
                height: "50%",
                transform: `rotate(${i * 45}deg) skewY(-45deg)`,
                transformOrigin: "100% 100%"
              }}
            />
          ))}
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        style={{
          marginTop: 30,
          padding: "12px 30px",
          fontSize: 20,
          fontWeight: "bold",
          borderRadius: 30
        }}
      >
        {spinning ? "SPINNING..." : "SPIN"}
      </button>
    </div>
  );
}
