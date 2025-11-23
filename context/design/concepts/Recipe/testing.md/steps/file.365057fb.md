---
timestamp: 'Sun Nov 23 2025 13:37:03 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_133703.9c1a0bb1.md]]'
content_id: 365057fbe7341905d901e275a00d2ae354a9075b78f45e2e3f866558e478e27a
---

# file: src/concepts/Recipes/RecipesConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import RecipesConcept from "./RecipesConcept.ts";

Deno.test("RecipesConcept - Actions and State", async (t) => {
  const [db, client] = await testDb();
  const recipes = new RecipesConcept(db);
  const user = "user_alice" as ID;
  const snapshot1 = "snap_1" as ID;
  const snapshot2 = "snap_2" as ID;
  let recipeId: ID;

  await t.step("createRecipe: requires user; effects create new recipe", async () => {
    console.log("Action: createRecipe('user_alice', 'Apple Pie', 'Sweet granny smiths')");
    const result = await recipes.createRecipe({
      user,
      name: "Apple Pie",
      description: "Sweet granny smiths",
    });

    assertNotEquals(result.recipe, undefined);
    recipeId = result.recipe;

    const state = await recipes._getRecipe({ recipe: recipeId });
    assertEquals(state.length, 1);
    assertEquals(state[0].name, "Apple Pie");
    assertEquals(state[0].owner, user);
    assertEquals(state[0].snapshots, []);
    assertEquals(state[0].defaultSnapshot, undefined);
    console.log("Effect verified: Recipe created with empty snapshots.");
  });

  await t.step("editRecipeName: requires recipe exists; effects update name/desc", async () => {
    console.log("Action: editRecipeName(recipeId, 'Dutch Apple Pie', 'With crumble')");
    const result = await recipes.editRecipeName({
      recipe: recipeId,
      newName: "Dutch Apple Pie",
      description: "With crumble",
    });

    if ("error" in result) throw new Error(result.error);

    const state = await recipes._getRecipe({ recipe: recipeId });
    assertEquals(state[0].name, "Dutch Apple Pie");
    assertEquals(state[0].description, "With crumble");
    console.log("Effect verified: Name and description updated.");
  });

  await t.step("addSnapshot: requires recipe exists; effects adds to set", async () => {
    console.log(`Action: addSnapshot('${snapshot1}')`);
    await recipes.addSnapshot({ snapshot: snapshot1, recipe: recipeId });
    
    console.log(`Action: addSnapshot('${snapshot2}')`);
    await recipes.addSnapshot({ snapshot: snapshot2, recipe: recipeId });

    const state = await recipes._getRecipe({ recipe: recipeId });
    assertEquals(state[0].snapshots.length, 2);
    assertEquals(state[0].snapshots.includes(snapshot1), true);
    assertEquals(state[0].snapshots.includes(snapshot2), true);
    console.log("Effect verified: Snapshots added to set.");
  });

  await t.step("setDefaultSnapshot: requires snapshot in set; effects updates default", async () => {
    console.log(`Action: setDefaultSnapshot('${snapshot1}')`);
    const result = await recipes.setDefaultSnapshot({ snapshot: snapshot1, recipe: recipeId });
    if ("error" in result) throw new Error(result.error);

    const state = await recipes._getRecipe({ recipe: recipeId });
    assertEquals(state[0].defaultSnapshot, snapshot1);
    console.log("Effect verified: Default snapshot set.");
  });

  await t.step("setDefaultSnapshot: requires snapshot in set (failure case)", async () => {
    const badSnap = "snap_999" as ID;
    console.log(`Action: setDefaultSnapshot('${badSnap}') (should fail)`);
    const result = await recipes.setDefaultSnapshot({ snapshot: badSnap, recipe: recipeId });
    
    assertEquals("error" in result, true);
    console.log("Requirement verified: Action failed because snapshot was not in set.");
  });

  await t.step("removeSnapshot: requires recipe exists; effects removes from set and clears default", async () => {
    // snapshot1 is currently the default
    console.log(`Action: removeSnapshot('${snapshot1}') (is currently default)`);
    await recipes.removeSnapshot({ snapshot: snapshot1, recipe: recipeId });

    const state = await recipes._getRecipe({ recipe: recipeId });
    assertEquals(state[0].snapshots.includes(snapshot1), false);
    assertEquals(state[0].snapshots.includes(snapshot2), true);
    assertEquals(state[0].defaultSnapshot, undefined); // Should have been unset
    console.log("Effect verified: Snapshot removed and default cleared.");
  });

  await t.step("deleteRecipe: requires recipe exists; effects deletes doc", async () => {
    console.log("Action: deleteRecipe(recipeId)");
    await recipes.deleteRecipe({ recipe: recipeId });

    const state = await recipes._getRecipe({ recipe: recipeId });
    assertEquals(state.length, 0);
    console.log("Effect verified: Recipe deleted.");
  });

  await client.close();
});

Deno.test("RecipesConcept - Principle Trace", async (t) => {
  const [db, client] = await testDb();
  const recipes = new RecipesConcept(db);
  const user = "chef_bob" as ID;

  await t.step("Principle: Named anchors, history, and evolving experience", async () => {
    // Principle: "a person uses recipes as named anchors for the dishes they care about... create a new recipe"
    console.log("\n[Trace] User creates a recipe for 'Risotto'");
    const { recipe: risottoId } = await recipes.createRecipe({
      user,
      name: "Mushroom Risotto",
      description: "Tags: Italian, Dinner, Medium Difficulty",
    });

    // Principle: "add a new attempt to the recipe’s history"
    console.log("[Trace] User cooks it once, results are okay.");
    const attempt1 = "snapshot_attempt_1" as ID;
    await recipes.addSnapshot({ snapshot: attempt1, recipe: risottoId });

    // Principle: "add a new attempt... see how often they have made it"
    console.log("[Trace] User cooks it again, better results.");
    const attempt2 = "snapshot_attempt_2" as ID;
    await recipes.addSnapshot({ snapshot: attempt2, recipe: risottoId });
    
    // User decides the second attempt represents the dish best
    await recipes.setDefaultSnapshot({ snapshot: attempt2, recipe: risottoId });

    // Principle: "update the name or tags so that the recipe remains easy to find as their tastes and habits evolve"
    console.log("[Trace] User refines the recipe identity.");
    await recipes.editRecipeName({
      recipe: risottoId,
      newName: "Perfect Mushroom Risotto",
      description: "Tags: Italian, Dinner, Mastered",
    });

    // Verify final state matches the evolved history
    const [state] = await recipes._getRecipe({ recipe: risottoId });
    assertEquals(state.name, "Perfect Mushroom Risotto");
    assertEquals(state.snapshots.length, 2);
    assertEquals(state.defaultSnapshot, attempt2);
    console.log("[Trace] Validated: Recipe anchor updated and history preserved.");
  });

  await client.close();
});
```
