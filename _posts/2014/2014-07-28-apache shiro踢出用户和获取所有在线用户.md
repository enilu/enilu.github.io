---
layout: post
category : 随手记 
tags : [开源,java,apache,权限管理]
---

产品要求用户只能在同一个地方登录，如果之前在其他机器或者浏览器上登录，讲之前登录帐号踢出。applicationContext-shiro.xml配置：
在默认的shiro配置上增加如下配置(本文假设你已经使用过apache shiro，并且已经使用shiro成功实现登录功能）
<!--break-->

{% include JB/setup %}


    <bea id="sessionDAO" class="org.apache.shiro.session.mgt.eis.MemorySessionDAO"/>
    <bean id="sessionManager" class="org.apache.shiro.web.session.mgt.DefaultWebSessionManager">
        <property name="sessionDAO" ref="sessionDAO"/>
    </bean>
    <bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
        <property name="realm" ref="shiroDbRealm" />
        <property name="cacheManager" ref="shiroCacheManager" />
        <property name="sessionManager" ref="sessionManager" />
    </bean>

然后在ShiroDbRealm中的认证方法中增加如下代码，代码主要目的就是根据当前登录名获取之前使用同样登录名登录后的session

    
    @Autowired
    
    private SessionDAO sessionDAO;
     {
        ...
    
        String loginName=token.getUsername();
        Session currentSession = null;
        Collection sessions = sessionDAO.getActiveSessions();
    
        for(Session session:sessions){
            if(loginName.equals(String.valueOf(session.getAttribute(DefaultSubjectContext.PRINCIPALS_SESSION_KEY))) {
                session.setTimeout(0);//设置session立即失效，即将其踢出系统
                break;
            }
        }
    }
    

apache shiro获取所有在线用户：

    
    Collection sessions = sessionDAO.getActiveSessions();
    
    for(Session session:sessions){
        System.out.println("登录ip:"+session.getHost());
        System.out.println("登录用户"+session.getAttribute(DefaultWebContext.PRINCIPALS_SESSION_KEY));
        System.out.println("最后操作日期:"+session.getLastAccessTime());
    }
    
