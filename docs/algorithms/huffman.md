
# Huffman

  

Since it's creation by David A. Huffman in 1952, Huffman coding has been regarded as one of the most efficient and optimal methods of compression. Huffman's optimal compression ratios are made possible through it's character counting functionality. Unlike many algorithims in the Lempel-Ziv suite, Huffman encoders scan the file and generate a frequency table and tree before begining the true compression process. Before discussing different implementations, lets dive deeper into how the algorithim works.

  

# The Algorithm

  

Although huffman encoding may seem confusing from an outside view, we can break it into three simple steps:

  

 - Frequency Counting
 - Tree Building
 - Character Encoding
## Frequency Countinig
Let's start out by going over the frequency counting step. Throughout all of the examples, I will be using the following sample input string:

    I AM SAM. I AM SAM. SAM I AM.
    THAT SAM-I-AM! THAT SAM-I-AM! I DO NOT LIKE THAT SAM-I-AM!

  The huffman encoder starts out by going over the inputed text and outputing a table correlating each character to the number of time it appears in the text. For the sample input, the table would look this:

|Frequency| Character|
|--|--|
| 1 |N|  
1 |	\n|
1|K|
1|D|
1|L|
1|E|
2|O|
3|H|
3|!|
3|.|
6|-|
6|S|
7|T|
8|I|
12|M
15|A|

As displayed above, the table is sorted to ensure consistency in each step of the compression process. 


 


