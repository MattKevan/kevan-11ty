---
title: Black & white photography
date: 2019-03-24
description: Some of my favourite photos taken over the years. 
image: "/images/photo-thumb.jpg"
banner: "/images/photo-thumb.jpg"
theme: dark
tags:
- Artwork
layout: wide-post
categories: 
- Photography
---

<div class="grid grid-cols-3">
{% assign i = 0 %}
{% for i in (1..24) %}
<img src="/images/p{{ i }}.jpg" />
{% endfor %}
</div>