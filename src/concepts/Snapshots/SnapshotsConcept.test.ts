import { assertEquals, assert } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import type { ID } from "@utils/types.ts";
import SnapshotConcept from "./SnapshotsConcept.ts";

const asID = (value: string) => value as ID;
const TEST_USER = asID("user:test");
type SnapshotDoc = Awaited<ReturnType<SnapshotConcept["_getSnapshots"]>>[number];

Deno.test("Snapshot Concept - Action Tests", async (t) => {
  const [db, client] = await testDb();
  const concept = new SnapshotConcept(db);

  try {
    await t.step("createSnapshot: enforces ranking requirements", async () => {
      // Attempt to create with invalid ranking (> 5)
      const resultInvalid = await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "flour, water",
        subname: "Failed Attempt",
        pictures: [],
        date: new Date(),
        instructions: "Mix",
        note: "Bad",
        ranking: 6,
        recipe: asID("recipe:1"),
      });

      console.log("Trace: createSnapshot with ranking 6 returned:", resultInvalid);
      assert(resultInvalid.error, "Should return error for ranking > 5");

      // Create with valid ranking
      const resultValid = await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "flour, water, yeast",
        subname: "Good Attempt",
        pictures: ["img1.jpg"],
        date: new Date(),
        instructions: "Mix and wait",
        note: "Better",
        ranking: 4,
        recipe: asID("recipe:1"),
      });

      console.log("Trace: createSnapshot with ranking 4 returned:", resultValid);
      assert(resultValid.snapshot, "Should return snapshot ID");
    });

    await t.step("editSnapshot: updates state and checks existence", async () => {
      // Setup
      const { snapshot } = await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "eggs",
        subname: "Omelette",
        pictures: [],
        date: new Date(),
        instructions: "Fry",
        note: "Ok",
        ranking: 3,
        recipe: asID("recipe:2"),
      });
      assert(snapshot);

      // Test Effect: Update fields
      const updateRes = await concept.editSnapshot({
        snapshot,
        ingredientsList: "eggs, cheese",
        subname: "Cheese Omelette",
        pictures: [],
        date: new Date(),
        instructions: "Fry with cheese",
        note: "Yummy",
        ranking: 5,
      });
      
      assert(!updateRes.error);
      console.log("Trace: Edited snapshot successfully");

      // Verify Effect
      const stored = await concept._getSnapshots({ recipe: asID("recipe:2") });
      const updated = stored.find((s: SnapshotDoc) => s._id === snapshot);
      assertEquals(updated?.subname, "Cheese Omelette");
      assertEquals(updated?.ranking, 5);
      console.log("Trace: Verified state update in DB");

      // Test Requirement: Snapshot exists
      const nonExistentRes = await concept.editSnapshot({
        snapshot: asID("snapshot:fake"),
        ingredientsList: "",
        subname: "",
        pictures: [],
        date: new Date(),
        instructions: "",
        note: "",
        ranking: 3,
      });
      assert(nonExistentRes.error, "Should fail when editing non-existent snapshot");
    });

    await t.step("deleteSnapshot: removes item", async () => {
      const { snapshot } = await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "water",
        subname: "Ice",
        pictures: [],
        date: new Date(),
        instructions: "Freeze",
        note: "Cold",
        ranking: 5,
        recipe: asID("recipe:3"),
      });
      assert(snapshot);

      const deleteRes = await concept.deleteSnapshot({ snapshot });
      assert(!deleteRes.error);
      console.log("Trace: Deleted snapshot");

      const stored = await concept._getSnapshots({ recipe: asID("recipe:3") });
      assertEquals(stored.length, 0, "Snapshot should be removed from DB");
    });

    await t.step("deleteAllSnapshotsForRecipe: removes all for specific recipe", async () => {
      // Create 2 for recipe A, 1 for recipe B
      await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "A1", subname: "A1", pictures: [], date: new Date(), instructions: "", note: "", ranking: 3, recipe: asID("recipe:A"),
      });
      await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "A2", subname: "A2", pictures: [], date: new Date(), instructions: "", note: "", ranking: 4, recipe: asID("recipe:A"),
      });
      await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "B1", subname: "B1", pictures: [], date: new Date(), instructions: "", note: "", ranking: 5, recipe: asID("recipe:B"),
      });

      // Action
      await concept.deleteAllSnapshotsForRecipe({ recipe: asID("recipe:A") });
      console.log("Trace: Deleted all snapshots for recipe:A");

      // Verify
      const remainingA = await concept._getSnapshots({ recipe: asID("recipe:A") });
      const remainingB = await concept._getSnapshots({ recipe: asID("recipe:B") });

      assertEquals(remainingA.length, 0, "Recipe A snapshots should be gone");
      assertEquals(remainingB.length, 1, "Recipe B snapshots should remain");
    });
  } finally {
    await client.close();
  }
});

Deno.test("Snapshot Concept - Principle Trace", async (t) => {
  const [db, client] = await testDb();
  const concept = new SnapshotConcept(db);
  const RECIPE_ID = asID("recipe:sour-dough");

  try {
    await t.step("Principle: Cook compares attempts and learns from variations", async () => {
      console.log("\n--- Start Principle Trace ---");

      // 1. User makes a dish (First attempt)
      console.log("Action: Creating first snapshot (Attempt 1)...");
      const attempt1 = await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "500g flour, 350g water, 10g salt, starter",
        subname: "First Loaf",
        pictures: ["loaf1_crumb.jpg"],
        date: new Date("2023-01-01"),
        instructions: "Bulk ferment 4 hours",
        note: "Dough was a bit sticky, crumb tight.",
        ranking: 3,
        recipe: RECIPE_ID,
      });
      assert(attempt1.snapshot);

      // 2. User makes the dish again with variation (Second attempt)
      console.log("Action: Creating second snapshot (Attempt 2) with variations...");
      const attempt2 = await concept.createSnapshot({
        user: TEST_USER,
        ingredientsList: "500g flour, 325g water, 10g salt, starter",
        subname: "Lower Hydration",
        pictures: ["loaf2_crumb.jpg"],
        date: new Date("2023-01-08"),
        instructions: "Bulk ferment 5 hours",
        note: "Easier to handle, better spring.",
        ranking: 5,
        recipe: RECIPE_ID,
      });
      assert(attempt2.snapshot);

      // 3. User reviews history to decide on next attempt
      console.log("Action: Reviewing history...");
      const history = await concept._getSnapshots({ recipe: RECIPE_ID });
      
      // Sort by date to simulate chronological review
      history.sort(
        (a: SnapshotDoc, b: SnapshotDoc) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      assertEquals(history.length, 2);
      assertEquals(history[0].subname, "First Loaf");
      assertEquals(history[1].subname, "Lower Hydration"); 
      
      console.log(`User sees: Attempt 1 ranked ${history[0].ranking}, Attempt 2 ranked ${history[1].ranking}`);
      console.log("Observation: User learns that lower hydration worked better.");

      // 4. User realizes they forgot to note the temperature in Attempt 2 and edits it
      console.log("Action: Editing Attempt 2 to add context...");
      await concept.editSnapshot({
        snapshot: attempt2.snapshot!,
        ingredientsList: "500g flour, 325g water, 10g salt, starter",
        subname: "Lower Hydration",
        pictures: ["loaf2_crumb.jpg"],
        date: new Date("2023-01-08"),
        instructions: "Bulk ferment 5 hours at 75F", // Changed
        note: "Easier to handle, better spring.",
        ranking: 5,
      });

      const updatedAttempt2 = (await concept._getSnapshots({ recipe: RECIPE_ID })).find(
        (s: SnapshotDoc) => s._id === attempt2.snapshot,
      );
      assertEquals(updatedAttempt2?.instructions, "Bulk ferment 5 hours at 75F");

      console.log("--- End Principle Trace ---");
    });
  } finally {
    await client.close();
  }
});