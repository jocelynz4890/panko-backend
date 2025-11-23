---
timestamp: 'Sun Nov 23 2025 13:40:59 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_134059.97a3a4ce.md]]'
content_id: d8803f39e62f3d91781f94504f1e3341172f7991a0e9f1480b52a8553c193719
---

# file: src/concepts/Authentication/AuthenticationConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import { createHash, randomBytes } from "node:crypto";

// Declare collection prefix
const PREFIX = "Authentication.";

// Generic types
type User = ID;

/**
 * a set of Users with
 *   a username String
 *   a hashed password String
 *   a token String (implicit for session management)
 */
interface Users {
  _id: User;
  username: string;
  passwordHash: string;
  token?: string;
}

export default class AuthenticationConcept {
  users: Collection<Users>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
    // Ensure uniqueness of usernames at the database level
    this.users.createIndex({ username: 1 }, { unique: true });
  }

  /**
   * Helper function to hash passwords
   */
  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  /**
   * register (username: String, password: String): (user: User)
   *
   * **requires** no user exists with given username
   *
   * **effects** creates and stores a new User with the given username and hashed password, returns the new user
   */
  async register(
    { username, password }: { username: string; password: string },
  ): Promise<{ user?: User; error?: string }> {
    const existing = await this.users.findOne({ username });
    if (existing) {
      return { error: "Username already exists" };
    }

    const _id = freshID();
    const passwordHash = this.hashPassword(password);

    await this.users.insertOne({
      _id,
      username,
      passwordHash,
    });

    return { user: _id };
  }

  /**
   * authenticate (username: String, password: String): (user: User, token: String)
   *
   * **requires** a user to exist with the given username
   *
   * **effects** if a user with the given username exists and the given password matches the user's password 
   * then the user is authenticated and a session token is generated. Otherwise, access is denied.
   */
  async authenticate(
    { username, password }: { username: string; password: string },
  ): Promise<{ user?: User; token?: string; error?: string }> {
    const userDoc = await this.users.findOne({ username });

    if (!userDoc) {
      return { error: "Invalid username or password" };
    }

    const inputHash = this.hashPassword(password);
    if (inputHash !== userDoc.passwordHash) {
      return { error: "Invalid username or password" };
    }

    // Generate a simple random token
    const token = randomBytes(16).toString("hex");

    // Update state to remember this token (making the concept stateful regarding sessions)
    await this.users.updateOne(
      { _id: userDoc._id },
      { $set: { token } },
    );

    return { user: userDoc._id, token };
  }

  /**
   * validateToken (user:User, token:String):(user:User)
   *
   * **requires** user exists and token matches
   *
   * **effects** verifies that user is authenticated.
   */
  async validateToken(
    { user, token }: { user: User; token: string },
  ): Promise<{ user?: User; error?: string }> {
    const userDoc = await this.users.findOne({ _id: user });

    if (!userDoc) {
      return { error: "User not found" };
    }

    if (!userDoc.token || userDoc.token !== token) {
      return { error: "Invalid or expired token" };
    }

    return { user: userDoc._id };
  }
}
```
