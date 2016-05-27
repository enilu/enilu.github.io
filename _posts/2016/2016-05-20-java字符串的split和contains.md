---
layout: post
category : 学习笔记 
keywords : "java基础,字符串处理"
description : "java基础字串处理日常"
tags : [java基础]
---

java中的字符串api String 类有封装了很多针对字符串操作的功能；不同的函数接收参数是不一样的，有的接收字符串参数，有的接收正则表达式参数。
之前用的时候没有注意这块，导致偶尔会出现一些问题。

<!--break-->

{% include JB/setup %}



比如下面这段代码：


    public class Test {
        public static  void main(String[] args){
            String src = "aaa.add.d";
            System.out.println(src.contains("."));
            System.out.println(src.split(".").length);
    
            String src2 = "aaa-add-d";
            System.out.println(src2.contains("-"));
            System.out.println(src2.split("-").length);
        }
    }

输出结果为：
    
    true
    0   //按照预想的这里应该输出3
    true
    3
    
其实原因很简单:contains 方法的参数是CharSequence的实现类（包括了String,StringBuffer等），而split方法的参数是正则表达式；而 . 表示任意字符的正则，所以结果显而易见了。

这里列下以正则表达式为参数的方法，备忘：

    matches()
    replaceAll()
    replaceFirst()
    split()


要注意replace的参数是字符串，避免与reaplceAll和replaceFist混淆。

另外自己以前也容易将endsWith 和startWith两个方法的参数类型误以为是可以传正则的。

