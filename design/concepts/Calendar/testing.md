[@implementation](implementation.md)

[@testing-concepts](../../background/testing-concepts.md)

[@example](../../background/example-test.md)
[@recipe](Calendar.md)
# test: Calendar

# response:

# file: src/concepts/Calendar/CalendarConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import CalendarConcept from "./CalendarConcept.ts";

Deno.test("--------------- 📅 CalendarConcept - scheduling and management 📅 ---------------", async (t) => {
  const [db, client] = await testDb();
  const calendar = new CalendarConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;

  const pizzaRecipe = "recipe:Pizza" as ID;
  const pastaRecipe = "recipe:Pasta" as ID;

  // Dates
  const today = new Date("2023-10-25T12:00:00Z");
  const tomorrow = new Date("2023-10-26T12:00:00Z");

  await t.step(
    "Test Case #1: Principle - Assign recipe to date and verify",
    async () => {
      console.log("[1] Alice plans to cook Pizza today...");

      const assignRes = await calendar.assignRecipeToDate({
        user: alice,
        recipe: pizzaRecipe,
        date: today,
      });

      assertNotEquals("error" in assignRes, true);
      const scheduledId = (assignRes as { scheduledRecipe: ID }).scheduledRecipe;
      console.log(`[1] Scheduled Pizza with ID: ${scheduledId}`);

      console.log("[1] Verifying via query...");
      const recipes = await calendar._getScheduledRecipes({ user: alice });

      assertEquals(recipes.length, 1);
      assertEquals(recipes[0].scheduledRecipe.recipe, pizzaRecipe);
      assertEquals(recipes[0].scheduledRecipe.date, today);
      assertEquals(recipes[0].scheduledRecipe.scheduledRecipe, scheduledId);

      console.log("[1] ✅ Alice successfully scheduled a dish.");
    }
  );

  await t.step(
    "Test Case #2: Deleting a scheduled recipe",
    async () => {
      console.log("[2] Alice decides not to cook Pizza...");

      // First, find the ID (we know there is one from step 1)
      const recipesBefore = await calendar._getScheduledRecipes({ user: alice });
      const targetId = recipesBefore[0].scheduledRecipe.scheduledRecipe;

      const deleteRes = await calendar.deleteScheduledRecipe({ scheduledRecipe: targetId });
      assertNotEquals("error" in deleteRes, true);

      const recipesAfter = await calendar._getScheduledRecipes({ user: alice });
      assertEquals(recipesAfter.length, 0);

      console.log("[2] ✅ Scheduled recipe deleted.");
    }
  );

  await t.step(
    "Test Case #3: Bulk deletion by recipe (e.g. if original dish is deleted)",
    async () => {
      console.log("[3] Alice schedules Pasta for today and tomorrow...");

      await calendar.assignRecipeToDate({
        user: alice,
        recipe: pastaRecipe,
        date: today,
      });

      await calendar.assignRecipeToDate({
        user: alice,
        recipe: pastaRecipe,
        date: tomorrow,
      });

      // Also schedule Pizza to ensure it isn't deleted
      await calendar.assignRecipeToDate({
        user: alice,
        recipe: pizzaRecipe,
        date: tomorrow,
      });

      const recipesBefore = await calendar._getScheduledRecipes({ user: alice });
      assertEquals(recipesBefore.length, 3);
      console.log(`[3] Alice has ${recipesBefore.length} scheduled items (2 Pasta, 1 Pizza).`);

      console.log("[3] Deleting all scheduled instances of Pasta...");
      const bulkDeleteRes = await calendar.deleteAllScheduledRecipesWithRecipe({ recipe: pastaRecipe });
      assertNotEquals("error" in bulkDeleteRes, true);

      const recipesAfter = await calendar._getScheduledRecipes({ user: alice });
      assertEquals(recipesAfter.length, 1);
      assertEquals(recipesAfter[0].scheduledRecipe.recipe, pizzaRecipe);

      console.log("[3] ✅ Only Pizza remains. All Pasta instances removed.");
    }
  );

  await t.step(
    "Test Case #4: User Isolation",
    async () => {
      console.log("[4] Bob schedules Pizza...");
      await calendar.assignRecipeToDate({
        user: bob,
        recipe: pizzaRecipe,
        date: today,
      });

      const aliceRecipes = await calendar._getScheduledRecipes({ user: alice });
      const bobRecipes = await calendar._getScheduledRecipes({ user: bob });

      // From previous step, Alice has 1 Pizza. Bob just added 1 Pizza.
      assertEquals(aliceRecipes.length, 1);
      assertEquals(bobRecipes.length, 1);

      console.log("[4] Alice and Bob's calendars are distinct.");
    }
  );

  await client.close();
});
```

# trace:

The test suite demonstrates the functionality of the **Calendar** concept through four scenarios:

1.  **Principle Verification**: Alice assigns a "Pizza" recipe attempt to a specific date. This directly tests the principle: "when a person decides they want to make a particular dish on a specific day, they create a calendar entry that links that plan to the chosen date." The `assignRecipeToDate` action is called, and the state is verified using `_getScheduledRecipes`.
2.  **Single Deletion**: Alice removes the specific "Pizza" entry. This confirms the ability to `deleteScheduledRecipe` as required by the actions list.
3.  **Bulk Deletion**: Alice schedules "Pasta" multiple times. Then `deleteAllScheduledRecipesWithRecipe` is called (which would typically happen via a sync if the underlying Recipe was deleted). The trace verifies that all "Pasta" entries are gone, but the "Pizza" entry remains, ensuring specificity of the delete action.
4.  **Isolation**: Bob schedules items. The trace confirms that querying Alice's calendar does not return Bob's items, fulfilling the implicit requirement that `_getScheduledRecipes` filters by the user provided.