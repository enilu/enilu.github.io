---
layout: post
category : Spring Boot 
keywords : "Spring Boot,Validator,数据校验,开源项目"
description : "在Spring Boot项目中使用数据校验Validator功能"
tags : [SpringBoot,java]
---

在web项目中经常要对用户输入的信息做校验。通常的做法是在前端使用js做初步的验证，
然后在后端再做进一步校验。本文会简单介绍在Spring Boot项目中使用hibernate-validator做后端数据校验的做法。 
<!--break-->

{% include JB/setup %}



首先在Spring Boot项目中，默认使用了hibernate做数据持久层，所以默认情况下hibernate-validator已经被引入项目了。

此时只需要在对应的地方添加注解和少量代码即可：


## 实体类

在实体类中对应的字段添加验证注解：

```java

@Entity(name="t_message_template")
@Table(appliesTo = "t_message_template",comment = "消息模板")
public class MessageTemplate extends BaseEntity {
    @Column(name="code",columnDefinition = "VARCHAR(32) COMMENT '编号'")
    @NotBlank(message = "编号不能为空")
    private String code;
    @NotBlank(message = "内容并能为空")
    @Column(name="content",columnDefinition = "TEXT COMMENT '内容'")
    private String content;
    @Column(name="id_message_sender",columnDefinition = "BIGINT COMMENT '发送者id'")
    @NotNull(message = "发送器不能为空")
    private Long idMessageSender; 
    @Min(18)
    private Integer age;
    @Pattern(regexp = "^1(3|4|5|7|8)\\d{9}$",message = "手机号码格式错误")
    @NotBlank(message = "手机号码不能为空")
    private String phone;
    @Email(message = "邮箱格式错误")
    private String email;
    ....
}
```

- 上述中针对字符串类型的数据，我们使用不能为空的验证@NotBlank,该注解标识该字段不能为null或者空字符串。
- 针对idMessageSender，则使用了@NotNull来验证；由于@NotBlank是针对字符串做验证，所以针对idMessageSender不能使用它，否则会报异常，下面列举更多常用注解：
 

## controller

在提交数据的方法中，需要使用@Valid来标识验证该类中的字段输入的合法性，BindingResult来获取校验结果，使用：

```java
    @RequestMapping(method = RequestMethod.POST)
    @BussinessLog(value = "编辑消息模板", key = "name", dict = CommonDict.class)
    @RequiresPermissions(value = {Permission.MSG_TPL_EDIT})
    public Object save(@ModelAttribute @Valid MessageTemplate tMessageTemplate,
    BindingResult bindingResult ) {
        if(bindingResult.hasErrors()){
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                //...
            }
            return "fail";
        }
        messagetemplateService.saveOrUpdate(tMessageTemplate);
        return "success";
    }
```

**常见的校验类型如下：**

- JSR提供的校验注解（javax.validation.constraints包下）如下：
```
@Null   被注释的元素必须为 null    
@NotNull    被注释的元素必须不为 null    
@AssertTrue     被注释的元素必须为 true    
@AssertFalse    被注释的元素必须为 false    
@Min(value)     被注释的元素必须是一个数字，其值必须大于等于指定的最小值    
@Max(value)     被注释的元素必须是一个数字，其值必须小于等于指定的最大值    
@DecimalMin(value)  被注释的元素必须是一个数字，其值必须大于等于指定的最小值    
@DecimalMax(value)  被注释的元素必须是一个数字，其值必须小于等于指定的最大值    
@Size(max=, min=)   被注释的元素的大小必须在指定的范围内    
@Digits (integer, fraction)     被注释的元素必须是一个数字，其值必须在可接受的范围内    
@Past   被注释的元素必须是一个过去的日期    
@Future     被注释的元素必须是一个将来的日期    
@Pattern(regex=,flag=)  被注释的元素必须符合指定的正则表达式
```
 
- hibernate提供的校验注解(org.hibernate.validator.constraints包下)如下：
 ```
@NotBlank(message =)   验证字符串非null，且长度必须大于0    
@Email  被注释的元素必须是电子邮箱地址    
@Length(min=,max=)  被注释的字符串的大小必须在指定的范围内    
@NotEmpty   被注释的字符串的必须非空    
@Range(min=,max=,message=)  被注释的元素必须在合适的范围内
 ```