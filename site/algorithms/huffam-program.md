---
title: Tree Building Implementation
layout: default
parent: Huffman
grand_parent: Overview of Algorithms
nav_order: 1
---

# How To Build a Tree (Programmatically)

## General Implementation
Push an array of huffman leaf objects containing each character and its associated frequency into a priority queue. To start building the tree, pop two leafs from the queue and assign them as the left and right leafs for a node. 

Using this new node, push the node into the priority qeuue. 

Continue this process untile the size of the queue is 1. 
