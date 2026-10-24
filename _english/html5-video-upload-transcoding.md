---
source_sha256: 593367b5fb7381dc6e5300532c0f1b19464e76bd2be3f7aacb801341002eb8c9
title: Uploading and Transcoding Video from a Mobile Web Page
date: '2020-03-18'
lang: en
translation_key: html5-video-upload-transcoding
permalink: /en/2020/03/18/html5-video-upload-transcoding/
description: A project needed users to record video on a mobile web page and upload it for staff review. A clip lasting only tens of seconds could exceed 100 MB. Upload delays, retry behavior and browser playback compatibility each needed their own desi
---

A project needed users to record video on a mobile web page and upload it for staff review. A clip lasting only tens of seconds could exceed 100 MB. Upload delays, retry behavior and browser playback compatibility each needed their own design.
<!--break-->

## Define the upload unit first

My initial approach uploaded Base64 chunks and reconstructed the video on the server. Base64 is not compression: three bytes usually become four characters, with additional conversion and memory costs. Once the browser has a `File`, a more direct approach is to cut binary chunks with `Blob.slice()` and upload them using multipart or binary requests.

Use a stable upload ID and include each chunk's sequence, total count, size and integrity information. Retrying a chunk should replace or reuse the confirmed result, never append it twice. Mark the merged file usable only after verifying completeness, ordering and the file checksum. Expire incomplete uploads.

A transfer progress bar does not mean merging and transcoding are finished. Expose uploading, processing and playable states separately, and allow upload continuation or processing retries after failure.

## Base64 decoding does not transcode video

If an API accepts Data URLs, separate metadata from the encoded data:

```text
data:video/mp4;base64,...
data:video/quicktime;base64,...
```

Split at the comma and verify the encoding marker before decoding. Avoid fixed string replacements for Android and iOS. Neither a MIME type nor an extension proves the internal encoding: decoding QuickTime data and renaming it `.mp4` does not create a compatible MP4 file.

If binary chunks were Base64-encoded separately, decode each chunk before concatenating the resulting bytes in order. Do not arbitrarily concatenate Base64 strings that contain padding.

## Check both container and codecs for playback

Web browsers support more than H.264. Playback depends on the combination of browser, device, container, video codec and audio codec. H.264 video and AAC audio inside MP4 are a common choice, but still require testing on target devices.

Here is an FFmpeg transcoding example; the installed build must include `libx264`:

```text
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart output.mp4
```

CRF, resolution and preset affect quality, file size and processing time. Evaluate them with real samples. `-movflags +faststart` moves the MP4 playback index toward the front for progressive playback. It does not produce HLS or replace HTTP Range support on the server.

## Move lengthy processing out of request threads

Run transcoding as a background job after merging, and record state and failure reasons. Pass an argument list when starting an external process. Bound concurrency, runtime and output size, and consume standard output and error streams to prevent blocking. Generate storage names server-side instead of inserting user filenames into commands.

The review page reads the transcoded file, and the server returns the correct content type and range responses. Acceptance should cover large files, duplicate chunks, interrupted transfers, transcoding failures, silent videos and recordings from different devices. Only then is the entire flow demonstrated to work.

**References**

- [FFmpeg command line](https://ffmpeg.org/ffmpeg.html)
- [Documentation: ffmpeg.org](https://ffmpeg.org/ffmpeg-formats.html#mov_002c-mp4_002c-ismv)
