---
source_sha256: 774964c61511194aa8866d8db628c434be487919995cfe34a68ca9b8990b1b59
title: Building and Configuring Nginx from Source
date: '2016-03-02'
lang: en
translation_key: nginx-source-installation
permalink: /en/2016/03/02/nginx-source-installation/
description: Building Nginx from source can provide a fixed installation path or selected modules. Compared with package-manager installation, it also leaves you responsible for versions, dependencies, service definitions and upgrades. Compilation is on
---

Building Nginx from source can provide a fixed installation path or selected modules. Compared with package-manager installation, it also leaves you responsible for versions, dependencies, service definitions and upgrades. Compilation is only the first step.
<!--break-->

## Record build conditions

I originally used 1.6.2. This describes the source-build workflow rather than recommending that old release. For deployment, select a validated release appropriate to the environment.

Download the matching source and verify provenance and checksums. Prepare compiler and development dependencies for the regex, zlib and TLS libraries required by selected modules. Package names vary by distribution. Installing a runtime library does not necessarily provide compilation headers.

Run inside the extracted source directory:

```text
./configure --prefix=/opt/nginx --with-http_stub_status_module --with-http_realip_module --with-http_gzip_static_module --with-http_ssl_module
make
make install
```

`./configure` runs the script in the current directory; `/configure` does not. Installation writes to the selected destination. Confirm it is not another active installation, and retain build arguments and dependency versions.

## Match the binary with its runtime configuration

```text
/opt/nginx/sbin/nginx -V
/opt/nginx/sbin/nginx -t -c /opt/nginx/conf/nginx.conf
```

`-V` displays version and build options. `-t` checks configuration syntax and access to required files. Verify log, pid and temporary paths plus worker-account permissions before starting.

SysV init and systemd use different service definitions. Follow the distribution's mechanism, avoiding two managers pointing to different binaries. The service's PID path must agree with Nginx configuration.

## Validate changes before reloading

After a syntax check, request reload with the matching installation's `nginx -s reload`. The running process still needs to load configuration successfully. Inspect errors and new requests rather than relying only on the command's return.

Configure appropriate Host headers and connection/read timeouts for reverse proxying. Trust only explicit proxy ranges for real_ip, restrict status pages and expose only public files from static directories. Build production configuration around business paths instead of copying examples containing private paths and broad network access.

Source-install upgrades also require compatibility checks for dynamic modules, TLS libraries and service scripts. Keep old binaries, configuration and a rollback method to control risk.

**References**

- [build options](https://nginx.org/en/docs/configure.html)
- [Controlling Nginx](https://nginx.org/en/docs/control.html)
