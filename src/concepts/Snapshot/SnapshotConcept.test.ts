import { assertEquals, assertNotEquals, assert } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import SnapshotConcept from "./SnapshotConcept.ts";
import { privateEncrypt } from "node:crypto";

Deno.test("--------------- 📸 SnapshotConcept - Lifecycle, Constraints, and Associations 📸 ---------------", async (t) => {
  const [db, client] = await testDb();
  const snapshotConcept = new SnapshotConcept(db);

  // Mock Data
  const userAlice = "user:Alice" as ID;
  const recipePancakes = "recipe:Pancakes" as ID;
  const recipeWaffles = "recipe:Waffles" as ID;

  // Helper to fetch directly from DB for verification
  const collection = db.collection("Snapshot.snapshots");

  // Test Case #1: Basic Lifecycle (Create, Edit, Delete)
  await t.step("Test Case #1: Snapshot Lifecycle (Create -> Edit -> Delete)", async () => {
    const dateNow = new Date();

    console.log("[1] Creating a valid snapshot for Pancakes...");
    const createRes = await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "Flour, Milk, Eggs",
      subname: "Fluffy Attempt",
      pictures: ["/img/pancake1.jpg"],
      date: dateNow,
      instructions: "Mix and fry",
      note: "Turned out great",
      ranking: 5,
      recipe: recipePancakes,
    });

    const snapshotId = createRes.snapshot!;
    console.log(`[1] Created snapshot: ${snapshotId}`);

    // Verify in DB
    const fetched = await collection.findOne({ _id: snapshotId });
    assert(fetched);
    assertEquals(fetched.subname, "Fluffy Attempt");
    assertEquals(fetched.ranking, 5);

    console.log("[1.1] Editing the snapshot (Changing ranking and note)...");
    const editRes = await snapshotConcept.editSnapshot({
      snapshot: snapshotId,
      subname: "Fluffy Attempt (Revised)", // subname is required by signature
      note: "Actually a bit dry",
      ranking: 3,
    });

    assert(!editRes.error, "Edit should succeed");

    // Verify updates
    const updated = await collection.findOne({ _id: snapshotId });
    assertEquals(updated?.note, "Actually a bit dry");
    assertEquals(updated?.ranking, 3);
    assertEquals(updated?.subname, "Fluffy Attempt (Revised)");
    // Check that fields not passed (like instructions) remained
    assertEquals(updated?.instructions, "Mix and fry");

    console.log("[1.2] Deleting the snapshot...");
    const deleteRes = await snapshotConcept.deleteSnapshot({ snapshot: snapshotId });
    assert(!deleteRes.error, "Delete should succeed");

    // Verify deletion
    const deleted = await collection.findOne({ _id: snapshotId });
    assertEquals(deleted, null);
    console.log("[1] Lifecycle verification complete.");
  });

  // Test Case #2: Constraints and Error Handling
  await t.step("Test Case #2: Constraints (Ranking limits & Non-existence)", async () => {
    console.log("[2] Attempting to create snapshot with ranking 6...");
    const invalidCreateHigh = await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "...",
      subname: "Bad Rank",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 6,
      recipe: recipePancakes,
    });
    assertEquals(invalidCreateHigh.error, "Ranking must be between 1 and 5");

    console.log("[2] Attempting to create snapshot with ranking 0...");
    const invalidCreateLow = await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "...",
      subname: "Bad Rank",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 0,
      recipe: recipePancakes,
    });
    assertEquals(invalidCreateLow.error, "Ranking must be between 1 and 5");

    // Create a valid one to test edit constraints
    const validRes = await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "Valid",
      subname: "Valid",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 3,
      recipe: recipePancakes,
    });
    const validId = validRes.snapshot!;

    console.log("[2] Attempting to edit snapshot with invalid ranking...");
    const invalidEdit = await snapshotConcept.editSnapshot({
      snapshot: validId,
      subname: "Valid",
      ranking: 10,
    });
    assertEquals(invalidEdit.error, "Ranking must be between 1 and 5");

    console.log("[2] Attempting to edit a non-existent snapshot...");
    const fakeId = "fake_id" as ID;
    const missingEdit = await snapshotConcept.editSnapshot({
      snapshot: fakeId,
      subname: "Ghost",
      ranking: 3,
    });
    assertEquals(missingEdit.error, "Snapshot does not exist");

    console.log("[2] Attempting to delete a non-existent snapshot...");
    const missingDelete = await snapshotConcept.deleteSnapshot({ snapshot: fakeId });
    assertEquals(missingDelete.error, "Snapshot does not exist");
  });

  // Test Case #3: Recipe Association and Bulk Actions
  await t.step("Test Case #3: Recipe Association & Bulk Deletion", async () => {
    console.log("[3] Seeding snapshots: 2 for Pancakes, 1 for Waffles...");

    // Pancake Snapshots
    await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "P1",
      subname: "Pancake 1",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 4,
      recipe: recipePancakes,
    });
    await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "P2",
      subname: "Pancake 2",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 5,
      recipe: recipePancakes,
    });

    // Waffle Snapshot
    const waffleRes = await snapshotConcept.createSnapshot({
      user: userAlice,
      ingredientsList: "W1",
      subname: "Waffle 1",
      pictures: [],
      date: new Date(),
      instructions: "...",
      note: "...",
      ranking: 5,
      recipe: recipeWaffles,
    });
    const waffleId = waffleRes.snapshot!;

    console.log("[3] Verifying retrieval by recipe...");
    const pancakeSnaps = await snapshotConcept._getSnapshots({ recipe: recipePancakes });
    assertEquals(pancakeSnaps.length, 3);

    const waffleSnaps = await snapshotConcept._getSnapshots({ recipe: recipeWaffles });
    assertEquals(waffleSnaps.length, 1);
    assertEquals(waffleSnaps[0]._id, waffleId);

    console.log("[3] Deleting all snapshots for Pancakes...");
    await snapshotConcept.deleteAllSnapshotsForRecipe({ recipe: recipePancakes });

    console.log("[3] Verifying deletion...");
    const pancakeSnapsAfter = await snapshotConcept._getSnapshots({ recipe: recipePancakes });
    assertEquals(pancakeSnapsAfter.length, 0);

    const waffleSnapsAfter = await snapshotConcept._getSnapshots({ recipe: recipeWaffles });
    assertEquals(waffleSnapsAfter.length, 1, "Waffle snapshots should remain untouched");
  });

  await client.close();
});
