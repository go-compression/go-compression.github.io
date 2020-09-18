---
title: Lempel-Ziv
layout: default
parent: Overview of Algorithms
nav_order: 1
has_children: true
---

# Lempel-Ziv

Lempel-Ziv, commonly referred to as LZ77/LZ78 depending on the variant, is one of the oldest, most simplistic, and widespread compression algorithms out there. It's power comes from its simplicity, speed, and decent compression rates. Now before we dive into an implementation, let's understand the concept behind Lempel-Ziv and the various algorithms it has spawned.

## The Algorithm(s)

Lempel-Ziv at its core is very simple. It works by taking an input string of characters, finding repetitive characters, and outputting an "encoded" version. To get an idea of it, here's an example.

```
Original: Hello everyone! Hello world!
Encoded: Hello everyone! <16,6>world!
```

As you can see, the algorithm simply takes an input string, in this case, "Hello everyone! Hello world!", and encodes it character by character. If it tries to encode a character it has already seen it will check to see if it has seen the next character. This repeats until it the character it's checking hasn't been seen before, following the characters it's currently encoding, at this point it outputs a "token", which is `<16,6>` in this example, and continues.

The `<16,6>` token is quite simple to understand too, it consists of two numbers and some syntactic sugar to make it easy to understand. The first number corresponds to how many characters it should look **backwards**, and the next number tells it how many characters to **go forwards and copy**. This means that in our example, `<16,6>` expands into "Hello " as it goes 16 characters backwards, and copies the next 6 characters.

This is the essential idea behind the algorithm, however it should be noted that there are many variations of this algorithm with different names. For example, in some implementations, the first number means go **forwards from the beginning** instead of **backwards from the current position**. Small (and big) differences like these are the reason for so many variations:

- [LZSS]({% link algorithms/lzss.md %}) - Lempel-Ziv-Storer-Szymanski
- LZW - Lempel-Ziv-Welch
- LZMA - Lempel–Ziv–Markov chain algorithm
- LZ77 - Lempel-Ziv 77
- LZ78 - Lempel-Ziv 78

It's also important to understand the difference between LZ77 and LZ78, the first, and most common, Lempel-Ziv algorithms. LZ77 works very similarly to the example above, using a token to represent an offset and length, while LZ78 uses a more complicated dictionary approach. For a more in-depth explanation, make sure to check out [this wonderful article](https://towardsdatascience.com/how-data-compression-works-exploring-lz78-e97e539138) explaining LZ78.

UNFINISHED

## Implementations

Now because there are so many different variations of Lempel-Ziv algorithms, there isn't a single LZ implementation. WIth that being said, if you are interested in implementing a Lempel-Ziv algorithm yourself, you'll have to choose an algorithm to start with. [LZSS]({% link algorithms/lzss.md %}) is a great starting point as it's a basic evolution of LZ77 and can be implemented very easily while achieving a respectable compression ratio. If you're interested in another algorithm, head back to [the algorithms](#the-algorithms)
