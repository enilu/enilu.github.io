---
layout: post
category : Spring Boot 
keywords : "Spring Boot,公共service,公共repository,开源项目"
description : " 在SpringBoot项目中我们经常会提取一些公共的方法封装起来，放到父类中；子类继承父类后复用这些方法，如果自己有特殊需要再写自己特有的方法。一般的web项目核心功能离不开对数据库数据的增删改查操作，因此封装公共的service和repository是很有必要的。"
tags : [SpringBoot,java]
---

 在SpringBoot项目中我们经常会提取一些公共的方法封装起来，放到父类中；子类继承父类后复用这些方法，如果自己有特殊需要再写自己特有的方法。
 一般的web项目核心功能离不开对数据库数据的增删改查操作，因此封装公共的service和repository是很有必要的。
 
 下面针对我们一个项目的封装过程做个总结
  
<!--break-->

{% include JB/setup %}

 
 ## 封装Repository
 - 基础Repository 除了继承Spring data jpa 中常用的Repository接口外，额外添加自己常用的方法：
 ```java
 @NoRepositoryBean
 public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID>
         , PagingAndSortingRepository<T, ID>
         , JpaSpecificationExecutor<T> {
     List<Object[]> queryBySql(String sql);
     List<T> query(String sql);
     Object getBySql(String sql);
     T get(String sql);
     int execute(String sql);
     Class<T> getDataClass();
 }
 ```
 - 由于该接口不纳入repository管理，所以应增加@NoRepositoryBean 注解来标识
 - 针对上述接口增加其实现类：BaseRepositoryImpl
 ```java
 public class BaseRepositoryImpl<T, ID extends Serializable>
         extends SimpleJpaRepository<T, ID>
         implements BaseRepository<T, ID> {
     private final EntityManager entityManager;
     private Class<T> klass;
 
 
     BaseRepositoryImpl(JpaEntityInformation<T, ID> entityInformation,
                        EntityManager entityManager) {
         super(entityInformation, entityManager);
         this.entityManager = entityManager;
         this.klass = (Class<T>) entityInformation.getJavaType();
     }
 
     @Override
     public List<Object[]> queryBySql(String sql) {
         return entityManager.createNativeQuery(sql).getResultList();
     }
 
     @Override
     public Object getBySql(String sql) {
         List list = entityManager.createNativeQuery(sql).getResultList();
         if(list.isEmpty()){
             return null;
         }
         return list.get(0);
     }
 
     @Override
     public T get(String sql) {
         List<T> list =  entityManager.createNativeQuery(sql,klass).getResultList();
         return list.get(0);
     }
 
     @Override
     public int execute(String sql) {
         return entityManager.createNativeQuery(sql).executeUpdate();
     }
 
     @Override
     public Class<T> getDataClass() {
         return klass;
     }
 
     @Override
     public List<T> query(String sql) {
         return entityManager.createNativeQuery(sql,klass).getResultList();
     }
 }
 ```
 - 建自定义RepositoryFactoryBean
     - 接下来我们来创建一个自定义的RepositoryFactoryBean来代替默认的RepositoryFactoryBean。
     - RepositoryFactoryBean负责返回一个RepositoryFactory，Spring Data Jpa 将使用RepositoryFactory来创建Repository具体实现，
     - 这里我们用BaseRepositoryImpl代替SimpleJpaRepository作为Repository接口的实现。这样我们就能够达到为所有Repository添加自定义方法的目的。
     ```java
     public class BaseRepositoryFactoryBean<JR extends JpaRepository<T, ID>, T, ID extends Serializable>
             extends JpaRepositoryFactoryBean<JR, T, ID> {
         public BaseRepositoryFactoryBean(Class<? extends JR> repositoryInterface) {
             super(repositoryInterface);
         }
     
         @Override
         protected RepositoryFactorySupport createRepositoryFactory(EntityManager entityManager) {
             return new BaseRepositoryFactory(entityManager);
         }
     
         private static class BaseRepositoryFactory<T, ID extends Serializable> extends JpaRepositoryFactory {
             private final EntityManager entityManager;
             public BaseRepositoryFactory(EntityManager entityManager) {
                 super(entityManager);
                 this.entityManager = entityManager;
             }
     
             @Override
             protected JpaRepositoryImplementation<?, ?> getTargetRepository(RepositoryInformation information, EntityManager entityManager) {
                 JpaEntityInformation<?, Serializable> entityInformation = this.getEntityInformation(information.getDomainType());
                 Object repository = this.getTargetRepositoryViaReflection(information, new Object[]{entityInformation, entityManager});
                 Assert.isInstanceOf(BaseRepositoryImpl.class, repository);
                 return (JpaRepositoryImplementation)repository;
             }
     
             @Override
             protected Class<?> getRepositoryBaseClass(RepositoryMetadata metadata) {
                 return BaseRepositoryImpl.class;
             }
         }
     }
     ```
 - 配置Jpa factory class
     - 由于我们实现了自定义的Repository Factory类，所以需要配置Jpa使用我们自定义的BaseRepositoryFactoryBean。
     - Spring支持使用标注进行配置，应在启动主类中添加标注@EnableJpaRepositories(repositoryFactoryBeanClass = BaseRepositoryFactoryBean.class),，例：
     ```java
     @SpringBootApplication   
     @EnableJpaRepositories(basePackages = "cn.enilu.flash.dao", repositoryFactoryBeanClass = BaseRepositoryFactoryBean.class)    
     public class ApiApplication extends SpringBootServletInitializer {
     
         public static void main(String[] args) {
             SpringApplication.run(ApiApplication.class);
         }
     }
     ```
 - 至此公共的Repository封装完毕，然后再自己的repository中继承BaseRepository即可使用封装的公共方法
 ```java
 public interface UserRepository extends BaseRepository<User,Long> {
 }
 
 ```
 
 
 ## 封装Service
 
 针对service，我们根据自己业务情况封装长用的增删改查方法即可，由于service涉及业务较多封装起来也比较复杂。总体步骤比较简单，只是具体的逻辑稍微复杂些，尤其涉及到复杂的查询，分页查询
 - 定义service接口，针对CRUD分别定义4中领域的接口
 - 实现service接口
 
 
 ### service接口定义
 
 这里我们针对CRUD分别定义四个接口：InsertService,DeleteService,UpdateService,SelectService,并且再定义一个CrudService来继承上面四个接口，具体代码如下：
 
 - InsertService
 
 ```java
 public interface InsertService<T, ID> {
 
     /**
      * 添加一条数据
      *
      * @param record 要添加的数据
      * @return 添加后生成的主键
      */
     T insert(T record);
 }
 
 ```
 - DeleteService
 ```java
 public interface DeleteService<ID> {
 
     /**
      * 根据主键删除记录
      *
      * @param id 主键
      */
     void delete(ID id);
 
     /**
      * 根据主键删除记录
      *
      * @param ids 主键集合
      */
     void delete(Iterable<ID> ids);
 
     /**
      * 清空表数据
      */
     void clear();
 }
 ```
 - UpdateService
 
 ```java
 public interface UpdateService <T, ID> {
     /**
      * 修改记录信息
      *
      * @param record 要修改的对象
      * @return 返回修改的记录
      */
     T update(T record);
     /**
      * 添加或修改记录
      * @param record 要添加或修改的对象
      * @return 返回添加或修改的记录
      */
     T saveOrUpdate(T record);
 }
 ```
 - SelectService
 
 ```java
 public interface SelectService <T, ID> {
 
     /**
      * 根据主键查询
      * @param id 主键
      * @return 查询结果,无结果时返回{@code null}
      */
     T get(ID id);
 
     /**
      * 根据多个主键查询
      * @param ids 主键集合
      * @return 查询结果,如果无结果返回空集合
      */
     List<T> query(Iterable<ID> ids);
 
     /**
      * 查询所有结果
      * @return 所有结果,如果无结果则返回空集合
      */
     List<T> queryAll();
 
     /**
      * 查询所有结果
      * @return 获取分页结果
      */
     Page<T> queryPage(Page<T> page);
 
     /**
      * 根据多个条件查询列表数据
      * @param filters
      * @return
      */
     List<T> queryAll(List<SearchFilter> filters);
 
     /**
      * 根据多个条件查询列表数据，并排序
      * @param filters
      * @param sort
      * @return
      */
     List<T> queryAll(List<SearchFilter> filters, Sort sort);
 
     /**
      * 根据的单个条件查询列表数据
      * @param filter
      * @return
      */
     List<T> queryAll(SearchFilter filter);
 
     /**
      * 根据的单个条件查询列表数据
      * @param filter
      * @param sort
      * @return
      */
     List<T> queryAll(SearchFilter filter,Sort sort);
 }
 
 ```
 
 -CurdService
 
 ```java
 public interface CrudService <T, ID> extends
         InsertService<T, ID>,
         UpdateService<T,ID>,
         DeleteService<ID>,
         SelectService<T, ID> {
 }
 ```
 
 ### 实现Service接口
 我们通过BaseService实现上述接口
 
 ```java
 
 public abstract  class BaseService<T, ID extends Serializable, R extends BaseRepository<T, ID>>
         implements CrudService<T, ID> {
     @Autowired
     private R dao;
 
 
     @Override
     public void delete(ID id) {
         dao.deleteById(id);
     }
 
     @Override
     public void delete(Iterable<ID> ids) {
         Iterator<ID> iterator = ids.iterator();
         while (iterator.hasNext()) {
             ID id = iterator.next();
             dao.deleteById(id);
         }
     }
 
     @Override
     public T insert(T record) {
         return dao.save(record);
     }
 
     @Override
     public T get(ID id) {
         return  dao.getOne(id);
     }
 
     @Override
     public List<T> query(Iterable<ID> ids) {
         return dao.findAllById(ids);
     }
 
     @Override
     public List<T> queryAll() {
         return dao.findAll();
     }
 
     @Override
     public Page<T> queryPage(Page<T> page) {
         Pageable pageable = null;
         if(page.isOpenSort()) {
             pageable = new PageRequest(page.getCurrent()-1, page.getSize(), page.isAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, page.getOrderByField());
         }else{
             pageable = new PageRequest(page.getCurrent()-1,page.getSize(), Sort.Direction.DESC,"id");
         }
         Specification<T> specification = DynamicSpecifications.bySearchFilter(page.getFilters(),dao.getDataClass());
         org.springframework.data.domain.Page<T> pageResult  = dao.findAll(specification,pageable);
         page.setTotal(Integer.valueOf(pageResult.getTotalElements()+""));
         page.setRecords(pageResult.getContent());
         return page;
     }
 
     @Override
     public List<T> queryAll(List<SearchFilter> filters) {
         return queryAll(filters,null);
     }
 
     @Override
     public List<T> queryAll(SearchFilter filter) {
         return queryAll(filter,null);
     }
 
     @Override
     public List<T> queryAll(List<SearchFilter> filters, Sort sort) {
         Specification<T> specification = DynamicSpecifications.bySearchFilter(filters,dao.getDataClass());
         if(sort==null){
             return dao.findAll(specification);
         }
         return dao.findAll(specification,sort);
     }
 
     @Override
     public List<T> queryAll(SearchFilter filter, Sort sort) {
         return queryAll(Lists.newArrayList(filter),sort);
     }
 
     @Override
     public T update(T record) {
         return dao.save(record);
     }
 
     @Override
     public T saveOrUpdate(T record) {
         return dao.save(record);
     }
 
     @Override
     public void clear() {
         dao.deleteAllInBatch();
     }
 }
 ```
 
 - 上述接口中针对复杂查询和分页查询做了通用的封装
     - 封装SearchFilter来构建复杂查询条件:
     
     ```java
     public class SearchFilter {
         public enum Operator {
             EQ, LIKE, GT, LT, GTE, LTE,IN,ISNULL,ISNOTNULL
         }
     
         public String fieldName;
         public Object value;
         public Operator operator;
         public  static SearchFilter build(String fieldName, Operator operator, Object value){
             return  new SearchFilter(fieldName,operator,value);
         }
         public  static SearchFilter build(String fieldName, Operator operator){
             return  new SearchFilter(fieldName,operator);
         }
         public SearchFilter(String fieldName, Operator operator) {
             this.fieldName = fieldName;
             this.operator = operator;
         }
         public SearchFilter(String fieldName, Operator operator, Object value) {
             this.fieldName = fieldName;
             this.value = value;
             this.operator = operator;
         }
     
         /**
          * searchParams中key的格式为OPERATOR_FIELDNAME
          */
         public static Map<String, SearchFilter> parse(Map<String, Object> searchParams) {
             Map<String, SearchFilter> filters = Maps.newHashMap();
     
             for (Map.Entry<String, Object> entry : searchParams.entrySet()) {
                 // 过滤掉空值
                 String key = entry.getKey();
                 Object value = entry.getValue();
     			/*if (StringUtils.isBlank((String) value)) {
     				continue;
     			}*/
     
                 // 拆分operator与filedAttribute
                 String[] names = StringUtils.split(key, "_");
                 if (names.length != 2) {
                     throw new IllegalArgumentException(key + " is not a valid search filter name");
                 }
                 String filedName = names[1];
                 Operator operator = Operator.valueOf(names[0]);
     
                 // 创建searchFilter
                 SearchFilter filter = new SearchFilter(filedName, operator, value);
                 filters.put(key, filter);
             }
     
             return filters;
         }
     }
     ```
     - 通过DynamicSpecifications来解析SearchFilter查询条件，构建Spring data jpa复杂查询对象Predicate 
     
     ```java
     public class DynamicSpecifications {
         public static <T> Specification<T> bySearchFilter(final Collection<SearchFilter> filters, final Class<T> entityClazz) {
             return new Specification<T>() {
                 @Override
                 public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
                     if (filters!=null && !filters.isEmpty()) {
     
                         List<Predicate> predicates = Lists.newArrayList();
                         for (SearchFilter filter : filters) {
                             // nested path translate, 如Task的名为"user.name"的filedName, 转换为Task.user.name属性
                             String[] names = StringUtils.split(filter.fieldName, ".");
                             Path expression = root.get(names[0]);
                             for (int i = 1; i < names.length; i++) {
                                 expression = expression.get(names[i]);
                             }
                             // logic operator
                             switch (filter.operator) {
                                 case EQ:
                                     predicates.add(builder.equal(expression, filter.value));
                                     break;
                                 case LIKE:
                                     predicates.add(builder.like(expression, "%" + filter.value + "%"));
                                     break;
                                 case GT:
                                     predicates.add(builder.greaterThan(expression, (Comparable) filter.value));
                                     break;
                                 case LT:
                                     predicates.add(builder.lessThan(expression, (Comparable) filter.value));
                                     break;
                                 case GTE:
                                     predicates.add(builder.greaterThanOrEqualTo(expression, (Comparable) filter.value));
                                     break;
                                 case LTE:
                                     predicates.add(builder.lessThanOrEqualTo(expression, (Comparable) filter.value));
                                     break;
                                 case IN:
                                     predicates.add(expression.in(filter.value));
                                     break;
                                 case ISNULL:
                                     predicates.add(expression.isNull());
                                     break;
                                 case ISNOTNULL:
                                     predicates.add(expression.isNotNull());
                                     break;
                             }
                         }
     
                         // 将所有条件用 and 联合起来
                         if (!predicates.isEmpty()) {
                             return builder.and(predicates.toArray(new Predicate[predicates.size()]));
                         }
                     }
     
                     return builder.conjunction();
                 }
             };
         }
     }
     ```
     - 在BaseService实现类中，我们使用了自己封装的一个分页对象Page来做分页查询：
     
     ```java
     public class Page<T>  {
         /**
          * 该操作只是为了忽略RowBounds属性
          *
          *
          */
         private transient int offset;
         /**
          * 该操作只是为了忽略RowBounds属性
          *
          *
          */
         private transient int limit;
     
         /**
          * 总数
          */
         private int total;
     
         /**
          * 每页显示条数，默认 10
          */
         private int size = 10;
     
         /**
          * 总页数
          */
         private int pages;
     
         /**
          * 当前页
          */
         private int current = 1;
     
         /**
          * 查询总记录数（默认 true）
          */
         private transient boolean searchCount = true;
     
         /**
          * 开启排序（默认 true） 只在代码逻辑判断 并不截取sql分析
          *
          *
          **/
         private transient boolean openSort = true;
     
     
         /**
          * <p>
          * SQL 排序 ASC 集合
          * </p>
          */
         private transient List<String> ascs;
         /**
          * <p>
          * SQL 排序 DESC 集合
          * </p>
          */
         private transient List<String> descs;
     
         /**
          * 是否为升序 ASC（ 默认： true ）
          *
          * @see #ascs
          * @see #descs
          */
         private transient boolean isAsc = true;
     
         /**
          * <p>
          * SQL 排序 ORDER BY 字段，例如： id DESC（根据id倒序查询）
          * </p>
          * <p>
          * DESC 表示按倒序排序(即：从大到小排序)<br>
          * ASC 表示按正序排序(即：从小到大排序)
          *
          * @see #ascs
          * @see #descs
          * </p>
          */
         private transient String orderByField;
     
         public Page() {
     
         }
     
         public Page(int current, int size, String orderByField) {
     
             this.setOrderByField(orderByField);
         }
     
         public Page(int current, int size, String orderByField, boolean isAsc) {
             this(current, size, orderByField);
             this.setAsc(isAsc);
         }
     
         /**
          * <p>
          * 分页构造函数
          * </p>
          *
          * @param current 当前页
          * @param size    每页显示条数
          */
         public Page(int current, int size) {
             this(current,size,true);
         }
     
         public Page(int current, int size, boolean searchCount) {
             this(current, size, searchCount, true);
         }
     
         public Page(int current, int size, boolean searchCount, boolean openSort) {
     
             setOffset(offsetCurrent(current, size));
             setLimit(size);
             if (current > 1) {
                 this.current = current;
             }
             this.size = size;
             this.searchCount = searchCount;
             this.openSort = openSort;
         }
     
         protected static int offsetCurrent(int current, int size) {
             if (current > 0) {
                 return (current - 1) * size;
             }
             return 0;
         }
     
         public int offsetCurrent() {
             return offsetCurrent(this.current, this.size);
         }
     
         public boolean hasPrevious() {
             return this.current > 1;
         }
     
         public boolean hasNext() {
             return this.current < this.pages;
         }
     
         public int getTotal() {
             return total;
         }
     
         public Page setTotal(int total) {
             this.total = total;
             return this;
         }
     
         public int getSize() {
             return size;
         }
     
         public Page setSize(int size) {
             this.size = size;
             return this;
         }
     
         public int getPages() {
             if (this.size == 0) {
                 return 0;
             }
             this.pages = this.total / this.size;
             if (this.total % this.size != 0) {
                 this.pages++;
             }
             return this.pages;
         }
     
         public int getCurrent() {
             return current;
         }
     
         public Page setCurrent(int current) {
             this.current = current;
             return this;
         }
     
         public boolean isSearchCount() {
             return searchCount;
         }
     
         public Page setSearchCount(boolean searchCount) {
             this.searchCount = searchCount;
             return this;
         }
     
         /**
          * @see #ascs
          * @see #descs
          */
         @Deprecated
         public String getOrderByField() {
             return orderByField;
         }
     
         /**
          * @see #ascs
          * @see #descs
          */
         public Page setOrderByField(String orderByField) {
             if (StringUtils.isNotEmpty(orderByField)) {
                 this.orderByField = orderByField;
             }
             return this;
         }
     
         public boolean isOpenSort() {
             return openSort;
         }
     
         public Page setOpenSort(boolean openSort) {
             this.openSort = openSort;
             return this;
         }
     
         public List<String> getAscs() {
             return orders(isAsc, ascs);
         }
     
         private List<String> orders(boolean condition, List<String> columns) {
             if (condition && StringUtils.isNotEmpty(orderByField)) {
                 if (columns == null) {
                     columns = new ArrayList<>();
                 }
                 if (!columns.contains(orderByField)) {
                     columns.add(orderByField);
                 }
             }
             return columns;
         }
     
         public Page setAscs(List<String> ascs) {
             this.ascs = ascs;
             return this;
         }
     
         public List<String> getDescs() {
             return orders(!isAsc, descs);
         }
     
         public Page setDescs(List<String> descs) {
             this.descs = descs;
             return this;
         }
     
         /**
          * @see #ascs
          * @see #descs
          */
         @Deprecated
         public boolean isAsc() {
             return isAsc;
         }
     
         /**
          * @see #ascs
          * @see #descs
          */
         public Page setAsc(boolean isAsc) {
             this.isAsc = isAsc;
             return this;
         }
     
         public int getOffset() {
             return offset;
         }
     
         public Page setOffset(int offset) {
             this.offset = offset;
             return this;
         }
     
         public int getLimit() {
             return limit;
         }
     
         public Page setLimit(int limit) {
             this.limit = limit;
             return this;
         }
         /**
          * 查询数据列表
          */
         private List<T> records = Collections.emptyList();
     
         /**
          * 查询参数
          */
         private transient Map<String, Object> condition;
         private transient  List<SearchFilter> filters;
     
     
         public List<T> getRecords() {
             return records;
         }
     
         public Page<T> setRecords(List<T> records) {
             this.records = records;
             return this;
         }
     
         public Map<String, Object> getCondition() {
             return condition;
         }
     
         public Page<T> setCondition(Map<String, Object> condition) {
             this.condition = condition;
             return this;
         }
     
         public List<SearchFilter> getFilters() {
             return filters;
         }
     
         public void setFilters(List<SearchFilter> filters) {
             this.filters = filters;
         }
         public void addFilter(SearchFilter filter){
             if(filter==null){
                 return ;
             }
             if(filters==null){
                 filters = Lists.newArrayList();
             }
             filters.add(filter);
         }
         public void addFilter(String fieldName, SearchFilter.Operator operator, Object value){
             if(!StringUtils.isNullOrEmpty(value)){
                 addFilter(SearchFilter.build(fieldName,operator,value));
             }
         }
         public void addFilter(String fieldName, SearchFilter.Operator operator){
             addFilter(SearchFilter.build(fieldName,operator));
         }
     
         @Override
         public String toString() {
             StringBuilder pg = new StringBuilder();
             pg.append(" Page:{ [").append(super.toString()).append("], ");
             if (records != null) {
                 pg.append("records-size:").append(records.size());
             } else {
                 pg.append("records is null");
             }
             return pg.append(" }").toString();
         }
     
     }
 
     ```
     
     
 - 基本的封装已经完毕，下面我们在自己的service中继承BaseService来使用封装的方法，比如有个用户服务类UserService
 
 ```java
 @Service
 public class UserService  extends BaseService<User,Long,UserRepository> {
 
 }
 ```
 - 在controller中使用上面的UserService
 
 ```java
 @RestController
 @RequestMapping("/user")
 public class UserController extends BaseController {
     @Autowired
     private UserService userService;   
     /**
      * 分页查询
      */
     @RequestMapping(value = "/list",method = RequestMethod.GET)
     public Object list(@RequestParam(required = false) String userName, @RequestParam(required = false) String mobile) {
         Page<Cfg> page = new PageFactory<Cfg>().defaultPage();
         page.addFilter(SearchFilter.build("userName", SearchFilter.Operator.LIKE, cfgName));
         page.addFilter(SearchFilter.build("mobile", SearchFilter.Operator.EQ, mobile));
         page = userService.queryPage(page);
         return Rets.success(page);
     }
 }    
 ```
 
 
 至此一个基础的service和repository已经封装完毕并且可以运行了，当然上面的封装还不完善，你可以根据自己的实际项目中需求做更多的封装：比如支持Or查询，比如controller层自动接收查询参数等等