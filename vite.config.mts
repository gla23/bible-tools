/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative so the build works under gla23.github.io/bible-tools/
  base: "./",
  plugins: [react()],
  // content-modal pins React 17 and react-spring 9; share the app's copies
  resolve: {
    dedupe: ["react", "react-dom", "react-spring", "@react-spring/web"],
  },
  test: {
    globals: true,
  },
});
