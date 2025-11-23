[@testing-concepts](../../background/testing-concepts.md)

[@Authentication](Authentication.md)

[@implementation](implementation.md)

# test: authentication

# response:

# file: src/concepts/Authentication/AuthenticationConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import AuthenticationConcept from "./AuthenticationConcept.ts";

Deno.test("Authentication Concept", async (t) => {
  const [db, client] = await testDb();
  const auth = new AuthenticationConcept(db);

  let aliceID: string | undefined;
  let aliceToken: string | undefined;

  await t.step("action: register", async (t) => {
    await t.step("requires: no user exists with given username", async () => {
      const result = await auth.register({
        username: "alice",
        password: "securePassword123",
      });

      assertNotEquals(result.user, undefined, "User should be created");
      assertEquals(result.error, undefined, "No error should be returned");
      aliceID = result.user;
      console.log(`[Trace] Registered 'alice' with ID: ${aliceID}`);
    });

    await t.step("requires check: fails if username exists", async () => {
      const result = await auth.register({
        username: "alice",
        password: "differentPassword",
      });

      assertEquals(result.user, undefined, "User should not be created");
      assertNotEquals(
        result.error,
        undefined,
        "Error should be returned for duplicate user"
      );
      console.log(
        `[Trace] Duplicate registration for 'alice' failed as expected: ${result.error}`
      );
    });
  });

  await t.step("action: authenticate", async (t) => {
    await t.step("requires: user must exist", async () => {
      const result = await auth.authenticate({
        username: "bob",
        password: "anyPassword",
      });
      assertNotEquals(result.error, undefined);
      console.log(
        `[Trace] Authentication for non-existent 'bob' failed: ${result.error}`
      );
    });

    await t.step(
      "effects: access denied if password does not match",
      async () => {
        const result = await auth.authenticate({
          username: "alice",
          password: "wrongPassword",
        });
        assertNotEquals(result.error, undefined);
        console.log(
          `[Trace] Authentication for 'alice' with wrong password failed: ${result.error}`
        );
      }
    );

    await t.step(
      "effects: user authenticated and token generated if correct",
      async () => {
        const result = await auth.authenticate({
          username: "alice",
          password: "securePassword123",
        });
        assertEquals(result.user, aliceID);
        assertNotEquals(result.token, undefined);
        aliceToken = result.token;
        console.log(
          `[Trace] Authentication for 'alice' successful. Token: ${aliceToken}`
        );
      }
    );
  });

  await t.step("action: validateToken", async (t) => {
    if (!aliceID || !aliceToken) throw new Error("Setup failed");

    await t.step("requires: token must match", async () => {
      const result = await auth.validateToken({
        user: aliceID!,
        token: "invalidToken",
      });
      assertNotEquals(result.error, undefined);
      console.log(
        `[Trace] Validation with invalid token failed: ${result.error}`
      );
    });

    await t.step("effects: verifies user is authenticated", async () => {
      const result = await auth.validateToken({
        user: aliceID!,
        token: aliceToken!,
      });
      assertEquals(result.user, aliceID);
      assertEquals(result.error, undefined);
      console.log(`[Trace] Validation with valid token successful.`);
    });
  });

  await t.step("principle: full lifecycle check", async () => {
    // Principle: a user is authorized to access their profile only if they provide
    // the correct username and password set during registration.
    console.log(`[Principle] Verifying principle trace...`);

    // 1. Setup a new user 'principleUser'
    const reg = await auth.register({
      username: "principleUser",
      password: "p-pass",
    });
    const uID = reg.user!;

    // 2. Attempt access without authenticating (simulated by guessing token)
    const noAuth = await auth.validateToken({ user: uID, token: "guess" });
    assertNotEquals(
      noAuth.error,
      undefined,
      "Access denied without valid token"
    );

    // 3. Authenticate to get valid token
    const login = await auth.authenticate({
      username: "principleUser",
      password: "p-pass",
    });
    const validToken = login.token!;

    // 4. Verify access
    const access = await auth.validateToken({ user: uID, token: validToken });
    assertEquals(
      access.user,
      uID,
      "Access granted with credentials set during registration"
    );
    console.log(
      `[Principle] Confirmed: Registration -> Auth (Credentials) -> Access`
    );
  });

  await client.close();
});
```

# trace:

1.  **Register `alice`**: The system successfully creates a user with `username="alice"` and hashes the password `securePassword123`.
2.  **Duplicate Register**: Attempting to register `alice` again returns an error, satisfying the requirement that usernames are unique.
3.  **Authenticate Failures**:
    - `bob` (non-existent) returns an error.
    - `alice` with `wrongPassword` returns an error (verifying the password hash check).
4.  **Authenticate Success**: `alice` provides `securePassword123`. The system verifies the hash, generates a random session token, stores it in the user's state, and returns it.
5.  **Validate Token**:
    - Passing `alice`'s ID with a bad token returns an error.
    - Passing `alice`'s ID with the token returned from step 4 succeeds, confirming the user is authenticated.
6.  **Principle Verification**: A new user flow confirms that access (validation) is contingent on the possession of the token derived from the password set during registration.
