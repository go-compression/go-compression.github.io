---
title: Huffman
layout: default
parent: Overview of Algorithms
nav_order: 2
has_children: false
---

# Huffman

  

  

Since it's creation by David A. Huffman in 1952, Huffman coding has been regarded as one of the most efficient and optimal methods of compression. Huffman's optimal compression ratios are made possible through it's character counting functionality. Unlike many algorithims in the Lempel-Ziv suite, Huffman encoders scan the file and generate a frequency table and tree before begining the true compression process. Before discussing different implementations, lets dive deeper into how the algorithim works.

  

  

# The Algorithm

  

  

Although huffman encoding may seem confusing from an outside view, we can break it into three simple steps:

  

  

- Frequency Counting

- Tree Building

- Character Encoding

## Frequency Countinig

Let's start out by going over the frequency counting step. Throughout all of the examples, I will be using the following sample input string:


```
    I AM SAM. I AM SAM. SAM I AM.
    
    THAT SAM-I-AM! THAT SAM-I-AM! I DO NOT LIKE THAT SAM-I-AM!
```

The huffman encoder starts out by going over the inputed text and outputing a table correlating each character to the number of time it appears in the text. For the sample input, the table would look this:

  

|Frequency| Character|
|--|--|
| 1 |N
1 | \n
1|K
1|D
1|L
1|E
2|O
3|H
3|!
3|.
6|-
6|S
7|T
8|I
12|M
15|A|

As displayed above, the table is sorted to ensure consistency in each step of the compression process.

  

## Tree Building

Once the frequency table is created, the huffman encoder builds a huffman tree. A huffman tree follows the same structure as a normal binary tree, containing nodes and leafs. Each Huffman Leaf containst two values, the frequency it's corresponding value.

  

To build the tree, we traverse our table of frequencies and characters, and push the characters with the highest frequencies to the top of tree. Continiuing the traversal until each table value is repersented on a Huffman Leaf.

  

That might be confusing, so lets break it down step by step.

  

Huffman compression works by taking existing 8 bit characters and assigning them to a smaller number of bits. To optimize the compression, the characters with the highest frequency are given smaller bit values.

  

A Huffman Tree helps us assign and visualize the new bit value assigned to existing characters. Simmilar to a binary tree, if we start at the root node, we can traverse the tree by using 1 to move to the right and 0 to move to the left. The position of a leaf node relative the root node is used to determine it's new bit value.


