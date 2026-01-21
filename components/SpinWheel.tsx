"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

const SEGMENTS = [
  { label: "FREE SPIN 1", color: "#FFD400" },
  { label: "ZONK", color: "#FF4C4C" },
  { label: "JACKPOT X2", color: "#00E5FF" },
  { label: "ZONK", color: "#9C27B0" },
  { label: "FREE SPIN 2", color: "#76FF03" },
  { label: "ZONK", color: "#FF5252" },
  { label: "JACKPOT X3", color: "#FF00FF" },
  { label: "JACKPOT X10", color: "#FF9800" }
];

const SIZE = 320;
const RADIUS = SIZE / 2;
const CENTER = RADIUS;
const SLICE = 360 / SEGMENTS.length;

export function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const controls = useAnimation();

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);

    const res = await fetch("/api/spins", { method: "POST" });
    const { targetSegmentIndex } = await res.json();

    const rotation =
      360 * 5 +
      (360 - targetSegmentIndex * SLICE - SLICE / 2);

    await controls.start({
      rotate: rotation,
      transition: { duration: 4, ease: "circOut" }
    });

    setSpinning(false);
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
    const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

    return `
      M ${CENTER} ${CENTER}
      L ${start.x} ${start.y}
      A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y}
      Z
    `;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #3b1c7a, #12002b)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}
    >
      {/* INFO ATAS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={{
          background: "#2c1a52",
          padding: "10px 20px",
          borderRadius: 12,
          fontWeight: "bold"
        }}>🪙 15.000</div>

        <div style={{
          background: "#1e3a8a",
          padding: "10px 20px",
          borderRadius: 12,
          fontWeight: "bold"
        }}>🔄 5</div>
      </div>

      <div style={{ marginBottom: 12, opacity: 0.8 }}>
        Using Free Spin!
      </div>

      {/* RODA */}
      <div style={{ position: "relative" }}>
        {/* JARUM */}
        <div style={{
          position: "absolute",
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "14px solid transparent",
          borderRight: "14px solid transparent",
          borderBottom: "26px solid white",
          zIndex: 10
        }} />

        <motion.svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          animate={controls}
          style={{
            borderRadius: "50%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const start = i * SLICE;
            const end = start + SLICE;
            const mid = start + SLICE / 2;

            const textPos = polarToCartesian(
              CENTER,
              CENTER,
              RADIUS * 0.65,
              mid
            );

            return (
              <g key={i}>
                <path
                  d={describeArc(start, end)}
                  fill={seg.color}
                  stroke="#111"
                  strokeWidth={4}
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  fill="#000"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${textPos.x}, ${textPos.y})`}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}

          {/* CENTER ICON */}
          <circle cx={CENTER} cy={CENTER} r={28} fill="#fff" />
          <text
            x={CENTER}
            y={CENTER + 6}
            textAnchor="middle"
            fontSize="20"
          >
            💰
          </text>
        </motion.svg>
      </div>

      {/* BUTTON */}
      <button
        onClick={spin}
        disabled={spinning}
        style={{
          marginTop: 30,
          padding: "18px 80px",
          fontSize: 24,
          fontWeight: "bold",
          borderRadius: 40,
          background: "linear-gradient(180deg,#60a5fa,#2563eb)",
          color: "white",
          border: "none",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}
      >
        {spinning ? "SPINNING..." : "FREE 5"}
      </button>

      <div style={{ marginTop: 30, opacity: 0.8 }}>
        🔁 Recent Spins
      </div>
    </div>
  );
}
