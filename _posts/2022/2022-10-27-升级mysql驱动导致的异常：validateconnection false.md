---
layout: post
category : 数据库
keywords : "mysql,java"
description: "记录升级 MySQL JDBC 驱动后的连接校验异常，并区分环境恢复结果与兼容性结论。"
tags : [java,mysql]
lang: zh-CN
translation_key: mysql-driver-upgrade-connection-validation
---

一次漏洞扫描后，项目需要升级 MySQL 的 Java 驱动。我将 `mysql-connector-java` 从 5.1.24 调整到 8.0.28，随后遇到 `java.sql.SQLException: validateConnection false`。

当时将 Druid 调整为 1.2.12 后，连接恢复正常。不过，恢复结果并不能单独证明故障根因，更不能据此归纳出一张通用的版本兼容表。
<!--break-->

{% include JB/setup %}

## 当时改了什么

驱动依赖由 5.1.24 升级到 8.0.28：

```xml
<!-- 本次升级使用的版本。 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>
```

升级后连接校验失败。经过调整，最终使用 Druid 1.2.12 时连接恢复。这次处理恢复了连接，但没有进一步定位到具体的失败机制，因此需要把恢复结果与根因判断分开。

## validateConnection false 说明什么

查看 Druid 1.2.12 的 `DruidAbstractDataSource.validateConnection`，当配置了 `validConnectionChecker`，而检查器返回失败时，会抛出 `validateConnection false`。部分异常路径还会附带原因。

所以，这条信息能告诉我们连接有效性检查没有通过，但不能直接告诉我们“驱动和连接池版本不兼容”。需要结合检查器实现、完整异常链和运行配置继续定位。排查其他版本时，还需要查看对应版本的实现。

## Provided Dependencies 不是兼容性矩阵

查找版本信息时，依赖网站上的 “Provided Dependencies” 容易被误认为是兼容版本列表。要理解它的含义，应该回到项目的 POM 和 Maven 的依赖作用范围。

Druid 1.2.12 对应的官方 POM 中声明的是：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.21</version>
    <scope>provided</scope>
</dependency>
```

`provided` 描述 Maven 依赖的作用范围，并不是“经过认证的兼容版本范围”。它也不会把这个驱动作为普通传递依赖带入使用 Druid 的项目。声明了一个版本，不代表只支持这个版本；网站展示了另一个版本，也不能证明中间所有版本都兼容。

## 按照连接创建和校验路径排查

| 检查项 | 需要回答的问题 |
|---|---|
| 实际运行依赖 | 打包和运行时到底加载了哪个驱动、哪个连接池版本，是否存在重复依赖？ |
| 环境 | JDK、MySQL 服务端、JDBC URL 和连接校验配置分别是什么？ |
| 异常链 | 最底层异常是什么，是否有 SQLState、错误码或其他日志？ |
| 最小连接测试 | 使用同一运行环境和连接参数，直接 JDBC 连接是否能成功？ |
| 对照验证 | 保持其他条件一致，分别改变驱动和连接池版本，结果是否稳定复现？ |
| 回归验证 | 重启、借还连接和空闲后再次借连接等场景是否正常？ |

例如，可以先查看 Maven 解析出的相关依赖，再确认它们是否与实际运行包一致：

```text
mvn dependency:tree -Dincludes=mysql:mysql-connector-java,com.mysql:mysql-connector-j,com.alibaba:druid
```

直接 JDBC 测试可以帮助缩小范围，但即使成功，也不能排除只在连接池校验路径才出现的问题。更新依赖后，应在实际配置下验证关键业务和连接生命周期，而不是只看应用能否启动。

## 升级完成后，验证完整的连接生命周期

这次使用 Druid 1.2.12 后恢复连接，为解决项目中的问题提供了一个落点。不过，应用能启动只是第一步，还需要确认连接创建、校验、复用和异常恢复符合预期。

依赖升级涉及驱动、连接池和服务端的协作。保存完整环境与异常，通过最小用例缩小范围，再做对照与回归验证，比寻找一组看起来匹配的版本号更可靠。

## 参考资料

- [Druid 1.2.12：连接校验实现](https://github.com/alibaba/druid/blob/1.2.12/src/main/java/com/alibaba/druid/pool/DruidAbstractDataSource.java)
- [Druid 1.2.12：POM](https://github.com/alibaba/druid/blob/1.2.12/pom.xml)
- [Maven：依赖机制与作用范围](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
