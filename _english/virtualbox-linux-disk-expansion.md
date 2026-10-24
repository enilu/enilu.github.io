---
source_sha256: 0b12e1f31ffdd569a0eb13aa3bd6ef5a55c6bc28e37a5b27263c7206f648111a
title: Expanding Disk Space in a Linux VirtualBox Guest
date: '2015-09-09'
lang: en
translation_key: virtualbox-linux-disk-expansion
permalink: /en/2015/09/09/virtualbox-linux-disk-expansion/
description: 'Running out of disk in a VirtualBox Linux guest involves three layers: virtual media capacity on the host, partitions or logical volumes in the guest, and filesystem capacity. Expanding only the first layer usually does not change Linux df '
---

Running out of disk in a VirtualBox Linux guest involves three layers: virtual media capacity on the host, partitions or logical volumes in the guest, and filesystem capacity. Expanding only the first layer usually does not change Linux df output automatically.
<!--break-->

## Choose expansion or a new data volume

Expanding an existing volume keeps the directory layout but changes existing partitions or LVM. A new data volume mounts separately and suits isolated new data. Do not mix the workflows or format an existing data partition.

Back up important data, confirm disk format, snapshot chains and host free space, and follow the relevant VirtualBox version's instructions. Usually shut down the guest before inspecting the target medium:

```text
VBoxManage list hdds
```

Change the medium actually attached to the target guest. Versions use modifyhd or modifymedium, and resize support depends on media format and state. Capacity commonly uses MB. Do not guess device paths or numbers.

## Inspect the space inside Linux

```text
lsblk -f
df -h
```

Check device sizes, partitions, filesystem types and mount points. With LVM, inspect PV, VG and LV relationships too. Adding a disk, expanding a partition, growing a logical volume and growing a filesystem are separate actions. ext-family filesystems and XFS use different tools.

If creating a separate partition in new space, initialize only a target confirmed to contain no data that must be kept. Device names can change. `/dev/sda3` is not universally the new partition.

## Verify mounting and reboot recovery

Mount temporarily and test reads and writes before adding the actual filesystem UUID to fstab. Back up its previous configuration and validate syntax and mounting to avoid maintenance mode after reboot. Mounting over a nonempty directory hides its previous contents, which also requires planning.

Set permissions for the application's account instead of using `chmod 777` as a general fix. Verify mounting after reboot, application use of the new space and sufficient host capacity as dynamically allocated disks continue growing.

**References**

- [Documentation: www.virtualbox.org](https://www.virtualbox.org/manual/)
- [Documentation: docs.kernel.org](https://docs.kernel.org/filesystems/index.html)
