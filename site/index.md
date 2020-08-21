---
layout: default
title: Overview
nav_order: 1
---

# The Hitchhiker's Guide to Compression

Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun.

Orbiting this at a distance of roughly ninety-two million miles is an utterly insignificant little blue green planet whose ape- descended life forms are so amazingly primitive that they still think digital watches are a pretty neat idea.

This planet has - or rather had - a problem, which was this: files were too big. Many solutions were suggested for solving this problem via lossless compression, such as Lempel-Ziv and Huffman coding, but most of these were implemented into common compression utilities and promptly forgotten. Today, much of the relevant work to compression is in an obscure corner of the internet between lengthy PhD thesis papers and hard-to-find gems.

## Why compression

Lossless file compression, and file compression in general has become a lost art. The modern developer community has moved on from working on compression algorithms to bigger and better problems, such as creating the next major NodeJS framework. However, compression as it stands in the computer science aspect is still as interesting as it was in 1980s, possibly [even more so today](https://www.webfx.com/internet-real-time/) with an estimated [463 Exabytes of data to be created everyday in 2025](http://rcnt.eu/un8bg).

It's no secret that the internet is growing rapidly, and with it more people are becoming connected. From urban dwellers to rural farmers, fast internet speed are not a given. To counter this, there [are](https://www.bbc.com/news/technology-44886803) [numerous](https://www.microsoft.com/en-us/corporate-responsibility/airband) [projects](https://en.wikipedia.org/wiki/Starlink) focused on improving internet speeds for rural users, but there are almost no projects focused on the other half of improving internet access: compressing data.

These claims about the "lost of art of compression" may seem a bit unsubstantiated, as there are new and actively developed compression projects out there today, such as, but not limited to:

- [Facebook's ZSTD](https://github.com/facebook/zstd)
- [Google's Brotli](https://github.com/google/brotli)
- [LZ4](https://github.com/lz4/lz4)
- [Shrynk](https://github.com/kootenpv/shrynk)

However this argument still holds true, compression isn't really mainstream, and I don't know why it isn't. Internet speeds is a real problem and better compression stands as a promising solution. The possibilities of better compression are truly endless:

- Faster 4k video streaming
- Faster app downloads
- Less delay loading websites and content
- and more

## The Goal

The goal of this project, and by extension, the goal of all resources here is to **help people learn about compression algorithms** and **encourage people to tinker, build, and experiment** with their own algorithms and implementations. Afterall, the best way to innovate in tech is to get a bunch of developers interested in something and let them lead the way.

Additionally, this project itself is intended to be a community-sourced resource for people interested in compression algorithms. The idea is that anyone can contribute to this website through GitHub so that this can be a constantly improving and expanding resource for others.

With all of that said, if you're interested in learning more about the world of compression, you should [get started]({% link getting_started.md %}).

## Notable Compression Project Mentions

There are also some other notable projects which I've included at the end, but either they aren't active enough or univeral to be included here.

Notable mentions:

- [LZHAM](https://github.com/richgel999/lzham_codec) (not super active)
- [Google's WebP](https://developers.google.com/speed/webp/) (only for images)
- [Dropbox's DivANS](https://github.com/dropbox/divans)
- [Dropbox's avrecode](https://github.com/dropbox/avrecode)
- [H.266/VCC Codec](https://www.leawo.org/tutorial/h266-vs-h-265-whats-the-difference-1398.html) (domain-specific for video)
- [Pied Piper Middle-Out](http://www.piedpiper.com/) (abandoned and closed-source unfortunately)
