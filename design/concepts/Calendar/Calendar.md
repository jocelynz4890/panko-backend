### Calendar

- purpose: let a person commit planned dishes to specific dates so they can see at a glance what is coming up and avoid forgetting what they intended to cook on a given day.
- principle: when a person decides they want to make a particular dish on a specific day, they create a calendar entry that links that plan to the chosen date.
- state:
  - a set of ScheduledRecipes
    - a `user` of type `User`
    - a `snapshot` of type `Snapshot`
    - a `date` of type `Date`
- actions:
  - assignSnapshotToDate(snapshot: Snapshot, date: Date)
    - requires: snapshot exists
    - effects: adds snapshot to ScheduledRecipes with given date
  - deleteScheduledRecipe(scheduledRecipe: ScheduledRecipe)
    - requires: scheduledRecipe exists
    - effects: deletes the given scheduledRecipe
  - deleteAllScheduledRecipesWithSnapshot(snapshot:Snapshot)
    - requires: True
    - effects: finds all ScheduledRecipes associated with the given snapshot and deletes them
