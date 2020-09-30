---
layout: default
title: Compression Ratios
nav_order: 3
parent: Reference
---

# Compression Ratios

Compression ratios are generally used to represent how good a compression algorithm is at compressing. Generally, this is represented as the uncompressed size divided by the compressed size, yielding a number (hopefully) greater than 1. The higher the compression ratio, the better the compression algorithm is.

<p align="center">
  <img src="/assets/CompressionRatio.svg" alt="Compression Ratio Equation"/>
</p>

> Equation from [Wikipedia](https://en.wikipedia.org/wiki/Data_compression_ratio)

It should also be noted that a better compression ratio does not always indicate a better compression algorithm. Some algorithms are designed to give a moderate compression ratio with very good speed, while others are focused on good compression ratios and moderate speed. The use case of a compression algorithm are what determines what factors of a compression algorithm are favorable. For example, when streaming video you must be able to decode each frame relatively quickly, but when downloading a large game it may be preferable to download a smaller file and take time to decode the compressed files.

## Resources

Some good resources to learn more about compression algorithms include:

- [Data compression ratio on Wikipedia](https://en.wikipedia.org/wiki/Data_compression_ratio)
- [Comparison of Algorithms](https://cran.r-project.org/web/packages/brotli/vignettes/brotli-2015-09-22.pdf) (helpful to see how compression ratios are compared)
- [Comparison of Different Compression Algorithms](https://www.cs.rit.edu/~std3246/thesis/node36.html) (helpful to see how compression ratios are compared)
