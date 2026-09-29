import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://kevan.tv",
  output: "server",
  trailingSlash: "ignore",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    emdash({
      database: sqlite({ url: "file:./data.db" }),
      storage: local({ directory: "./uploads", baseUrl: "/_emdash/api/media/file" }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
