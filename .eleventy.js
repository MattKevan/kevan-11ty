const linkPreview = require('@aloskutov/eleventy-plugin-link-preview');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const now = String(Date.now())

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(linkPreview);
  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: "default" // opt-out of <img/>-style XHTML single tags
    }
  });
  eleventyConfig.addWatchTarget('./styles/tailwind.config.js')
  eleventyConfig.addWatchTarget('./styles/tailwind.css')

  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  let markdownLibrary = markdownIt(options).use(markdownItAnchor);

  eleventyConfig.setLibrary("md", markdownLibrary);
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/resources");
  eleventyConfig.addPassthroughCopy("src/bbc");
  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' })
  eleventyConfig.addPassthroughCopy('_redirects')
  eleventyConfig.addShortcode('version', function () {
    return now
  })

  return {
    dir: {
      includes: "_includes",
      layouts: "_layouts",
      input: 'src', 
      output: '_site'
    }
  }
};
