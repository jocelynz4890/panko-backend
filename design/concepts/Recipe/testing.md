[@implementation](implementation.md)

[@testing-concepts](../../background/testing-concepts.md)

[@example](../../background/example-test.md)
[@recipe](Recipe.md)

# test: Recipe

# response:

# approach: steps to testing

# file: src/concepts/Recipes/RecipesConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import RecipesConcept from "./RecipesConcept.ts";

Deno.test("--------------- 🥘 RecipesConcept - principle trace and edge cases 🥘 ---------------", async (t) => {
  const [db, client] = await testDb();
  const recipesConcept = new RecipesConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const snapshot1 = "snapshot:1" as ID;
  const snapshot2 = "snapshot:2" as ID;
  const snapshot3 = "snapshot:3" as ID;

  // Test Case #1: Principle Trace
  // "over time, a person uses recipes as named anchors... create a new recipe... add a new attempt... update the name... find it quickly"
  await t.step(
    "Test Case #1: Principle Trace - Create, Add Snapshots, Set Default, Edit, Review",
    async () => {
      console.log("[1] Alice creates a recipe for 'Spaghetti Carbonara'...");
      const createRes = await recipesConcept.createRecipe({
        user: alice,
        name: "Spaghetti Carbonara",
        description: "Classic Italian dish with eggs and cheese.",
      });

      // Check create success
      assertNotEquals("error" in createRes, true);
      const recipeId = (createRes as { recipe: ID }).recipe;
      console.log(`[1] Recipe created with ID: ${recipeId}`);

      // Verify initial state
      let state = await recipesConcept._getRecipe({ recipe: recipeId });
      assertEquals(state.length, 1);
      assertEquals(state[0].name, "Spaghetti Carbonara");
      assertEquals(state[0].snapshots.length, 0);

      console.log("[1.1] Alice cooks it once (Snapshot 1) and adds it...");
      const addSnap1 = await recipesConcept.addSnapshot({
        recipe: recipeId,
        snapshot: snapshot1,
      });
      assertNotEquals("error" in addSnap1, true);

      console.log("[1.2] Alice cooks it again (Snapshot 2) and adds it...");
      const addSnap2 = await recipesConcept.addSnapshot({
        recipe: recipeId,
        snapshot: snapshot2,
      });
      assertNotEquals("error" in addSnap2, true);

      // Verify snapshots
      state = await recipesConcept._getRecipe({ recipe: recipeId });
      assertEquals(state[0].snapshots.includes(snapshot1), true);
      assertEquals(state[0].snapshots.includes(snapshot2), true);
      console.log(`[1.2] Recipe now has ${state[0].snapshots.length} snapshots.`);

      console.log(
        "[1.3] Alice decides Snapshot 2 is the best representation and sets it as default...",
      );
      const setDefault = await recipesConcept.setDefaultSnapshot({
        recipe: recipeId,
        snapshot: snapshot2,
      });
      assertNotEquals("error" in setDefault, true);

      state = await recipesConcept._getRecipe({ recipe: recipeId });
      assertEquals(state[0].defaultSnapshot, snapshot2);
      console.log("[1.3] Default snapshot set successfully.");

      console.log(
        "[1.4] Alice updates the description to mention guanciale...",
      );
      const editRes = await recipesConcept.editRecipeName({
        recipe: recipeId,
        newName: "Authentic Carbonara",
        description: "Use Guanciale, not bacon!",
      });
      assertNotEquals("error" in editRes, true);

      state = await recipesConcept._getRecipe({ recipe: recipeId });
      assertEquals(state[0].name, "Authentic Carbonara");
      assertEquals(state[0].description, "Use Guanciale, not bacon!");
      console.log("[1.4] Recipe details updated.");
    },
  );

  // Test Case #2: Managing Snapshots (Removal & Constraints)
  await t.step(
    "Test Case #2: Managing Snapshots - Removal, Consistency of Default, Bad Inputs",
    async () => {
      // Setup: Create a new recipe for testing logic
      const createRes = await recipesConcept.createRecipe({
        user: bob,
        name: "Test Dish",
        description: "Testing logic",
      });
      const recipeId = (createRes as { recipe: ID }).recipe;
      await recipesConcept.addSnapshot({
        recipe: recipeId,
        snapshot: snapshot1,
      });
      await recipesConcept.addSnapshot({
        recipe: recipeId,
        snapshot: snapshot2,
      });
      await recipesConcept.setDefaultSnapshot({
        recipe: recipeId,
        snapshot: snapshot1,
      });

      console.log(
        "[2] Created 'Test Dish' with snapshots [1, 2], default is 1.",
      );

      console.log("[2.1] Attempting to set default to a non-existent snapshot (Snapshot 3)...");
      const badSetDefault = await recipesConcept.setDefaultSnapshot({
        recipe: recipeId,
        snapshot: snapshot3,
      });
      assertEquals("error" in badSetDefault, true);
      console.log(
        `[2.1] Correctly failed: ${(badSetDefault as { error: string }).error}`,
      );

      console.log("[2.2] Removing Snapshot 1 (which is currently default)...");
      const removeRes = await recipesConcept.removeSnapshot({
        recipe: recipeId,
        snapshot: snapshot1,
      });
      assertNotEquals("error" in removeRes, true);

      const state = await recipesConcept._getRecipe({ recipe: recipeId });
      assertEquals(state[0].snapshots.includes(snapshot1), false);
      assertEquals(state[0].snapshots.includes(snapshot2), true);
      assertEquals(state[0].defaultSnapshot, undefined); // Should be cleared
      console.log(
        "[2.2] Snapshot 1 removed. Verified defaultSnapshot was cleared because it matched the removed item.",
      );

      console.log("[2.3] Removing a snapshot that isn't there (Snapshot 3)...");
      // MongoDB $pull usually doesn't error if item not found, just modifies 0.
      // However, our spec implementation returns {} on success or error on 0 matches of RECIPE.
      // Since the recipe exists, this operation succeeds (no-op on list).
      const removeNonExistent = await recipesConcept.removeSnapshot({
        recipe: recipeId,
        snapshot: snapshot3,
      });
      assertNotEquals("error" in removeNonExistent, true);
      console.log("[2.3] Removal of non-existent snapshot handled gracefully (no-op).");
    },
  );

  // Test Case #3: Deletion & Isolation
  await t.step("Test Case #3: Recipe Deletion & Isolation", async () => {
    console.log("[3] Creating two recipes...");
    const r1 = await recipesConcept.createRecipe({
      user: alice,
      name: "Alice's Pie",
      description: ".",
    });
    const r2 = await recipesConcept.createRecipe({
      user: alice,
      name: "Alice's Stew",
      description: ".",
    });
    const id1 = (r1 as { recipe: ID }).recipe;
    const id2 = (r2 as { recipe: ID }).recipe;

    console.log("[3.1] Deleting 'Alice's Pie'...");
    const delRes = await recipesConcept.deleteRecipe({ recipe: id1 });
    assertNotEquals("error" in delRes, true);

    const check1 = await recipesConcept._getRecipe({ recipe: id1 });
    assertEquals(check1.length, 0);
    console.log("[3.1] 'Alice's Pie' deleted and not found via query.");

    const check2 = await recipesConcept._getRecipe({ recipe: id2 });
    assertEquals(check2.length, 1);
    console.log("[3.1] 'Alice's Stew' remains untouched.");

    console.log("[3.2] Attempting to delete non-existent recipe...");
    const delBad = await recipesConcept.deleteRecipe({ recipe: id1 });
    assertEquals("error" in delBad, true);
    console.log("[3.2] Correctly returned error for non-existent recipe.");
  });

  await client.close();
});
```

# trace:

1.  **Principle Trace**:
    *   **User Goal**: Track "Spaghetti Carbonara".
    *   **Action**: `createRecipe` creates the container. State: `{ name: "Spaghetti...", snapshots: [] }`.
    *   **Action**: `addSnapshot` (x2) populates history. State: `{ ..., snapshots: [s1, s2] }`.
    *   **Action**: `setDefaultSnapshot` highlights a specific success. State: `{ ..., defaultSnapshot: s2 }`.
    *   **Action**: `editRecipeName` refines the metadata. State: `{ name: "Authentic Carbonara", ... }`.
    *   **Result**: The user has successfully anchored the dish and curated its history.
2.  **Constraint Handling**:
    *   When a snapshot is removed (`removeSnapshot`), the system checks if it was the default. If so, `defaultSnapshot` is cleared to ensure state consistency (a recipe cannot have a default that isn't in its history).
    *   When setting a default, `setDefaultSnapshot` enforces that the target snapshot must already exist in the `snapshots` set via the query filter.
3.  **Lifecycle**:
    *   Creation and Deletion work as expected, cleaning up the document entirely.