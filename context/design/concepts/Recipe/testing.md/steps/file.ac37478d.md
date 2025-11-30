---
timestamp: 'Sun Nov 23 2025 14:26:48 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_142648.05372c0b.md]]'
content_id: ac37478d2048fcbb0aff0a27ea4a63e97d8e8701bc8587075b188c1ab564238c
---

# file: src/concepts/Snapshot/SnapshotConcept.test.ts

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import SnapshotConcept from "./SnapshotConcept.ts";

Deno.test("Snapshot Concept - Action Tests", async (t) => {
  const [db, client] = await testDb();
  const snapshotConcept = new SnapshotConcept(db);

  // Test Data
  const user = "user_alice" as ID;
  const recipe = "recipe_pizza" as ID;
  const date = new Date();

  let createdSnapshotId: ID;

  await t.step("createSnapshot: enforces ranking requirement (lower bound)", async () => {
    console.log("Trace: Attempting to create snapshot with ranking 0 (expecting error)");
    const result = await snapshotConcept.createSnapshot({
      user,
      ingredientsList: "Flour, Water",
      subname: "Attempt 1",
      pictures: [],
      date,
      instructions: "Mix and bake",
      note: "Bad",
      ranking: 0, // Invalid
      recipe,
    });

    assertEquals(result.error, "Ranking must be between 1 and 5");
  });

  await t.step("createSnapshot: enforces ranking requirement (upper bound)", async () => {
    console.log("Trace: Attempting to create snapshot with ranking 6 (expecting error)");
    const result = await snapshotConcept.createSnapshot({
      user,
      ingredientsList: "Flour, Water",
      subname: "Attempt 2",
      pictures: [],
      date,
      instructions: "Mix and bake",
      note: "Great",
      ranking: 6, // Invalid
      recipe,
    });

    assertEquals(result.error, "Ranking must be between 1 and 5");
  });

  await t.step("createSnapshot: successfully creates valid snapshot", async () => {
    console.log("Trace: Creating valid snapshot with ranking 3");
    const result = await snapshotConcept.createSnapshot({
      user,
      ingredientsList: "Flour, Water, Yeast",
      subname: "Standard Dough",
      pictures: ["img1.jpg"],
      date,
      instructions: "Knead 10 mins",
      note: "Decent outcome",
      ranking: 3,
      recipe,
    });

    assertNotEquals(result.snapshot, undefined);
    createdSnapshotId = result.snapshot!;
    console.log(`Trace: Created snapshot ${createdSnapshotId}`);

    // Verify state
    const snapshots = await snapshotConcept._getSnapshots({ recipe });
    assertEquals(snapshots.length, 1);
    assertEquals(snapshots[0]._id, createdSnapshotId);
    assertEquals(snapshots[0].ranking, 3);
  });

  await t.step("editSnapshot: enforces requirements", async () => {
    console.log("Trace: Attempting edit with invalid ranking");
    const failResult = await snapshotConcept.editSnapshot({
      snapshot: createdSnapshotId,
      ingredientsList: "Flour, Water, Yeast",
      subname: "Standard Dough",
      pictures: [],
      date,
      instructions: "Knead 10 mins",
      note: "Edited note",
      ranking: 6, // Invalid
    });
    assertEquals(failResult.error, "Ranking must be between 1 and 5");

    console.log("Trace: Attempting edit on non-existent snapshot");
    const missingResult = await snapshotConcept.editSnapshot({
      snapshot: "missing_id" as ID,
      ingredientsList: "",
      subname: "",
      pictures: [],
      date,
      instructions: "",
      note: "",
      ranking: 3,
    });
    assertEquals(missingResult.error, "Snapshot does not exist");
  });

  await t.step("editSnapshot: successfully updates state", async () => {
    console.log("Trace: Editing snapshot to improve ranking and note");
    const result = await snapshotConcept.editSnapshot({
      snapshot: createdSnapshotId,
      ingredientsList: "Flour, Water, Yeast, Oil", // Changed
      subname: "Enriched Dough", // Changed
      pictures: ["img1.jpg", "img2.jpg"],
      date,
      instructions: "Knead 15 mins",
      note: "Much better with oil",
      ranking: 4, // Changed
    });

    assertEquals(result.snapshot, createdSnapshotId);

    // Verify update via query
    const snapshots = await snapshotConcept._getSnapshots({ recipe });
    const updated = snapshots.find((s) => s._id === createdSnapshotId);
    assertEquals(updated?.ingredientsList, "Flour, Water, Yeast, Oil");
    assertEquals(updated?.ranking, 4);
    console.log("Trace: Verified snapshot updated in DB");
  });

  await t.step("deleteSnapshot: successfully removes snapshot", async () => {
    console.log(`Trace: Deleting snapshot ${createdSnapshotId}`);
    const result = await snapshotConcept.deleteSnapshot({ snapshot: createdSnapshotId });
    assertEquals(result.snapshot, createdSnapshotId);

    // Verify deletion
    const snapshots = await snapshotConcept._getSnapshots({ recipe });
    assertEquals(snapshots.length, 0);
    console.log("Trace: Verified snapshot removed from DB");
  });

  await t.step("deleteSnapshot: handles non-existent snapshot", async () => {
    console.log("Trace: Attempting delete on already deleted snapshot");
    const result = await snapshotConcept.deleteSnapshot({ snapshot: createdSnapshotId });
    assertEquals(result.error, "Snapshot does not exist");
  });

  await client.close();
});

Deno.test("Snapshot Concept - Principle Trace: Iterative Cooking History", async (t) => {
  const [db, client] = await testDb();
  const snapshotConcept = new SnapshotConcept(db);

  const user = "chef_alice" as ID;
  const recipeSourdough = "recipe_sourdough" as ID;
  const recipeOther = "recipe_cake" as ID;

  let snap1: ID;
  let snap2: ID;

  await t.step("1. User records first attempt (the baseline)", async () => {
    console.log("Trace: Alice creates first sourdough attempt (dense)");
    const res = await snapshotConcept.createSnapshot({
      user,
      ingredientsList: "500g Flour, 300g Water",
      subname: "Low Hydration",
      pictures: ["attempt1.png"],
      date: new Date("2023-01-01"),
      instructions: "Bake at 400F",
      note: "Too dense, hard crust",
      ranking: 2,
      recipe: recipeSourdough,
    });
    snap1 = res.snapshot!;
  });

  await t.step("2. User records second attempt (the variation)", async () => {
    console.log("Trace: Alice creates second attempt (higher hydration)");
    const res = await snapshotConcept.createSnapshot({
      user,
      ingredientsList: "500g Flour, 375g Water",
      subname: "High Hydration",
      pictures: ["attempt2.png"],
      date: new Date("2023-01-08"),
      instructions: "Bake at 450F",
      note: "Better open crumb",
      ranking: 4,
      recipe: recipeSourdough,
    });
    snap2 = res.snapshot!;
  });

  await t.step("3. Consistency check: Ensure isolation from other recipes", async () => {
    console.log("Trace: Creating a snapshot for a different recipe (Cake)");
    await snapshotConcept.createSnapshot({
      user,
      ingredientsList: "Sugar, Spice",
      subname: "Bday Cake",
      pictures: [],
      date: new Date(),
      instructions: "Mix",
      note: "Yum",
      ranking: 5,
      recipe: recipeOther,
    });

    const sourdoughSnaps = await snapshotConcept._getSnapshots({ recipe: recipeSourdough });
    assertEquals(sourdoughSnaps.length, 2, "Should only see sourdough snapshots");
    console.log("Trace: Query confirms isolation by recipe ID");
  });

  await t.step("4. User reviews and refines history", async () => {
    console.log("Trace: Alice updates notes on the second attempt");
    await snapshotConcept.editSnapshot({
      snapshot: snap2,
      ingredientsList: "500g Flour, 375g Water",
      subname: "High Hydration",
      pictures: ["attempt2.png"],
      date: new Date("2023-01-08"),
      instructions: "Bake at 450F",
      note: "Better open crumb. REVISION: Add steam tray!", // Updated
      ranking: 5, // Bumped ranking
    });

    const updatedSnap2 = (await snapshotConcept._getSnapshots({ recipe: recipeSourdough }))
      .find((s) => s._id === snap2);
    
    assertEquals(updatedSnap2?.note, "Better open crumb. REVISION: Add steam tray!");
    assertEquals(updatedSnap2?.ranking, 5);
  });

  await t.step("5. Cleanup: User deletes the failed first attempt", async () => {
    console.log("Trace: Alice deletes the dense loaf snapshot");
    await snapshotConcept.deleteSnapshot({ snapshot: snap1 });

    const finalHistory = await snapshotConcept._getSnapshots({ recipe: recipeSourdough });
    assertEquals(finalHistory.length, 1);
    assertEquals(finalHistory[0]._id, snap2);
    console.log("Trace: History now reflects only the successful iteration");
  });

  await t.step("6. Bulk Cleanup: Deleting recipe clears history", async () => {
    console.log("Trace: Deleting all snapshots for Sourdough");
    await snapshotConcept.deleteAllSnapshotsForRecipe({ recipe: recipeSourdough });

    const clearedHistory = await snapshotConcept._getSnapshots({ recipe: recipeSourdough });
    assertEquals(clearedHistory.length, 0);
    
    // Ensure Cake still exists
    const cakeHistory = await snapshotConcept._getSnapshots({ recipe: recipeOther });
    assertEquals(cakeHistory.length, 1);
    console.log("Trace: Sourdough history cleared, Cake history intact");
  });

  await client.close();
});
```
