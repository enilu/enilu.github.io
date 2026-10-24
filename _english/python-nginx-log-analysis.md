---
source_sha256: a6330929d2797588feff3a7f31494f0119559d726ad74b945c061e1f30bab03c
title: Analyzing Nginx Logs for Excessive Requests with Python
date: '2014-09-25'
lang: en
translation_key: python-nginx-log-analysis
permalink: /en/2014/09/25/python-nginx-log-analysis/
description: Nginx access logs can identify sources making many requests in a short period, but high volume alone does not establish malicious behavior. Shared gateways, search engines, monitoring and frontend assets all produce traffic. Finding candida
---

Nginx access logs can identify sources making many requests in a short period, but high volume alone does not establish malicious behavior. Shared gateways, search engines, monitoring and frontend assets all produce traffic. Finding candidates first and applying business rules afterward gives better control over false positives than immediately adding IPs to a firewall.
<!--break-->

## Fix the observation window

This Python 3 example reads a log already restricted to a time interval. It assumes the first field is the client IP, which must match the actual Nginx log_format. It prints candidates meeting a threshold without changing firewall rules:

```python
import argparse
import ipaddress
from collections import Counter

parser = argparse.ArgumentParser()
parser.add_argument("logfile")
parser.add_argument("--threshold", type=int, default=500)
args = parser.parse_args()
if args.threshold < 1:
    parser.error("threshold must be positive")

counts = Counter()
with open(args.logfile, encoding="utf-8", errors="replace") as stream:
    for line in stream:
        fields = line.split(maxsplit=1)
        if not fields:
            continue
        try:
            address = str(ipaddress.ip_address(fields[0]))
        except ValueError:
            continue
        counts[address] += 1

for address, count in counts.most_common():
    if count >= args.threshold:
        print(address, count)
```

```text
python count_requests.py access-window.log --threshold 500
```

The threshold depends on the window: 500 requests per hour differs substantially from 500 per minute. Counter memory also grows with distinct IPs. Large logs may need a logging platform or streaming aggregation.

## Account for real IPs and log rotation

Behind a reverse proxy, the first field may be the proxy's address. Configure real_ip with explicit trusted proxy ranges before attributing traffic to real sources. Never trust arbitrary client-supplied X-Forwarded-For values unconditionally.

A continuously running reader cannot track only the last line number. Rotation, truncation and restart invalidate it. Track file identity and offsets, or let a log collector supply timestamped records to aggregation logic.

## Make restrictions expire and recover

Evaluate paths, status codes, rates and business outcomes before selecting rate limits, challenges or temporary blocks. Record a reason and expiry, maintain allowlists and provide manual removal. A one-off script should not append duplicate DROP rules forever.

Nginx limit_req is better suited to rate control as requests arrive, but still requires an appropriate key and burst policy. Test normal users and shared-network scenarios before choosing production thresholds.

**References**

- [Nginx log module](https://nginx.org/en/docs/http/ngx_http_log_module.html)
- [limit_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
