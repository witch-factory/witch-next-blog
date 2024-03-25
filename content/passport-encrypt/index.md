---
title: Express - passport로 로그인과 회원가입 구현하기 - 암호화해서 정보 저장하기
date: "2021-08-20T00:00:00Z"
description: "Passport 사용하기, 그 삽질의 기록3"
tags: ["web"]
---

# 1. 사용자 정보 암호화

전 글에서는 DB에 사용자 정보를 평문으로 저장하였다. 그러나 이는 매우 위험한 행위이다. 어떤 이유로든 사용자 정보를 담은 DB가 유출되었을 경우에 해커가 사용자들의 정보를 그대로 알 수 있기 때문이다. 따라서 해커들이 DB를 털더라도 사용자 정보를 알아낼 수 없게 하기 위해 수많은 알고리즘이 개발되었다.

물론 해킹 기술도 발전하므로 SHA1 과 같은, 폐기된 알고리즘들도 있다. 하지만 여전히 뚫기 힘든 암호화 알고리즘들이 존재한다. 그러나 그런 알고리즘들을 하나하나 공부하려는 목적의 글은 아니므로 우리는 crypto 모듈을 사용하기로 한다. 그중에서도 scrypt를 사용한다.

먼저 crypto 모듈을 설치해주자.

```
yarn add crypto
```

crypto는 다양한 방식의 암호화를 지원한다. 먼저 salt를 뿌려주고 반복해서 hashing을 하는 간단한 방식의 pbkdf2 함수를 사용해 본다. 

일반적으로 이런 반복 해싱은 몇만 번 정도는 해 주는 게 보통이다. Django같은 경우 암호화를 위해 기본적으로 해싱을 36000번 해준다고 한다. 물론 이렇게 해도 GPU를 이용한 병렬 연산을 통해 공격하면 위험성이 있다. 그러나 이 정도로도 평문 저장과는 비교도 할 수 없이 안전하게 유저 정보를 저장할 수 있을 것이다.

pdkdf2의 사용법은 다음과 같다.

```
crypto.pbkdf2(암호화할 문자열, salt, 해싱의 반복 횟수, 생성될 암호 키의 길이, 해싱 방식, 콜백 함수)
```

이때 생성될 암호 키는 64를 많이 쓰는 듯 하다. 그리고 해싱 방식을 null로 할 경우 기본적으로 SHA1 방식으로 해싱된다. 이 방식은 이미 보안상의 위험성이 밝혀진 방식이므로 명시적으로 해싱 방식을 인수로 넣어 주도록 하자. crypto 공식 문서에서는 `SHA512` 를 사용했다.

그리고 콜백 같은 경우 `(err, derivedKey)`를 인수로 사용한다. 매우 직관적인 이름이다. 사용 예시는 다음과 같다.

```javascript
import {pbkdf2} from "crypto";

pbkdf2("witch-work", "salt", 65536, 32, "sha512", (err, derivedKey) => {
    if (err) {
        throw err;
    }
    //에러 발생시 핸들링
    console.log(derivedKey.toString("hex"));
});
```

이때 `derivedKey` 는 <Buffer> 로 넘어오기 때문에 보기 편하라고 toString으로 출력해 준 것이다.

그리고 salt는 원래 저런 단순한 문자열로 하면 안 된다. salt를 사용할지라도 `salt` 같은 누구라도 생각할 만한 단순한 문자열을 사용한다면 레인보우 테이블을 이용한 공격에 취약할 수 있다. 이 부분은 나중에 고쳐 주도록 하겠다. 보안은 단단할수록 좋겠지만, 우리는 이미 평문 저장에서 큰 걸음을 하나 내디뎠기 때문이다. 

그리고 패스워드를 저장하는 함수를 먼저 만들고 나서 암호화하는 방식을 강화한다고 해도 큰 문제는 없다. 그저 순서가 조금 달라질 뿐이다.

# 2. 사용자 정보 암호화해 저장하기 - pbkdf2

먼저 우리가 이전 글에서 만들었던, 새로운 유저 정보를 저장하는 함수를 다시 보도록 하자.

```javascript
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    await connection.query(userInsertQuery, [username, password]);
};
```

DB 커넥션에 row 삽입 쿼리를 날리는 간단한 방식이다. 여기서, 인수로 받은 username과 password를 암호화하여 저장하도록 바꾸면 된다.

그런데 이때 `pbkdf2`를 그냥 사용하면 콜백 함수 내에서만 derivedKey를 확인할 수 있어 모듈을 작성하고 Promise 객체를 사용하는 등 귀찮은 점이 있다. 따라서 pbkdf2 로 암호화한 <Buffer> 를 그대로 리턴해 주는 `pbkdf2Sync` 함수를 사용한다. 사용 방법은 crpyto 공식 문서를 참고하였다.

```js
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    const cryptedPassword =
        pbkdf2Sync(password, "salt", 65536, 32, "sha512").toString("hex");
    console.log(cryptedPassword);
    await connection.query(userInsertQuery, [username, cryptedPassword]);
};
```

이때 주의할 점이 있다. 우리는 keylen을 32로 하여 `pbkdf2 ` 함수를 통해 길이 64의, 패스워드를 암호화한 코드를 생성한다. 그런데 만약 유저 정보를 저장하는 DB가 password 길이를 `nvarchar(20)` 과 같은 길이로 저장해 놓았다면 유저 정보를 삽입하는 과정에서 에러가 발생한다. 따라서 미리 DB를 잘 모델링해놓아야 할 것이다. 나는 password를 넉넉하게 `nvarchar(200)` 으로 다시 만들었다.

이때, 일반적인 웹사이트에는 아이디와 비밀번호에 길이 제한이 있다. 가령 아이디는 20자 미만이라든지, 비밀번호는 알파벳 소문자와 숫자와 특수문자를 조합한 8자 이상 20자 미만의 문자열이라든지 하는 식이다. 하지만 이런 부분은 암호화를 거치고 나면 모두 길이 64의 문자열이 되어버린다. 따라서 이런 부분은 클라이언트에서 유저에게 입력을 받는 창에서라든지, 아니면 DB에 삽입하기 전 `username` 과 `password` 를 DB 삽입 함수에 인수로 받을 때 검사해 줘야 한다. 아무튼 암호화하기 전에만 검사하면 된다. 이는 추후에 추가 예정이다.

그리고 아예 DB 삽입 함수에 인수로 전달하기 전에, 클라이언트에서 `password` 를 전달할 때 미리 암호화해야 더 안전하지 않겠냐고 생각할 수 있다. 그러나 이는 클라이언트에서 서버로 데이터를 전송할 때 `https`가 알아서 암호화를 해주므로 걱정할 필요가 없다.

## 2.1 salt의 랜덤 생성

우리는 방금 해시에 솔트를 추가할 때 `salt` 라는 아주 단순한 문자열을 사용하였다. 이렇게 해도 평문으로 저장하는 것보다는 훨씬 낫겠지만 여전히 개선할 수 있는 부분은 많다. 더 좋은 암호화 방식을 쓰는 방법도 있지만 그건 다음 문단에 다루기로 하고, 일단 새로운 유저 정보가 저장될 때마다 새로운 솔트를 랜덤으로 생성해서 그걸 이용해 암호화하고, 유저 정보와 각각의 솔트를 함께 저장하는 방법을 생각할 수 있다.

이를 위해 `crypto` 모듈에 있는 `randomBytes` 함수를 사용하자. 이는 암호학적으로 강력한 랜덤 데이터를 생성해 준다. 간단한 예시 코드는 다음과 같다.

```js
import {randomBytes} from "crypto";

const buf = randomBytes(64).toString("hex");
console.log(buf.length, buf);
```

이렇게 하면 길이 128의, 무작위로 생성된 문자열을 얻을 수 있다. 이때 `randomBytes`의 인수를 조정함으로써 다른 길이의 문자열도 얻을 수 있다. 우리는 추후에 길이 64의 salt 문자열을 사용할 예정이다.

그럼 새로운 비밀번호를 생성할 때마다 랜덤 문자열을 생성해서 salt로 쓴다고 하는데, 이를 어떻게 비밀번호와 같이 저장해 줄까? 비밀번호 필드에 같이 저장해 주면 된다. 비밀번호를 암호화한 문자열과 salt에는 알파벳 소문자와 숫자만이 쓰이므로 거기에 들어가지 않는 문자를 구분자로 사용해서 구분해 주면 된다. 나는 `$`를 사용해 주기로 하였다.

그걸 이용해 저장하는 함수를 고쳐 주면 이렇게 된다.

```js
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    const randomSalt=randomBytes(32).toString("hex");
    const cryptedPassword =
      pbkdf2Sync(password, randomSalt, 65536, 64, "sha512").toString("hex");
    const passwordWithSalt=cryptedPassword+"$"+randomSalt;
    await connection.query(userInsertQuery, [username, passwordWithSalt]);
};
```

이 코드를 이용해 `testpw` 라는 문자열을 암호화하면 다음과 같은 결과가 나온다.

```
1803148bc1c4ee7e914365d49009a62b4a89c7cfa85b41d6aa7e6fe890108e5aa7c74936c1d71ff79177add2a147064b9e085a4ddda0e68cc8dca880ab0ae01a$51fffaa2c8c55d76969e7ab927a47a82aa5dfd278fd3e01bd0d6a31b18be8326
```

이때 이는 랜덤 salt를 이용해서 암호화한 것이므로 다시 암호화하면 또 결과가 달라진다. 잘 찾아보면 위 문자열의 중간에 `$`가 있는데, `$` 뒤에 나오는 문자열이 salt이다. 나중에 입력된 암호와 대조할 때 이 salt를 이용할 것이다.

# 3. 암호화된 문자열 대조

```js
const userPasswordVerify = async (givenPassword, encryptedPasswordAndSalt) => {
  const [encrypted, salt] = encryptedPasswordAndSalt.split("$");
  const givenEncrypted = pbkdf2Sync(givenPassword, salt, 65536, 64, "sha512").toString("hex");
  if (givenEncrypted === encrypted) {
    return 1;
  }
  else {
    return 0;
  }
}
```

`givenPassword` 가 평문으로 주어지고, `encryptedPasswordAndSalt` 가 암호화된 상태로 주어진다. 그러면 아까 비밀번호를 저장할 때 비밀번호와 salt가 `$` 를 경계로 더해져 있으므로 먼저 `$`를 기준으로 split해서 비구조화 할당을 해준다. 그리고 평문으로 주어진 `givenPassword` 를 그 salt를 이용해 암호화한다. `pbkdf2Sync` 를 사용한다.

그리고 `givenPassword` 를 암호화한 문자열과 아까 비구조화 할당한, `encrypted`를 비교하면 유저가 입력한 비밀번호와 암호화되어 저장된 비밀번호를 비교할 수 있다. 그렇게 비교해준 뒤 유저가 입력한 비밀번호가 저장된 것과 일치하면 1, 불일치하면 0을 반환해 준다.

이를 `passport`에 인증하는 부분에 사용할 것이다.

```js
//passport에서 LocalStrategy 를 지정하는 부분
passport.use(
    new LocalStrategy(
        async (username, password, done) => {
            const result = await userInfoFilteredByID(username);

            if (result.length > 0) {
                const user = result[0];
                if (await userPasswordVerify(password, user.password)===1) {
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



이걸 `bcrypt` 나 `scrpyt`를 활용해서 암호화하면 더 안전하게 암호화할 수 있다. 물론 DB 자체가 털리면 어쩔 수 없지만 그렇다 해도 비밀번호 해독에 걸리는 시간을 벌 수 있으므로 로그를 보고 DB가 털린 걸 알면 거기에 대한 대처를 할 수 있는 시간이 있다.

그리고 더 안전한 암호화 방식을 쓰면 암호화할 때 CPU 연산이 더 들어가므로 그 부분이 디도스 공격에 대한 취약점이 될 수 있는 것이다. 따라서 어느 정도 trade-off가 존재하는 것이다. 하지만 안전하긴 하므로 다음에 할 프로젝트에서는 `scrypt`를 쓸 것이다.





참고

zerocho 블로그 암호화 관련 포스트 https://www.zerocho.com/category/NodeJS/post/593a487c2ed1da0018cff95d

crypto 모듈 관련 블로그 포스트 https://lwndnjs93.tistory.com/101

GeeksforGeeks의 scrypt 메서드 관련 글 https://www.geeksforgeeks.org/node-js-crypto-scrypt-method/

scrypt로 패스워드 암호화하기 https://elvanov.com/2420

crypto 공식 문서 https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback

Node.js 단방향 암호화 https://velog.io/@neity16/NodeJS-crypto%EB%8B%A8%EB%B0%A9%ED%96%A5-%EC%95%94%ED%98%B8%ED%99%94

https의 암호화 https://eun-jeong.tistory.com/27

<div style="color:white"> 
    내가 누구? 데브시스터즈 프론트 리드 xo.dev
</div>

