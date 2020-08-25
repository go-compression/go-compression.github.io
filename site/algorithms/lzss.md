---
title: LZSS
parent: Lempel-Ziv
grand_parent: Overview of Algorithms
nav_order: 1
---

# Lempel-Ziv-Storer-Szymanski

Lempel-Ziv-Storer-Szymanski, which we'll refer to as LZSS, is a simple variation of the common [LZ77]({% link algorithms/lz.md %}) algorithm. It uses the same token concept with an offset and length to tell the decoder where to copy the text, except it only places the token when the token is shorter than the text it is replacing.

The idea behind this is that it will never increase the size of a file by adding tokens everywhere for repeated letters. You can imagine that LZ77 would easily increase the file size if it simply encoded every repeated letter "e" or "i" as a token, which may take at least 5 bytes depending on the file and implementation.

## Example

Let's take a look at some examples, so we can _see_ exactly how it works. The [wikipedia article for LZSS](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Storer%E2%80%93Szymanski) has a great example for this, which I'll use here, and it's worth a read as an introduction to LZSS.

So let's encode an exceprt of Dr. Seuss's Green Eggs and Ham with LZSS (credit to Wikipedia for this example).

```
I AM SAM. I AM SAM. SAM I AM.

THAT SAM-I-AM! THAT SAM-I-AM! I DO NOT LIKE THAT SAM-I-AM!

DO WOULD YOU LIKE GREEN EGGS AND HAM?

I DO NOT LIKE THEM,SAM-I-AM.
I DO NOT LIKE GREEN EGGS AND HAM.
```

This text takes up 192 bytes in a typical UTF-8 encoding. Let's take a look at the LZSS encoded version.

```
I AM SAM. <10,10>SAM I AM.

THAT SAM-I-AM! T<15,14>I DO NOT LIKE<29,15>

DO WOULD YOU LIKE GREEN EGGS AND HAM?

I<69,15>EM,<113,8>.<29,15>GR<64,16>.
```

This encoded, or compressed, version only takes 148 bytes to store (without a [magic type](https://linux.die.net/man/5/magic) to describe the file type), which is a 77% of the original file size, or a compression ratio of 1.3. Not bad!

### Analysis

Now let's take a second understand what's happening before you start trying to conquer the world with LZSS.

As we can see, the "tokens" are reducing the size of the file by referencing pieces of text that are longer than the actual token. Let's look at the first line:

```
I AM SAM. <10,10>SAM I AM.
```

The encoder works character by character. On the first character, 'I', it checks it's search buffer to see if it's already seen an 'I'. The search buffer is essentially the encoder's memory, for every character it encodes, it adds it into the search buffer so it can "remember" it. Because it hasn't seen an 'I' already (the search buffer is empty), it just outputs an 'I', adds it to the search buffer, and moves to the next character. The next character is ' ' (a space). The encoder checks the search buffer to see if it's seen a space before, and it hasn't so it outputs the space and moves forward.

Once it gets to the second space (after "I AM"), the LZ77 starts to come into play. It's already seen a space before because it's in the search buffer so it's ready to output a token, but first it tries to maximize how much text the token is referencing. If it didn't do this you could imagine that for every character it's already seen it would output something similar to `<5,1>`, which is 5 times larger than any character. So once it finds a character that it's already seen, it moves on to the next character and checks if it's already seen the next character directly after the previous chracter. Once it finds a sequence of characters that it hasn't already seen, then it goes back one character to the sequence of characters it's already seen and prepares the token.

Once the token is ready, the difference between LZ77 and LZSS starts to shine. At this point LZ77 simply outputs the token, adds the characters to the search buffer and continues. LZSS does something a little smarter, it will check to see if the size of the outputted token is larger than the text it's representing. If so, it will output the text it represents, not the token, add the text to the search buffer, and continue. If not, it will output the token, add the text it represents to the search buffer and continue.

![](/assets/LZ1.png)

Coming back to our example, the space character has already been seen, but a space followed by an "S" hasn't been seen yet (" S"), so we prepare the token representing the space. The token in our case would be "<3,1>", which means go back three characters and copy 1 character(s). Next we check to see if our token is longer than our text, and "<3,1>" is indeed longer than " ", so it wouldn't make sense to output the token, so we output the space, add it to our search buffer, and continue.

This entire process continues until we get to the "I AM SAM. ". At this point we've already seen an "I AM SAM. " but haven't seen an "I AM SAM. S" so we know our token will represent "I AM SAM. ". Then we check to see if "I AM SAM. " is longer than "<10,10>", which it is, so we output the token, add the text to our search buffer and go along.

![](/assets/LZ2.png)

This process continues, encoding tokens and adding text to the search buffer character by character until it's finished encoding everything.

### Takeaways

There's a lot of information to unpack here, but the algorithm at a high level is quite simple:

- Loop character by character
- Check if it's seen the character before
  - If so, check the next character and prepare a token to be outputted
    - If the token is longer than the text it's representing, don't output a token
    - Add the text to the search buffer and continue
  - If not, add the character to the search buffer and continue

It's important to remember that no matter the outcome, token or no token, the text is always appended to the search buffer so it can always "remember" the text it's already seen.

## Implementation

Now let's take a stab at building our very own version so we can understand it more deeply.

As with most of these algorithms, we have an implementation written in Go in our [raisin project](https://github.com/go-compression/raisin). If you're interested in what a more performant or real-world example of these algorithms looks like, be sure to check it out. However for this guide we'll use Python to make it more approachable so we can focus on understanding the algorithm and not the nuances of the language.

### Character Loop

Let's get started with a simple loop that goes over each character for encoding. As we can see from our [takeaways](#takeaways), the character-by-character loop is what powers LZSS.

```python
text = "HELLO"
encoding = "utf-8"

text_bytes = text.encode(encoding)

for char in text_bytes:
    print(bytes([char]).decode(encoding)) # Print the character
```

Output:

```
H
E
L
L
O
```

Although the code is functionally pretty simple, there's a few important things going on here. You can see that looping character-by-character isn't as simple as `for char in text`, first we have to encode it and then loop over the encoding. This is because it converts our string into an array of [bytes]({% link reference.md %}), represented as a Python object called `bytes`. When we print the character out, we have to convert it from a byte (represented as a Python `int`) back to a string so we can see it.

The reason we do this is because a byte is really just a number from 0-255 as it is represented in your computer as 8 1's and 0's, called [binary](https://en.wikipedia.org/wiki/Binary_code). If you don't already have a basic understanding of how computers store our language, you should get acquainted with it on our [getting started]({% link getting_started.md %}) page.

### Search Buffers

Great, we have a basic program working which can loop over our text and print it out, but that's pretty far off from compression so let's keep going. The next step to our program is to implement our "memory" so the program can check to see if its already seen a character.

```python
text = "HELLO"
encoding = "utf-8"

text_bytes = text.encode(encoding)

search_buffer = [] # Array of integers, representing bytes

for char in text_bytes:
	print(bytes([char]).decode(encoding)) # Print the character
    search_buffer.append(char) # Add the character to our search buffer
```

We no longer need to output anything as we're just adding each character to the search buffer with the `append` method.

### Checking Our Search buffer

Now let's try to implement the LZ part of LZSS, we need to start looking **backwards** for characters we've already seen. This can accomplished quite easily using the `list.index` method.

```python
for char in text_bytes:
    if char in search_buffer:
        print(f"Found at {search_buffer.index(char)}")

    print(bytes([char]).decode(encoding)) # Print the character
    search_buffer.append(char) # Add the character to our search buffer
```

Output:

```
H
E
L
Found at 2
L
O
```

Notice the `if char in search_buffer`, without this Python will throw an `IndexError` if the value is not in the list.

### Building Tokens

Now let's build a token and output it when we find the character.

```python
i = 0
for char in text_bytes:
    if char in search_buffer:
        index = search_buffer.index(char) # The index where the character appears in our search buffer
        offset = i - index # Calculate the relative offset
        length = 1 # Set the length of the token (how many character it represents)

        print(f"<{offset},{length}>") # Build and print our token
    else:
        print(bytes([char]).decode(encoding)) # Print the character

    search_buffer.append(char) # Add the character to our search buffer

    i += 1
```

Output:

```
H
E
L
<1,1>
O
```

We're nearly there! This is actually a rough implementation of LZ77, however there's one issue. If we have a word that repeats twice, it will copy each character instead of the **entire word**.

```
text = "SAM SAM"
```

Output

```
S
A
M

<4,1>
<4,1>
<4,1>
```

> Note: `<4,1>` is technically correct as each character is represented 4 characters behind the beginning of the token.

That's not exactly right, we should see `<4,3>` instead of three `<4,1>` tokens. So let's write some code that can check our search buffer for more than one character.

### Checking the Search Buffer for More Characters

Let's modify our code to check the search buffer for more than one character.

```python
def elements_in_array(check_elements, elements):
    i = 0
    offset = 0
    for element in elements:
        if len(check_elements) <= offset:
            # All of the elements in check_elements are in elements
            return i - len(check_elements)

        if check_elements[offset] == element:
            offset += 1
        else:
            offset = 0

        i += 1
    return -1

check_characters = [] # Array of integers, representing bytes

i = 0
for char in text_bytes:
    check_characters.append(char)
    index = elements_in_array(check_characters, search_buffer) # The index where the characters appears in our search buffer

    if index == -1 or i == len(text_bytes) - 1:
        if len(check_characters) > 1:
            index = elements_in_array(check_characters[:-1], search_buffer)
            offset = i - index - len(check_characters) + 1 # Calculate the relative offset
            length = len(check_characters) # Set the length of the token (how many character it represents)

            print(f"<{offset},{length}>") # Build and print our token
        else:
            print(bytes([char]).decode(encoding)) # Print the character

        check_characters = []

    search_buffer.append(char) # Add the character to our search buffer

    i += 1
```

There's quite a lot to unpack here so let's go through it line by line.
