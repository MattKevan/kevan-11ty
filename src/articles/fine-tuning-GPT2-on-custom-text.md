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

## Preparing the data

I thought it would be fun to fine-tune GPT2 on the infamous [@fesshole](https://twitter.com/fesshole) Twitter/X account, but this turned out to be a mistake so I'd recommend you use your own training dataset. Here's a list of [ready-made Kaggle datasets](https://www.kaggle.com/datasets?tags=13204-NLP) if you're looking for ideas. 

If you really want to use the @fesshole dataset, you can find over 16,000 tweets that I scraped here. Though be prepared, there's a lot of naughty language and general bad behaviour.

## Fine-tuning the model

It's possible to fine-tune GPT2 on your computer, especially if you have a decent graphics card – it even ran slowly but happily on my M1 MacBook Air. I'd recommend though that you use a service like Google Colab or Paperspace as they will be much faster. 

I've made a Colab notebook that should make the whole process pretty simple, but here's a more detailed explanation.

### Setup 
First, open the notebook. You may need to sign into your Google account. The model will run happily on a free Colab account, but if you upgrade to a Colab Pro account or buy some credits you'll get access to more powerful hardware, making the whole process much faster.

Install the requirements and connect your Google Drive. The latter is optional, but I definitely recommend it as it means you only need to download the models once and any progress will be saved in your Drive. Free Colab accounts have low usage limits and regularly disconnect, meaning any progress not saved will be lost. Just make sure you have enough space in your Drive.

### Configuration

Upload your dataset to your Google Drive. Locate the file in the notebook file browser, right click on it and select 'Copy patj'

**training_data** – This is the location of your dataset. Find the file in the notebook file browser, right click on it, select 'Copy path' and paste it in this field.

**select_model** – This is the GPT2 model to use. 124M is selected by default as it's smaller and quicker, while the 355M model will produce better results but take a lot longer. Larger GPT2 models are available, but they're too big to run in free Google Colab. The selected model will automatically download to the 'models' folder if you haven't downloaded them already.

**restore_from** – Selecting 'Fresh' will start a new fine-tuning session, while selecting 'Latest' will resume an existing one.

**session_name** – Enter the name for your session. An existing session name will either overwrite or resume it depending on the option above. Sessions are saved in the 'checkpoint' folder.

**number_of_steps** – How long to run the fine-tuning for. Longer is not always better as quality may decrease over time. You may need to experiment with this, but 1000 is a good starting point.

**print_after** – How many steps before printing a progress report. 

**sample_every** – How many steps before printing an output sample. Useful to see how the output is improving as the fine-tuning progresses.

**save_every** – How many steps before saving a progress checkpoint. Set this lower if you're on a free Colab account so that you don't have to re-do too much training when starting a new session. Lots of checkpoint saves will quickly fill up your drive though.

### The training process

When you're happy with the settings, click 'Start training'. This will load everything up and start the fine-tuning process, printing the progress and samples as it goes.

While this is happening, keep an eye on the loss number. This is a rough estimate of how good the output is compared to your original dataset. The lower the loss, the better the output is likely to be. Eventually you'll see the loss stabilise or even start to increase. This is a good sign to stop the training as the model won't improve further and may actually get worse.

## Generating content

I got pretty good results from the @fesshole fine-tune. Some were a bit mad, but no more mad than many of the real ones. I was feeling pretty pleased with myself, until I realised that all I'd done was teach an innocent AI about wanking and divorce. 

<iframe width="100%" height="400px" src="https://www.youtube.com/embed/Z9cw4pyKMSU?si=oRXMJKaESNLkeIgE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

You can see a bunch of the generations here, at least until GPT becomes powerful enough that it decides to wipe us out as humanity is clearly too far gone.
