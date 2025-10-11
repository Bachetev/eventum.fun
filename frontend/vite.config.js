import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [] // добавим tailwind/autoprefixer позже, сейчас глушим поиск внешних конфигов
    }
  },
  server: { port: 5173, open: true },
  preview: { port: 5174 }
});
