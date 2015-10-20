##Bonding的模式一共有7种：
    #defineBOND_MODE_ROUNDROBIN       0   （balance-rr模式）网卡的负载均衡模式
    #defineBOND_MODE_ACTIVEBACKUP     1   （active-backup模式）网卡的容错模式
    #defineBOND_MODE_XOR              2   （balance-xor模式）需要交换机支持
    #defineBOND_MODE_BROADCAST        3    （broadcast模式）
    #defineBOND_MODE_8023AD           4   （IEEE 802.3ad动态链路聚合模式）需要交换机支持
    #defineBOND_MODE_TLB              5   自适应传输负载均衡模式
    #defineBOND_MODE_ALB              6   网卡虚拟化方式
 
##bonding模块的所有工作模式可以分为两类：
 多主型工作模式和主备型工作模式，
 balance-rr 和broadcast属于多主型工作模式而active-backup属于主备型工作模式。（balance-xor、自适应传输负载均衡模式（balance-tlb）和自适应负载均衡模式（balance-alb）也属于多主型工作模式，IEEE 802.3ad动态链路聚合模式（802.3ad）属于主备型工作模式。

##详细介绍这7种模式：
- 1、balance-rr （mode=0）

    轮转（Round-robin）策略：从头到尾顺序的在每一个slave接口上面发送数据包。本模式提供负载均衡和容错的能力。

- 2、active-backup（mode=1）

    活动-备份（主备）策略：在绑定中，只有一个slave被激活。当且仅当活动的slave接口失败时才会激活其他slave。为了避免交换机发生混乱此时绑定的MAC地址只有一个外部端口上可见。在bongding的2.6.2及其以后的版本中，主备模式下发生一次故障迁移时，bonding将在新激活的slave上会送一个或者多个gratuitous ARP。bonding的主salve接口上以及配置在接口上的所有VLAN接口都会发送gratuitous ARP，只要这些接口上配置了至少一个IP地址。VLAN接口上发送的的gratuitous ARP将会附上适当的VLAN id。本模式提供容错能力，primary option，documented below会影响本模式的行为。

- 3、balance-xor（mode=2）

    XOR策略：基于所选择的传送hash策略。本模式提供负载均衡和容错的能力。
- 4、broadcast（mode=3）

    广播策略：在所有的slave接口上传送所有的报文。本模式提供容错能力。
- 5、802.3ad（mode=4）

    IEEE 802.3ad 动态链路聚合。创建共享相同的速率和双工模式的聚合组。能根据802.3ad规范利用所有的slave来建立聚合链路。Salve的出站选择取决于传输的hash策略，默认策略是简单的XOR策略，而hash策略则可以通xmit_hash_policy选项加以改变。需要注意的是：不是所有的传输策略都与802.3ad兼容，尤其是802.3ad标准的43.2.4章节中关于 packet mis-ordering要求的地方。不同个体的实现往往出现很大的不兼容。
先决条件：
    - 1. 每个slave的基本驱动支持Ehtool获取速率和双工状态。
    - 2.交换机支持IEEE 802.3ad动态链路聚合。大多数的交换机都需要使用某种配置方式来启用802.3ad模式。

- 6、balance-tlb（mode=5）
    
    自适应传输负载均衡：信道绑定不需要特殊的交换机支持。出口流量的分布取决于当前每个slave的负载（计算相对速度）。进口流量从当前的slave的接收。如果接收salve出错，其他的slave接管失败的slave的MAC地址继续接收。
  先决条件：
  每个slave的基本驱动支持Ehtool获取速率状态。

- 7、balance-alb（mode=6）
    
    自适应负载均衡：
        包括balance-tlb（模式5）以及用于IPV4流量的接收负载均衡，并且不需要特殊的交换机支持。接收负载均衡通过ARP协商实现。bonding的驱动拦截本机发出的ARP Replies（ARP回应报文），并且用bond的某一个slave的硬件地址改写ARP报文的源地址，使得本服务器对不同的设备使用不同的硬件地址。本服务器建立的连接的接收流量也是负载均衡的。当本机发送ARP Request时，bonding驱动通过ARP报文复制并保存节点的IP信息。当从其他节点接收到ARP Reply，bonding驱动获取节点的硬件地址并且会回应一个包含绑定好的slave的硬件地址的ARP Reply给发送的节点。用ARP协商的负载均衡的有一个问题是每次用bond的硬件地址广播ARP报文，那么其他节点发送的数据全部集中在一个slave上，处理ARP更新给其他所有节点的时候，每个节点会重新学习硬件地址，导致流量重新分配。当新加入一个slave或者一个非激活的slave重新激活的时候也会导致接收流量重新分配。接收流量负载是串行（轮转）的分配在bond的一组速率最高的slave上。当一个链路重连或者一个新的slave加入的时候，bond会重新初始化ARP Replies给所有的客户端。updelay参数的值必须等于或者大于交换机的forwarding delay，以免ARP Replies被交换机阻塞。
    先决条件：

    - 1.每个slave的基本驱动支持Ehtool获取速率状态。
    - 2. 基本驱动支持当设备打开时重新设置硬件地址。也要求每一个slave具有唯一的硬件地址。如果curr_active_slave失败，它的硬件地址被新选上的curr_active_slave硬件地址来替换。

##在CentOS上配置Bond0和Bond1：
首先要看linux是否支持bonding,RHEL4已经默认支持了.(大部分发行版都支持)
    # modinfo bonding
    filename:       /lib/modules/2.6.18-8.el5/kernel/drivers/net/bonding/bonding.ko
    author:         Thomas Davis, tadavis@lbl.gov and many others
    de.ion:    Ethernet Channel Bonding Driver, v3.0.3
    version:        3.0.3
    license:        GPL
    srcversion:     2547D22885C2FDF28EF7D98
如果有类似上面的信息输出,说明已经支持了.
###1、配置Bond 0 负载均衡
特点:

- 双网块同时工作,实现负载均衡,某一网卡不正常时,不会引发网络中断.
- 恢复不能正常工作的网卡时,会引发网络中断几秒,然后双网卡同时工作.
- 编辑虚拟网络接口配置文件,指定网卡IP 
        cp /etc/sysconfig/network-scripts/ifcfg-lo ifcfg-bond0
        vi  ifcfg-bond0
        DEVICE=bond0
        IPADDR=10.10.10.1
        NETMASK=255.255.255.0
        NETWORK=10.10.10.0
        BROADCAST=10.10.10.255
        ONBOOT=yes
        BOOTPROTO=none
        USERCTL=no
        GATEWAY=192.168.0.1

###2.在bond0上添加网关,是确保默认路由无故障
    [root@Linux ~]# route
    Kernel IP routing table
    Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
    10.0.0.0        *               255.255.255.0   U     0      0        0 bond0
    10.0.0.0        *               255.255.255.0   U     0      0        0 eth0
    10.0.0.0        *               255.255.255.0   U     0      0        0 eth1
    169.254.0.0     *               255.255.0.0     U     0      0        0 bond0
    default         10.0.0.1        0.0.0.0         UG    0      0        0 bond0

- 编辑网卡配置文件：
        vi  ifcfg-eth0
        DEVICE=eth0
        BOOTPROTO=none
        ONBOOT=yes
        USERCTL=no
        MASTER=bond0
        SLAVE=yes

-  编辑另外一块网卡配置文件：
        vi  ifcfg-eth1
        DEVICE=eth1
        BOOTPROTO=none
        ONBOOT=yes
        USERCTL=no
        MASTER=bond0
        SLAVE=yes

###3，编辑/etc/modprobe.conf 文件，
加入如下一行内容，以使系统在启动时加载bonding模块，对外虚拟网络接口设备为 bond0 
加入下列两行 

    alias bond0 bonding 
    options bond0 miimon=100 mode=0 
说明：
miimon是用来进行链路监测的。 比如:miimon=100，那么系统每100ms监测一次链路连接状态，如果有一条线路不通就转入另一条线路；
mode的值表示工作模式，他共有0，1,2,3四种模式，常用的为0,1两种。
   mode=0表示load balancing (round-robin)为负载均衡方式，两块网卡都工作。
   mode=1表示fault-tolerance (active-backup)提供冗余功能，工作方式是主备的工作方式,也就是说默认情况下只有一块网卡工作,另一块做备份. 
4 # vi /etc/rc.d/rc.local 
加入以下内容 
### 仅在热备模式下,eht0 eth1网卡的工作顺序.
ifenslave bond0 eth0 eth1 
到这时已经配置完毕重新启动机器.
重启会看见以下信息就表示配置成功了

    ................ 
    Bringing up interface bond0 OK 
    Bringing up interface eth0 OK 
    Bringing up interface eth1 OK

## 配置Bond 1 热备模式

特点:

- 1. 正在工作的网卡不正常后,切换到备用网卡,此时会中间几秒钟
- 2. 恢复不正常的网卡时,不会引发网络中断.
其他步骤一致，只在第3步骤，将mode设置成1即可.

            alias bond0 bonding 
            options bond0 miimon=100 mode=1