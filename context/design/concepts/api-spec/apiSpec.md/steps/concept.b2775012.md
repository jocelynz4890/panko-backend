---
timestamp: 'Sun Nov 23 2025 14:41:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144147.7f1a1117.md]]'
content_id: b277501239a67ebf8be797d02b22451c1b0422d905e5652f168ea3d584807524
---

# concept: Authentication

**purpose** authenticate users so that each user of the app is a real person

**principle** a user is authorized to access their profile only if they provide the correct username and password set during registration

**state**

```
a set of Users with
    a username String
    a hashed password String
    (implicitly) a current session token String
```

**actions**

* `register (username: String, password: String): (user: User)`
  * **requires** no user exists with given username
  * **effect** creates and stores a new User with the given username and hashed password, returns the new user
* `authenticate (username: String, password: String): (user: User, token: String)`
  * **requires** a user to exist with the given username
  * **effects** if a user with the given username exists and the given password matches the user's password then the user is authenticated and a session token is generated. Otherwise, access is denied.
* `validateToken (user: User, token: String): (user: User)`
  * **requires** user exists and token matches
  * **effects** verifies that user is authenticated.
