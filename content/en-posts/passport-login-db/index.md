---
title: Implementing Login and Registration with Passport and Connecting to DB
date: "2021-08-18T00:00:00Z"
description: "Using Passport, a record of the struggles, Part 2"
tags: ["web"]
---

# 1. Creating User Information DB

## 1.1 DB Modeling

Earlier, when validating user information using Passport, the data was stored in a simple array of objects. However, it would be a reasonable choice to use a separate database optimized for storing such information. I decided to use MySQL.

Since I am using Express, I first need to connect the database to Express. Therefore, I will configure the connection to MySQL first.

```javascript
// mysql/mysql_connection.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// Using .env file to hide DB connection info
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

export default connection;
```

So, what information should we store when saving users in the database? I decided to simply store the user's unique ID, username, and password. I created the user table by executing the following SQL query in MySQL.

```mysql
create table users(
    id int not null primary key auto_increment,
    username nvarchar(20) not null unique,
    password nvarchar(20) not null
);
```

Once the database connection is successfully established, I can execute SQL queries using `connection.query(query)`, and I used this to create the table. If you find it easier to use the MySQL command line in the terminal, that's fine as well. However, since you will often need to execute SQL queries using the `query` function while creating API endpoints for login and registration, I recommend using it.

After setting up the user information table like that, you will be able to validate incoming requests by querying the table. However, information must be present in the table in order to perform that validation.

## 1.2 Adding Information to the Table

Therefore, let's use the insert statement to add information to the table.

At this time, thinking ahead to create the functionality for inserting new users during registration, I decided to set up a basic structure now. The function that receives `username` and `password` and inserts them into the `users` table is as follows.

```javascript
const userInfoInsert = async (username, password) => {
    const userInsertQuery = "insert into users(username, password) values(?,?)";
    await connection.query(userInsertQuery, [username, password]);
    console.log("New user information insertion completed");
};
```

Additionally, let’s create a temporary route `/user-insert` to facilitate user information insertion. This will allow us to easily insert new information via Postman.

```javascript
app.post("/user-insert", async(req, res) => {
    const { username, password } = req.body;

    try {
        // Basic error handling. An error occurs if a duplicate username request comes in
        const result = await userInfoInsert(username, password);
        res.send("User information insertion successful");
    } catch(err) {
        res.send("Error occurred");
    }
});
```

I inserted several data entries. Executing the query `SELECT * FROM USERS` confirmed that I could see the user information I inserted as follows.

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

# 2. Validating Login Requests Using the DB

Recall from the previous article how authentication was handled using Passport with LocalStrategy. What approach was taken? Initially, we used a filter function on the userList array to check the existence of a user with the provided username. If there was no user with that username in the request, it resulted in a login failure.

If a user exists with the same username, but the registered password does not match the provided password, it also results in a login failure. Only if both the username and password match will the login be considered successful.

Let's change this to use database-backed authentication. Firstly, the usernames stored in the database have a unique constraint. Generally, user systems do not allow duplicate usernames, which is a reasonable modeling approach. This means that if we run a SELECT query filtered by username in the DB, the result will be only one.

Let’s create a function that returns the result filtered by username from the database. This function will look like the following.

```javascript
const userInfoFilteredByID = async (username) => {
    const userFilterQuery = "select * from users where username=?";
    const result = await connection.query(userFilterQuery, [username]);
    return result[0];
    /* result contains a variety of information coming from the DB, 
    and index 0 contains the array of user information filtered by username.
    Since this is an async function, the return value is an array wrapped in a promise,
    and it must be awaited when received. */
};
```

Now we can use this function to implement the authentication logic for LocalStrategy.

Take note that since the above function is an async function, we need to await its result.

```javascript
passport.use(
    new LocalStrategy(
        async (username, password, done) => {
            const result = await userInfoFilteredByID(username);
            // result is an array containing user information filtered by username
            
            if (result.length > 0) {
                const user = result[0];
                if (user.password === password) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect password" });
                }
            } else {
                return done(null, false, { message: "User does not exist" });
            }
        }
    )
);
```

Now, we can inspect login requests from users using the user information stored in the database. The overall structure is the same as the one we previously created using arrays. The only difference is whether we are validating the information with a JavaScript array or using the results from SQL queries.

However, a significant issue in our current code is that user information is stored in plaintext. Presently, the database contains meaningless IDs and passwords like `test` and `testpw`.

If an actual user ID and password are stored in plaintext, it poses a serious security risk. To mitigate the risk of a database leak, encryption is necessary. There are various methods to achieve this, and we will explore one of those methods for encryption in the next article.

References

Using async/await with MySQL https://holywater-jeong.github.io/2018/06/08/node-mysql-async-await