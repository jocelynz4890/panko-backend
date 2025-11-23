---
timestamp: 'Sun Nov 23 2025 14:42:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144247.07ffceb6.md]]'
content_id: 4acdd72e960f9f807b4bf0e107df07699f4da2838de03fe1be9f2ea546bf15a4
---

# API Specification: Authentication Concept

**Purpose:** Authenticate users so that each user of the app is a real person.

***

## API Endpoints

### POST /api/Authentication/register

**Description:** Registers a new user with a username and password.

**Requirements:**

* No user exists with the given `username`.

**Effects:**

* Creates and stores a new User with the given `username` and a hashed version of the `password`.
* Returns the new user ID.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**

```json
{
  "user": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Authentication/authenticate

**Description:** Authenticates a user and generates a session token.

**Requirements:**

* A user must exist with the given `username`.

**Effects:**

* If the `username` exists and the `password` matches, generates a session token and updates the user state.
* Returns the user ID and the token.
* If validation fails, access is denied.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**

```json
{
  "user": "string (ID)",
  "token": "string"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Authentication/validateToken

**Description:** Verifies that a user is currently authenticated with a valid token.

**Requirements:**

* The `user` exists.
* The `token` matches the stored token for that user.

**Effects:**

* Returns the user ID if authenticated.

**Request Body:**

```json
{
  "user": "string (ID)",
  "token": "string"
}
```

**Success Response Body (Action):**

```json
{
  "user": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***
