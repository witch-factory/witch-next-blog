---
title: Implementing Login and Registration with Passport in Express - Getting Started
date: "2021-08-17T00:00:00Z"
description: "Using Passport - a record of trial and error"
tags: ["web"]
---

# 1. What is Passport

While conducting backend clone coding using Express, I decided to use a middleware called Passport for implementing user registration and login. Given the complexity I faced before achieving this code and my understanding, I leave a trace here. The content is primarily based on the official Passport documentation and my personal understanding.

Let's say we want to receive input from a user to check if the user exists in the database, and to compare the username and password to provide a successful or failed login response.

This is a feature that is naturally present on common websites. Our information is stored somewhere, and when we enter our username and password, specific actions take place depending on whether the input matches (usually, upon successful login, the user is redirected to the original page they were viewing).

So how do we implement this?

The simplest way would be to use the POST method to query the database for the username and password contained in the request coming from the client. (`SELECT * FROM USER WHERE ID=req.body.id and PASSWORD=req.body.password`)

If the user information is stored in the database in an encrypted state, we would need to salt and hash the information in `req.body` before querying, but the basic logic would remain the same.

However, this method is not particularly ideal.

For example, consider the following code:

```javascript
app.post("/login", (req, res) => {
    /* Validate the user input by querying the DB and handle the actions for login success/failure */
})
```

In this case, the query corresponding to the user input is made against the DB and specific actions are handled depending on success/failure, all within a single callback function. This is messy and not ideal. Thus, Passport was created to separate the authentication of requests coming from the page and the callbacks that are executed based on the results.

In other words, Passport is middleware used for authentication in Node.js (excerpted from the official documentation at http://www.passportjs.org/docs/). It is used as follows:

```javascript
app.post('/login',
  passport.authenticate('local'),
  //'local' will be discussed later in the text
  function(req, res) {
    // This callback is called upon successful authentication
  });
```

As noted in the comment in the code above, if authentication is successful, the next route handler (callback function) is invoked. What if it fails? A 401 error (Unauthorized) is responded to, and the route handler will not execute. The POST method will end with a 401 error.

Before directly processing the POST request, the middleware that handles the authentication is Passport. More specifically, it connects to the strategy that authenticates (there are various authentication methods such as username/password or Google/Facebook, etc.) and then receives the results.

# 2. Handling Authentication Results

Passport links requests sent via the POST method to the authenticate strategy and provides several methods for handling the results.

## 2.1 Redirection

For instance, if login authentication succeeds, we may redirect to the homepage; if it fails, we redirect back to the login page.

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));
```

This can be handled as shown above. Isn’t it intuitive? If authentication succeeds, the user moves to the page specified by successRedirect; if it fails, they are redirected to the page specified by failureRedirect.

## 2.2 Flash Messages

It is also possible to display flash messages that show up briefly and disappear upon success or failure.

Everyone has probably experienced an alert that says something like, "Incorrect username or password," due to a typo while logging in. Alternatively, a message like "Welcome!" could be shown upon successful login. That is precisely the function it serves.

This is made possible by providing `successFlash` and `failureFlash` options in the object given as a second argument to the `authenticate` function.

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   successFlash: 'Welcome!',
                                   failureFlash: true })
);
```

Here, `successFlash` contains the custom message "Welcome!", and `failureFlash` is simply set to true. By only applying the true option to `failureFlash`, the code will output the error messages produced by the authentication callback from the strategy connected by Passport.

Since the error message generated from the authentication callback used in each strategy is the most accurate, setting `failureFlash` to just true is the most standard approach.

However, in the latest version of Express, the functionality to display flash messages has been separated, so the `connect-flash` middleware must be installed to use it.

By using these built-in redirection functions provided by Passport, the actions leading to the next route handler upon success will not execute.

## 2.3 Not Using Sessions

Generally, once logged in, the login information is stored in the session. However, if certain information is extremely sensitive and requires authentication every time it is accessed, storing login information in the session may be unnecessary. In such cases, an option to not use sessions can be provided to the `authenticate` function.

```javascript
passport.authenticate('basic', { session: false })
//Does not use sessions
```

## 2.4 Handling Authentication Results with a Custom Callback

If you do not find the default options provided by Passport satisfactory, you can create a custom callback function that executes specific actions based on the authentication results (success/failure).

```javascript
app.get('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
      // If an exception occurs, err will contain a specific value. If no exception, it will be null.
    if (!user) { return res.redirect('/login'); }
      // On authentication failure, user will be set to false.
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
```

In this case, the `authenticate` function is not placed as a route middleware but rather within the route handler. This allows the callback invoked within `authenticate` to access `req` and `res`.

When using a custom callback, you will also need to write separate code for handling the session, such as using `req.logIn` as shown above.

# 3. Configuring Passport

To use Passport for authentication, three things are required:

1. Authentication strategy (Provider)
2. Application middleware
3. Session (not mandatory)

Let's examine each one.

## 3.1 Strategy

Passport does not have any special functionality on its own. It merely acts as middleware that intermediates with another provider that supplies authentication. The providers that Passport intermediates with are called strategies. There are various strategies such as the local strategy (authentication using username and password with `passport-local`) and strategies for logging in through services like Google/Facebook/Kakao (`passport-facebook`, etc.).

There are so many strategies that it is impossible to list them all; interested users can refer to this link (http://www.passportjs.org/packages/).

Therefore, before processing authentication through Passport, it is necessary to specify which strategy to use.

Strategy configuration can be done with the `passport.use()` function. For example, the code I wrote to use `passport-local`, which authenticates using username and password, is as follows. This code was slightly modified from the code provided in the official documentation.

```javascript
import passport from "passport";
import passportLocal from "passport-local";
import userList from "./userList.js";

const LocalStrategy = passportLocal.Strategy;

passport.use(
    new LocalStrategy(
        //verify callback
        (username, password, done) => {
            const result = userList.filter((user) => user.username === username);

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

```javascript
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    // This callback is invoked upon successful authentication
    res.redirect('/');
  }
);
```

This code is somewhat rudimentary. However, it is designed to work before connecting to a database. The general logic is as follows:

First, import the strategy for `passport-local`, and then feed in a callback for authentication (commonly referred to as the verify callback). The purpose of this callback is to verify whether the user (or request) is qualified. In other words, it serves as the authentication that Passport must pass to the application. It determines whether the password is correct, whether the request is valid, whether there is any error processing the request, etc.

Now let’s look at how this authentication callback operates.

When Passport validates the request, it retrieves the qualifications included in the request. This is somewhat akin to how one accesses `req.body` in a typical Express route handler. Here, the username and password are retrieved.

We then need to verify whether these values are indeed those of an existing user. Currently, a simple array is being used. `userList.js` contains an array of objects representing qualified users and their usernames and passwords.

```javascript
//userList.js
const userList = [
    {
        username: "test",
        password: "testpw"
    },
    {
        username: "test1",
        password: "testpw1"
    },
    {
        username: "test2",
        password: "testpw2"
    },
];

export default userList;
```

Returning to the authentication callback, we use the JavaScript filter function to check if there is a qualified user whose username matches the username received through the POST request. If such a user exists, we then check the password. Depending on whether these checks succeed or fail, the appropriate `done` method is applied.

### 3.1.1 About `done`

Reference materials for this section: zerocho's blog post (https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457)

So what is `done`? What role does it play? If the request is valid, the authentication callback calls the `done` callback to pass the authentication result back to Passport. A valid request does not necessarily mean that qualification has been verified. It means that there were no server errors or issues executing the authentication callback and that the result (success or failure) can be obtained normally.

Once `done` is called, the strategy callback from which it was called completes and returns to the authentication layer where the behavior will differ based on the result passed by the `done` callback.

To summarize:

---

A request is received at the domain of `app.post` -> The `passport.authenticate` function is called, which triggers the appropriate strategy callback according to its parameters. In the above code, the `LocalStrategy` callback is called -> Inside the `LocalStrategy` callback, authentication is carried out and `done` is called based on certain conditions -> `done` returns information about the outcome of the authentication attempt, and this information becomes the return value of the `authenticate` function -> Based on this return value, specific actions are taken or different callbacks are invoked in `app.post`.

---

What do the three arguments of `done` signify?

Firstly, the first argument is null in the code above, but it is reserved for server errors. As we are currently storing user information in a JavaScript array, if we were to use a database, errors could arise during the connection. This is where such errors would be placed. Hence, in the current situation, it is always null.

However, if a server error, such as a database connection failure, were to occur, `done` could be called as follows:

```javascript
return done(err);
// The callback used to connect to the database in Express often includes err as one of the arguments.
```

The second argument is the authentication result that should be forwarded to Passport upon successful authentication. If the authentication is successful, an object containing the details of the authenticated user is passed to Passport.

If, however, the authentication fails—due to an incorrect password, a non-existent username, etc.—the second argument to `done` should be set to false, indicating that the authentication has failed.

The third argument serves to convey additional information as error messages regarding the reasons for failure. This is useful in scenarios where flash messages need to be displayed upon authentication failure. For example, messages like "User does not exist" and "Incorrect password" signify different failure reasons, yet both indicate authentication failure. The additional information can be transmitted using the third argument to `done`.

The benefit of this method is that Passport can function independently of the specific strategy used for authentication. The Passport layer is not concerned with how user data is stored or how authentication proceeds. It merely passes incoming requests to whatever strategy is connected to Passport. Conversely, this also means that the Passport layer has no limitations on the authentication process, allowing it to proceed in a highly flexible manner.

## 3.2 Application Middleware

To use Passport in Express, middleware functions must be utilized. To initialize Passport, we use `passport.initialize()`, and if sessions are to be maintained for login, we also use `passport.session()`.

Middleware refers to the callbacks that a request goes through before reaching the actual `post`, `get`, etc. as a response to incoming requests via methods such as POST. Of course, the official documentation shows that we're also able to create and use our own middleware. Note, however, that you must include the `next` argument with `(req, res)` to ensure the request can pass on to the next middleware. Middleware will be organized separately later. For now, it’s sufficient to think of them as the callback functions through which requests (`req`) to the application must pass.

Since I performed authentication at the route for the domain `/login`, I added middleware to the router accordingly, as follows:

```javascript
router.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
    //.env used for session secret key management (using dotenv)
}));

router.use(express.urlencoded({ extended: false }));
router.use(passport.initialize());
router.use(passport.session());
```

If a request comes in from a user seeking authentication, the middleware added via `router.use()` will process before reaching the following code.

```javascript
app.post('/', 
  // The req that reaches here has already passed through the above middleware.
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    // This callback is called upon successful authentication.
    res.redirect('/');
  }
);
```

## 3.3 Sessions

On most websites, once logged in, the session is maintained until the browser is closed. It would be quite frustrating to have to log in again immediately after navigating to another page.

Therefore, almost every website only requires credential verification (i.e., login) once when accessing the site. If the login is successful, a session is created. This session persists through the browser until it is closed.

In detail, when a valid login request comes from the client, upon successful login, the server stores the username in the session and includes `set-cookie: sessionid` in the response headers. As a result, the client automatically includes `sessionid` with subsequent requests (like navigating to a different page). Upon receiving such requests, the server verifies the validity of the `sessionid` and processes the request accordingly.

To use such login sessions for authentication, Passport provides `serializeUser` and `deserializeUser`.

```javascript
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // id is stored in req.session.passport.user
    done(null, user);
});
```

`serializeUser` executes on successful login to receive the `user` transmitted from `done(null, user)` and stores it in the session. Meanwhile, `deserializeUser` compares the information in the session to the actual data every time a request comes in. The value of `user` in `done` from `deserializeUser` must match the type that was passed from `done` in `serializeUser`.

This is because `serializeUser` stores the `user` in the session, and `deserializeUser` confirms this against the actual data. If the types do not match—e.g., if `serializeUser` stored only `user.id`, but `deserializeUser` checks for the entire `user` in the session—authentication will fail.

These two methods for managing sessions are essential for Passport to operate correctly.

# 4. Implementing Login with Passport-local

The login strategy we commonly use, which implements authentication via username and password, is `passport-local`. To use it, the `passport-local` module is essential.

```
yarn add passport-local
```

Let’s install this via the terminal.

Before writing the code for login authentication, let’s first create a simple login form. Although testing with Postman or similar tools is acceptable, having a visual effect is more advantageous.

```html
<!-- loginView/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Form</title>
</head>
<body>
<form action="/login" method="post">
    <div>
        <label>Username: </label>
        <input type="text" name="username"/><br/>
    </div>
    <div>
        <label>Password: </label>
        <input type="password" name="password"/><br/>
    </div>
    <input type="submit" value="submit"/>
</form>
</body>
</html>
```

After creating this HTML and opening it in a browser, a simple yet familiar login form structure will appear.

![loginForm.png](./loginForm.png)

When the username and password are entered and submitted, a request containing this information will be sent to `/login`.

Now let’s configure Passport to handle this request.

First, we set up the necessary middleware to use Passport. We'll also create a simple page to show upon successful login.

```javascript
router.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
    //.env used for session secret key
}));

router.use(express.urlencoded({ extended: false }));
router.use(passport.initialize());
router.use(passport.session());

router.use("/", express.static(__dirname + "/server/loginView/index.html"));
router.use("/success", express.static(__dirname + "/server/loginView/success.html"));
```

```html
<!-- loginView/success.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>LOGIN SUCCESS</h1>
</body>
</html>
```

The reason for using `router.use` instead of the common `app.use` is that I wanted to have login operations handled on a separate login page rather than the homepage. If the login were to occur on the homepage, changing `router.use` to `app.use` would suffice. (In reality, the variable name is less pivotal than the difference between `express()` and `express.Router()`).

Next, let's define the strategy for Passport.

First, the required libraries and the information used for verification (which will be changed to use a database in the future, but for now we'll use the array stored in `userList.js`) must be imported.

```javascript
import passport from "passport";
import passportLocal from "passport-local";
import userList from "./userList.js";

const LocalStrategy = passportLocal.Strategy;
```

Then, add the strategy and the `serializeUser` and `deserializeUser` methods.

```javascript
passport.use(
    new LocalStrategy(
        (username, password, done) => {
            const result = userList.filter((user) => user.username === username);

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

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    // id is stored in req.session.passport.user
    done(null, username);
});
```

Finally, as the login form sends the request via the POST method to the specified domain, we configure it to handle this request.

```javascript
router.post("/", passport.authenticate("local",
    { successRedirect: "/login/success",
    failureRedirect: "/login",
    failureFlash: "Login Failed" })
);
```

When the domain `"/"` receives a request, the body of this request is passed to the `passport.authenticate` callback, which delegates the handling to `LocalStrategy`. The results of the request validation will then be passed back to the `passport.authenticate` stage, where it connects to the handling specified in the second argument. For instance, upon success, the user is redirected to `/login/success`.

## 4.1 Using Different Credential Names in LocalStrategy

By default, `LocalStrategy` uses the names `username` and `password` for authentication. However, if you want to use different names, such as using an email instead of a username, you can specify this change when defining the `LocalStrategy`.

```javascript
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  // Set the alternative credential names in the first argument of LocalStrategy
  (username, password, done) => {
    // ...
  }
));
```

In the next article, we will connect to a database containing user information and develop the logic to authenticate users and implement a simple registration feature.

References

Official documentation: http://www.passportjs.org/docs/

passport-local: http://www.passportjs.org/packages/passport-local/

Zerocho's blog post: https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457

2G Dev blog post: https://dev-dain.tistory.com/73?category=858558

https://stackoverflow.com/questions/26164837/difference-between-done-and-next-in-node-js-callbacks

Express middleware official documentation: https://expressjs.com/ko/guide/writing-middleware.html

Jenny Lee's log: https://velog.io/@wjddnjswjd12/node.js-express-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%EB%9E%80

Serialize and Deserialize: https://velog.io/@mollang/20.01.17-backend-serializeUser-%EC%99%80-deserializeUser

Cookies and Sessions in Web: https://chrisjune-13837.medium.com/web-%EC%BF%A0%ED%82%A4-%EC%84%B8%EC%85%98%EC%9D%B4%EB%9E%80-aa6bcb327582

Principles of Passport Operation and Authentication Implementation: https://jeonghwan-kim.github.io/dev/2020/06/20/passport.html