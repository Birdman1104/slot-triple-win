import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  base: process.env.NODE_ENV === "production" ? "/slot-triple-win/" : "",

  build: {
    target: "esnext",
    minify: true,
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    modulePreload: false,
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      input: ["./index.html", "./src/main.ts"],
      treeshake: true,
    },
  },
});
