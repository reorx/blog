---
title: “Moving away from UUIDs”, Really?
date: 2022-11-23T16:20:31+08:00
draft: false
tags:
  - english
  - programming
---

Recently I saw an article called [Moving away from UUIDs – Neil Madden](https://neilmadden.blog/2018/08/30/moving-away-from-uuids/) on Hacker News. The title immediately got my attention since I use UUIDs a lot in various projects, no matter personal or commercial. Whether I'm using it right or wrong is a vital concern from an engineering perspective, so I read it thoroughly and carefully. This article is my summary and thoughts on it.

Overall, the author gives an opinion that using UUIDs for **unguessable random string like session tokens or cookies** is a bad practice, the reasons are as follows:
1. UUID is insecure in cryptography. In some situations, an attacker can take only 35 minutes to brute-force guess a valid result.
2. UUID is inefficient in storing data. Because of its hexadecimal format and the use of extra dashes, a UUID takes 36 characters to represent 16 bytes of data.

As a replacement, the author suggests to use a 20 bytes random string that is [URL-safe base64](https://en.wikipedia.org/wiki/Base64#URL_applications)-encoded. Here's an example comparing with an UUID string:

```
20 bytes base64 random: Xl3S2itovd5CDS7cKSNvml4_ODA
UUID                  : 5a097fe7-1720-457c-8363-8d660a65bab2
```

The advantages over UUIDs are:
1. A 20 bytes random value is almost impossible to guess in a reasonable time.
2. The length of the string is just 224 characters, resulting in much less storage space than UUIDs.

Generally speaking, I think although the conclusion of not using UUIDs for tokens is correct, the assumption is totally wrong. UUID (Universally unique identifier) as the name says, is an ID which should not be used for cryptographic purposes in the first place. The proper scenario for UUIDs is using it as primary keys in distributed systems, in which it prevents collisions without relying on a centralized identity generator. In contrast, random string has no way to achieve that.

I did learn something new from this article, but it failed to give me anything useful upon my understanding of how UUIDs should be used.

Do not write clickbait posts, as being neutral and accurate is a virtue for engineers.