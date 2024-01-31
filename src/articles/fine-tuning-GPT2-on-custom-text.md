---
description: Finetuning GPT2 to generate custom text
date: 2024-01-30
image: 
banner: 
categories:
  - Artificial intelligence
layout: post
author: Matt Kevan
title: How to fine-tune GPT2 to generate custom text
tags:
  - Article
---

With the release of ChatGPT in 2022, natural language generation (NLG) has exploded from a rather niche curiosity to an increasingly essential part of our lives, almost overnight. 

While the basic ideas have been around for a long time, models large enough to create good results and the comptuing power to run them at a reasonable speed haven't been available until recently. Unlike traditional programs, where functionality is carefully designed and coded by developers, natural language models are more like black boxes – we don't actually know what they can do until we try things out. This is exciting as there's lots to discover, but can be a problem as it's often not possible to tell how or why they arrived at a particular result.

The core technology behind ChatGPT is a large language model (LLM) called GPT, or Generative Pre-trained Transformer. Since the release of GPT1 by OpenAI in 2018, the size and complexity (and ability) of the GPT series of models has increased massively, from 117 million parameters with GPT1 to an estimated 1.76 trillion parameters with GPT4.

One of the things that makes LLMs so useful is that it's straightforward to customise them to perform specific tasks. This is called fine-tuning, and basically consists of giving a model enough examples of a type of content for it to create new content in that style. For example, fine-tuning an LLM on the works of Shakespeare would result in it producing content in a similar style, including vocabulary, sentence structure and formatting.

In this article I'll show you how to fine-tune GPT2 to generate your own text. GPT2 is a good choice for this, as it's large enough to produce reasonable text, while still being small enough to not need enormous amounts of processing power It's also fully open source, which later releases are not.

I thought it would be fun to fine-tune GPT2 on the infamous [@fesshole](https://twitter.com/fesshole) Twitter/X account, but this turned out to be a mistake so I'd recommend you use your own training dataset. Here's a list of [ready-made Kaggle datasets](https://www.kaggle.com/datasets?tags=13204-NLP) if you're looking for ideas. 

If you really want to use the @fesshole dataset, you can find over 16,000 tweets that I scraped here. Though

## Fine-tuning the model

It's possible to fine-tune GPT2 on your computer, especially if you have a decent graphics card. It even ran happily but slowly on my M1 Macbook Air. However, I'd recommend using a service like Google Colab or Paperspace as they will be much faster. 

Op

## Generating content

I got pretty good results from the @fesshole fine-tune. Some were a bit mad, but no more mad than many of the real ones. I was feeling pretty pleased with myself, until I realised that all I'd done was teach an innocent AI about wanking and divorce. 

<iframe width="100%" height="400px" src="https://www.youtube.com/embed/Z9cw4pyKMSU?si=oRXMJKaESNLkeIgE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

You can see a bunch of the generations here, at least until our future robot overlords decide that humanity isn't worth keeping because of it.

