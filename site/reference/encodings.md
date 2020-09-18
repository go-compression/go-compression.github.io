---
layout: default
title: Character Encodings
nav_order: 2
parent: Reference
---

# Character Encodings

When it comes to encoding every character that we use as a number there are many different ways we can do it. For example, how many bytes should a character represent? Should byte length be dynamic based on the character? Should you prioritize shorter encodings for more frequent characters?

These are the types of questions that are answered with the many different [character encodings](https://en.wikipedia.org/wiki/Character_encoding) that exist today. The most popular of these are arguably UTF-8 and UTF-16, both encodings for Unicode.

## UTF-8 and UTF-16

UTF-8 is covered briefly in the the reference on [bytes and binary]({% link reference/bytes.md %}), but generally the first 127 numbers in UTF-8 are the same as the ASCII encoding which makes transitioning between the two formats very easy. Additionally because of this property, UTF-8 results in smaller file sizes for primarily English data which is another contributing factor in it's popularity.

In order for UTF-8 to replicate ASCII encodings, it must use anywhere from one to four bytes to represent all 1,112,064 different characters defined by Unicode. This means that a single rendered character could take up 4 bytes which can be inefficient depending on what data you are encoding.

The largest alternative encoding is UTF-16 which is very similar to UTF-8 except that it uses one or two 16-bit units, essentially two bytes or four bytes, never one or three. The advantage of doing this is that in some cases where a large range of non-English characters are being encoded, such as Mandarin or emoji characters, it can be more efficient than UTF-8 encodings.

## Other Encodings

Aside from UTF-8 and UTF-16 many different types of file encodings exist such as UTF-32, ISO standardized encodings, Mac OS Roman, Windows encodings, and more. Luckily however, Unicode has risen in popularity to the point that there is generally great support and standardization around Unicode encodings like UTF-8 and UTF-16. If you are interested in checking out some other file encodings, you should check out Wikipedia's list on [common character encodings](https://en.wikipedia.org/wiki/Character_encoding).

## Resources

If you're interested in learning more about Unicode and other character encodings, check out some of these great resources:

- [Character encoding on Wikipedia](https://en.wikipedia.org/wiki/Character_encoding)
- [Unicode on Wikipedia](https://en.wikipedia.org/wiki/Unicode)
- [Difference between UTF-8, UTF-16 and UTF-32 Character Encoding](https://javarevisited.blogspot.com/2015/02/difference-between-utf-8-utf-16-and-utf.html)
- [Comparison of Unicode encodings on Wikipedia](https://en.wikipedia.org/wiki/Comparison_of_Unicode_encodings)
- [UTF-8, UTF-16, and UTF-32 on StackOverflow](https://stackoverflow.com/questions/496321/utf-8-utf-16-and-utf-32)
