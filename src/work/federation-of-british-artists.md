---
title: Federation of British Artists
date: 2018-11-12
description: Creating an online gallery space for the Federation of British Artists.
image: "/images/mall-thumb.jpg"
tags:
- Work
categories:
- Information architecture
link: https://www.mallgalleries.org.uk
layout: post

---

## Background
Established in 1961, The Federation of British Artists (FBA) consists of nine artist societies and is based at the Mall Galleries in London. The societies represent over 500 member artists working in the UK, focusing on contemporary figuarative art.

## The challenge

As well as a new website to better promote their exhibitions and gallery space, they wanted to make the website an extension of their physical gallery space. The site should both compliment and extend their in-gallery exhibtions, showcase the work of their members and display their permanent collection.

## The solution


Gallery sites (done well) give you all the information you need about their exhibitions, but the artwork itself, beyond a few samples, is often omitted. If you want to see the work, visit the gallery.

This approach, while understandable, seems out of step in the age of enormous online art marketplaces like Artfinder or Artsy - almost every piece of art from any artist in any gallery is available to view in just a few clicks. 

The client and I decided at the start that we’d approach the design more like an art marketplace than a traditional gallery. I’d already had a lot of experience designing and building art marketplaces through my own marketplace site Illustrators.co, so I had a good idea of how to begin.  

<img src="/images/mall3.jpg" class="wide" />
<p class="caption">↑ Sitemap detail, showing site structure.</p>

My plan was that every artwork shown in the gallery or that was part of their permanent collection would also be exhibited on the site. We could bring in e-commerce functionality, enabling online art sales and not just in-person at the gallery as was the current process. We could also create profile pages for artists and member societies, meeting the goal of promoting their artwork. 

<img src="/images/mall1.jpg" class="wide" />
<p class="caption">↑ Example mobile and desktop wireframes.</p>

## Implementation 

To make all of these pieces fit together, I used Drupal’s ability to create references from one piece of content to another. These are links that are set up when publishing content, and can be used to pull content from one page to another. References can work both ways, so referencing an artist from an artwork page  sets up a reciprocal reference from the artwork back to the artist. 

For example, when adding an artwork, if I reference an artist, the system will display content from that artist’s profile on my artwork page, such as their name and profile picture. 

These references formed the backbone of the site, joining the different types of content in a meaningful way. Artwork could be referenced by exhibitions and artist profiles, artist profiles could be referenced by exhibitions and member society profiles and so on. 

I used Drupal’s taxonomy system to aid searching and filtering artwork, creating vocabularies for genre, medium, subject and more. 

As time progresses, the site will build up a complete picture of the exhibitions, artists and artwork that have been shown at the gallery - a much richer experience than a traditional gallery website. 

In addition to creating the user experience and information architecture I was heavily involved in the design and development process, art directing the design and contributing towards the front-end development. 