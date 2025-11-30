---
timestamp: 'Sun Nov 23 2025 14:26:48 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_142648.05372c0b.md]]'
content_id: 96c325db8241b613a7642afe20eef21426a650da9e96ecf2c36c1aa7a07b29aa
---

# trace: Snapshot Concept Principle

The operational principle of the **Snapshot** concept is about capturing the evolution of a dish over time to facilitate learning.

1. **Context**: User "ChefAlice" wants to perfect her "Sourdough Bread" recipe (`recipe_sourdough`).
2. **First Attempt**: Alice creates a snapshot (`snap_1`).
   * *Inputs*: Ranking 2, Note "Too dense, crust too hard".
   * *Result*: Snapshot recorded.
3. **Second Attempt**: Alice tries a variation (higher hydration) and creates `snap_2`.
   * *Inputs*: Ranking 4, Note "Better crumb, good oven spring".
   * *Result*: Snapshot recorded.
4. **Review History**: Alice queries all snapshots for `recipe_sourdough`.
   * *Observation*: She sees both attempts and compares the notes/rankings.
5. **Refinement**: Realizing she forgot to mention the baking temperature in `snap_2`, she edits it.
   * *Action*: `editSnapshot` on `snap_2` with updated notes.
6. **Cleanup**: She decides `snap_1` was a failure not worth keeping as a reference.
   * *Action*: `deleteSnapshot` on `snap_1`.
7. **Result**: The history now contains the refined `snap_2`, serving as the baseline for the next attempt.
