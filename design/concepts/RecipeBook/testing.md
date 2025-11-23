[@implementation](implementation.md)

[@testing-concepts](../../background/testing-concepts.md)

[@example](../../background/example-test.md)
[@RecipeBook](RecipeBook.md)
# test: RecipeBook

# response:

# file: src/concepts/RecipeBook/RecipeBookConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import RecipeBookConcept from "./RecipeBookConcept.ts";

Deno.test("--------------- 📖 RecipeBookConcept - Principle and Edge Cases 📖 ---------------", async (t) => {
  const [db, client] = await testDb();
  const concept = new RecipeBookConcept(db);

  const alice = "user:Alice" as ID;
  const bob = "user:Bob" as ID;
  const pastaRecipe = "recipe:Pasta" as ID;
  const pizzaRecipe = "recipe:Pizza" as ID;
  const saladRecipe = "recipe:Salad" as ID;

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
      assertEquals(books[0].recipes.length, 0);

      // 2. Add recipes
      console.log("[1.1] Adding 'Pasta' and 'Pizza' recipes...");
      const addPastaRes = await concept.addRecipeToBook({
        recipe: pastaRecipe,
        book: bookID,
      });
      const addPizzaRes = await concept.addRecipeToBook({
        recipe: pizzaRecipe,
        book: bookID,
      });
      assertNotEquals("error" in addPastaRes, true);
      assertNotEquals("error" in addPizzaRes, true);

      // Verify recipes added
      books = await concept._getBook({ book: bookID });
      assertEquals(books[0].recipes.includes(pastaRecipe), true);
      assertEquals(books[0].recipes.includes(pizzaRecipe), true);
      assertEquals(books[0].recipes.length, 2);
      console.log("[1.1] Recipes added successfully.");

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

      // 4. Remove a recipe
      console.log("[1.3] Removing 'Pizza' from book...");
      const removeRes = await concept.removeRecipeFromBook({
        recipe: pizzaRecipe,
        book: bookID,
      });
      assertNotEquals("error" in removeRes, true);

      books = await concept._getBook({ book: bookID });
      assertEquals(books[0].recipes.includes(pizzaRecipe), false);
      assertEquals(books[0].recipes.includes(pastaRecipe), true);
      assertEquals(books[0].recipes.length, 1);
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

    // Edge Case: Add duplicate recipe
    console.log("[2] Adding 'Salad' twice to ensure set behavior...");
    await concept.addRecipeToBook({ recipe: saladRecipe, book: bookID });
    await concept.addRecipeToBook({ recipe: saladRecipe, book: bookID });

    const books = await concept._getBook({ book: bookID });
    assertEquals(books[0].recipes.length, 1);
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
```

# trace:

1.  **Principle Fulfillment**: The test strictly follows the narrative of the principle:
    *   **Creation**: A book is initialized with a name and user.
    *   **Curating**: The user adds multiple recipes (state grows) and removes one (state shrinks), verifying the list content at each step.
    *   **Refining**: The user renames the collection to better fit the contents.
    *   **Termination**: The user deletes the book, removing it from persistence.
2.  **Data Integrity**:
    *   **Set Behavior**: Verified that adding the same recipe ID multiple times does not result in duplicates in the `recipes` array (using MongoDB `$addToSet`).
    *   **Independence**: Confirmed that queries for Alice do not return Bob's books, ensuring the concept properly separates user concerns via the query filtering.
3.  **Robustness**: Checked that operations on invalid IDs return explicit error objects rather than throwing unhandled exceptions.