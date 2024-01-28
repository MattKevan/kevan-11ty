---
title: Regular expressions cheatsheet
description: A quick reference for some common regular expressions.
date: 2023-07-13
banner:
tags:
  - Article
categories:
  - Code
layout: post
author: Matt Kevan
type: article
image: https://res.cloudinary.com/dhcgic4ld/image/upload/c_crop,h_445,w_593,x_0,y_49/c_scale,h_445,w_593/v1705318217/2208_1c_2.png
---
### Alternation

Find this OR that – either or both return true

```regex
# | = OR

this|that
```

Matches this OR that

### Character sets

Character sets, denoted by a pair of brackets \[], let us match one character from a series of characters, allowing for matches with incorrect or different spellings.

```regex
con[sc]en[sc]us
```

Matches consensus, concensus, consencus, concencus.

```regex
[cat]
```

Matches c, a, or t, but not the text cat.

```regex
# ^ = NOT
[^cat]
```

Matches anything NOT c, a, or t, e.g. dog

### Wildcards

Wildcards will match any single character (letter, number, symbol or whitespace) in a piece of text. They are useful when we do not care about the specific value of a character, but only that a character exists.

```regex
# . = Wildcard
# \. = Escape wildcard
```

```regex
......... 
```

Matches any 9 character text

```regex
I have . cats
```

Matches I have 2 cats, I have 8 cats, I have X cats etc.

### Ranges

Ranges allow us to specify a range of characters in which we can make a match without having to type out each individual character.

```regex
[0-9]
```

Matches any one number between 0-9 

```regex
[a-z]
```

Matches any one lowercase letter between a-z

```regex
[A-Za-z]
```

Matches any one uppercase or lowercase letter between A-z

### Shorthand Character Classes

```regex
\w # Word character
```

Represents the regex range \[A-Za-z0-9_], and it matches a single uppercase character, lowercase character, digit or underscore

```regex
\d # Digit character
```

Represents the regex range \[0-9], and it matches a single digit character

```regex
\s # Whitespace character
```

Represents the regex range \[ \t\r\n\f\v], matching a single space, tab, carriage return, line break, form feed, or vertical tab.

```regex
\d\s\w\w\w\w\w\w\w
```

Matches a digit character, followed by a whitespace character, followed by 7 word characters, eg. 3 monkeys

```regex
\W # Non-word character
\D # Non-digit character
\S # Non-whitespace character
```

### Grouping

```regex
Put it (here|there)
```

Matches Put it here OR Put it there

### Quantifiers

```regex
\w{3} 
```

Matches any three character words

```regex
\w{4,7}
```

Match any words with a minimum of 4 characters and max 7 characters.

```regex
roa{3}r
# Matches ro aaa r
```

```regex
roa{3,7}r 
```

Matches min 3 a's, max 7 a's. Will always match with the largest quantity.

```regex
? # Optional quantifier 
```

```regex
colou?r
```

Matches both color and colour as the u is marked as optional
Need to escape ? if want to use it in sentance.

```regex
The monkey ate a (rotten )?banana
```

Matches both The monkey ate a rotten banana and The monkey ate a banana.

### Kleene star - matches 0 or more times

```regex
coo*l 
```

 Matches co followed by 0 or more o's, followed by l. So, col, cool, coooooooooooooool all match.

```regex
+ # Kleene plus - matches 1 or more times.
```

```regex
coo*l 
```

Matches co followed by 1 or more o's, followed by l 
So, cool, coool, coooooooooooooool all match.

### Anchors

Anchor metacharacters ensure we don't match unintended text. ^ and $ are used to mark the start and the end of a string.

```regex
^Red is my favourite colour$
```

Matches Red is my favourite colour, but not Orange Red is my favourite colour of car.