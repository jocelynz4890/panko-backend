```ts
Snapshot Concept - Action Tests ...
  createSnapshot: enforces ranking requirements ...
------- post-test output -------
Trace: createSnapshot with ranking 6 returned: { error: "Ranking must be between 1 and 5" }
Trace: createSnapshot with ranking 4 returned: { snapshot: "019abd28-9848-7dc8-9688-b8ed9fc113ed" }
----- post-test output end -----
  createSnapshot: enforces ranking requirements ... ok (36ms)
  editSnapshot: updates state and checks existence ...
------- post-test output -------
Trace: Edited snapshot successfully
Trace: Verified state update in DB
----- post-test output end -----
  editSnapshot: updates state and checks existence ... ok (80ms)
  deleteSnapshot: removes item ...
------- post-test output -------
Trace: Deleted snapshot
----- post-test output end -----
  deleteSnapshot: removes item ... ok (56ms)
  deleteAllSnapshotsForRecipe: removes all for specific recipe ...
------- post-test output -------
Trace: Deleted all snapshots for recipe:A
----- post-test output end -----
  deleteAllSnapshotsForRecipe: removes all for specific recipe ... ok (113ms)
  editSnapshot: allows partial updates ... ok (57ms)
Snapshot Concept - Action Tests ... ok (825ms)
Snapshot Concept - Principle Trace ...
  Principle: Cook compares attempts and learns from variations ...
------- post-test output -------

--- Start Principle Trace ---
Action: Creating first snapshot (Attempt 1)...
Action: Creating second snapshot (Attempt 2) with variations...
Action: Reviewing history...
User sees: Attempt 1 ranked 3, Attempt 2 ranked 5
Observation: User learns that lower hydration worked better.
Action: Editing Attempt 2 to add context...
--- End Principle Trace ---
----- post-test output end -----
  Principle: Cook compares attempts and learns from variations ... ok (105ms)
Snapshot Concept - Principle Trace ... ok (559ms)
```
