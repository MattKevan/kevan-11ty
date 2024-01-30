---
title: Black & white photography
date: 2019-03-24
description: 
image: "/images/photo-thumb.jpg"
banner: "/images/photo-thumb.jpg"
theme: dark
tags:
- Photography
- Artwork
layout: wide-post

---

<div class="grid grid-cols-3">
{% assign i = 0 %}
{% for i in (1..24) %}
<img src="/images/p{{ i }}.jpg" />
{% endfor %}
</div>