---
title: Implementing Login and Registration with Passport and Encrypting User Information
date: "2021-08-20T00:00:00Z"
description: "Using Passport, The Chronicles of Struggles 3"
tags: ["web"]
---

# 1. Encrypting User Information

In the previous article, user information was stored in plaintext in the database. This is a very risky practice. If the database containing user information is compromised for any reason, hackers can access that information directly. Therefore, numerous algorithms have been developed to ensure that even if hackers breach the database, they cannot uncover user information.

Of course, hacking techniques are also evolving, which is why some algorithms, such as SHA1, have been deprecated. However, there are still encryption algorithms that are challenging to crack. This article is not aimed at studying each of those algorithms, so we will use the crypto module, focusing specifically on scrypt.

First, install the crypto module.

```
yarn add crypto
```

The crypto module supports various encryption methods. We will first use the pbkdf2 function, which applies salt and repeatedly hashes the input. 

Generally, it is common to perform such repeated hashing tens of thousands of times. For instance, Django hashes passwords 36,000 times as a standard. Although this still presents risks if attacked via parallel processing using GPUs, it provides a significantly safer method for storing user information compared to plaintext storage.

The usage of pbkdf2 is as follows:

```
crypto.pbkdf2(string to encrypt, salt, number of iterations, length of generated key, hashing method, callback function)
```

Commonly, a key length of 64 is used. If the hashing method is set to null, it defaults to SHA1, which has been recognized as insecure. Therefore, it is advisable to specify the hashing method explicitly. The official crypto documentation recommends using `SHA512`.

The callback function takes `(err, derivedKey)` as arguments, which are intuitively named. An example is as follows:

```javascript
import {pbkdf2} from "crypto";

pbkdf2("witch-work", "salt", 65536, 32, "sha512", (err, derivedKey) => {
    if (err) {
        throw err;
    }
    // Handle error if it occurs
    console.log(derivedKey.toString("hex"));
});
```

At this point, `derivedKey` is returned as a <Buffer>, hence the conversion to string for readability.

Furthermore, the salt should not be a simple string like 'salt'. Using a straightforward string that anyone could easily guess could expose the system to rainbow table attacks even with salt applied. This aspect will be addressed later. While security is best when robust, we have already made significant progress from plaintext storage.

Creating a function to store passwords first and then enhancing the encryption method poses no significant issues; it merely alters the order of operations slightly.

# 2. Storing User Information Encrypted with pbkdf2

Let us review the function we previously created to store new user information.

```javascript
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    await connection.query(userInsertQuery, [username, password]);
};
```

This is a simple method of executing a row insertion query into the database connection. Here, we need to modify it to store the encrypted version of the received username and password.

If we use `pbkdf2` directly, we can only access derivedKey within the callback function, which complicates matters with module creation and the use of Promise objects. Therefore, we will utilize the `pbkdf2Sync` function to return the <Buffer> encrypted directly. We have referred to the crypto official documentation for this method.

```js
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    const cryptedPassword =
        pbkdf2Sync(password, "salt", 65536, 32, "sha512").toString("hex");
    console.log(cryptedPassword);
    await connection.query(userInsertQuery, [username, cryptedPassword]);
};
```

Here, it is crucial to note that by setting the key length to 32, we generate a 64-character encrypted password via the `pbkdf2` function. However, if the database storing user information has a password length of `nvarchar(20)`, an error may occur during data insertion. Therefore, proper modeling of the database is necessary. I have increased the password field to `nvarchar(200)`.

Typically, websites impose length restrictions on usernames and passwords. For example, a username may be limited to less than 20 characters, and passwords may require a combination of lowercase letters, numbers, and special characters, with lengths ranging between 8 and 20 characters. Nevertheless, after encryption, every password becomes a 64-character string. Thus, these constraints should be enforced on the client side when capturing user input or when checking the `username` and `password` before passing them to the database insertion function. This check must occur before encryption and will be added later.

Additionally, one may reason that encrypting the `password` on the client side before sending it to the server adds extra security. However, this is unnecessary since the `https` protocol automatically encrypts data during transmission.

## 2.1 Random Generation of Salt

We previously used a simple string 'salt' when adding salt to the hash. Although this is significantly better than storing plaintext, there remain numerous areas for improvement. One approach is to generate a new salt randomly every time new user information is stored and use that to encrypt the password. The salt should then be stored alongside the user information.

To facilitate this, we can use the `randomBytes` function from the `crypto` module, which generates cryptographically strong random data. A simple example is shown below.

```js
import {randomBytes} from "crypto";

const buf = randomBytes(64).toString("hex");
console.log(buf.length, buf);
```

This will produce a randomly generated string of length 128. The length of the string generated can be adjusted by changing the input to `randomBytes`. We plan to use a salt string of length 64 in the future.

So now we will generate a random string for salt whenever a new password is created. How should we store this along with the password? We can include it in the password field in a way that allows us to separate the two. Since the password's encrypted string and the salt will only contain lowercase letters and numbers, we can use a character not present in either to separate them. I have chosen to use `$` as the delimiter.

Thus, our storage function can be adjusted as follows:

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

When we use this code to encrypt the string `testpw`, we get the following result:

```
1803148bc1c4ee7e914365d49009a62b4a89c7cfa85b41d6aa7e6fe890108e5aa7c74936c1d71ff79177add2a147064b9e085a4ddda0e68cc8dca880ab0ae01a$51fffaa2c8c55d76969e7ab927a47a82aa5dfd278fd3e01bd0d6a31b18be8326
```

This result is generated using a random salt, so re-encrypting it will yield a different result each time. Notably, the `$` in the middle of the above string indicates the start of the salt. We will utilize this salt in future password verifications.

# 3. Comparing Encrypted Strings

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

Here, the `givenPassword` is provided in plaintext, while `encryptedPasswordAndSalt` is the encrypted version. We first split the string by `$` to destructure it and obtain both the encrypted password and salt. The `givenPassword` is then encrypted using the extracted salt. 

We then compare the encrypted version of `givenPassword` with the previously stored `encrypted` value to assess if they match. If the user-entered password matches the stored password, we return 1; otherwise, we return 0.

This comparison will be utilized in the authentication portion of `passport`.

```js
// Setting up LocalStrategy in passport
passport.use(
    new LocalStrategy(
        async (username, password, done) => {
            const result = await userInfoFilteredByID(username);

            if (result.length > 0) {
                const user = result[0];
                if (await userPasswordVerify(password, user.password) === 1) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Incorrect password"});
                }
            } else {
                return done(null, false, {message: "User does not exist"});
            }
        }
    )
);
```

Using `bcrypt` or `scrypt` for encryption would enhance security further. Of course, if the database itself is compromised, it is a significant concern; however, stronger encryption would buy valuable time in assessing and responding to database breaches.

Increased security measures applied during encryption result in greater CPU computation, potentially rendering the system vulnerable to DDoS attacks. This highlights an inherent trade-off; however, maintaining security remains paramount. For future projects, I will utilize `scrypt`.

References

Zerocho Blog Post on Encryption: https://www.zerocho.com/category/NodeJS/post/593a487c2ed1da0018cff95d

Blog Post on the Crypto Module: https://lwndnjs93.tistory.com/101

GeeksforGeeks Article on scrypt Method: https://www.geeksforgeeks.org/node-js-crypto-scrypt-method/

Encrypting Passwords with scrypt: https://elvanov.com/2420

Crypto Official Documentation: https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback

Node.js One-Way Encryption: https://velog.io/@neity16/NodeJS-crypto%EB%8B%A8%EB%B0%A9%ED%96%A5-%EC%95%94%ED%98%B8%ED%99%94

Encryption in HTTPS: https://eun-jeong.tistory.com/27

<div style="color:white"> 
    Who am I? Front Lead at Dev Sisters xo.dev
</div>