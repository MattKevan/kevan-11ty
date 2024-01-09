---
theme: dark
description: Simple browser-based ebook reader with an emphasis on clean typography.
image: /images/tig/gallery.png
tags:
  - Project
categories: List [ "Vue", "Web app" ]
layout: post
logo: /images/minimal-logo.jpg
banner: https://res.cloudinary.com/dhcgic4ld/image/upload/v1704725031/slc/311_awdmwf.png
featured: "False"
date: 2023-08-01
status: Active
title: Minimal Reader
---
I love ebooks for their portability and convenience, but I've never been happy with the actual experience of reading one. They just don't provide the same level of enjoyment that a well-designed physical book does. 

That's why I've never liked the Kindle – it's just not a nice reading experience: the device is plasticky and cheap and the book typesetting is often dreadful. I try and look past it and focus on the content, but even after tweaking the settings as much as possible it still doesn't feel right.

I've also tried every single ebook reading app available for iOS and iPadOS and it's a similar thing. The state of ebook readers is pretty sad: either they're old, abandoned, badly designed or just don't work how I'd like. 

Ebook readers put often put a lot of effort into replicating the superficial look of books – paper textures, nice page turn animations, carefully rendered wooden bookshelves etc. – without stopping to think whether that interaction model actually makes sense in a digital context.

For example, the page turn. Pages are great for physical reading (we no longer use long rolls of paper for a reason), but they don't make sense for screen-based content. A skeuomorphism that can be safely ditched. On a digital device, where scrolling is a natural interaction, I'd much rather scroll as I read, rather than having to break focus and swipe the screen the next page. Some readers, like Apple Books, don't support vertical scrolling at all.

So I decided to make my own book reader. How hard can it be, I thought, when ebooks are basically just a zip file full of HTML and CSS anyway?

I got something working pretty quickly that unzipped the epub and displayed the contents, but I should have realised earlier that this could lead to problems. Turns out that perhaps just decompressing and reading any old random file with no precautions might lead to a few security issues.

After researching a lot of options, I decided to go with [epub.js](https://github.com/futurepress/epub.js) as it had good sandboxing and isolation, was well developed and had most of the features I needed. I also decided to build it as a web app, using the browser's local storage to cache the book files as it was pretty simple to implement and ensured it would run on any platform.

<img alt="Minimal reader library" src="https://res.cloudinary.com/dhcgic4ld/image/upload/v1704758874/Screenshot_2024-01-08_at_20.11.50_kbjvmi.jpg" class="full shadow-md">

<p class="caption">The book library page</p>