---
layout: post
category : 运维 
tags : [telnet,运维,linux]
---
 
Linux默认没有开启telnet， 首先更改/etc/xinetd.d/telnet文件，有的可能没有该文件，有比如krb5-telnet之类的，那就更改这个文件，如果实在一个跟telnet沾边的文件都没有；可能是没有安装telent服务，就需要拿盘再安装了，或者安装后还没有，就新建一个该文件，文件内容为
 <!--break-->
 
{% include JB/setup %}

     # default: off
     # description: The kerberized telnet server accepts normal telnet sessions, \
     #              but can also use Kerberos 5 authentication.
     service telnet
     {
     flags           = REUSE
     socket_type     = stream
     wait            = no
     user            = root
     server          = /usr/kerberos/sbin/telnetd
     log_on_failure  += USERID
     disable         = yes
     }

将其中的disable=yes的“yes”更改为“no”即可， 然后重启telnet服务 输入：


     service xinetd restart
     Stopping xinetd: [  OK  ]
     Starting xinetd: [  OK  ]

重启成功， 这时候可以用telnet连接开通的linux主机了；但是linux默认不允许root用户远程telnet登录，两种方法解决该问题：

 - 1， 用非root’用户登录，然后在切换到root用户， 
 - 2， 将/etc/pam.d/login文件的第二行注释掉：#auth required pam_securetty.so；但是我这里没有测试通过 