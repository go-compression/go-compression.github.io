---
title: Dynamic Markov Compression
layout: default
parent: Overview of Algorithms
nav_order: 4
has_children: false
---

# Dynamic Markov Compression

Dynamic Markov Compression is an obscure form of compression that uses [Markov chains](https://en.wikipedia.org/wiki/Markov_chain) to model the patterns represented in a file.

## Markov Chains

Markov Chains are a simple way to model the transitions between states based on a measureable probability. For example, we could use a Markov Chain to model the weather and the probability that it will become sunny if it's already raining, or vice-versa.

![Markov Chain diagram for sunny and rainy states](/assets/MarkovChains.png)

Each circle represents a **state**, and each arrow represents a **transition**. In this example, we have two states, raining and sunny, a perfect representation of true weather. Each state has two possible transitions, it can transition to itself again or it can transition to another state. The likelihood of each transition is defined by a percentage representing the probability that the transition occurs.

Now let's say it's sunny and we're following this model. According to the model there's a 50% chance it's sunny **again** tomorrow or a 50% chance it's rainy tomorrow. If it becomes rainy, then there's a 25% chance it's rainy the day after that or a 75% chance it's sunny the day after that.

Markov Chains may sound scary but the essence of how they work is quite simple. Markov Chains are the statistical model behind a lot of the technology we use today from Google's PageRank search algorithm to predictive text on smartphone keyboards. If you'd like to learn more, check out this [wonderful article](https://setosa.io/ev/markov-chains/) by Victor Powell and Lewis Lehe that goes into depth about how Markov Chains work. They also have a wonderful [interactive demo](https://setosa.io/markov).

## Markov Chain Powered Compression

Dynamic Markov Compression is a very obscure and complicated subject when it comes to implementation, and unfortunately I cannot claim to understand it well enough to explain it myself. Though, I have written a similar algorithm from my own trial-and-error that employs stateful Markov chains that model a file. You can find the source code within the [Raisin project]({% link reference/raisin.md %}) under the [`compressor/mcc` package](https://github.com/go-compression/raisin/blob/master/compressor/mcc). This code is un-optimized and a bit messy as it exists only as a research project to learn more about DMC.

If you have a better understanding of DMC and would like to contribute to this article, we would appreciate any and all [contributions]({% link contributing.md %})!

## Resources

If you're interested in trying to implement DMC yourself or are just interested in the algorithm, here's a few helpful resources as a jumping-off point:

- [Dynamic Markov Compression on Wikipedia](https://en.wikipedia.org/wiki/Dynamic_Markov_compression)
- [An Exploration of Dynamic Markov Compression Thesis](https://ir.canterbury.ac.nz/bitstream/handle/10092/9572/whitehead_thesis.pdf?sequence=1)
- [The structure of DMC](https://ieeexplore.ieee.org/document/515497) (Paywall)
- [Original Paper](https://academic.oup.com/comjnl/article-pdf/30/6/541/935458/30-6-541.pdf)
- [Original C Implementation](https://web.archive.org/web/20070630111546/http://plg.uwaterloo.ca/~ftp/dmc/dmc.c) by Gordon Cormack
- [Markov Chain Compression - Compressor Head](https://www.youtube.com/watch?v=05RFEGWNxts)
- [Markov Chains](https://setosa.io/ev/markov-chains/)
