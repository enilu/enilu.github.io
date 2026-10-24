---
source_sha256: 561b79354331ff8d3fe072b91b9fc73aa96c96136d112d7eb8b3c4b65777f217
title: 'From Development to Release: A WeChat Mini Program Workflow'
date: '2018-01-26'
lang: en
translation_key: wechat-mini-program-workflow
permalink: /en/2018/01/26/wechat-mini-program-workflow/
description: Releasing a WeChat Mini Program from scratch requires accounts, backend APIs, real-device testing and review materials as well as pages. Identifying these dependencies early avoids finishing the code while still being unable to release.
---

Releasing a WeChat Mini Program from scratch requires accounts, backend APIs, real-device testing and review materials as well as pages. Identifying these dependencies early avoids finishing the code while still being unable to release.
<!--break-->

## Prepare an integration environment

Register the Mini Program for the appropriate entity and configure the correct AppID and environment in the developer tools. Keep AppSecret on the server, outside client code. Backend APIs must authenticate and authorize independently rather than trusting client-provided user IDs.

Local debugging exceptions in developer tools do not relax domain or TLS requirements on real devices and published builds. Integrate early against a production-like HTTPS environment and configure required domains according to the console and official documentation.

## Define application and page responsibilities

app.json holds global configuration, app.js application logic, and app.wxss global styles. A page typically has WXML, WXSS, JS and JSON for structure, styling, logic and page configuration. It is not ordinary HTML into which arbitrary script tags can be inserted.

Register routes according to the main-package or subpackage structure. Use lifecycle callbacks the framework actually provides. Do not depend on a guaranteed destruction callback at application exit to save critical data.

## Test real devices before review

Check operating systems and screens, network failures, denied permissions, expired login, images, video and background transitions. Simulator success does not establish behavior on real devices and release networks.

Associate API environments, application versions and backend versions so trial builds do not connect to the wrong database. Test accounts and permissions should cover the review journey, and the backend must remain available during review and release.

## Upload, review and publication are separate

After uploading in developer tools, select the version in the console, submit it for review, and publish after approval. Review duration, categories and entity qualifications change with platform rules. Fixed-day promises or a few keywords cannot establish approval; follow the console's current requirements.

For frameworks such as Wepy or third-party generators, check maintenance, platform compatibility and export capabilities. Component frameworks still need official preview, upload and platform validation. They do not imply that arbitrary code can migrate directly to H5.

**References**

- [WeChat Mini Program documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
