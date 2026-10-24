---
source_sha256: 89c46c3a4d01dcf0919aa7e41e9ff38c148d6cf045ae2719bf918f7a7fc79272
title: A First Data Transformation with Kettle Spoon
date: '2015-08-01'
lang: en
translation_key: kettle-spoon-basics
permalink: /en/2015/08/01/kettle-spoon-basics/
description: Spoon is the graphical transformation and job designer in Pentaho Data Integration. A small CSV-to-fields-to-XML flow illustrates how records pass between steps and where cleaning failures should go.
---

Spoon is the graphical transformation and job designer in Pentaho Data Integration. A small CSV-to-fields-to-XML flow illustrates how records pass between steps and where cleaning failures should go.
<!--break-->

## Define example input and output

Using the PDI 5.3 transformation model, start with this CSV:

```csv
name
Alice
Bob
```

The target XML contains two records with greetings hello:Alice and hello:Bob. Establish encoding, headers, delimiter and quoting before configuring steps, so a successful preview does not disguise reading an entire line as one field.

## Connect three transformation steps

| Step | Configuration focus |
|---|---|
| CSV input | File path, UTF-8, headers and the name field type |
| Field processing | A string concatenation step or a script creating greeting |
| XML output | Root and record elements, output fields and encoding |

Connect the main outputs and inspect values and types at each preview. Adding a name prefix does not necessarily require JavaScript. Built-in steps are often easier for maintainers to understand.

## Give invalid records an explicit destination

Test empty names, duplicates, quoted commas and undecodable data. Filter, mark or route failures according to business requirements instead of silently skipping them. Let the XML writer escape special characters; hand-concatenated strings are not a substitute.

## Make the flow repeatable beyond preview

A transformation describes data flow. A job can arrange multiple transformations and failure branches. These concepts differ. Save the transformation and centralize paths, environment parameters and output naming instead of embedding a developer machine's absolute paths in every step.

Define overwrite versus append behavior for repeated runs. Compare input, success, failure and output counts, then parse the generated XML again. File existence alone does not prove every row was processed correctly.

**References**

- [Pentaho Data Integration documentation](https://docs.pentaho.com/)
