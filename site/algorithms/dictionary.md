---
title: Dictionary Coding
layout: default
parent: Overview of Algorithms
nav_order: 2
has_children: false
---

# Dictionary Coding

Dictionary coding is one of the most primitive and powerful forms of compression that exists currently. In fact, we use it everyday in English. I've actually used it already. Did you catch that?

The contraction "I've" is technically a form of dictionary coding because when we read the word we automatically expand it to "I have" in our mind. This simple concept is used everywhere from spoken languages, mathematic functions, to file encodings.

More advanced forms of dictionary coding form the basis for many different compression algorithms aside from a simple search-and-replace step such as [LZ]({% link algorithms/lz.md %}), [Huffman]({% link algorithms/huffman.md %}), and more.

## The Concept

Let's get an idea of how you could use dictionary coding to compress data.

So let's say we're working in a restaurant and we have to communicate to the chefs what food we need to be prepared on paper. Now our restaurant has three things on the menu:

- Pizza
- Fries
- Milkshakes

Rather than writing down "pizza" or "fries" everytime someone order's pizza or fries, we can assign each item a unique code.

- **1** - Pizza
- **2** - Fries
- **3** - Milkshake

Now when we're preparing order tickets for the kitchen, we can simply write 1, 2, or 3. This simple concept is used to improve upon the most advanced modern compression algorithms.

## Implementation

Implementing a dictionary coder and decoder is actually **very** simple. All we're really doing is replacing the long text with corresponding codes to encode it, and replacing codes with the text it represents to decode it.

Here's a sample:

```python
text = "Order: pizza, fries, milkshake"
encoded = text.replace("pizza", "1").replace("fries", "2").replace("milkshake", "3")
print(encoded)
# Order: 1, 2, 3
```

Decoding is the same, just in reverse:

```python
text = "Order: 1, 2, 3"
decoded = text.replace("1", "pizza").replace("2", "fries").replace("3", "milkshake")
print(decoded)
# Order: pizza, fries, milkshake
```

If we want to get a bit fancier we can even use a **dictionary** to dynamically pull codes and values from:

```python
codes = {"pizza": "1", "fries": "2", "milkshake": "3"}
text = "Order: pizza, fries, milkshake"

encoded = text

for value, code in codes.items():
    encoded = encoded.replace(value, code)

print(encoded)
# Order: 1, 2, 3
```

And to decode:

```python
codes = {"pizza": "1", "fries": "2", "milkshake": "3"}
text = "Order: 1, 2, 3"

decoded = text

for value, code in codes.items():
    decoded = decoded.replace(code, value)

print(decoded)
# Order: pizza, fries, milkshake
```

## Caveats

The key to dictionary coding is that it solves a different problem than general-purpose encoders. A dictionary coder must be built with a known list of words (or bytes) that are very common to be able to see any real difference. For example, you could build a dictionary coder with the most common English character and encode Shakespeare, which would probably give you a good [compression ratio]({% link reference/compression_ratios.md %}). But if you were to use the same dictionary to encode a PDF or HTML file you would get much worse results. You also have to make sure that both the coder and decoder have the same dictionaries, otherwise the encoded text will be useless.

## Common Usage

While dictionary coders may sound imperfect and niche, they're quite the opposite. Web compression algorithms like [Brotli](https://brotli.io/) use a dictionary with the most common words, HTML tags, JavaScript tokens, and CSS properties to encode web assets. [This dictionary](https://gist.github.com/klauspost/2900d5ba6f9b65d69c8e), while large, is insignificant compared to the savings they provide to each file they decode.

Here's some modern algorithms that employ dictionary coding:

- [Brotli](https://brotli.io/)
- [Zstandard](https://facebook.github.io/zstd/)

## Resources

If you're interested in learning more about dictionary coding, check out some of these great resources:

- [Dictionary coder on Wikipedia](https://en.wikipedia.org/wiki/Dictionary_coder)
- [University of Washington Dictionary Coding](https://courses.cs.washington.edu/courses/csep521/09au/DictionaryCoding.pdf)
