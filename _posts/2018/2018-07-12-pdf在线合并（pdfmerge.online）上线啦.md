---
layout: post
category : 开源项目 
keywords : "pdf merge online,pdf merge,pdf合并"
description : "好用的pdf在线合并工具"
tags : [itext,java,web]
---

pdf merge online 
在线pdf合并上线啦
做这个网站的起源是之前在开一个网络课程，每节课都有一个pdf课件。想合并成一个看起来方便些，
于是网上找一些在线的合并pdf工具，没有特别好用的，只好自己撸一个  戳这里试用[http://pdfmerge.online/](http://pdfmerge.online/)

<!--break-->

{% include JB/setup %}

刚开始用python做了一个，网上很多python合并pdf的例子，整理后下面这个可用

```python

# -*- coding:utf-8*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import fnmatch
import os
import os.path
from pyPdf import PdfFileReader,PdfFileWriter
import time
time1=time.time()


# 使用os模块walk函数，搜索出某目录下的全部pdf文件
######################获取同一个文件夹下的所有PDF文件名#######################
def getFileName(filepath):
    file_list = []
    for n in range(1,10):
        file_list.append(str(n)+'.pdf')

    return file_list


##########################合并同一个文件夹下所有PDF文件########################
def MergePDF(filepath,outfile):
    output=PdfFileWriter()
    outputPages=0
    pdf_fileName=getFileName(filepath)
    print pdf_fileName
    for each in pdf_fileName:
        # 读取源pdf文件
        input = PdfFileReader(file('/root/test/pdf/'+each, "rb"))

        # 如果pdf文件已经加密，必须首先解密才能使用pyPdf
        if input.isEncrypted == True:
            input.decrypt("map")

        # 获得源pdf文件中页面总数
        pageCount = input.getNumPages()
        outputPages += pageCount
        print pageCount

        # 分别将page添加到输出output中
        for iPage in range(0, pageCount):
            output.addPage(input.getPage(iPage))


    print "All Pages Number:"+str(outputPages)
    # 最后写pdf文件
    outputStream=file(filepath+outfile,"wb")
    output.write(outputStream)
    outputStream.close()
    print "finished"



if __name__ == '__main__':
    file_dir = r'/root/test/pdf/'
    out=u"out.pdf"
    MergePDF(file_dir,out)
    time2 = time.time()
    print u'总共耗时：' + str(time2 - time1) + 's'


```
 
 
 但是我想要的是一个在线的pdf合并工具，所以用spring boot搭建了一个，既然用了java，就不用python做pdf合并了。
 java方面itext对pdf的操作支持很丰富，自然少不了合并pdf，下面是合并pdf的核心代码

 ```java
public class PdfService {
    public static void main(String[] args) {
        Map<Integer,String> files = new HashMap();
        files.put(0,"e:\\1.pdf");
        files.put(1, "e:\\2.pdf");
        files.put(2, "e:\\3.pdf" );
        String savepath = "e:\\temp.pdf";

        new PdfService().mergePdfFiles(files, savepath);
    }

    public  boolean mergePdfFiles(Map<Integer,String> files, String newfile) {
        boolean retValue = false;
        Document document = null;
        try {
            document = new Document(new PdfReader(files.get(0)).getPageSize(1));
            PdfCopy copy = new PdfCopy(document, new FileOutputStream(newfile));
            document.open();
            for (int i = 0; i < files.size(); i++) {
                PdfReader reader = new PdfReader(files.get(i));
                int n = reader.getNumberOfPages();
                for (int j = 1; j <= n; j++) {
                    document.newPage();
                    PdfImportedPage page = copy.getImportedPage(reader, j);
                    copy.addPage(page);
                }
            }
            retValue = true;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            document.close();
        }
        return retValue;
    }
}

```