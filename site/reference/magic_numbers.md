---
layout: default
title: Unix Magic Numbers
nav_order: 3
parent: Reference
---

# Unix Magic Numbers

Unix magic types, also known as magic numbers, or format indicators are a small sequence of bytes at the beginning of a file used to identify the file type.

Here are just a few examples of file magic numbers from [Wikipedia](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Format_indicators>):

- GIFs: `GIF89a`
- Unix scripts: `#!`
- PDFs: `25 50 44 46`
- JPEGs: `FF D8`

Magic numbers are important to understand if you start writing and reading compressed files. Written compressed files should include your own custom magic number that represents your compression format and doesn't conflict with any other magic number. You can also read these magic types to determine the format of a compressed file.

These magic numbers and the corresponding file type are generally stored in a file called the magic patterns, also known as the magic database or magic data. This file is used by Unix systems to lookup the file type based off of a file's magic numbers.

For a more complete list of different magic numbers, check out the Wikipedia entry for a [list of file extensions](https://en.wikipedia.org/wiki/List_of_file_signatures).

## Resources

To learn more about magic numbers, check out these resources:

- [Linux man page for `file`](https://linux.die.net/man/1/file)
- [List of file signatures on Wikipedia](https://en.wikipedia.org/wiki/List_of_file_signatures)
- [Format indicators on Wikipedia](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Format_indicators>)
- [Working with Magic numbers in Linux](https://www.geeksforgeeks.org/working-with-magic-numbers-in-linux/)
