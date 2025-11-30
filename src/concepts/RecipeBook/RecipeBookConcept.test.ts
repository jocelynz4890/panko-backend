import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import RecipeBookConcept from "./RecipeBookConcept.ts";

Deno.test("--------------- 📖 RecipeBookConcept - Principle and Edge Cases 📖 ---------------", async (t) => {
  const [db, client] = await testDb();
  const concept = new RecipeBookConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const pastaDish = "dish:Pasta" as ID;
  const pizzaDish = "dish:Pizza" as ID;
  const saladDish = "dish:Salad" as ID;

  await t.step(
    "Test Case #1: Principle - Create, Populate, Rename, Refine, Delete",
    async () => {
      // 1. Create a recipe book
      console.log("[1] Alice creating 'Italian Favorites' book...");
      const createRes = await concept.createRecipeBook({
        user: alice,
        name: "Italian Favorites",
      });
      assertNotEquals("error" in createRes, true);
      const bookID = (createRes as { book: ID }).book;
      console.log(`[1] Created book with ID: ${bookID}`);

      // Verify initial state
      let books = await concept._getBook({ book: bookID });
      assertEquals(books[0].name, "Italian Favorites");
      assertEquals(books[0].dishes.length, 0);

      // 2. Add dishes
      console.log("[1.1] Adding 'Pasta' and 'Pizza' dishes...");
      const addPastaRes = await concept.addDishToBook({
        dish: pastaDish,
        book: bookID,
      });
      const addPizzaRes = await concept.addDishToBook({
        dish: pizzaDish,
        book: bookID,
      });
      assertNotEquals("error" in addPastaRes, true);
      assertNotEquals("error" in addPizzaRes, true);

      // Verify dishes added
      books = await concept._getBook({ book: bookID });
      assertEquals(books[0].dishes.includes(pastaDish), true);
      assertEquals(books[0].dishes.includes(pizzaDish), true);
      assertEquals(books[0].dishes.length, 2);
      console.log("[1.1] Dishes added successfully.");

      // 3. Rename book
      console.log("[1.2] Renaming book to 'Pasta & More'...");
      const renameRes = await concept.editRecipeBookName({
        book: bookID,
        newName: "Pasta & More",
      });
      assertNotEquals("error" in renameRes, true);

      books = await concept._getBook({ book: bookID });
      assertEquals(books[0].name, "Pasta & More");
      console.log("[1.2] Rename successful.");

      // 4. Remove a dish
      console.log("[1.3] Removing 'Pizza' from book...");
      const removeRes = await concept.removeDishFromBook({
        dish: pizzaDish,
        book: bookID,
      });
      assertNotEquals("error" in removeRes, true);

      books = await concept._getBook({ book: bookID });
      assertEquals(books[0].dishes.includes(pizzaDish), false);
      assertEquals(books[0].dishes.includes(pastaDish), true);
      assertEquals(books[0].dishes.length, 1);
      console.log("[1.3] Removal successful.");

      // 5. Delete the book
      console.log("[1.4] Deleting the recipe book...");
      const deleteRes = await concept.deleteRecipeBook({ book: bookID });
      assertNotEquals("error" in deleteRes, true);

      books = await concept._getBook({ book: bookID });
      assertEquals(books.length, 0);
      console.log("[1.4] Deletion successful.");
    },
  );

  await t.step("Test Case #2: Edge Cases (Sets and Invalid IDs)", async () => {
    // Setup: Create a book for Bob
    const createRes = await concept.createRecipeBook({
      user: bob,
      name: "Bob's BBQ",
    });
    const bookID = (createRes as { book: ID }).book;

    // Edge Case: Add duplicate dish
    console.log("[2] Adding 'Salad' twice to ensure set behavior...");
    await concept.addDishToBook({ dish: saladDish, book: bookID });
    await concept.addDishToBook({ dish: saladDish, book: bookID });

    const books = await concept._getBook({ book: bookID });
    assertEquals(books[0].dishes.length, 1);
    console.log("[2] Verified: Salad appears only once.");

    // Edge Case: Edit non-existent book
    console.log("[2] Attempting to rename non-existent book...");
    const fakeBookID = "book:fake" as ID;
    const errorRes = await concept.editRecipeBookName({
      book: fakeBookID,
      newName: "Ghost",
    });
    assertEquals("error" in errorRes, true);
    assertEquals((errorRes as { error: string }).error, "Recipe book not found");
    console.log("[2] Verified: Correct error returned.");
  });

  await t.step("Test Case #3: User Independence", async () => {
    // Alice created a book in step 1 but deleted it.
    // Bob has "Bob's BBQ" from step 2.
    // Let's verify Alice sees nothing and Bob sees his book.

    console.log("[3] Querying books for Alice (should be empty)...");
    const aliceBooks = await concept._getBooks({ user: alice });
    assertEquals(aliceBooks.length, 0);

    console.log("[3] Querying books for Bob (should have 1)...");
    const bobBooks = await concept._getBooks({ user: bob });
    assertEquals(bobBooks.length, 1);
    assertEquals(bobBooks[0].name, "Bob's BBQ");
    console.log("[3] Verified: Users only see their own books.");
  });

  await client.close();
});
