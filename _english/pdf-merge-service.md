---
source_sha256: e251dfe8ab7fd0c25b08a7997fcdee799a8c00efb5c35d89d0c7f9a261d2fe4e
title: Building a PDF Merge Tool
date: '2018-07-12'
lang: en
translation_key: pdf-merge-service
permalink: /en/2018/07/12/pdf-merge-service/
description: I built an online PDF merger to combine course handouts for reading. The service is now offline, but input ordering, page copying and failure cleanup still illustrate useful file-processing service design.
---

I built an online PDF merger to combine course handouts for reading. The service is now offline, but input ordering, page copying and failure cleanup still illustrate useful file-processing service design.
<!--break-->

## Ordering is part of the interface

Merging needs an ordered input list, not directory enumeration or HashMap iteration order. A filename containing 10 may sort before 2 without matching user expectations. Let users confirm the order explicitly.

This Python 3 and pypdf example takes two distinct files without overwriting a source:

```python
from pathlib import Path
from pypdf import PdfWriter

def merge_pdf(inputs, output):
    sources = [Path(name).resolve() for name in inputs]
    destination = Path(output).resolve()
    if not sources:
        raise ValueError("at least one input is required")
    if destination in sources or destination.exists():
        raise ValueError("output must be a new file, separate from inputs")
    writer = PdfWriter()
    try:
        for source in sources:
            writer.append(str(source))
        with destination.open("xb") as stream:
            writer.write(stream)
    finally:
        writer.close()

merge_pdf(["1.pdf", "2.pdf"], "merged.pdf")
```

Install pypdf and prepare the directories and inputs first. Failed writes may leave incomplete output. A service should write a separate temporary file, validate it, and atomically publish the result. Clean failed artifacts through the task directory.

## Copying pages does not preserve every PDF feature automatically

A Java project can copy pages through version-compatible APIs such as PdfCopy. Close readers, writers and output streams and report success only after final writing completes. Forms, bookmarks, attachments and digital signatures need separate verification. Correct page count does not establish lossless preservation of all information.

Encrypted PDFs require legitimately obtained passwords and explicit decryption failure handling. Do not hardcode passwords or silently skip unreadable files while reporting the whole job as successful.

## An upload service needs task boundaries

Use an isolated directory and server-generated filenames per task. Bound file counts, sizes, processing time and concurrency. Preserve the client's chosen order separately from arrival order. Offer downloading only after output completes, and expire old tasks.

At minimum, verify page count, first and last pages, input order, differing page sizes and corrupt files. Users should know which input failed instead of receiving an apparently complete result with missing pages.

**References**

- [Documentation: pypdf.readthedocs.io](https://pypdf.readthedocs.io/en/stable/user/merging-pdfs.html)
