---
source_sha256: abf9b4e26af7bacbae80a2fec43bb5f896d5883ba6b75123fb2ee190f4e03dd6
title: Laying Out Images and Text in a PDF with iText
date: '2009-10-14'
lang: en
translation_key: itext-image-text-layout
permalink: /en/2009/10/14/itext-image-text-layout/
description: For a PDF containing photos and text, an outer table can arrange cards while each card contains its image and caption. Defining paper size, columns, fonts and scaling beforehand produces a more controlled layout than appending images indivi
---

For a PDF containing photos and text, an outer table can arrange cards while each card contains its image and caption. Defining paper size, columns, fonts and scaling beforehand produces a more controlled layout than appending images individually.
<!--break-->

## Combine an outer grid with inner cards

Early iText com.lowagie APIs support nested PdfPTable instances. This layout fragment assumes an existing Document, usable font and imagePaths list:

```java
int columns = 4;
PdfPTable grid = new PdfPTable(columns);
grid.setWidthPercentage(100);
for (String path : imagePaths) {
    PdfPTable card = new PdfPTable(1);
    Image image = Image.getInstance(path);
    image.scaleToFit(100, 100);
    card.addCell(image);
    card.addCell(new Paragraph("Photo caption", font));
    grid.addCell(card);
}
int padding = (columns - imagePaths.size() % columns) % columns;
for (int i = 0; i < padding; i++) {
    grid.addCell(" ");
}
document.add(grid);
```

The padding count uses modulo twice to avoid adding a whole blank row when the image count is already divisible by the column count. Cards can include names or locations too; verify wrapping and pagination for long text.

## Handle Chinese fonts and images explicitly

Choose an available font licensed for the intended use, embedding it when needed so Chinese remains visible on other machines. Do not hardcode one Windows system font directory. Missing glyphs and a font not being embedded are different issues.

Preserve aspect ratio when scaling images. Oversized originals increase PDF size and memory use. A small display size does not imply the embedded image data has been reduced.

## Check resources and final output

Close Document, PdfWriter and output streams according to the selected library version. On failure, do not close an object that was never initialized. The file is complete only after final output is closed.

com.lowagie, com.itextpdf and later iText APIs cannot be mixed indiscriminately. Use examples matching the dependency version. Test zero, one, four and five images, long text and missing Chinese glyphs. Check for a lost final row and unexpected blank pages.

A related application is [Building a PDF Merge Tool](/en/2018/07/12/pdf-merge-service/).
