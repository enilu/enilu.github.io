---
source_sha256: 54bb05ac147f6ad4791849e9f4c151f8e60b90c1b4f5d79613b1f2010500faf3
layout: english-post
lang: en
translation_key: small-open-models-for-local-deployment
title: "Which Small Open Models Can You Run on a Laptop or an Ordinary Server?"
date: 2026-10-31
permalink: /en/2026/10/31/small-open-models-for-local-deployment/
category: Learning Notes
keywords: "local AI,open models,Xiaomi-OCR-0,Qwen,OCR,self-hosting"
description: "A guide to local chat, OCR, speech and retrieval models, explaining their differences, applications and deployment constraints ahead of individual installation and hands-on articles."
tags: [AI,LLM,Open Source,Self-hosting]
---

I recently came across Xiaomi-OCR-0, an open model from Xiaomi with just 0.8B parameters that handles document parsing, text recognition and document question answering. It prompted me to put together a shortlist: what small models are worth considering if you want to run AI on a laptop, desktop or ordinary server?

Beyond chat, there are small models for recognizing scans, transcribing recordings and searching documents. Some have fewer than a billion parameters and can support a local tool built around one specific function. The candidates below are grouped by purpose, with links to official sources.
<!--break-->

This article draws on official information available as of **October 31, 2026**. It covers downloading weights and running inference on your own machine; the models have not been individually tested here. This first article explains their purposes and differences. Later articles will cover individual installations, actual configurations, speed, results and problems encountered.

## General assistants: start with a small chat model

For local chat, summaries, information extraction or questions about images, these are useful candidates.

| Model | Main uses | Deployment considerations |
| --- | --- | --- |
| [Qwen3.5-4B](https://huggingface.co/Qwen/Qwen3.5-4B) | Chinese chat, summaries, information extraction, image understanding and lightweight coding | The official model card links to quantized versions; choose according to available memory |
| [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B) | Similar general tasks | More parameters mean larger weights at the same precision |
| [Ministral 3 3B Instruct](https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512) | Multilingual chat, image understanding, extraction and tool calling | The official card says the FP8 version fits in 8GB of VRAM; further quantization can reduce its footprint |
| [Gemma 4 E2B / E4B](https://ai.google.dev/gemma/docs/core) | Chat, reasoning, image understanding and audio input | Designed for edge devices; another family to consider for laptops |

### Qwen3.5-4B: text and images in one model

Qwen3.5-4B is a general model with a vision encoder. Alongside text chat, it accepts screenshots or document images for explanation, field extraction and questions. For someone adding an assistant to an existing tool, this offers a way to connect both text and image tasks to one model. [Official model card](https://huggingface.co/Qwen/Qwen3.5-4B)

For example, an error screenshot could be paired with “What does the error say, and what should be checked next?” A release log could instead be used to summarize affected functionality. These are possible test cases, not claims that the small model reliably completes every step.

One setting also affects the experience: the official examples enable thinking mode by default and provide a direct-response option. For simple classification or summaries, comparing latency and output in both modes is useful. Tokens per second alone can miss the wait before an answer begins to appear.

### Qwen3.5-9B: is the larger model worth it?

Both 9B and 4B support text and images, making them candidates for the same set of tasks. The official card compares their benchmark results. For personal deployment, the practical question is whether the larger model reduces errors in your work enough to justify extra memory and waiting time. [Official model card](https://huggingface.co/Qwen/Qwen3.5-9B)

For extraction, check valid JSON and whether missing fields are invented. For summaries, check that numbers and conditions survive. For image tasks, look for omitted small print. Keep prompts, quantization precision and thinking mode consistent so that model size is not confused with runtime settings.

Both list a context length of 262,144 tokens. This is a supported length, not free capacity on a laptop. Processing time and memory also matter as input grows. Loading an entire book simply because a model supports long context is not a useful first test.

### Ministral 3 3B: structured output and tool integration

Ministral 3 3B contains a language model of about 3.4B parameters and a 0.4B vision encoder. The entry here is the instruction-trained Instruct FP8 release; the family also has Base and Reasoning versions, so check the complete name before downloading. The official reference says this FP8 release fits in 8GB of VRAM. [Model details](https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512)

JSON output and function calling make it a candidate for small application tasks, such as extracting dates and actions from emails or preparing query-tool arguments from a question. A tool call is a request generated by the model; the application still executes the operation.

For later testing, argument correctness, behavior when information is missing, and consistently parseable results matter more than how human the response sounds. These determine whether it can become part of an everyday tool.

### Gemma 4 E2B / E4B: on-device design, with a naming caveat

Gemma 4 E2B and E4B target edge deployments and support text, images and native audio input. This opens up screenshot questions and audio understanding, though support in the model does not establish that a chosen desktop client exposes each input type. [Official overview](https://ai.google.dev/gemma/docs/core)

The E refers to effective parameters. These versions use Per-Layer Embeddings (PLE), whose embedding tables also occupy storage. Do not calculate file size on the assumption that E2B has only 2B total parameters. Match the actual quantized files, and do not interchange desktop and mobile-optimized memory figures.

A later comparison with Qwen can examine Chinese answers alongside loading and runtime changes when vision or audio is enabled. Practical multimodal use depends on the model, runtime and input interface working together.

## Coding assistants: 30B MoE as an advanced option

For editing code, generating programs or connecting a model to a coding agent, consider [Qwen3-Coder-30B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct).

This mixture-of-experts (MoE) model has about 30.5B total parameters, with about 3.3B activated per computation. That reduces the parameters involved in each computation, but does not mean deployment only needs to accommodate an ordinary 3B model. The other experts' weights still need somewhere to reside.

This is an advanced option in the shortlist, with substantially higher resource requirements than the lightweight models above. A rough calculation based on its total parameters gives about 15.25GB for weights stored entirely at 4 bits; actual quantized files and runtime memory will be larger. Check the specific package and runtime settings rather than estimating from “A3B” alone.

Its focus goes beyond producing code in chat: the official material describes integration with coding agents and tool calls. A workflow might read files, generate edits, run checks and respond to errors. The model handles reasoning and generation within that workflow; external software provides tools, context management and tests. [Model and integration details](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct)

A useful later test would start with a bounded change to existing code, recording correctness, unrelated edits and test results. Generating a sorting algorithm alone says little about working in an existing project.

## OCR: practical functions with fewer than a billion parameters

For turning scans into text or extracting tables from PDF pages, the following three models are more directly relevant. All have fewer than a billion parameters.

| Model | Size | Main uses |
| --- | --- | --- |
| [Xiaomi-OCR-0](https://github.com/xiaomi-research/Xiaomi-OCR-0) | 0.8B | Document parsing, OCR, key information extraction and document question answering |
| [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6) | About 0.9B | Parsing text, tables, formulas, charts, seals and other document elements |
| [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR) | 0.9B | Recognizing text, tables and formulas in complex documents |

### Xiaomi-OCR-0: from page content to structured results

Xiaomi-OCR-0 starts from Qwen3.5-0.8B and is specialized for document parsing, key information extraction and document questions. Its official workflow does more than produce lines of text: it can organize pages into Markdown, handle tables and LaTeX formulas, extract requested JSON fields and answer questions about documents. [Official project](https://github.com/xiaomi-research/Xiaomi-OCR-0)

These outputs serve different purposes. Archiving a scanned article calls for preserving reading order, while a receipt may only need a date, identifier and amount. For the latter, recognizing a number is insufficient unless it is assigned to the correct field.

The project offers whole-page and region parsing. Regular printed documents can be split into regions for recognition, while handwriting, historical documents and irregular pages can lose context through segmentation. Testing both workflows on the same page would reveal how tables, footnotes and columns are reassembled.

Local deployment includes a browser demo and inference-server integration. The Ollama route is currently marked **experimental**; its community BF16 package includes the text model and vision projector, with a download size of about 1.8GB.

For Xiaomi-OCR-0, follow the official demo's image preprocessing, prompts and decoding settings. Region parsing also requires additional layout detection dependencies, so download size does not describe the memory footprint of the complete OCR service.

### PaddleOCR-VL-1.6: reconstructing the document

PaddleOCR-VL-1.6 has a vision-language model of about 0.9B parameters and covers text, tables, formulas, charts and seals. Its official description highlights improvements for tables, historical Chinese documents, rare characters and seals. These suggest useful test materials, without establishing the same gains for every document. [Official model card](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6)

The accompanying parsing workflow also matters. Official PaddleOCR examples export JSON and Markdown, making it possible to examine the full path from a page to a structured file rather than recognition on a single crop. Distinguish the 0.9B model from the complete pipeline: layout processing and other components also affect deployment cost.

For complex tables, inspect merged cells and row-column relationships before checking numbers. A tidy Markdown table can still attach an amount to the wrong item, which matters more to downstream processing than a missing punctuation mark.

### GLM-OCR: layout analysis followed by parallel recognition

GLM-OCR combines a vision encoder, a cross-modal connector and a language decoder, totaling about 0.9B parameters. Its complete official workflow uses PP-DocLayoutV3 for layout analysis before parallel region recognition. Both the recognizer and page segmentation therefore influence the result. [Official model card](https://huggingface.co/zai-org/GLM-OCR)

How a two-column article is segmented, whether a header enters the body, or whether a table is split can change the assembled output. A comparison with the other models should distinguish recognition of the same crop from parsing a complete PDF; otherwise pipeline differences can be mistaken for model differences.

The official card also specifies prompts for structured extraction with a defined JSON schema. Integration should check parseability, field completeness and whether values come from the correct locations.

For annual reports, contracts or scanned PDFs, compare the three models on the same files. Beyond character recognition, inspect table rows and columns, reading order, numbers and units, content across page boundaries, and missing small print. Published aggregate scores cannot replace validation on your own documents.

## Speech and retrieval: input, output and search for local tools

You do not have to send every task to a chat model. Speech input, reading aloud and search have their own small models.

| Model | Size | Uses |
| --- | --- | --- |
| [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B) | 0.6B | Speech recognition across multiple languages and Chinese dialects |
| [Qwen3-TTS-12Hz-0.6B-CustomVoice](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice) | 0.6B | Multilingual speech synthesis with preset voices |
| [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) | 0.6B | Document embeddings, semantic search and knowledge retrieval |
| [EmbeddingGemma](https://developers.googleblog.com/en/introducing-embeddinggemma/) | 308M | On-device text retrieval, classification and clustering |

### Qwen3-ASR-0.6B: voice input and transcription

The Qwen3-ASR family has 0.6B and 1.7B versions; this article focuses on the smaller one. Official documentation lists 30 languages and 22 Chinese dialects, with streaming and offline inference tooling. Offline transcription handles existing recordings; streaming matters when text should appear while someone speaks. [Official model card](https://huggingface.co/Qwen/Qwen3-ASR-0.6B)

A personal tool could transcribe speech first, then send the text to search or a chat model. Transcription, summarization and executing instructions are separate stages, which also makes errors easier to locate.

Later tests can use Mandarin recordings, English technical terms within Chinese speech, and background noise, checking terminology, numbers and long sentences. Subtitles require separate attention to timestamps. The project provides a ForcedAligner companion, so basic transcription output should not be assumed to include subtitle-ready alignment.

### Qwen3-TTS-0.6B-CustomVoice: spoken output

The complete checkpoint name is `Qwen3-TTS-12Hz-0.6B-CustomVoice`. It offers nine preset voices and supports ten languages, including Chinese. It can follow text generation to read notifications, articles or assistant answers aloud. This is the preset-voice version, not an arbitrary voice-cloning model. [Official model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice)

Short samples draw attention to voice quality, but actual use also needs natural continuous reading. Dates, amounts, English abbreviations, Chinese characters with multiple pronunciations and pauses provide useful test material. Longer articles also reveal abrupt changes between generated segments.

Deployment experience includes the wait for the first audio, uninterrupted playback and sharing resources with ASR or a chat model. Measure these on the target machine rather than treating published service latency as laptop performance.

### Qwen3-Embedding-0.6B: finding your own material

Embedding models are useful for a local document collection: turn documents into vectors, then retrieve relevant passages for a question. They find the material; a chat model organizes an answer from it. If you only want semantic search for your notes and documents, you can start without a chat model at all.

Qwen3-Embedding-0.6B supports multilingual and code retrieval, with up to 32K input tokens and output vectors up to 1024 dimensions. It also supports smaller dimensions and task instructions. Vector size affects index storage and query cost; longer input support is not a reason to compress an entire book into one vector. [Official model card](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)

For example, a question about an exhausted connection pool might need to find a development note written in terms of database connection timeouts. Semantic retrieval addresses that wording gap. Success still depends on chunking, query instructions and index settings. First check whether relevant passages appear among the top results, then add a chat model, so retrieval failures are not misdiagnosed as answer-generation failures.

### EmbeddingGemma: a smaller on-device retrieval candidate

Here the model is `google/embeddinggemma-300m`, a text embedding model of about 308M parameters. It supports multiple languages, up to 2048 input tokens, and 768-dimensional vectors with 512, 256 and 128-dimensional options. Compared with Qwen, it offers a different combination of model size, input length and vector dimensions. [Model card](https://huggingface.co/google/embeddinggemma-300m)

The 2048-token limit has more immediate consequences for chunking. Long notes need splitting while retaining headings and context, rather than simply truncating the remainder. Testing both models on the same documents and questions can compare retrieval hits, index size and CPU time. Fewer parameters do not automatically make it better suited to Chinese documents.

Two installation details matter: Hugging Face requires accepting the applicable terms, and the official example says activations do not support `float16`; use `float32` or `bfloat16` as appropriate for the hardware. Such conditions are more useful than simply describing a model as lightweight and local.

On an ordinary server without a GPU, a vector inference implementation with CPU support can process documents in batches. It does not need to generate a long answer token by token as chat does, though batch processing speed still depends on the machine and input length.

## Published evaluations: which results can be compared?

Performance has two meanings: task quality, and speed and resource use on your own machine. The following results concern the first, checked on **October 31, 2026**. They are mainly excerpts from model teams' reports, not tests conducted for this article or a live global ranking. Quantized versions and different inference settings need separate validation.

### General models: start with comparisons within one team's table

Qwen's official card reports both 4B and 9B. Higher is better for the selected metrics: MMLU-Pro covers knowledge and reasoning, C-Eval Chinese knowledge, IFEval instruction following, and LiveCodeBench v6 coding problems. [Qwen evaluation table](https://huggingface.co/Qwen/Qwen3.5-4B#benchmark-results)

| Model | MMLU-Pro ↑ | C-Eval ↑ | IFEval ↑ | LiveCodeBench v6 ↑ |
| --- | --- | --- | --- | --- |
| Qwen3.5-9B | 82.5 | 88.2 | 91.5 | 65.6 |
| Qwen3.5-4B | 79.1 | 85.1 | 89.8 | 55.8 |

9B leads on these four metrics, with a larger gap on coding problems. That does not establish success rates for modifying existing projects, which also require tools and engineering tasks to evaluate.

Gemma's official card compares E4B and E2B. These three instruction-tuned results retain the percentages in the source. [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4#benchmark-results)

| Model | MMLU Pro ↑ | GPQA Diamond ↑ | LiveCodeBench v6 ↑ |
| --- | --- | --- | --- |
| Gemma 4 E4B | 69.4% | 58.6% | 52.0% |
| Gemma 4 E2B | 60.0% | 43.4% | 44.0% |

These help explain the difference between E4B and E2B. The Qwen and Gemma tables come from different teams; this article has not standardized prompts, thinking budgets or evaluation settings, so they are not combined into a cross-family ranking.

Ministral's official Instruct table reports 56.8 on WildBench and 7.83 on MM MTBench for 3B. These measure different things from the knowledge and coding tests above. Reasoning and Base results appear separately and should not substitute for the Instruct version discussed here. [Ministral evaluations](https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512#benchmark-results)

For coding models, consult the [official SWE-bench leaderboard](https://www.swebench.com/). It evaluates real repository issues, and results describe a model combined with an agent workflow. When comparing Qwen3-Coder, retain the agent, allowed interaction count and test set rather than mixing a percentage with LiveCodeBench.

### OCR: positions within the same comparison table

Xiaomi's repository compares all three OCR candidates. This excerpt is sorted by OmniDocBench v1.6; the ordering applies only to these three models. Real5 and Wild retain the source's Real5-OmniDocBench and Wild-OmniDocBench metrics. All columns are Overall scores, with higher being better. [Xiaomi comparison table](https://github.com/xiaomi-research/Xiaomi-OCR-0#document-parsing-selected-comparisons)

| Order among these three | Model | OmniDocBench v1.6 ↑ | Real5 ↑ | Wild ↑ |
| --- | --- | --- | --- | --- |
| 1 | Xiaomi-OCR-0 | 96.83 | 95.24 | 87.94 |
| 2 | PaddleOCR-VL-1.6 | 96.33 | 93.19 | 87.36 |
| 3 | GLM-OCR | 95.22 | 90.32 | 85.08 |

Xiaomi leads on these three metrics in this table. It is a comparison published by Xiaomi, not an independent retest; the repository states that its results use two-stage parsing. The 0.50-point OmniDocBench v1.6 gap between Xiaomi and Paddle needs checking on actual pages. Different OmniDocBench versions or aggregation metrics cannot be mixed directly.

### Retrieval: aggregate scores alongside resource cost

Table 5 of the EmbeddingGemma report includes both retrieval candidates. These are Mean Task scores, higher being better, from a historical report snapshot rather than current leaderboard positions. Qwen's multilingual score here is 64.34, slightly different from the 64.33 in its own card; this excerpt consistently uses the same source table. [EmbeddingGemma report, Table 5](https://arxiv.org/html/2509.20354v1#S4.T5)

| Model | Parameters | MTEB Multilingual v2 ↑ | MTEB English v2 ↑ |
| --- | --- | --- | --- |
| Qwen3-Embedding-0.6B | About 0.6B | 64.34 | 70.70 |
| EmbeddingGemma (768 dimensions) | 308M | 61.15 | 69.67 |

Qwen leads on these aggregates, which do not answer whether an index is smaller or CPU processing faster. EmbeddingGemma's card also reports 60.62 for its 768-dimensional Q4_0 multilingual result, against 61.15 at full precision. This is evidence for that quantization scheme, not a general rule for all models. [Quantization results](https://huggingface.co/google/embeddinggemma-300m#benchmark-results)

The [official MTEB site](https://leaderboard.mteb.org/) provides ongoing results; distinguish Mean Task, Mean Type and Borda rankings. A higher aggregate does not guarantee better retrieval on personal Chinese notes or specialized terminology.

### Speech recognition: lower errors, separated by language and dataset

Table 3 of the Qwen3-ASR report compares Chinese test sets. The excerpt uses character error rate (CER) in percent. Whisper-large-v3 is a reference evaluated by the Qwen team, not by this article. [Qwen3-ASR report and metrics](https://arxiv.org/html/2601.21337v2#S4.T3)

| Model | AISHELL-2-test CER ↓ | WenetSpeech meeting CER ↓ | Fleurs-zh CER ↓ |
| --- | --- | --- | --- |
| Qwen3-ASR-1.7B (larger reference) | 2.71 | 5.88 | 2.41 |
| Qwen3-ASR-0.6B | 3.15 | 6.88 | 2.88 |
| Whisper-large-v3 (reference) | 5.06 | 19.11 | 4.09 |

1.7B has lower errors on these three tests, and 0.6B outperforms the reported Whisper results. This establishes neither a ranking across all languages nor a universal winner. English typically uses word error rate (WER), which should not simply be averaged with CER. The [Open ASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard) is another source to follow, checking language coverage and evaluation settings.

### Speech synthesis: reading correctly versus sounding good

Table 9 of the Qwen3-TTS report compares 12Hz CustomVoice models after fine-tuning for a particular target speaker, Aiden Voice. These content-consistency error rates retain the report's WER label, lower being better. They are not general rankings for arbitrary preset voices in a downloaded model. [Qwen3-TTS report, Table 9](https://arxiv.org/html/2601.15621v1#S4.T9)

| Model (report's target-speaker setup) | Chinese error rate ↓ | English error rate ↓ |
| --- | --- | --- |
| Qwen3-TTS-12Hz-0.6B-CustomVoice | 0.944 | 1.188 |
| Qwen3-TTS-12Hz-1.7B-CustomVoice | 0.903 | 0.899 |

These metrics assess consistency with the input text, not naturalness, voice preference or long-form listening quality. Later tests should retain audio samples and separately measure first-audio latency and continuous playback.

## Estimating hardware: memory and context matter together

To assess whether a machine can run a model, first check the size and format of the chosen files, then the devices supported by its runtime.

For weights alone, a rough calculation is **parameter count × storage bits per parameter ÷ 8**. Four billion parameters stored entirely at 4 bits would take about 2GB; nine billion would take about 4.5GB. These are decimal gigabytes and theoretical weight storage figures only. Actual quantized files contain additional data, and inference also needs caches, computation buffers and runtime memory.

A model file of a few gigabytes does not establish that the same amount of VRAM is enough. Longer contexts, higher concurrency and larger images generally increase memory use. Apple Silicon uses unified memory, so leave room for the operating system and other applications rather than allocating the machine's entire memory to the model.

An official statement such as Ministral's “FP8 fits in 8GB of VRAM” is a reference for that version, not a rule for every model with a similar parameter count. Before downloading, check the quantized package, runtime and context settings; after loading, check whether generation speed is acceptable. Without measurements, this article does not offer general hardware purchasing recommendations by VRAM capacity.

## Where to begin deployment

For trying chat, start with tools such as Ollama or LM Studio. For more control over quantized files, CPU inference or mixed CPU/GPU loading, look at [llama.cpp](https://github.com/ggml-org/llama.cpp). The official Qwen3.5 model cards also link to quantized versions.

For serving an API, follow the model's instructions to choose vLLM, SGLang or a dedicated inference package. New architectures often require particular runtime versions, so installing a framework does not by itself establish compatibility. For OCR, ASR and TTS, begin with each project's official examples.

## Licenses and scope

The Qwen3.5, Ministral 3 and PaddleOCR-VL-1.6 models listed here use Apache 2.0, while the GLM-OCR model card lists MIT. For product use, check the licenses of the selected weights, accompanying code and dependencies separately.

Later articles will install these models individually and document their use. Each should record the environment, model and quantization version, installation problems, resource use and results on fixed samples. OCR tests should retain images and parsed outputs; speech tests, audio clips; retrieval tests, questions and matching passages; and coding tests, edits and check results. Those records will connect what the official projects provide with what using them is actually like.
