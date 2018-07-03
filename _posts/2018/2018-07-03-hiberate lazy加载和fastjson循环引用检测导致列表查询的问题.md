---
layout: post
category : 问题集锦 
keywords : "fastjson,延迟加载,循环引用检测"
description : "hiberate lazy加载和fast json 循环引用检测导致列表查询的问题"
tags : [fastjson,hibernate,java]
---

做分页查询的时候，发现外键关联的数据查询不出来，而且比较诡异的时候一个列表中，前面记录关联的记录可以正常出来，后面记录的关联数据出不来，debug发现返回的数据后面的出现：{"$ref":"$.rows[2]"} 的情况

<!--break-->

{% include JB/setup %}


问题复现：

实体类做关联的时候使用了延迟加载，例如：

```java
@Data
@Table(name = "t_test")
@Entity
public class TestBean   implements Serializable {
    @Id
    private Long id;
    @Column(name = "id_org", columnDefinition = "bigint COMMENT '机构id'")
    private Long idOrg;
    @JoinColumn(name="id_org",referencedColumnName = "id",columnDefinition = "bigint COMMENT '机构id'",insertable = false,updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Org org;
    @Column(name = "amount", columnDefinition = "varchar(20) COMMENT '总金额'")
    private String amount;

}
```

查询TestBean列表的时候页面通过org.name 获取机构名称

假如有两条记录的idOrg相同，那么第一条记录的org可以正常获取，而第二条记录的org返回为："org":{"$ref":"$.rows[2].org"}

完整json数据记录如下：

```json
	{
			"amount":"500",
			"id":"1",
			"idOrg":"1",
			"org":{
				"id":"1",
				"name":"XX教育公司",
			}
		},
		{
			"amount":"111",
			"id":"5",
			"idOrg":"1",
			"org":{"$ref":"$.rows[2].org"},
		}
```

出现上述问题的原因在于:
后台处理hibernate 延迟加载(lazy)的数据的时候时，它交给了Javassist处理，这时fastjson.会把它当对象处理，而不会解析它。

处理办法有两种，一种是不使用延迟加载，采用EAGER方式：

```java
    @JoinColumn(name="id_org",referencedColumnName = "id",columnDefinition = "bigint COMMENT '机构id'",insertable = false,updatable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Org org;
```

当然上述方法是下策。更好的方式是关闭fastjson的循环引用检测功能：
JSON.toJSONString(obj, SerializerFeature.DisableCircularReferenceDetect)

我们在项目中做了fastjson的全局配置，具体更改如下：

```java
@Configuration("defaultFastjsonConfig")
@ConditionalOnClass(com.alibaba.fastjson.JSON.class)
@ConditionalOnMissingBean(FastJsonHttpMessageConverter.class)
@ConditionalOnWebApplication
public class DefaultFastjsonConfig {

    @Bean
    public FastJsonHttpMessageConverter fastJsonHttpMessageConverter() {
        FastJsonHttpMessageConverter converter = new FastJsonHttpMessageConverter();
        converter.setFastJsonConfig(fastjsonConfig());
        converter.setSupportedMediaTypes(getSupportedMediaType());
        return converter;
    }

    /**
     * fastjson的配置
     */
    public FastJsonConfig fastjsonConfig() {
        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setSerializerFeatures(
                SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteEnumUsingToString,
				        //关闭循环应用检测
                SerializerFeature.DisableCircularReferenceDetect
        );
        fastJsonConfig.setDateFormat("yyyy-MM-dd HH:mm:ss");
        ValueFilter valueFilter = new ValueFilter() {
            public Object process(Object o, String s, Object o1) {
                if (null == o1) {
                    o1 = "";
                }
                return o1;
            }
        };
        fastJsonConfig.setCharset(Charset.forName("utf-8"));
        fastJsonConfig.setSerializeFilters(valueFilter);

        //解决Long转json精度丢失的问题
        SerializeConfig serializeConfig = SerializeConfig.globalInstance;
        serializeConfig.put(BigInteger.class, ToStringSerializer.instance);
        serializeConfig.put(Long.class, ToStringSerializer.instance);
        serializeConfig.put(Long.TYPE, ToStringSerializer.instance);
        fastJsonConfig.setSerializeConfig(serializeConfig);
        return fastJsonConfig;
    }

    /**
     * 支持的mediaType类型
     */
    public List<MediaType> getSupportedMediaType() {
        ArrayList<MediaType> mediaTypes = new ArrayList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        return mediaTypes;
    }

}

```