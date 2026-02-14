module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 58, 237, 0.35), 0 0 60px rgba(236, 72, 153, 0.25)",
      },
      colors: {
        night: "#05050b",
        neon: "#7c3aed",
        plasma: "#ec4899",
      },
    },
  },
  plugins: [],
}
