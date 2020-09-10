---
layout: default
title: Bytes and Binary
nav_order: 1
parent: Reference
---

# Bytes and Binary

When it comes to working with computers, one thing becomes very apparenent: there's a lot of data. Now naturally, when you have a lot of data you have to figure out how you want to **store** the data. Just like how leftover Christmas decorations are stored in bins inside of garages, data is stored inside of bytes inside of a file. So what is a byte?

Bytes are a term used to represent 8 bits, simply a `1` or a `0`. So, a byte might look something like this: `00111010`.

## Binary

These ones and zeroes are used in something called binary. Now, in most of the world you count with a base-10 decimal number system. One is `1`, two is `2`, all the way up to 10 being `10`, and so forth. The number system is based around `10` being the base.

| Base | Power | Decimal |
| :--: | :---: | :-----: |
|  10  |   0   |    1    |
|  10  |   1   |   10    |
|  10  |   2   |   100   |
|  10  |   3   |  1,000  |

Now binary works the same way, except the base is actually 2, not 10.

| Base | Power | Decimal | Binary |
| :--: | :---: | :-----: | :----: |
|  2   |   0   |    1    |  0001  |
|  2   |   1   |    2    |  0010  |
|  2   |   2   |    4    |  0100  |
|  2   |   3   |    8    |  1000  |

With this simple example, you start to see a simple pattern emerge. The right-most bit (the 1 or 0) represents 2^0, left of that is 2^1, left of that is 2^2, etc. Using this simple system we can represent any number using 1s and 0s, which is precisely what a computer uses to store numbers.

Let's take a look at a few more examples because unless you have a PhD in mathematics or computer science, the entire "different number base" thing might be still be a bit confusing.

So let's take the binary number `0110010`, and convert it to decimal so our human minds can understand what it means. Now remember, the right most bit (also known as the [least significant bit](https://en.wikipedia.org/wiki/Bit_numbering#Least_significant_bit)) represents 2^0, which is 1. This means that if the right most bit is a `1`, then we add `1` to the result, otherwise we add `0`. The next bit to the left represents 2^1, which is 2, so if it's a `1`, then we add a `2`, otherwise we add a `0`. Hopefully the pattern is starting to become clear:

|  Binary |  0  |  1  |  1  |  0  |  0  |  1  |  0  |
| ------: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Decimal | 64  | 32  | 16  |  8  |  4  |  2  |  1  |

Then we can add our decimal numbers together:

| 0\*64 | 1\*32 | 1\*16 | 0\*8 | 0\*4 | 1\*2 | 0\*1 |
| :---: | :---: | :---: | :--: | :--: | :--: | :--: |
|  0 +  | 32 +  | 16 +  | 0 +  | 0 +  | 2 +  |  0   | = 50 |

And we get `50`!

If it's still a bit cloudy or you would just like some more practice, make sure to search online for information about "binary numbers", or check out some of these great resources:

- [Wikipedia](https://en.wikipedia.org/wiki/Binary_number)
- [RapidTables Binary Calculator](https://www.rapidtables.com/convert/number/decimal-to-binary.html)
- [Visual 8-bit Binary to Decimal Converter](https://www.openprocessing.org/sketch/160659/)

So now that you understand binary, where do they fit within bytes and how do they store text?

## Bytes

Bytes are the answer to storing text, and basically everything, on a computer. A byte is essentially a chunk of bits (1s and 0s), generally 8. Bytes are used nearly everywhere in a computer, they're used to store variables in memory, to transfer data over wires or the internet, and most importantly to compression, to store data in files.

Every character in English is stored as a **byte** in a file. And as we know a byte is 8 bits. So, from our knowledge we know that the largest number an 8 bit binary number can store is 2^8, or 256. This means that a single byte can store exactly 256 different numbers, or in our case, 256 unique characters.

In 1960 computers are still brand new and largely used by English speaking countries, so there was a need for a system to represent English characters, without worrying about any other language. The answer to this is [ASCII](https://en.wikipedia.org/wiki/ASCII). While there's a massive amount of history behind ASCII and all of the other computer history being created at the time, the basis is simple. The English alphabet, and generally every other special character English uses can be assigned a number from 0-255 (remember the largest 8 bit number is `11111111`, which is only 255 in decimal, but `00000000` represents 0, so there are 256 possibilities).

Let's take a look at the ASCII codes for capital A-F on the alphabet:

| Letter | ASCII Code | Binary Code |
| :----: | :--------: | :---------: |
|   A    |     65     |  01000001   |
|   B    |     66     |  01000010   |
|   C    |     67     |  01000011   |
|   D    |     68     |  01000100   |
|   E    |     69     |  01000101   |
|   F    |     70     |  01000110   |

For a complete table, check out the [RapidTables ASCII Table](https://www.rapidtables.com/code/text/ascii-table.html).

These binary representations of each character would then be stored in a file. Later when you wanted to read the file again, your computer would take each chunk of 8 bits, lookup the letter it represents in an ASCII table, and output the represented character before moving on. This system worked perfectly for a while until more people started using computers.

Now as it turns out, there are a lot of people who want to use computers who don't speak English and need to represent characters that we don't have in English (Arabic, Spanish, French, Chinese, etc.). The solution to this is using a different type of encoding rather than ASCII, referred to as [file encodings]({% link reference/encodings.md %}).

However, the most common encoding, `UTF-8`, simply extends ASCII to add extra characters because ASCII does not use all 256 numbers, it only uses around 127. So, in a modern day file, the word "Hello" would be representes as follows:

```text
Text: Hello
UTF-8 Decimal: 72 101 108 108 111
UTF-8 Binary: 01001000 01100101 01101100 01101100 01101111
```

To try this out on your own, check out [Online Utf8 Tools](https://onlineutf8tools.com/convert-utf8-to-binary).

## Kilobytes, Megabytes, and Beyond

Stub.

## Resources

If you want to learn more about bytes and binary in general, check out some of these great resources:

- [Binary on Wikipedia](https://en.wikipedia.org/wiki/Binary_number)
- [Byte on Wikipedia](https://en.wikipedia.org/wiki/Byte)
- [Bit on Wikipedia](https://en.wikipedia.org/wiki/Bit)
- [Khan Academy Binary Course](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/a/bits-and-binary)
- [Byte Size Infographic](https://www.redcentricplc.com/resources/byte-size-infographic/)
