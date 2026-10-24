---
source_sha256: dbb2afebfba430a27828582cfeb21c550083d5e1cab1c12c042da5a8380a4247
title: Improving Crawler Performance by Fixing Proxy Allocation
date: '2015-12-24'
lang: en
translation_key: crawler-proxy-resource-allocation
permalink: /en/2015/12/24/crawler-proxy-resource-allocation/
description: 'Slow data collection does not always mean slow HTTP requests. In one case, initialization stalled because we allocated proxy resources incorrectly: shared configuration was treated as an exclusively owned resource and assigned too early to '
---

Slow data collection does not always mean slow HTTP requests. In one case, initialization stalled because we allocated proxy resources incorrectly: shared configuration was treated as an exclusively owned resource and assigned too early to individual collectors.
<!--break-->

## Requests wait even though the resource is not exhausted

We put 100 proxies in a `ArrayBlockingQueue` at startup. Each collector took ten and held them indefinitely. Once ten collectors had initialized, the eleventh waited for a proxy, while the preceding collectors had no return mechanism.

The queue was not inherently slow. The resource lifecycle did not match the design. If a proxy supports multiple requests, a collector should not permanently own it at initialization. If it has a genuine concurrency limit, borrow capacity per request, return it afterward, and bound the waiting time.

## Select shared configuration with round robin

If the requirement is simply to distribute selections across requests, retain an immutable configuration list and allocate indices atomically. This generic selector uses only JDK 8 APIs; `T` can be a proxy configuration type:

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public final class RoundRobin<T> {
    private final List<T> entries;
    private final AtomicInteger next = new AtomicInteger();

    public RoundRobin(List<T> entries) {
        if (entries == null || entries.isEmpty()) {
            throw new IllegalArgumentException("entries must not be empty");
        }
        if (entries.contains(null)) {
            throw new IllegalArgumentException("entries must not contain null");
        }
        this.entries = Collections.unmodifiableList(new ArrayList<>(entries));
    }

    public T get() {
        int index = next.getAndUpdate(i -> i == entries.size() - 1 ? 0 : i + 1);
        return entries.get(index);
    }
}
```

Reading and wrapping the index occur in one atomic update. There is no separate increment and reset that could allow concurrent callers at the end of the list to obtain an out-of-range index. Copying the input list protects its size from external additions and removals. The configuration objects themselves must still be immutable or otherwise thread-safe.

## Round robin is not a resource pool

The selector chooses an entry. It neither checks availability nor limits concurrent use of a proxy. Equal selection counts also do not imply equal load when request durations differ.

Record connection failures, response times and target-site rate limits in a real crawler. Use bounded retries with backoff for transient failures. Temporarily exclude unavailable proxies and probe them before restoring service. Configuration selection, connection pooling and concurrency permits have separate responsibilities; an index counter cannot implement all of them.

Initialize resources only when needed. An unscheduled collector does not need to hold connections or other scarce resources in advance. Measure where waiting happens before deciding whether to optimize requests, scheduling or allocation. This is usually more effective than adding threads immediately.

**References**

- [AtomicInteger](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicInteger.html)
