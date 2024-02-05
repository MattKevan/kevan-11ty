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

With the release of ChatGPT in 2022, large language models (LLMs) have gone, seemingly overnight, from a fairly niche curiosity to an increasingly essential part of our lives. While the ideas behind LLMs are not new, models large enough and computers powerful enough have only just become available. 

The core technology behind ChatGPT is a LLM called GPT, or Generative Pre-trained Transformer. Since the release of GPT1 by OpenAI in 2018, the size and complexity (and ability) of the GPT models has increased from 117 million parameters with GPT1 to an estimated 1.76 trillion parameters with GPT4.

Unlike traditional programs, where features are carefully designed and developed, LLMs are more like black boxes – we don't actually know what they can do until we experiment. This is exciting as there's still a lot to discover, but can be a problem as it's often not possible to tell how or why they arrived at a particular result.

One of the things that makes LLMs so useful is that it's straightforward to customise them to perform specific tasks. This is called fine-tuning, and basically consists of giving a model enough examples of a type of content for it to create new content in that style. For example, fine-tuning an LLM on the works of Shakespeare would result in it producing content in a similar style, including vocabulary, sentence structure and formatting.

In this article I'll show you how to fine-tune GPT2 to generate your own text. GPT2 is a good choice for this, as it's big enough to produce coherent text while being small enough to run on regular hardware. It's also open source, unlike later versions.

## Preparing the training data

I thought it would be fun to fine-tune GPT2 on the infamous [@fesshole](https://twitter.com/fesshole) Twitter/X account, but this turned out to be a mistake so I'd recommend you use your own training dataset. Here's a list of [ready-made Kaggle datasets](https://www.kaggle.com/datasets?tags=13204-NLP) if you're looking for ideas. 

If you really want to use the Fesshole dataset, you can find over 16,000 tweets that I scraped here. If you've not encountered Fesshole before, be prepared, there's a lot of bad language and naughty behaviour.

## Fine-tuning the model

It's possible to fine-tune GPT2 on your computer, especially if you have a decent graphics card – it even ran slowly but happily on my M1 MacBook Air. I'd recommend though that you use a service like Google Colab or Paperspace as they will be much faster. 

I've made a Colab notebook that should make the whole process pretty simple, but here's a more detailed explanation.

### Setup 
First, open the notebook. You may need to sign into your Google account for this. The model will run happily on a free Colab plan, but if you upgrade to Colab Pro or buy some credits you'll get access to more powerful hardware.

Run the 'Install requirements' cell and wait for the installation process to complete. Ensure 'use_google_drive' is ticked and enter the name of the folder in your Drive where you want to save everything into the 'working_folder' field. Run the cell and follow the instructions to connect your Drive. If the folder doesn't already exist, the script will create it for you. 

You don't have to use Google Drive, but if you don't you'll lose your models and training progress whenever the notebook disconnects. Which happens a lot.

### Configuration

**training_data** – This is the location of your dataset. Find the file in the notebook file browser, right click on it, select 'Copy path' and paste it in this field.

**select_model** – Select which GPT2 model to use. 124M is the default as it's smaller and quicker, while the 355M model produces better results but takes longer. Larger GPT2 models are available but they're too big to run in free Google Colab. The selected model will automatically download to the 'models' folder if they're not downloaded already.

**restore_from** – Selecting 'Fresh' will start a new fine-tuning session, while selecting 'Latest' will resume an existing one.

**session_name** – Enter the name for your session. An existing session name will either overwrite or resume it depending on the option above. Sessions are saved in the 'checkpoint' folder.

**number_of_steps** – How long to run the fine-tuning for. Longer is not always better as output quality may decrease over time. You'll need to experiment for best results, but 1000 is a good starting point.

**sample_every** – How many steps before printing a sample generation. Interesting to see how the output changes during the fine-tuning progresses.

**save_every** – How many steps before saving a progress checkpoint. Set this lower if you're on a free Colab so you don't lose too much progress when starting a new session. Checkpoint saves will quickly fill up your drive.

### The training process

When you're happy with the settings, click 'Start training'. This will start the fine-tuning process, printing the progress and samples as it goes.

While this is happening, keep an eye on the loss number. This is a rough estimate of how close the output is to your original dataset. The lower the loss, the better the output is likely to be. It'll drop quite rapidly at first, but When the loss stabilises, the fine-tuning is pretty much complete. Training for longer longer won't improve the output much and may even make it worse.

## Generating content

It surprised me how well the fine-tune came out – some generations were nonsens, but many could easily be real 'fesses. Then I felt guilty as I realised all I'd actually done was teach an innocent AI about about divorce and wanking.

<iframe width="100%" height="400px" src="https://www.youtube.com/embed/Z9cw4pyKMSU?si=oRXMJKaESNLkeIgE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

You can see a bunch of the generations here, at least until GPT becomes so powerful it decides humanity's not worth saving.

