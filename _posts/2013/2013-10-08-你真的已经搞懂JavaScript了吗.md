---
layout: post
category : 前端 
tags : [linux,运维,java]
---

（转载），猛戳[查看原文](http://144.dragonparking.com/?site=julying.com&t=1448548406&s=d942dfed3e78bfdc8a603b1334a506d8) 引原文：昨天在著名前端架构师Baranovskiy的博客中看到一个帖子《So, you think you know JavaScript?》
<!--break-->

{% include JB/setup %}

 
 

题目一：

    if (!("a" in window)) {
        var a = 1;
    }
    alert(a);

 

题目二：

    var a = 1,
    b = function a(x) {
        x && a(--x);
    };
    alert(a);

 

题目三：

    function a(x) {
        return x * 2;
    }
    var a;
    alert(a);

 

题目四：

    function b(x, y, a) {
        arguments[2] = 10;
        alert(a);
    }
    b(1, 2, 3);

 

题目五：

    function a() {
        alert(this);
    }
    a.call(null);

请不要借助任何帮助工具，心算答案。答案在下面。
 

答案：
题目1

    if (!("a" in window)) {
        var a = 1;
    }
    alert(a);

代码含义：如果window不包含属性a，就声明一个变量a，然后赋值为1。

你可能认为alert出来的结果是1，然后实际结果是“undefined”。要了解为什么，需要知道JavaScript里的3个概念。

首先，所有的全局变量都是window的属性，语句 var a = 1;等价于window.a = 1; 你可以用如下方式来检测全局变量是否声明：

"变量名称" in window

第二，所有的变量声明都在范围作用域的顶部，看一下相似的例子：

    alert("a" in window);
    var a;

此时，尽管声明是在alert之后，alert弹出的依然是true，这是因为JavaScript引擎首先会扫墓所有的变量声明，然后将这些变量声明移动到顶部，最终的代码效果是这样的：

    var a;
    alert("a" in window);

这样看起来就很容易解释为什么alert结果是true了。

第三，你需要理解该题目的意思是，变量声明被提前了，但变量赋值没有，因为这行代码包括了变量声明和变量赋值。

你可以将语句拆分为如下代码：

    var a;    //声明
    a = 1;    //初始化赋值

当变量声明和赋值在一起用的时候，JavaScript引擎会自动将它分为两部以便将变量声明提前，不将赋值的步骤提前是因为他有可能影响代码执行出不可预期的结果。

所以，知道了这些概念以后，重新回头看一下题目的代码，其实就等价于：

    var a;
    if (!("a" in window)) {
        a = 1;
    }
    alert(a);

这样，题目的意思就非常清楚了：首先声明a，然后判断a是否在存在，如果不存在就赋值为1，很明显a永远在window里存在，这个赋值语句永远不会执行，所以结果是undefined。

提前这个词语显得有点迷惑了，你可以理解为：预编译。

 
题目2

    var a = 1,
    b = function a(x) {
        x && a(--x);
    };
    alert(a);

这个题目看起来比实际复杂，alert的结果是1；这里依然有3个重要的概念需要我们知道。

首先，在题目1里我们知道了变量声明在进入执行上下文就完成了；第二个概念就是函数声明也是提前的，所有的函数声明都在执行代码之前都已经完成了声明，和变

量声明一样。澄清一下，函数声明是如下这样的代码：

    function functionName(arg1, arg2){
        //函数体
    }

如下不是函数，而是函数表达式，相当于变量赋值：

    var functionName = function(arg1, arg2){
        //函数体
    };

澄清一下，函数表达式没有提前，就相当于平时的变量赋值。

第三需要知道的是，函数声明会覆盖变量声明，但不会覆盖变量赋值，为了解释这个，我们来看一个例子：

    function value(){
        return 1;
    }
    var value;
    alert(typeof value);    //"function"

尽快变量声明在下面定义，但是变量value依然是function，也就是说这种情况下，函数声明的优先级高于变量声明的优先级，但如果该变量value赋值了，那结果就完全不一样了：

    function value(){
        return 1;
    }
    var value = 1;
    alert(typeof value);    //"number"

该value赋值以后，变量赋值初始化就覆盖了函数声明。

重新回到题目，这个函数其实是一个有名函数表达式，函数表达式不像函数声明一样可以覆盖变量声明，但你可以注意到，变量b是包含了该函数表达式，而该函数表达式的名字是a；不同的浏览器对a这个名词处理有点不一样，在IE里，会将a认为函数声明，所以它被变量初始化覆盖了，就是说如果调用a(–x)的话就会出错，而其它浏览器在允许在函数内部调用a(–x)，因为这时候a在函数外面依然是数字。基本上，IE里调用b(2)的时候会出错，但其它浏览器则返回undefined。

理解上述内容之后，该题目换成一个更准确和更容易理解的代码应该像这样：

    var a = 1,
    b = function(x) {
        x && b(--x);
    };
    alert(a);

这样的话，就很清晰地知道为什么alert的总是1了。

 
题目3

    function a() {
        return 1 ;
    }
    var a;
    alert(a);

这个题目比较简单：即函数声明和变量声明的关系和影响，遇到同名的函数声明，不会重新定义

 
题目4

    function b(x, y, a) {
        arguments[2] = 10;
        alert(a);
    }
    b(1, 2, 3);

关于这个题目，ECMAsCRIPT 262-3的规范有解释的。

活动对象是在进入函数上下文时刻被创建的，它通过函数的arguments属性初始化。arguments属性的值是Arguments对象.

关于 Arguments对象的具体定义，看这里：ECMAScript arguments 对象

 
题目5

    function a() {
        alert(this);
    }
    a.call(null);

这个题目可以说是最简单的，也是最诡异的！关于这个题目，我们先来了解2个概念。

这个问题主要考察 Javascript 的 this 关键字，具体看这里：

关于Javascript语言中this关键字的用法

 

关于 a.call(null);  根据ECMAScript262规范规定：如果第一个参数传入的对象调用者是null或者undefined的话，call方法将把全局对象（也就是window）作为this的值。所以，不管你什么时候传入null，其this都是全局对象window，所以该题目可以理解成如下代码：

    function a() {
        alert(this);
    }
    a.call(window);

所以弹出的结果是[object Window]就很容易理解了。

  
总结：

这5个题目虽然貌似有点偏，但实际上考察的依然是基本概念，只有熟知了这些基本概念才能写出高质量代码。