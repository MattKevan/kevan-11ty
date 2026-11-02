import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const seedPath = path.join(root, ".emdash", "seed.json");

const collectionConfig = {
  articles: {
    label: "Articles",
    labelSingular: "Article",
    directories: ["articles"],
  },
  projects: {
    label: "Projects",
    labelSingular: "Project",
    directories: ["projects"],
  },
  work: {
    label: "Work",
    labelSingular: "Case Study",
    directories: ["work"],
  },
  artwork: {
    label: "Artwork",
    labelSingular: "Artwork",
    directories: ["artwork"],
  },
  pages: {
    label: "Pages",
    labelSingular: "Page",
    directories: ["content-source/pages"],
  },
};

const baseFields = [
  { slug: "title", label: "Title", type: "string", required: true },
  { slug: "description", label: "Description", type: "text" },
  { slug: "date", label: "Publish date", type: "datetime" },
  { slug: "image", label: "Image", type: "image", options: { showPreview: true } },
  { slug: "banner", label: "Banner image", type: "image", options: { showPreview: true } },
  { slug: "logo", label: "Logo", type: "image", options: { showPreview: true } },
  { slug: "tags", label: "Tags (comma separated)", type: "text" },
  { slug: "categories", label: "Categories (comma separated)", type: "text" },
  { slug: "featured", label: "Featured", type: "boolean" },
  { slug: "author", label: "Author", type: "string" },
  { slug: "body", label: "Body (Markdown or HTML)", type: "text" },
  { slug: "body_format", label: "Body format (markdown or html)", type: "string" },
  { slug: "gallery_images", label: "Gallery images", type: "json" },
  { slug: "cover", label: "Cover image filename", type: "string" },
  { slug: "type", label: "Legacy content type", type: "string" },
  { slug: "layout", label: "Legacy layout", type: "string" },
  { slug: "page_bg", label: "Legacy page background", type: "string" },
];

const landingPages = [
  { slug: "home", title: "Matt Kevan", description: "Art, design & code." },
  { slug: "articles", title: "Articles", description: "Insights and reflections on design trends, techniques and personal growth." },
  { slug: "projects", title: "Projects", description: "A few self-initiated projects, highlighting independent explorations in design and innovation." },
  { slug: "work", title: "Work", description: "Case studies of UX, design and development work, from conception to execution." },
  { slug: "artwork", title: "Artwork", description: "Personal art projects exploring creativity, design and technology." },
];

function slugFromFile(filename) {
  return filename.replace(/\.(md|html?)$/i, "");
}

function slugify(value) {
  return String(value ?? "entry")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "entry";
}

function stringList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean).join(", ");
  if (typeof value === "string") return value.trim();
  return "";
}

function normalizedDate(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

async function mediaValue(value, title) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const source = value.trim();
  if (/^https?:\/\//i.test(source)) {
    return {
      $media: {
        url: source,
        filename: path.basename(new URL(source).pathname) || `${slugify(title)}.jpg`,
        alt: title,
      },
    };
  }

  if (!source.startsWith("/")) return undefined;
  // Public assets already have stable URLs and EmDash's Image component can
  // render URL strings. `$media.file` is not a supported seed marker and
  // creates references that cannot be resolved by the media library.
  const localPath = path.join(root, "public", source.replace(/^\/+/, ""));
  try {
    await readFile(localPath);
    return source;
  } catch {
    return undefined;
  }
}

async function readEntries(collection, config) {
  const entries = [];
  for (const directory of config.directories) {
    const fullDirectory = path.join(sourceRoot, directory);
    let filenames = [];
    try {
      filenames = (await readdir(fullDirectory)).filter((filename) => /\.(md|html?)$/i.test(filename));
    } catch {
      continue;
    }

    for (const filename of filenames.sort()) {
      if (collection === "articles" && filename === "colour-palette-generator.html") continue;
      if (collection === "pages" && filename !== "about.md") continue;

      const source = await readFile(path.join(fullDirectory, filename), "utf8");
      const parsed = matter(source);
      const slug = slugFromFile(filename);
      const title = String(parsed.data.title ?? slug.replace(/-/g, " "));
      const data = {
        title,
        description: String(parsed.data.description ?? ""),
        date: normalizedDate(parsed.data.date),
        image: await mediaValue(parsed.data.image, title),
        banner: await mediaValue(parsed.data.banner, title),
        logo: await mediaValue(parsed.data.logo, title),
        tags: stringList(parsed.data.tags),
        categories: stringList(parsed.data.categories),
        featured: parsed.data.featured === true || parsed.data.featured === 1 || parsed.data.featured === "True" || parsed.data.featured === "true",
        author: String(parsed.data.author ?? "Matt Kevan"),
        body: parsed.content.trim(),
        body_format: /\.html?$/i.test(filename) ? "html" : "markdown",
      };

      if (parsed.data.galleryImages) data.gallery_images = parsed.data.galleryImages;
      for (const [key, value] of Object.entries(parsed.data)) {
        if (!(key in data) && ["cover", "type", "layout", "menu", "page-bg"].includes(key) && typeof value === "string") {
          data[key === "page-bg" ? "page_bg" : key] = value;
        }
      }

      for (const key of Object.keys(data)) {
        if (data[key] === undefined || data[key] === "") delete data[key];
      }

      entries.push({
        id: `${collection}-${slugify(slug)}`,
        slug,
        status: parsed.data.published === false ? "draft" : "published",
        data,
      });
    }
  }
  return entries;
}

const collections = Object.entries(collectionConfig).map(([slug, config]) => ({
  slug,
  label: config.label,
  labelSingular: config.labelSingular,
  supports: ["drafts", "revisions"],
  fields: baseFields,
}));

const content = {};
for (const [slug, config] of Object.entries(collectionConfig)) {
  content[slug] = await readEntries(slug, config);
}

const existingPageSlugs = new Set(content.pages.map((entry) => entry.slug));
for (const page of landingPages) {
  if (existingPageSlugs.has(page.slug)) continue;
  content.pages.push({
    id: `pages-${page.slug}`,
    slug: page.slug,
    status: "published",
    data: { title: page.title, description: page.description, body: "", body_format: "markdown" },
  });
}

const seed = {
  "$schema": "https://emdashcms.com/seed.schema.json",
  version: "1",
  meta: {
    name: "Kevan.tv",
    description: "Art, design & code.",
    author: "Matt Kevan",
  },
  settings: { title: "Kevan.tv", tagline: "Art, design & code." },
  collections,
  menus: [
    {
      name: "primary",
      label: "Primary Navigation",
      items: [
        { type: "custom", label: "Articles", url: "/articles/" },
        { type: "custom", label: "Projects", url: "/projects/" },
        { type: "custom", label: "Work", url: "/work/" },
        { type: "custom", label: "Artwork", url: "/artwork/" },
        { type: "custom", label: "About", url: "/about/" },
      ],
    },
  ],
  content,
};

await mkdir(path.dirname(seedPath), { recursive: true });
await writeFile(seedPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Wrote ${Object.values(content).reduce((total, entries) => total + entries.length, 0)} entries across ${collections.length} collections to .emdash/seed.json`);
