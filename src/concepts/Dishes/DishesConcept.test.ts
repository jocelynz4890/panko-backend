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
  // "over time, a person uses dishes as named anchors... create a new dish... add a new attempt... update the name... find it quickly"
  await t.step(
    "Test Case #1: Principle Trace - Create, Add Recipes, Set Default, Edit, Review",
    async () => {
      console.log("[1] Alice creates a dish for 'Spaghetti Carbonara'...");
      const createRes = await dishesConcept.createDish({
        user: alice,
        name: "Spaghetti Carbonara",
        description: "Classic Italian dish with eggs and cheese.",
      });

      // Check create success
      assertNotEquals("error" in createRes, true);
      const dishId = (createRes as { dish: ID }).dish;
      console.log(`[1] Dish created with ID: ${dishId}`);

      // Verify initial state
      let state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state.length, 1);
      assertEquals(state[0].name, "Spaghetti Carbonara");
      assertEquals(state[0].recipes.length, 0);

      console.log("[1.1] Alice cooks it once (Recipe 1) and adds it...");
      const addRecipe1 = await dishesConcept.addRecipe({
        dish: dishId,
        recipe: recipe1,
      });
      assertNotEquals("error" in addRecipe1, true);

      console.log("[1.2] Alice cooks it again (Recipe 2) and adds it...");
      const addRecipe2 = await dishesConcept.addRecipe({
        dish: dishId,
        recipe: recipe2,
      });
      assertNotEquals("error" in addRecipe2, true);

      // Verify recipes
      state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].recipes.includes(recipe1), true);
      assertEquals(state[0].recipes.includes(recipe2), true);
      console.log(`[1.2] Dish now has ${state[0].recipes.length} recipes.`);

      console.log(
        "[1.3] Alice decides Recipe 2 is the best representation and sets it as default...",
      );
      const setDefault = await dishesConcept.setDefaultRecipe({
        dish: dishId,
        recipe: recipe2,
      });
      assertNotEquals("error" in setDefault, true);

      state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].defaultRecipe, recipe2);
      console.log("[1.3] Default recipe set successfully.");

      console.log(
        "[1.4] Alice updates the description to mention guanciale...",
      );
      const editRes = await dishesConcept.editDishName({
        dish: dishId,
        newName: "Authentic Carbonara",
        description: "Use Guanciale, not bacon!",
      });
      assertNotEquals("error" in editRes, true);

      state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].name, "Authentic Carbonara");
      assertEquals(state[0].description, "Use Guanciale, not bacon!");
      console.log("[1.4] Dish details updated.");
    },
  );

  // Test Case #2: Managing Recipes (Removal & Constraints)
  await t.step(
    "Test Case #2: Managing Recipes - Removal, Consistency of Default, Bad Inputs",
    async () => {
      // Setup: Create a new dish for testing logic
      const createRes = await dishesConcept.createDish({
        user: bob,
        name: "Test Dish",
        description: "Testing logic",
      });
      const dishId = (createRes as { dish: ID }).dish;
      await dishesConcept.addRecipe({
        dish: dishId,
        recipe: recipe1,
      });
      await dishesConcept.addRecipe({
        dish: dishId,
        recipe: recipe2,
      });
      await dishesConcept.setDefaultRecipe({
        dish: dishId,
        recipe: recipe1,
      });

      console.log(
        "[2] Created 'Test Dish' with recipes [1, 2], default is 1.",
      );

      console.log("[2.1] Attempting to set default to a non-existent recipe (Recipe 3)...");
      const badSetDefault = await dishesConcept.setDefaultRecipe({
        dish: dishId,
        recipe: recipe3,
      });
      assertEquals("error" in badSetDefault, true);
      console.log(
        `[2.1] Correctly failed: ${(badSetDefault as { error: string }).error}`,
      );

      console.log("[2.2] Removing Recipe 1 (which is currently default)...");
      const removeRes = await dishesConcept.removeRecipe({
        dish: dishId,
        recipe: recipe1,
      });
      assertNotEquals("error" in removeRes, true);

      const state = await dishesConcept._getDish({ dish: dishId });
      assertEquals(state[0].recipes.includes(recipe1), false);
      assertEquals(state[0].recipes.includes(recipe2), true);
      assertEquals(state[0].defaultRecipe, undefined); // Should be cleared
      console.log(
        "[2.2] Recipe 1 removed. Verified defaultRecipe was cleared because it matched the removed item.",
      );

      console.log("[2.3] Removing a recipe that isn't there (Recipe 3)...");
      // MongoDB $pull usually doesn't error if item not found, just modifies 0.
      // However, our spec implementation returns {} on success or error on 0 matches of DISH.
      // Since the dish exists, this operation succeeds (no-op on list).
      const removeNonExistent = await dishesConcept.removeRecipe({
        dish: dishId,
        recipe: recipe3,
      });
      assertNotEquals("error" in removeNonExistent, true);
      console.log("[2.3] Removal of non-existent recipe handled gracefully (no-op).");
    },
  );

  // Test Case #3: Deletion & Isolation
  await t.step("Test Case #3: Dish Deletion & Isolation", async () => {
    console.log("[3] Creating two dishes...");
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

    console.log("[3.1] Deleting 'Alice's Pie'...");
    const delRes = await dishesConcept.deleteDish({ dish: id1 });
    assertNotEquals("error" in delRes, true);

    const check1 = await dishesConcept._getDish({ dish: id1 });
    assertEquals(check1.length, 0);
    console.log("[3.1] 'Alice's Pie' deleted and not found via query.");

    const check2 = await dishesConcept._getDish({ dish: id2 });
    assertEquals(check2.length, 1);
    console.log("[3.1] 'Alice's Stew' remains untouched.");

    console.log("[3.2] Attempting to delete non-existent dish...");
    const delBad = await dishesConcept.deleteDish({ dish: id1 });
    assertEquals("error" in delBad, true);
    console.log("[3.2] Correctly returned error for non-existent dish.");
  });

  await client.close();
});
