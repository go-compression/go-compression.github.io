---
title: Huffman
layout: default
parent: Overview of Algorithms
nav_order: 3
has_children: false
---

# Huffman

Since it's creation by David A. Huffman in 1952, Huffman coding has been regarded as one of the most efficient and optimal methods of compression. Huffman's optimal compression ratios are made possible through it's character counting functionality. Unlike many algorithms in the Lempel-Ziv suite, Huffman encoders scan the file and generate a frequency table and tree before begining the true compression process. Before discussing different implementations, lets dive deeper into how the algorithm works.

# The Algorithm

Although huffman encoding may seem confusing from an outside view, we can break it into three simple steps:

- [Frequency Counting](#Frequency-Counting)

- [Tree Building](#Tree-Building)

- [Character Encoding](#Character-Encoding)

## Frequency Counting

Let's start out by going over the frequency counting step. Throughout all of the examples, I will be using the following sample input string:

```
I AM SAM. I AM SAM. SAM I AM.
THAT SAM-I-AM! THAT SAM-I-AM! I DO NOT LIKE THAT SAM-I-AM!
```

The huffman encoder starts out by going over the inputted text and outputing a table correlating each character to the number of time it appears in the text. For the sample input, the table would look this:

| Frequency | Character |
| --------- | --------- |
| 1         | N         |
| 1         | \n        |
| 1         | K         |
| 1         | D         |
| 1         | L         |
| 1         | E         |
| 2         | O         |
| 3         | H         |
| 3         | !         |
| 3         | .         |
| 6         | -         |
| 6         | S         |
| 7         | T         |
| 8         | I         |
| 12        | M         |
| 15        | A         |
| 17        |           |

As displayed above, the table is sorted to ensure consistency in each step of the compression process.

## Tree Building

Once the frequency table is created, the huffman encoder builds a huffman tree. A huffman tree follows the same structure as a normal binary tree, containing nodes and leafs. Each Huffman Leaf contains two values, the frequency it's corresponding value.

To build the tree, we traverse our table of frequencies and characters, and push the characters with the highest frequencies to the top of tree. Continuing the traversal until each table value is represented on a Huffman Leaf.

That might be confusing, so lets break it down step by step.

Huffman compression works by taking existing 8 bit characters and assigning them to a smaller number of bits. To optimize the compression, the characters with the highest frequency are given smaller bit values.

A Huffman Tree helps us assign and visualize the new bit value assigned to existing characters. Similar to a binary tree, if we start at the root node, we can traverse the tree by using 1 to move to the right and 0 to move to the left. The position of a leaf node relative the root node is used to determine it's new bit value.

A huffman tree for our example is depicted below:
![Sample Huffman Tree](https://i.ibb.co/jyPPwnw/Screen-Shot-2020-08-31-at-10-34-00-AM.png)

As shown in the image, Huffman trees can get very large and complicated very easily. To see a sample tree for any text go to url.

To understand more about the programatic implementation of tree building, click here.

## Character Encoding

Character encoding is the final step for most huffman encoders. Once a tree and frequency table has built, the final step is to encode the characters from the initial file and write the encoded bytes to a new file.

This can be done in two ways.

- [Tree Traversal](#Tree-Traversal)
- [Array Indexing](#Array-Indexing)

### Tree Traversal

Tree traversal is the first way of encoding the input of a huffman encoder. For each character, the tree is traversed recursively until a leaf with a matching character is found.

This method can easily get complicated and very inefficient as the tree has to be traversed multiple times.

For a simpler and quicker solution, we can use [Array Indexing](#Array-Indexing)

### Array Indexing

When compared to the previous tree traversal method, array indexing is much less complicated and significantly faster.

Before encoding the characters, the tree is traversed once and the values for each leaf are outputted in two corresponding arrays. The first array contains the value of each character, while the second contains its updated bit value.

Once created, the arrays are traversed and each character in the input is replaced with its updated bit value.

Once a new output text is generated, it is encoded as a byte array and written to the output file.
