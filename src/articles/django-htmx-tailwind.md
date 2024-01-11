---
theme: dark
description: Starter project for Django, with HTMX, Tailwind and Alpine.js.
image: /images/tig/gallery.png
tags:
  - Project
categories:
  - Branding
  - Print design
  - Web development
layout: post
logo: /images/djx.jpg
banner: https://res.cloudinary.com/dhcgic4ld/image/upload/v1704833577/Deep_Glass2_r8pl0b.jpg
featured: "False"
date: 2023-12-01
status: Active
title: Django HTMX
---
A starter project for Django based on [DjangoX](https://github.com/wsvincent/djangox) by Will Vincent. This adds a few extra features I found I was adding for every project, as well as switching the front-end framework from Bootstrap and jQuery to Tailwind, HTMX and Alpine.js.

<img alt="Homepage" src="https://res.cloudinary.com/dhcgic4ld/image/upload/v1705010973/Screenshot_2024-01-11_at_21.08.38_le0jjd.png" class="wide">

### Features

* Django 4.2 & Python 3.11.
* Modern front-end experience with [HTMX](https://htmx.org/) and [django-htmx](https://django-htmx.readthedocs.io/en/latest/).
* Front-end styling with [Tailwind](https://tailwindcss.com/) and [django-tailwind](https://django-tailwind.readthedocs.io/).
* Interactivity with [Alpine.js](https://alpinejs.dev/).
* Environment variables with [python-dotenv](https://saurabh-kumar.com/python-dotenv/).
* Media management support via [Cloudinary](https://cloudinary.com/).
* User log in/out, sign up, password reset via [django-allauth](https://allauth.org/).
* Static files configured with [Whitenoise](https://whitenoise.readthedocs.io/en/stable/index.html).
* Debugging with [django-debug-toolbar](https://django-debug-toolbar.readthedocs.io/en/latest/).
* DRY forms with [django-crispy-forms](https://github.com/django-crispy-forms/django-crispy-forms).
* Live reloading with [django-browser-reload](https://pypi.org/project/django-browser-reload/).
* Custom 404, 500, and 403 error pages.

### Installation

Clone the project and move into the directory.

```
$ git clone https://github.com/MattKevan/djangox-tailwind.git
$ cd djangox-tailwind
```

Create a new virtual environment and activate it.

```python
$ python -m venv .venv
$ source .venv/bin/activate 
```

Rename env-sample to .env and add your site key as well as any other variables. If necessary, you can generate a site key here.

```python
mv env-sample .env
```

Install the requirements and set up the database. The site will use SQLite by default, but it's straightforward to use Postgres instead.

```
$ pip install -r requirements.txt
$ python manage.py migrate
```

Set up the superuser, entering your email, username and password.

```
$ python manage.py createsuperuser
```

Launch the site at http://127.0.0.1:8000

```
python manage.py runserver
```

### Tailwind

Open a new terminal tab, ensuring your virtual environment venv is activated. Start the Tailwind development server with:

```
python manage.py tailwind start
```

This will watch for changes in your template and theme files and use browsersync to refresh the browser.

Create a build optimised for production:

```
python manage.py tailwind build
```

[View on Github »](https://github.com/MattKevan/django-htmx)