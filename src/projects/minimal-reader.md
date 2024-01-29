---
theme: dark
description: Simple browser-based ebook reader with an emphasis on clean typography.
image: /images/tig/gallery.png
tags:
  - Project
categories: 
  - Vue
  - Web app
layout: post
logo: /images/minimal-logo.jpg
featured: "False"
date: 2023-08-01
status: Active
title: Minimal Reader
---

I'm a huge reader of ebooks, but I've never been happy with the reading experience. Ebooks themselves tend to be poorly typeset and barring a few bright-spots the state of ebook readers is pretty sad: either they're old, abandoned, badly designed or just don't work how I'd like. For example Apple Books, which otherwise is a decent reader, doesn't support vertical scrolling, my preferred way of reading.

![An ebook reading app.](https://res.cloudinary.com/dhcgic4ld/image/upload/v1704759615/ebook-reader-iphone-ipad-app-screenshot_glblpx.jpg)

<p class="caption">↑ Oh, the skeuomorphism (and terrible typography).</p>

Ebook readers put often put a lot of effort into replicating the superficial look of books – paper textures, nice page turn animations, carefully rendered wooden bookshelves etc. – without stopping to think whether that interaction model actually makes sense in a digital context.



For example, the page turn. Pages are great for physical reading (we no longer use long rolls of paper for a reason), but they don't make sense for screen-based content. A gimmick that can be safely ditched. On a digital device, where scrolling is a natural interaction, I'd much rather scroll as I read, rather than having to break focus and swipe the screen the next page. Some readers, like 

So I decided to make my own book reader. How hard can it be, I thought, when ebooks are basically just a zip file full of HTML and CSS anyway?

I got something working pretty quickly that unzipped the epub and displayed the contents, but I should have realised earlier that this could lead to problems. Turns out that perhaps just decompressing and reading any old random file with no precautions might lead to a few security issues.

After researching a lot of options, I decided to go with [epub.js](https://github.com/futurepress/epub.js) as it had good sandboxing and isolation, was well developed and had most of the features I needed. I also decided to build it as a web app, using the browser's local storage to cache the book files as it was pretty simple to implement and ensured it would run on any platform.

### Interactions

<img alt="Minimal reader library" src="https://res.cloudinary.com/dhcgic4ld/image/upload/v1704758874/Screenshot_2024-01-08_at_20.11.50_kbjvmi.jpg" class="wide shadow-md">

<p class="caption">↑ The library.</p>

<img alt="Reading  a book" src="https://res.cloudinary.com/dhcgic4ld/image/upload/v1704759157/Screenshot_2024-01-08_at_20.12.44_jbpdwt.jpg" class="wide shadow-md">
<p class="caption">↑ The reading experience.</p>