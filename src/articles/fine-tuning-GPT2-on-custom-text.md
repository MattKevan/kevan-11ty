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

Natural language generation (NLG) is going from a niche curiosity to becoming an increasingly ubiquitous part of our lives. With the release of ChatGPT in 2022 it was quickly apparent how handy NLG could be, from answering questions to helping write content, with more uses being found all the time.

The core technology behind ChatGPT is a large language model (LLM) called GPT, or Generative Pre-trained Transformer. Since the release of GPT1 by OpenAI in 2018, the size and complexity (and therefore the ability) of the GPT models has increased rapidly, from 117 million parameters with GPT1 to an estimated 1.76 trillion parameters with GPT4.

One of the things that makes LLMs so useful is that it's straightforward to customise them to perform specific tasks. This is called fine-tuning, and basically consists of giving a model enough examples of a type of content for it to create new content in that style. After fine-tuning an LLM on the works of Shakespeare for example, all its responses would be structured like a play and have a distinctly Shakesperean feel.

In this article I'll show you how to fine-tune GPT2 to generate your own text. GPT2 is a good choice for this, as it's large enough to produce good quality text, while still being small enough to not need enormous amounts of processing power to run. It's also fully open source, which later releases are not.

I thought it would be fun to fine-tune GPT2 on the [@fesshole](https://twitter.com/fesshole) Twitter/X account, but this turned out to be a mistake so I'd recommend you use your own training dataset. Here's a list of [ready-made Kaggle datasets](https://www.kaggle.com/datasets?tags=13204-NLP) if you're looking for ideas.

### Getting started

It's possible to fine-tune GPT2 on your computer, especially if you have a decent graphics card, but I'd recommend using a service like Google Colab or Paperspace as they will be significantly faster. 