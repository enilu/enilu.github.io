---
source_sha256: d467940ed8a49992d84c0d6a2d9d3ef834e73521c712d2d6f96f975232bb8455
title: "Nginx Static Content: Root Paths, Browser Caching and Releases"
date: '2016-07-27'
lang: en
translation_key: nginx-static-dynamic-content
permalink: /en/2016/07/27/nginx-static-dynamic-content/
description: "Serve public assets with Nginx, checking root versus alias, access boundaries, fresh caches versus 304 responses, content hashes and release sequencing."
---

With Nginx forwarding requests and Jetty running a Java application, public static resources can be served directly by Nginx. This reduces that work on the application server. Measure request volume, latency and resource use to determine the overall improvement.
<!--break-->

## Understand path mapping first

If `/assets/app.css` maps to `/srv/blog/assets/app.css`, add this inside the existing server block:

```nginx
location /assets/ {
    root /srv/blog;
    try_files $uri =404;
    expires 1h;
}
```

`root` appends the complete URI, so the root here is not `/srv/blog/assets`. `alias` has different substitution rules; changing only the directive name is not equivalent. Put only public files in this directory. Extension-based matching must not accidentally expose business attachments that require authorization.

Run `nginx -t` before reloading through the deployment's service mechanism. There is no need to shut down Jetty for a production test. In an isolated environment, verify static requests bypass the backend and inspect access logs, Content-Type, 404 responses and cache headers.

## Distinguish cache reuse from conditional requests

A browser can use a fresh cached resource without making a request. When revalidation is needed, it may send If-Modified-Since or If-None-Match. A 304 response confirms the resource is unchanged and lets the browser reuse its stored body.

A 304 still incurs a network round trip. It does not mean no request occurred or prove that the overall optimization succeeded. Dynamic responses may also be cached according to their semantics. Headers and data properties determine cacheability, rather than whether Java generated the response.

## Coordinate caching with releases

The one-hour lifetime is illustrative. Content-hashed filenames can support longer caching. A fixed filename cached for too long may keep old JS or CSS after deployment. Align HTML and asset update strategies and verify references and publication order.

Compare backend static-request hits, latency, bandwidth and errors before and after the change. If the bottleneck is database access or business computation, serving static files separately removes only part of the cost. It does not replace tracing the actual slow path.

**References**

- [Nginx root](https://nginx.org/en/docs/http/ngx_http_core_module.html#root)
- [expires](https://nginx.org/en/docs/http/ngx_http_headers_module.html#expires)
