import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), vueDevTools()],
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
