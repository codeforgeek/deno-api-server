# Deno API Server
A simple API server using Deno, Oak and MySQL

## Run
Create a mysql database and create a table named ```users``` in it.

Here is the SQL.

```sql
  CREATE TABLE users (
      id int(11) NOT NULL AUTO_INCREMENT,
      name varchar(100) NOT NULL,
      created_at timestamp not null default current_timestamp,
      PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

Note: Make sure mysql credentials has no password, it is a WIP in a deno MySQL driver.

Run the Deno server.
```
 deno run --allow-net --allow-env server.ts
```

## Routes

```
GET      /api/v1/users
GET      /api/v1/users/:id
POST     /api/v1/users
PUT      /api/v1/users/:id
DELETE   /api/v1/users/:id
```
