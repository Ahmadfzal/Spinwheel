"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * 8 SEGMENT (45° per segment)
 * Urutan HARUS konsisten dengan backend
 */
const SEGMENTS = [
  { label: "ZONK", color: "#f44336" },
  { label: "JACKPOT X2", color: "#ff9800" },
  { label: "ZONK", color: "#f44336" },
  { label: "FREE SPIN 1", color: "#4caf50" },
  { label: "ZONK", color: "#f44336" },
  { label: "JACKPOT X3", color: "#9c27b0" },
  { label: "FREE SPIN 2", color: "#2196f3" },
  { label: "JACKPOT X10", color: "#ffeb3b" }
];

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // ambil hasil dari backend
    const res = await fetch("/api/spins", { method: "POST" });
    const { targetSegmentIndex } = await res.json();

    const anglePerSegment = 360 / SEGMENTS.length;

    // RUMUS PRESISI
    const rotation =
      360 * 5 +
      (360 - targetSegmentIndex * anglePerSegment - anglePerSegment / 2);

    await controls.start({
      rotate: rotation,
      transition: { duration: 4, ease: "circOut" }
    });

    setIsSpinning(false);
  };

  // CONIC GRADIENT (AMAN & PRESISI)
  const gradient = SEGMENTS.map((s, i) => {
    const start = i * (360 / SEGMENTS.length);
    const end = start + 360 / SEGMENTS.length;
    return `${s.color} ${start}deg ${end}deg`;
  }).join(", ");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}
    >
      {/* CONTAINER RODA */}
      <div
        style={{
          position: "relative",
          width: 300,
          height: 300,
          marginBottom: 40
        }}
      >
        {/* JARUM */}
        <div
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "22px solid white",
            zIndex: 10
          }}
        />

        {/* RODA */}
        <motion.div
          animate={controls}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "8px solid gold",
            background: `conic-gradient(${gradient})`,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}
        />
      </div>

      {/* TOMBOL */}
      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          padding: "14px 40px",
          fontSize: 20,
          fontWeight: "bold",
          borderRadius: 30,
          border: "none",
          cursor: "pointer",
          background: isSpinning ? "#999" : "#facc15",
          color: "#000"
        }}
      >
        {isSpinning ? "SPINNING..." : "SPIN"}
      </button>
    </div>
  );
}
