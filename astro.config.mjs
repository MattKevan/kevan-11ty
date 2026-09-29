import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { d1, r2 } from "@emdash-cms/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const database = import.meta.env.PROD
  ? d1({ binding: "DB" })
  : sqlite({ url: "file:./data.db" });

const storage = import.meta.env.PROD
  ? r2({ binding: "MEDIA" })
  : local({
      directory: "./uploads",
      baseUrl: "/_emdash/api/media/file",
    });

export default defineConfig({
  site: "https://kevan.tv",
  output: "server",
  trailingSlash: "ignore",
  adapter: cloudflare(),
  integrations: [
    react(),
    emdash({ database, storage }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
