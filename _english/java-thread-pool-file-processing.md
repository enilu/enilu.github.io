---
source_sha256: 86c71ddc107dca02d74628900960dec406fd74da41389400025632b23bd0a631
title: "Using a Java Thread Pool to Process Files"
date: 2016-03-12
lang: en
translation_key: java-thread-pool-file-processing
permalink: /en/2016/03/12/java-thread-pool-file-processing/
description: "A file-processing example covering task submission, result collection, failures and executor shutdown."
---

A thread pool simplifies thread creation and reuse. We still need to decide how tasks are queued, how failures are collected and how the program waits for completion. This article connects those concerns through a batch text-file example.
<!--break-->

## Define the task first

Read the regular `.txt` files in one directory. Each task reads one UTF-8 file line by line and returns its line count. The main thread collects the results and prints failures. If any file fails, the program exits with a failure status.

Counting lines is a stand-in for application-specific parsing. The example does not recurse into subdirectories and assumes a manageable number of files. It retains a path and Future for each file, so it is not a scheduler for enormous datasets.

Concurrency is not automatically faster. If storage is already saturated, more concurrent readers may not help. Measure the actual workload instead of assuming that more threads are better.

## Distinguish the main abstractions

`Executor` defines task execution. `ExecutorService` adds submission, results and lifecycle management. `ThreadPoolExecutor` is one implementation, while `Executors` provides factory methods for common executors.

| Factory method | Main behavior | Considerations |
|---|---|---|
| `newFixedThreadPool(n)` | At most n threads execute tasks; other tasks wait in a shared unbounded queue; workers are reused | Bounded thread count does not mean bounded backlog |
| `newCachedThreadPool()` | Reuses available threads or creates new ones; by default, removes threads idle for 60 seconds | Fast submission can create too many threads |
| `newSingleThreadExecutor()` | Executes tasks sequentially, with at most one running at a time, using an unbounded queue | Slow processing can still accumulate a backlog |
| `newScheduledThreadPool(n)` | Supports delayed and periodic tasks | Define exception handling and cancellation for recurring work |

A fixed pool does not normally wait for a worker thread to terminate before running another task. A worker completes a task and takes another from the queue. Its default core threads do not time out merely because they are idle; `keepAliveTime=0` does not mean that every thread immediately expires.

## A standalone example

The code uses only JDK APIs and Java 8 syntax. It explicitly creates five workers and a task queue with capacity 64. With `CallerRunsPolicy`, a full queue causes the submitting thread to execute the task itself while the executor remains active, slowing down further submission.

The main thread can therefore participate in file processing: this is not a process-wide limit of five concurrent tasks. Shutdown is controlled by the main thread in this example. If other threads may shut down the executor, submission and rejection races require additional handling.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class FileBatch {
    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            throw new IllegalArgumentException("Usage: java FileBatch <directory>");
        }
        Path directory = Paths.get(args[0]);
        if (!Files.isDirectory(directory)) {
            throw new IOException("Not a directory: " + directory);
        }
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
                5, 5, 0L, TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<Runnable>(64),
                new ThreadPoolExecutor.CallerRunsPolicy());
        Map<Path, Future<Long>> tasks = new LinkedHashMap<>();
        try {
            try (DirectoryStream<Path> stream =
                         Files.newDirectoryStream(directory, "*.txt")) {
                for (Path file : stream) {
                    if (Files.isRegularFile(file)) {
                        tasks.put(file, pool.submit(() -> countLines(file)));
                    }
                }
            }
            pool.shutdown();
            int failed = 0;
            for (Map.Entry<Path, Future<Long>> task : tasks.entrySet()) {
                try {
                    long lines = task.getValue().get();
                    System.out.println(task.getKey() + ": " + lines + " lines");
                } catch (ExecutionException e) {
                    failed++;
                    System.err.println("Failed: " + task.getKey());
                    e.getCause().printStackTrace(System.err);
                }
            }
            if (failed > 0) {
                throw new IllegalStateException(failed + " file(s) failed");
            }
        } catch (InterruptedException e) {
            pool.shutdownNow();
            Thread.currentThread().interrupt();
            throw e;
        } finally {
            shutdownAndAwait(pool);
        }
    }

    private static long countLines(Path file) throws IOException {
        long count = 0;
        try (BufferedReader reader =
                     Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
            while (reader.readLine() != null) {
                if (Thread.currentThread().isInterrupted()) {
                    throw new IOException("Interrupted: " + file);
                }
                count++;
            }
        }
        return count;
    }

    private static void shutdownAndAwait(ThreadPoolExecutor pool) {
        pool.shutdown();
        try {
            if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
                pool.shutdownNow();
                if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
                    System.err.println("Workers have not terminated");
                }
            }
        } catch (InterruptedException e) {
            pool.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
```

Save it as `FileBatch.java` and run:

```text
javac -encoding UTF-8 FileBatch.java
java FileBatch ./sample-files
```

## Why collect results this way?

A task reads its own file and returns a count. It does not modify a shared failure list. `submit` returns a `Future`; task failures surface through `ExecutionException` when the main thread calls `get`. The main thread can inspect the other files before deciding whether the batch succeeded.

Having several workers call `add` on the same ordinary `ArrayList` to record failures would introduce a concurrency bug. A concurrent collection can protect those mutations, while returning task results avoids shared aggregation state in the workers altogether.

Results are retrieved in registration order. A slow earlier task delays the display of later results, but does not prevent those tasks from running concurrently. `ExecutorCompletionService` is an option when results should be processed in completion order.

## Shutdown and waiting are separate

`shutdown()` rejects new tasks while allowing submitted work to continue. It does not wait for completion. `awaitTermination` waits for executor termination and returns `false` on timeout; merely calling it does not establish that work has finished.

On the normal path, this program retrieves every Future before waiting for executor termination. The 30-second waits in the cleanup method apply to shutdown, not to the execution time of each file. Per-task deadlines require a separate timeout and cancellation policy.

On interruption, the program requests cancellation of remaining work and restores the current thread's interrupt flag. `shutdownNow()` attempts interruption; it does not forcibly stop arbitrary code. Tasks must cooperate, and blocking IO may not respond immediately. Checking interruption between lines does not guarantee that every IO operation will exit promptly.

Reading line by line avoids loading an entire file into memory. Paths and Futures still grow with the number of files, however. Larger workloads need additional limits on in-flight tasks and retained results.

## References

- [Java 8: ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html)
- [Java 8: Executors](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executors.html)
- [Java 8: ThreadPoolExecutor](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ThreadPoolExecutor.html)
- [Java 8: ArrayList](https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html)
