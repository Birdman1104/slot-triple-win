import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === "production" ? "/slot-triple-win/" : "",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/assets/icons", import.meta.url)),
    },
  },
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
