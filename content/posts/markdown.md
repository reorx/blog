---
title: Markdown Example
draft: true
---

This documented is based on https://www.markdownguide.org/

## Heading level 2 with id {#custom-id}
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6

## Paragraph

**Line break**

First line with two spaces after.
And the next line.

First line with the HTML tag after.<br>
And the next line.

## Inline

Italicized text is the *cat's meow*.

This text is ***really important***.

``Use `code` in your Markdown file.``

Email: <fake@example.com>

My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").

I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).

~~Strikethrough~~ and ==highligh==

### HTML

Some of these words <ins>will be underlined</ins>.

&nbsp;&nbsp;&nbsp;&nbsp;This is the first sentence of my indented paragraph.

<center>This text is centered.</center>

<p style="text-align:center">Center this text</p>

<font color="red">This text is red!</font>

<p style="color:blue">Make this text blue.</p>

Here's a paragraph that will be visible.

[This is a comment that will be hidden.]: #

And here's another paragraph that's visible.


## Blockquote

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.
>
>> Dorothy followed her through many of the beautiful rooms in her castle.

## List

Ordered list:
1. First item
2. Second item
3. Third item
   1. Indented item 1
   2. Indented item 2
4. Fourth item

Unordered list:
* This is the first list item.

    > A blockquote would look great below the first list item.
* Here's the second list item.

    I need to add another paragraph below the second list item.
* And here's the third list item.
   - Indented item
        ```
        code block in nested item
        ```
   - Indented item

Task list:
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## Code block

    <html>
      <body>
        Indented code block
      </body>
    </html>

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

## Reference-style links AKA footnotes

In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
eat: it was a [hobbit-hole][1], and that means comfort.

[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> "Hobbit lifestyles"

## Table

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |


## Definition List

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.
