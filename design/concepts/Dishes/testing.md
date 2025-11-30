[@implementation](implementation.md)

[@testing-concepts](../../background/testing-concepts.md)

[@example](../../background/example-test.md)
[@Dishes](Dishes.md)

# test: Dishes

# response:

# file: src/concepts/Dishes/DishesConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import DishesConcept from "./DishesConcept.ts";

Deno.test("--------------- 🥘 DishesConcept - principle trace and edge cases 🥘 ---------------", async (t) => {
  const [db, client] = await testDb();
  const dishesConcept = new DishesConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const recipe1 = "recipe:1" as ID;
  const recipe2 = "recipe:2" as ID;
  const recipe3 = "recipe:3" as ID;

  // Test Case #1: Principle Trace
  await t.step(
    "Test Case #1: Principle Trace - Create, Add Recipes, Set Default, Edit, Review",
    async () => {
      const createRes = await dishesConcept.createDish({
        user: alice,
        name: "Spaghetti Carbonara",
        description: "Classic Italian dish with eggs and cheese.",
      });

      const dishId = (createRes as { dish: ID }).dish;

      // Verify initial state
      let state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].recipes.length, 0);

      await dishesConcept.addRecipe({ dish: dishId, recipe: recipe1 });
      await dishesConcept.addRecipe({ dish: dishId, recipe: recipe2 });

      state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].recipes.includes(recipe1), true);
      assertEquals(state[0].recipes.includes(recipe2), true);

      const setDefault = await dishesConcept.setDefaultRecipe({
        dish: dishId,
        recipe: recipe2,
      });
      assertNotEquals("error" in setDefault, true);

      await dishesConcept.editDishName({
        dish: dishId,
        newName: "Authentic Carbonara",
        description: "Use Guanciale, not bacon!",
      });

      state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].defaultRecipe, recipe2);
      assertEquals(state[0].name, "Authentic Carbonara");
    },
  );

  // Test Case #2: Managing Recipes (Removal & Constraints)
  await t.step(
    "Test Case #2: Managing Recipes - Removal, Consistency of Default, Bad Inputs",
    async () => {
      const createRes = await dishesConcept.createDish({
        user: bob,
        name: "Test Dish",
        description: "Testing logic",
      });
      const dishId = (createRes as { dish: ID }).dish;

      await dishesConcept.addRecipe({ dish: dishId, recipe: recipe1 });
      await dishesConcept.addRecipe({ dish: dishId, recipe: recipe2 });
      await dishesConcept.setDefaultRecipe({ dish: dishId, recipe: recipe1 });

      const badSetDefault = await dishesConcept.setDefaultRecipe({
        dish: dishId,
        recipe: recipe3,
      });
      assertEquals("error" in badSetDefault, true);

      await dishesConcept.removeRecipe({ dish: dishId, recipe: recipe1 });
      let state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].defaultRecipe, undefined);

      const removeNonExistent = await dishesConcept.removeRecipe({
        dish: dishId,
        recipe: recipe3,
      });
      assertNotEquals("error" in removeNonExistent, true);
    },
  );

  // Test Case #3: Deletion & Isolation
  await t.step("Test Case #3: Dish Deletion & Isolation", async () => {
    const r1 = await dishesConcept.createDish({
      user: alice,
      name: "Alice's Pie",
      description: ".",
    });
    const r2 = await dishesConcept.createDish({
      user: alice,
      name: "Alice's Stew",
      description: ".",
    });
    const id1 = (r1 as { dish: ID }).dish;
    const id2 = (r2 as { dish: ID }).dish;

    const delRes = await dishesConcept.deleteDish({ dish: id1 });
    assertNotEquals("error" in delRes, true);

    const check1 = await dishesConcept._getDish({ dish: id1 });
    assertEquals(check1.length, 0);

    const check2 = await dishesConcept._getDish({ dish: id2 });
    assertEquals(check2.length, 1);

    const delBad = await dishesConcept.deleteDish({ dish: id1 });
    assertEquals("error" in delBad, true);
  });

  await client.close();
});
```

# trace:

1.  **Principle Trace**:
    *   `createDish` establishes the anchor.
    *   `addRecipe` (twice) builds the dish’s recipe history and `setDefaultRecipe` highlights a preferred attempt.
    *   `editDishName` confirms metadata edits are persisted.
2.  **Constraint Handling**:
    *   Invalid defaults are rejected.
    *   Removing the default recipe clears `defaultRecipe`, and removing non-existent recipes is a no-op.
3.  **Lifecycle**:
    *   Independent dishes can be deleted safely, and attempting to delete the same dish twice yields an error, demonstrating isolation and proper error handling.