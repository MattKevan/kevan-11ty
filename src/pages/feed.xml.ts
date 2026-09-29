import { getEmDashCollection } from "emdash";
import { byDateDescending } from "../lib/content";

export async function GET() {
  const { entries } = await getEmDashCollection("articles");
  const articles = byDateDescending(entries);
  const items = articles.map((article) => {
    const url = new URL(`/articles/${article.slug}/`, "https://kevan.tv").href;
    const title = escapeXml(String(article.data.title ?? ""));
    const description = escapeXml(String(article.data.description ?? ""));
    const date = new Date(article.data.date ?? article.publishedAt ?? Date.now()).toUTCString();
    return `<item><title>${title}</title><link>${url}</link><guid>${url}</guid><description>${description}</description><pubDate>${date}</pubDate><dc:creator>Matt Kevan</dc:creator></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="utf-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Kevan.tv</title><link>https://kevan.tv</link><description>Art, design &amp; code.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

