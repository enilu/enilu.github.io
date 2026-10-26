---
source_sha256: a7ec85e5310349fa17903e265454bf20430792b3b0c221507b50c92a374d3945
title: "Shared Spring Data JPA Layers: Repositories, Queries and Services"
date: '2019-06-29'
lang: en
translation_key: spring-data-common-service-repository
permalink: /en/2019/06/29/spring-data-common-service-repository/
description: "Reuse Spring Data repositories and Specifications while constraining queries, validating pagination and keeping authorization and transactions in business services."
---

Admin applications repeatedly need CRUD operations, filters and pagination. I have tried putting shared behavior into Repository and Service abstractions. The goal should be to remove stable duplication, rather than make every business feature inherit an ever-growing parent class.
<!--break-->

## Reuse Spring Data's existing interfaces first

```java
@NoRepositoryBean
public interface BaseRepository<T, ID>
        extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
}
```

`@NoRepositoryBean` prevents the base interface from being instantiated as an entity repository. Concrete repositories specify their entity and ID types:

```java
public interface UserRepository extends BaseRepository<User, Long> {
}
```

Spring Data already provides CRUD, pagination and Specification execution. There is no need to wrap every method under the same name. Add a custom base implementation only for behavior required across repositories. Modern Spring Data JPA supports `repositoryBaseClass`; align more complex factory extensions with the actual version's API.

## Constrain query abstraction inputs

Generic filtering can convert supported fields, operators and values into a Specification for execution. Here is a Service fragment:

```java
Specification<User> condition = (root, query, cb) ->
        cb.equal(root.get("status"), status);
Page<User> result = userRepository.findAll(condition, pageable);
```

It requires an actual User entity, status value and Pageable. Restrict field names and sort directions with allowlists, and validate value types, page size and maximum range. Parameter binding avoids concatenating values into SQL, but does not replace field authorization or business data scope restrictions.

For joins, verify duplicate records and count queries. Convert dates, numbers and enums to explicit types instead of relying on unchecked casts. Define empty conditions, empty IN lists and AND/OR combinations clearly.

## Services should express business operations

Business services enforce authorization, state constraints and transaction boundaries. `save` does not distinguish an authorized update from an arbitrary overwrite. Load and check an edit target first. A reference returned by methods such as `getReferenceById` is not an existence check.

For example, freezing an account should be an explicit operation, rather than passing an entire request to a generic update method. Declare transactions around business operations involving several repositories; use read-only transactions where appropriate. Bulk deletion may bypass callbacks, and a clear-all operation should not become a generic public business API.

## Keep pagination responsibilities focused

A request may have its own pagination DTO. Internally, prefer Spring Data Pageable and Page, then map them to an API response. Frontend page numbers often start at one, whereas PageRequest starts at zero. Keep total counts as long instead of narrowing them to int.

Verify creation, editing, empty results, out-of-range pages, sorting and transaction rollback with different entities. If the second entity already demands repeated special cases, leave the differences in the business layer rather than expanding the parent class indefinitely.

**References**

- [Documentation: docs.spring.io](https://docs.spring.io/spring-data/jpa/reference/repositories/custom-implementations.html)
