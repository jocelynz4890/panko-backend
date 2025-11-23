---
timestamp: 'Sun Nov 23 2025 13:39:45 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_133945.9c4df0b9.md]]'
content_id: d1b16bff4339f4073659e66c8fe21cfdd15c0c163e1da572315725cd2aa9614c
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
