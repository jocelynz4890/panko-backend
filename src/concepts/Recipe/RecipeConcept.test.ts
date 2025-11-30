import { assertEquals, assertNotEquals, assert } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import RecipeConcept from "./RecipeConcept.ts";

Deno.test("--------------- 🍽️ RecipeConcept - Lifecycle, Constraints, and Associations 🍽️ ---------------", async (t) => {
  const [db, client] = await testDb();
  const recipeConcept = new RecipeConcept(db);

  // Mock Data
  const userAlice = "user:Alice" as ID;
  const dishPancakes = "dish:Pancakes" as ID;
  const dishWaffles = "dish:Waffles" as ID;

  // Helper to fetch directly from DB for verification
  const collection = db.collection("Recipe.recipes");

  // Test Case #1: Basic Lifecycle (Create, Edit, Delete)
  await t.step("Test Case #1: Recipe Lifecycle (Create -> Edit -> Delete)", async () => {
    const dateNow = new Date();

    console.log("[1] Creating a valid recipe for Pancakes...");
    const createRes = await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "Flour, Milk, Eggs",
      subname: "Fluffy Attempt",
      pictures: ["/img/pancake1.jpg"],
      date: dateNow,
      instructions: "Mix and fry",
      note: "Turned out great",
      ranking: 5,
      dish: dishPancakes,
    });

    const recipeId = createRes.recipe!;
    console.log(`[1] Created recipe: ${recipeId}`);

    // Verify in DB
    const fetched = await collection.findOne({ _id: recipeId });
    assert(fetched);
    assertEquals(fetched.subname, "Fluffy Attempt");
    assertEquals(fetched.ranking, 5);

    console.log("[1.1] Editing the recipe (Changing ranking and note)...");
    const editRes = await recipeConcept.editRecipe({
      recipe: recipeId,
      subname: "Fluffy Attempt (Revised)", // subname is required by signature
      note: "Actually a bit dry",
      ranking: 3,
    });

    assert(!editRes.error, "Edit should succeed");

    // Verify updates
    const updated = await collection.findOne({ _id: recipeId });
    assertEquals(updated?.note, "Actually a bit dry");
    assertEquals(updated?.ranking, 3);
    assertEquals(updated?.subname, "Fluffy Attempt (Revised)");
    // Check that fields not passed (like instructions) remained
    assertEquals(updated?.instructions, "Mix and fry");

    console.log("[1.2] Deleting the recipe...");
    const deleteRes = await recipeConcept.deleteRecipe({ recipe: recipeId });
    assert(!deleteRes.error, "Delete should succeed");

    // Verify deletion
    const deleted = await collection.findOne({ _id: recipeId });
    assertEquals(deleted, null);
    console.log("[1] Lifecycle verification complete.");
  });

  // Test Case #2: Constraints and Error Handling
  await t.step("Test Case #2: Constraints (Ranking limits & Non-existence)", async () => {
    console.log("[2] Attempting to create recipe with ranking 6...");
    const invalidCreateHigh = await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "...",
      subname: "Bad Rank",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 6,
      dish: dishPancakes,
    });
    assertEquals(invalidCreateHigh.error, "Ranking must be between 1 and 5");

    console.log("[2] Attempting to create recipe with ranking 0...");
    const invalidCreateLow = await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "...",
      subname: "Bad Rank",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 0,
      dish: dishPancakes,
    });
    assertEquals(invalidCreateLow.error, "Ranking must be between 1 and 5");

    // Create a valid one to test edit constraints
    const validRes = await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "Valid",
      subname: "Valid",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 3,
      dish: dishPancakes,
    });
    const validId = validRes.recipe!;

    console.log("[2] Attempting to edit recipe with invalid ranking...");
    const invalidEdit = await recipeConcept.editRecipe({
      recipe: validId,
      subname: "Valid",
      ranking: 10,
    });
    assertEquals(invalidEdit.error, "Ranking must be between 1 and 5");

    console.log("[2] Attempting to edit a non-existent recipe...");
    const fakeId = "fake_id" as ID;
    const missingEdit = await recipeConcept.editRecipe({
      recipe: fakeId,
      subname: "Ghost",
      ranking: 3,
    });
    assertEquals(missingEdit.error, "Recipe does not exist");

    console.log("[2] Attempting to delete a non-existent recipe...");
    const missingDelete = await recipeConcept.deleteRecipe({ recipe: fakeId });
    assertEquals(missingDelete.error, "Recipe does not exist");
  });

  // Test Case #3: Dish Association and Bulk Actions
  await t.step("Test Case #3: Dish Association & Bulk Deletion", async () => {
    console.log("[3] Seeding recipes: 2 for Pancakes, 1 for Waffles...");

    // Pancake Recipes
    await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "P1",
      subname: "Pancake 1",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 4,
      dish: dishPancakes,
    });
    await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "P2",
      subname: "Pancake 2",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 5,
      dish: dishPancakes,
    });

    // Waffle Recipe
    const waffleRes = await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "W1",
      subname: "Waffle 1",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 5,
      dish: dishWaffles,
    });
    const waffleId = waffleRes.recipe!;

    console.log("[3] Verifying retrieval by dish...");
    const pancakeRecipes = await recipeConcept._getRecipes({ dish: dishPancakes });
    assertEquals(pancakeRecipes.length, 3);

    const waffleRecipes = await recipeConcept._getRecipes({ dish: dishWaffles });
    assertEquals(waffleRecipes.length, 1);
    assertEquals(waffleRecipes[0]._id, waffleId);

    console.log("[3] Deleting all recipes for Pancakes...");
    await recipeConcept.deleteAllRecipesForDish({ dish: dishPancakes });

    console.log("[3] Verifying deletion...");
    const pancakeRecipesAfter = await recipeConcept._getRecipes({ dish: dishPancakes });
    assertEquals(pancakeRecipesAfter.length, 0);

    const waffleRecipesAfter = await recipeConcept._getRecipes({ dish: dishWaffles });
    assertEquals(waffleRecipesAfter.length, 1, "Waffle recipes should remain untouched");
  });

  await t.step("Test Case #4: Adding recipe pictures", async () => {
    console.log("[4] Creating a recipe without pictures...");
    const created = await recipeConcept.createRecipe({
      user: userAlice,
      ingredientsList: "Image test",
      subname: "Needs pics",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 4,
      dish: dishPancakes,
    });
    const imageRecipeId = created.recipe!;

    console.log("[4.1] Adding a picture to the recipe...");
    const imageUrl = "https://cdn.example.com/pancake.jpg";
    const addPictureRes = await recipeConcept.addRecipePicture({
      recipe: imageRecipeId,
      pictureUrl: imageUrl,
    });
    assert(!addPictureRes.error, "Should append picture");

    const updatedRecipe = await collection.findOne({ _id: imageRecipeId });
    assertEquals(updatedRecipe?.pictures, [imageUrl]);

    console.log("[4.2] Attempting to add a picture to a non-existent recipe...");
    const missingRes = await recipeConcept.addRecipePicture({
      recipe: "missing" as ID,
      pictureUrl: imageUrl,
    });
    assertEquals(missingRes.error, "Recipe does not exist");
  });

  await client.close();
});
