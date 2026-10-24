---
layout: post
category : java 
tags : [linux,运维,java]
description: "监控告警不总是“数值超过一个固定阈值”。有时需要组合多个采集值、比较字符串，甚至使用动态参数。BeanShell 可以嵌入 Java 应用执行脚本，适合用来理解这类可配置规则的实现思路。"
lang: zh-CN
translation_key: beanshell-monitoring-rules
---

监控告警不总是“数值超过一个固定阈值”。有时需要组合多个采集值、比较字符串，甚至使用动态参数。BeanShell 可以嵌入 Java 应用执行脚本，适合用来理解这类可配置规则的实现思路。
<!--break-->

{% include JB/setup %}

## 从 Java 传入参数并取得结果

下面引入 BeanShell 后即可执行，脚本使用类似 Java 的表达式：

```java
import bsh.Interpreter;

public class RuleExample {
    public static void main(String[] args) throws Exception {
        Interpreter interpreter = new Interpreter();
        interpreter.set("a", 85);
        interpreter.set("b", 20);
        Object result = interpreter.eval("a > 80 && a - b > 50");
        if (!(result instanceof Boolean)) {
            throw new IllegalStateException("Rule must return a boolean");
        }
        System.out.println(result); // true
    }
}
```

BeanShell 不是系统 shell，脚本里调用 Java 类也不等于在执行 bash。不同 BeanShell 版本支持的 Java 语法范围需要确认，不能保证任意新版本 Java 源码都能解释执行。

## 让规则输入输出稳定

给每个变量定义类型、单位、缺失值处理和合法范围。整数除法与小数除法不同，动态分母可能为零；字符串比较还要考虑 null。规则正常返回 false 与语法错误、运行异常应分成不同状态，否则配置错误会被当作“没有告警”。

规则保存时可以先用样例数据试算，启用后记录规则 ID、版本与执行结果，便于解释一次告警来自哪一组条件。

## 动态执行也有边界

脚本能够调用 Java 能力，就不应将它当成天然的安全沙箱。仅允许可信维护者配置，限制暴露对象，并给执行安排资源与超时管理；取消一个 Future 不能强制终止任意不响应中断的脚本。

并发请求不要无约束地共享一个带可变变量的 Interpreter。脚本变更何时生效取决于应用的读取、缓存和发布方式，保存文件不意味着所有运行中的实例会自动切换。简单规则也可以用受限表达式或显式策略实现，不必总是开放完整脚本。

参考：[BeanShell](https://beanshell.github.io/)。
