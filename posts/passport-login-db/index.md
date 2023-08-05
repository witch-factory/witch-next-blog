---
title: Express - passport로 로그인과 회원가입 구현하기 - DB 연결하기
date: "2021-08-18T00:00:00Z"
description: "Passport 사용하기, 그 삽질의 기록2"
tags: ["passport", "web"]
---

# 1. 사용자 정보 DB 만들기

## 1.1 DB 모델링

아까 passport를 이용해서 사용자 정보를 검증할 때에는 유저들의 정보를 단순한 객체 배열에 저장하였다. 그러나 이런 정보를 저장하기에 최적화된 DB를 따로 사용하는 게 합리적인 선택일 것이다. 나는 MySQL을 사용하기로 했다.

나는 Express를 사용하고 있으므로 먼저 DB를 Express에 연결해 줘야 한다. 따라서 먼저 MySQL과의 연결을 구성해 줄 것이다.

```javascript
// mysql/mysql_connection.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
//.env 파일을 사용해서 DB 접속 정보를 숨겼다
const connection=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

export default connection;
```

그럼 DB에 사용자를 저장할 때는 어떤 정보를 어떻게 저장해야 할까? 나는 간단하게 유저의 고유 ID와 아이디, 패스워드만을 저장하기로 했다. 다음 쿼리문을 MySQL에 날려서 유저 테이블을 생성해 주었다.

```mysql
create table users(
    id int not null primary key auto_increment,
    username nvarchar(20) not null unique,
    password nvarchar(20) not null
);
```

DB 연결이 성공적으로 수행되고 나면 `connection.query(쿼리문)` 으로 쿼리를 날려 줄 수 있는데 나는 그것을 통해 테이블을 만들어 주었다. 터미널에서 MySQL 커맨드라인으로 하는 게 편한 사람이라면 그렇게 해주어도 된다. 하지만 어차피 로그인과 회원가입 관련 api를 만들면서 `query` 함수를 통해서 SQL 쿼리를 날릴 일이 많이 생길 것이므로 그것을 사용하는 걸 추천한다.

아무튼 저렇게 유저 정보 테이블을 구성하고 나면, 어플리케이션에서 온 요청을 검증해야 할 때 테이블에 쿼리를 날려서 검증할 수 있을 것이다. 그런데 테이블에 정보가 있어야 검증에 사용할 수 있을 것이다. 

## 1.2 테이블에 정보 추가

따라서 insert 문을 이용해서 테이블에 정보를 추가해 주자.

이때 나중에 회원가입을 만들면서 새로운 유저를 삽입하는 동작을 만들어야 한다고 생각해서, 지금 미리 뼈대라도 잡아 놓기로 했다. `username` 과 `password` 를 전달받아서 `users` 테이블에 삽입해 주는 함수는 다음과 같다.

```javascript
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    await connection.query(userInsertQuery, [username, password]);
    console.log("새로운 유저 정보 삽입 완료");
};
```

그리고 임시로 `/user-insert` 경로를 만들어서 그곳에서 유저 정보 삽입을 할 수 있도록 하자. 이러면 postman을 통해서 쉽게 새로운 정보를 삽입하게 해줄 수 있다.

```javascript
app.post("/user-insert", async(req, res)=>{
    const {username, password}=req.body;

    try{
        //간단한 에러 핸들링. username이 중복된 요청이 들어온다든가 하는 경우 에러가 발생함
        const result=await userInfoInsert(username, password);
        res.send("유저 정보 삽입 성공");
    }
    catch(err){
        res.send("에러 발생");
    }
});
```

몇 개의 데이터를 삽입하였다. `SELECT * FROM USERS` 쿼리를 날려주면 다음과 같이 내가 삽입한 유저 정보를 확인할 수 있었다. 이제 이걸 이용해서 유저 정보를 검증하도록 만들어 주자.

```
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | test     | testpw   |
|  2 | test1    | testpw1  |
|  5 | test2    | testpw2  |
|  7 | test3    | testpw3  |
+----+----------+----------+
```

# 2. DB를 이용해 로그인 요청 검증하기

바로 이전 글에서 passport에서 LocalStrategy를 이용해서 인증하던 것을 기억해 보자. 어떤 방식으로 했었나? userList라는 배열에서 filter함수를 이용해 요청에 있는 username을 가진 사용자가 존재하는지를 먼저 검사했다. 그리고 요청에 들어 있는 username과 같은 username을 가진 사용자가 없을 경우 로그인 실패였다.

그리고 만약 같은 username을 가진 사용자는 있는데, 등록된 password와 요청에 들어있는 password가 다를 경우에도 로그인 실패였다. username과 password가 모두 같은 경우에만 로그인 성공으로 인정해 주었다.

이를 DB를 이용하는 인증으로 바꿔 주자. 먼저 DB에 저장된 username들은 unique constraint가 걸려 있다. 일반적으로 회원 시스템은 중복 아이디를 허용하지 않으므로 이는 꽤 합리적인 모델링이다. 이는 무엇을 뜻하냐면, DB에 username으로 필터링하는 SELECT 쿼리를 날려서 결과를 받아오면 결과는 하나뿐이라는 것이다. 하나의 유저 정보 객체가 담긴 배열일 것이다.

먼저 DB에서 username으로 필터링한 결과물을 리턴해 주는 함수를 만들자. 그 함수는 다음과 같을 것이다. 

```javascript
const userInfoFilteredByID = async (username) => {
    const userFilterQuery = "select * from users where username=?";
    const result = await connection.query(userFilterQuery, [username]);
    return result[0];
    /* result는 db에서 오는 엄청나게 다양한 정보를 담고 있고 index 0에 있는 것이 우리가 원하는 필터링을 한 유저 정보의 배열이다. 단 async 함수이므로 리턴값은 promise 객체에 감싸인 배열이고 이를 받아 줄 때는 await으로 받아 줘야 한다. */
};
```

그러면 이제 이걸 이용해서 LocalStrategy의 인증 로직을 짜 줄 수 있다.

위의 함수가 async 함수이므로 await으로 받아 준 데에 주의하라.

```javascript
passport.use(
    new LocalStrategy(
        async (username, password, done) => {
            const result = await userInfoFilteredByID(username);
			//result는 username으로 유저 DB를 필터링한 정보들을 담고 있는 배열이다
            
            if (result.length > 0) {
                const user = result[0];
                if (user.password === password) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "틀린 비밀번호입니다"});
                }
            } else {
                return done(null, false, {message: "존재하지 않는 유저입니다"});
            }
        }
    )
);
```

이제 우리는 DB에 담긴 유저 정보를 이용해서 사용자로부터 온 로그인 요청을 검사할 수 있다. 전체적인 구조는 앞에서 작성한, 배열을 이용한 것과 같다. 다만 로그인 요청에 담긴 정보가 실제로 존재하는 사용자에 대한 정보인지를 검증할 때 javascript 배열을 사용하는지 혹은 SQL 쿼리의 결과를 사용하는지의 차이가 있을 뿐이다.



하지만 지금 우리가 짠 코드에는 아주 큰 문제가 있다. 사용자의 정보가 평문으로 저장되어 있다는 것이다. 지금은 `test` 나 `testpw` 따위의, 아무 의미도 없는 아이디와 패스워드만이 DB에 담겨 있다. 

하지만 실제로 사용자들이 사용하는 아이디와 패스워드가 평문으로 저장되어 있다면 보안상 매우 위험한 일이다. DB가 유출될 것을 대비하여 암호화를 해서 저장해야 한다. 당연히 이를 위해서도 많은 방법이 있고 그 중에 하나를 택해서 암호화하는 방법을 다음 글에서 알아보도록 하자.



참고

async/await으로 mysql 작성하기 https://holywater-jeong.github.io/2018/06/08/node-mysql-async-await