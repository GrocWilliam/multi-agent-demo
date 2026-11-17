import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060F",
        nebula: "#0E1030",
        hull: "#161A3D",
        "hull-edge": "#2A3070",
        starlight: "#E8ECFF",
        stardust: "#A9B1E0",
        plasma: "#4DE1FF",
        nova: "#FF4FD8",
        ember: "#FFB547",
        alert: "#FF6B6B",
      },
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        sans: ['"Exo 2"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 18px rgba(77, 225, 255, 0.35)",
        "glow-nova": "0 0 18px rgba(255, 79, 216, 0.35)",
      },
      borderRadius: {
        md: "0.5rem",
        xl: "1rem",
      },
      backgroundImage: {
        starfield: "radial-gradient(ellipse at 50% 0%, #0E1030 0%, #05060F 70%)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        orbit: {
          to: { transform: "rotate(360deg)" },
        },
        "float-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        orbit: "orbit 1s linear infinite",
        "float-in": "float-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
