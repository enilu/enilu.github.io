---
layout: post
category : 入门教程 
tags : [linux,运维,java]
---

监控软件在事件配置公式中使用了BeanShell，那么这玩意儿是啥？能干嘛？为什么在这里用呢？让我们一起来拨开她的外衣，好好瞅瞅吧。
<!--break-->

{% include JB/setup %}

首先简介一下下BeanShell,
     
- BeanShell是一种完全符合Java语法规范的脚本语言,并且又拥有自己的一些语法和方法;
- BeanShell是一种松散类型的脚本语言(这点和JS类似)
- BeanShell是用Java写成的,一个小型的、免费的、可以下载的、嵌入式的Java源代码解释器,
- 具有对象脚本语言特性,非常精简的解释器jar文件大小为175k。
- BeanShell执行标准Java语句和表达式,另外包括一些脚本命令和语法。

说白了，把BeanShell 理解为一种脚本语言，这个语言具备这样的特性：java可以很方便的用它，它可以很方便的用java。

举个栗子：

   -java调用BeanShell:
        步骤一：写一个BeanShell脚本d:\test.bsh:
                 print("hello,input Value is: "+inValue);
         outValue = inValue+1;
        步骤二：再写一个java文件来调用上面的test.bsh：
        import bsh.Interpreter;
        public class TestBeanShell {
             public static void main(String[] args) {
                
                 try {
                     Interpreter interpreter = new Interpreter();
                     interpreter.set("inValue", new Integer(1));
                     interpreter.source("/E:/proj/eclipsews/javasedemo/src/opensource/beanshell/test.bsh");
                     System.out.println(((Integer) interpreter.get("outValue")).intValue());
                 } catch (Exception e) {
                     e.printStackTrace();
                 } 
             }
         }
        步骤三：运行上面java类，结果是：
         hello,input Value is: 1
    - BeanShell  调用java:
        看过hold住姐的一秒钟变格格么？我们一秒钟让BeanShell调用java：
        更改test.sh内容为：
         System.out.println ("hello,input Value is: "+inValue); 
            outValue = inValue+1;
     看到么？ System.out.println();这里直接在shell脚本中使用java程序了？


为嘛要用这厮：
    先看看别人为嘛用：
    
    每一种脚本语言都有它的使用场景,而正是因为其在某些场景的使用而使语言本身得到了发扬光大,
    比如Ruby正是因为Ruby On Rails这个Web框架的流行而得到开发者的关注,Groovy也一样;
    BeanShell可不能再有Web框架,Java世界的Web框架已经太多了,够让人头痛的了;
    BeanShell是Java语法,所以对Java开发者来说,很快就可以上手,
    BeanShell不能像Ruby,Perl,Ruby一样可以占据一个系统的主体,
    而只能在一些小的地方发挥"螺丝钉"的作用。
    
    笔者与BeanShell结缘是通过一个开源工作流引擎-OBE(这个鸟东西现在好像没什么声音了),
    BeanShell被用作流程跳转的Parser,举个例子,比如一个流程A节点的下一个节点是B或者C,
    如何决定A->B还是A->C呢,我们可以写一段Java脚本放在流程定义里面,
    一旦A运行完毕,流程会使用BeanShell来Parse这段Java脚本,
    根据脚本的返回值决定流程下一步的运行方向,
    脚本在这里虽然用得不多,但是却是非常的重要,
    我们知道,简单的表达式是远远满足不了流程跳转的判断的,
    有了脚本就可以满足任何不规则的业务逻辑。
    
    继以上说到的,使用BeanShell可以处理现实中不规则的业务,举个很典型的例子,
    我们知道,一个保险公司有很多险种,每个险种的投入和收益的算法是很复杂的,
    无法用规则的关系数据库模型来描述,所以很多保险系统在处理险种的算法都是硬编码,
    如果要在系统中新加一个险种,是非常麻烦的,重新修改代码,重新发布,
    这对开发\维护人员和客户都是很痛苦的,有了BeanShell,我们可以从这种痛苦中解脱出来,
    对每个险种使用不同的脚本,新加的险种我们新配一个脚本,这样既可以满足业务多变的要求,
    又可以减少工作量,节约成本。
    
    BeanShell的一个特点是动态执行Java代码,脚本文件改变不会影响当前脚本的调用,
    新脚本将在脚本的下一次调用生效,这不同于配置文件,配置文件改变一般都需要应用重启。

我来说说我们为嘛用：
监控软件中有一个东东叫做事件，即，将采集到的值配置指定的阈值，当采集值超过这个阈值的就要产生异常事件；
呃。。。你抬杠了：超过？不就是一个大于或小于的判断么？要BeanShell作甚？
 不好意思，我没说全，举几个例子说明这里事件生成的条件：
 假设：采集值：a(数字），b(数字），c(数字），d（字符串）；
    
 规则要求：
    
        当a>80的时候产生事件
        当a-b>50的时候产生事件
        当((（a-b）+100)+c*2)/100>20的时候产生事件
        当((（a-b）+100)+c*2)/动态传入的参数>10的时候产生事件
        当d.equals("否")的时候产生事件
        当d中包含"你XX"的的时候产生事件
        当。。。。
更多当当当的时候，怎么办，写java代码处理么？显然不合适，这时候肿么办呢？
办法就是：把上面一个个条件写成bsh脚本配置到数据库里面，需要的时候拿到这个脚本，交给BeanShell执行即可，而且这个BeanShell支持你用java往里面传参数。



