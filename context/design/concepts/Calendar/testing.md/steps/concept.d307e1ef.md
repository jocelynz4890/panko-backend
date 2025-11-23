---
timestamp: 'Sun Nov 23 2025 14:17:59 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_141759.30f3edb5.md]]'
content_id: d307e1efd6e9364ce33dbbfe2f4165e6e7e930ba430b6219acde627494030d9e
---

# concept: Calendar

**concept** Calendar \[User, Snapshot]

**purpose** let a person commit planned dishes to specific dates so they can see at a glance what is coming up and avoid forgetting what they intended to cook on a given day.

**principle** when a person decides they want to make a particular dish on a specific day, they create a calendar entry that links that plan to the chosen date.

**state**
a set of ScheduledRecipes with
a user User
a snapshot Snapshot
a date Date

**actions**
assignSnapshotToDate (user: User, snapshot: Snapshot, date: Date): (scheduledRecipe: ScheduledRecipe)
**requires** snapshot exists
**effects** adds a new ScheduledRecipe to the state associating the user, snapshot, and date; returns the new ID

deleteScheduledRecipe (scheduledRecipe: ScheduledRecipe)
**requires** scheduledRecipe exists
**effects** removes the identified ScheduledRecipe from the state

deleteAllScheduledRecipesWithSnapshot (snapshot: Snapshot)
**requires** true
**effects** removes all ScheduledRecipes associated with the given snapshot

**queries**
\_getScheduledRecipes (user: User): (scheduledRecipe: {scheduledRecipe: ScheduledRecipe, snapshot: Snapshot, date: Date})
**requires** true
**effects** returns all scheduled recipes for the given user
