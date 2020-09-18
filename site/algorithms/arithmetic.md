---
title: Arithmetic Coding
layout: default
parent: Overview of Algorithms
nav_order: 5
has_children: false
---

# Arithmetic Coding

In the world of dictionary coding and probability based encoding, the floating point weirdness that is arithmetic coding is a refreshing and surprisingly efficient lossless compression algorithm.

At a very broad level arithmetic coding works by taking assigning a character frequency table to a number line between 0 and 1. So, if we have the character frequency table as shown below, we would end up with our number line shown below.

| Character | Frequency | Probability |
| --------- | --------- | ----------- |
| H         | 1         | 20%         |
| E         | 1         | 20%         |
| L         | 2         | 40%         |
| O         | 1         | 20%         |

![](/assets/arithmetic1.png)
