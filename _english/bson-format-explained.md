---
source_sha256: 67c5d1288286f92b5896b26c81b9b01b46b9c923f8ab1cee9ca87622526696f4
title: Understanding BSON Through Its Bytes
date: '2014-07-29'
lang: en
translation_key: bson-format-explained
permalink: /en/2014/07/29/bson-format-explained/
description: BSON is a binary document format with type information. The clearest introduction is a small document whose lengths, field names and values can be matched byte by byte. It should not be treated as compressed JSON text.
---

BSON is a binary document format with type information. The clearest introduction is a small document whose lengths, field names and values can be matched byte by byte. It should not be treated as compressed JSON text.
<!--break-->

## Start with an integer

This document stores a as a BSON int32:

```json
{"a": 1}
```

Its BSON bytes can be written as:

```text
0c 00 00 00  10  61 00  01 00 00 00  00
```

| Bytes | Meaning |
|---|---|
| `0c 00 00 00` | Total document length: 12 bytes, including the length field and final zero |
| `10` | int32 element type, hexadecimal 0x10 |
| `61 00` | UTF-8 field name a as a zero-terminated cstring |
| `01 00 00 00` | Integer 1, in little-endian order |
| `00` | End of document |

The total is 4 + 1 + 2 + 4 + 1 = 12 bytes. Changing the type to int64 changes both the type marker and value length even if the value remains one.

## String lengths count bytes

For `{"name":"张三"}`, the BSON string value consists of an int32 length, UTF-8 content and a final zero. Each Chinese character occupies three UTF-8 bytes, so the string length field is seven, including its terminator.

The complete document is 4 + 1 + 5 + 4 + 7 + 1 = 22 bytes. The name field's five bytes already include its own zero terminator.

## Documents, strings and binary values are distinct

Storing `{"id":1}` as a string does not turn it into an embedded document. Encode it as a BSON document to retain its field structure. Raw bytes use the binary type, which also carries a length and subtype.

A type byte of 0x05 therefore requires interpreting the following value as binary first. Bytes resembling text do not make it a BSON string. The actual encoder determines the character encoding; the abstract notion of a Java string does not establish it.

BSON retains field names, types and lengths, and is not guaranteed smaller than corresponding JSON text. Its value is explicit types and a parseable structure. A parser must validate length boundaries, terminators and unsupported types instead of trusting declared input lengths.

**References**

- [BSON specification](https://bsonspec.org/spec.html)
