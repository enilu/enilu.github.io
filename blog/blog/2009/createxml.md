
java生成xml数据的一点困惑

    博客分类： java 

XMLJavaAjaxBeanF#

由于之前页面用的是ajax请求数据，后来想在页面再添加一个表格数据的时候也打算继续用这种方式：ajax提交后台组长xml数据返回，回调函数中用js解析xml生成表格。困惑来了，组装xml的时候本来我是这么做的：用一个StringBuilder然后一个一个节点在后面追加。最后用PrinterWriter将这个StringBuilder对象输出。写完之后觉得页面比较乱，如下，代码具体内容大伙不必关注，只看下大致情形即可：
Java代码  收藏代码

    StringBuilder baseinfo = new StringBuilder("<?xml version='1.0' encoding='gb2312'?>");  
            baseinfo.append("<totaltable>");  
            baseinfo.append("<basetable>");  
            //cpu使用信息  
            baseinfo.append("<baseinfo name='CPU'>");  
            baseinfo.append("<total>"+host.getCpufreq()+"</total>");          
            double totalcpu = Double.parseDouble(host.getCpufreq().replace("G Hz", ""));  
            double used = totalcpu*(Double.parseDouble(winbase.getCpuusage())/100);  
            baseinfo.append("<used>"+nbf.format(used)+"GHz</used>");  
            baseinfo.append("<usedpercent>"+winbase.getCpuusage()+"%</usedpercent>");  
            baseinfo.append("</baseinfo>");  
            //物理内存占用信息  
            baseinfo.append("<baseinfo name='内存'>");  
            baseinfo.append("<total>"+host.getTotalmem()+"</total>");          
              
            double memused = (Double.parseDouble(winbase.getTotalphys())-(Double.parseDouble(winbase.getAvailphys())));  
            nbf.setMaximumFractionDigits(2);//设置最大保留两位小数     
           
            baseinfo.append("<used>"+nbf.format(memused/(1024*1024))+"MB</used>");  
            baseinfo.append("<usedpercent>"+winbase.getMemoryload()+"%</usedpercent>");  
            baseinfo.append("</baseinfo>");  
            //虚拟内存信息  
            double totalvirtual = Double.parseDouble(winbase.getTotalvirtual());  
            baseinfo.append("<baseinfo name='交换空间'>");  
            baseinfo.append("<total>"+nbf.format(totalvirtual/1024/1024)+"MB</total>");       
           
            double swapused =  Double.parseDouble(winbase.getTotalvirtual())-(Double.parseDouble(winbase.getAvailvirtual()));  
            baseinfo.append("<used>"+nbf.format(swapused/1024/1024)+"MB</used>");  
            baseinfo.append("<usedpercent>"+ nbf.format(swapused/totalvirtual)+"%</usedpercent>");  
            baseinfo.append("</baseinfo>");  
            baseinfo.append("</basetable>");  
            //磁盘使用率信息  
            baseinfo.append("<disktable>");  
               
              
            Hostdiskinfo disk = (Hostdiskinfo) disks.get(0);  
            String[] diskinfos = disk.getHdiskinfo().split(";");  
       
            for(int i=0;i<diskinfos.length;i++){  
                String tmp[] = diskinfos[i].split(",");  
                double diskused = Double.parseDouble(tmp[1]);  
                double free = 100.0-diskused;  
               
                baseinfo.append("<disk name='"+tmp[0]+"'>");  
                baseinfo.append("<used>"+nbf.format(diskused)+"%</used>");  
                baseinfo.append("<free>"+nbf.format(free)+"%</free>");  
                baseinfo.append("<level>"+(diskused>70.0?"磁盘空间紧张":"磁盘空间富足")+"</level>");  
                baseinfo.append("</disk>");  
            }  
            baseinfo.append("</disktable>");  
            baseinfo.append("</totaltable>");  
              

 

最后生成的xml文件格式如下：
Xml代码  收藏代码

    <?xml version='1.0' encoding='gb2312'?>  
    <totaltable>  
        <basetable>  
            <baseinfo name='CPU'>  
                <total>1.6G Hz</total>  
                <used>0.083GHz</used>  
                <usedpercent>5.2%</usedpercent>  
            </baseinfo>  
            <baseinfo name='内存'>  
                <total>2038MB</total>  
                <used>1,304.57MB</used>  
                <usedpercent>64%</usedpercent>  
            </baseinfo>  
            <baseinfo name='交换空间'>  
                <total>2,047.88MB</total>  
                <used>157.79MB</used>  
                <usedpercent>0.08%</usedpercent>  
            </baseinfo>  
        </basetable>  
        <disktable>  
            <disk name='C:'>  
                <used>40.2%</used>  
                <free>59.8%</free>  
                <level>磁盘空间富足</level>  
            </disk>  
            <disk name='D:'>  
                <used>87.6%</used>  
                <free>12.4%</free>  
                <level>磁盘空间紧张</level>  
            </disk>  
            <disk name='E:'>  
                <used>67.4%</used>  
                <free>32.6%</free>  
                <level>磁盘空间富足</level>  
            </disk>  
            <disk name='F:'>  
                <used>58.2%</used>  
                <free>41.8%</free>  
                <level>磁盘空间富足</level>  
            </disk>  
        </disktable>  
    </totaltable>  

 

 今天看到别人用extjs的时候用到xstream直接将java对象转换为xml数据，就想这里是否也可以这样用；

       首先上面这个xml中的数据不是一个类中获得的，那么肯定需要在根据该xml数据格式再定义一个java bean，然后根据业务逻辑将合适的值设置到这个java bean中，再转换。 不知道这么做有没有必要？因为看这满眼的sbinfo.append(".....")感觉很乱。

      不知道大伙一般做类似的工作的时候，是直接手动组装xml呢，还是用类似XStream这样的直接将java bean转换为xml的工具，如果都有的，那么使用各自不同的方法的依据是什么。
