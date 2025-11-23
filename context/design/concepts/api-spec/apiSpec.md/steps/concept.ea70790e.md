---
timestamp: 'Sun Nov 23 2025 14:41:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144147.7f1a1117.md]]'
content_id: ea70790ec5cdeb00d748dec068fed6459c26349d134acf6ca39cb2ed79b42788
---

# concept: Snapshot

**purpose**: record individual attempts at preparing a dish, including context and outcome, so that the cook can compare attempts, learn from variations, and see how their results change over time.

**principle**: each time a user prepares a dish, they create a new snapshot that captures when it was made, any photos of the result, notes about what they did (or changed) compared to their usual approach, and how satisfied they were with the outcome. Over many cooking sessions, these snapshots accumulate into a chronological history of attempts for that dish. When the user is deciding how to make the dish again, they review the previous snapshots to see which variations turned out best and what they want to repeat or avoid, then create a new snapshot for the latest attempt to extend the history.

**state**:
a set of `snapshots` with

* a `user` of type `User`
* an `ingredientsList` of type `String`
* an `instructions` of type `String`
* a `note` of type `String`
* a `ranking` of type `Number`
* a `subname` of type `String`
* a set of `pictures` of type `FilePath`
* a `date` of type `Date`
* a `recipe` of type `Recipe`

**actions**:

* `createSnapshot` (ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking, recipe: Recipe): (snapshot: Snapshot)
* `editSnapshot` (snapshot: Snapshot, ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking): (snapshot: Snapshot)
* `deleteSnapshot` (snapshot: Snapshot): (snapshot: Snapshot)
* `deleteAllSnapshotsForRecipe` (recipe: Recipe): ()
