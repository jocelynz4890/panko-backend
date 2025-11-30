### Calendar

- purpose: let a person commit planned dishes to specific dates so they can see at a glance what is coming up and avoid forgetting what they intended to cook on a given day.
- principle: when a person decides they want to make a particular dish on a specific day, they create a calendar entry that links that plan to the chosen date.
- state:
  - a set of ScheduledRecipes
    - a `user` of type `User`
    - a `recipe` of type `Recipe`
    - a `date` of type `Date`
- actions:
  - assignRecipeToDate(recipe: Recipe, date: Date)
    - requires: recipe exists
    - effects: adds recipe to ScheduledRecipes with given date
  - deleteScheduledRecipe(scheduledRecipe: ScheduledRecipe)
    - requires: scheduledRecipe exists
    - effects: deletes the given scheduledRecipe
  - deleteAllScheduledRecipesWithRecipe(recipe:Recipe)
    - requires: True
    - effects: finds all ScheduledRecipes associated with the given recipe and deletes them
