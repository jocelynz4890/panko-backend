---
timestamp: 'Sun Nov 23 2025 13:36:27 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_133627.29176d0f.md]]'
content_id: dda51990256100e6ba1cb29a1ee2d4ec6d07cf6342f9ee31208f5388d7c06e43
---

# concept: Recipes

**concept** Recipes \[User, Snapshot]

**purpose** provide a stable identity and high-level categorization for a dish, together with a history of its recorded attempts, so that a person can quickly find that dish and see how their experience with it has evolved over time without relying on memory.

**principle** over time, a person uses recipes as named anchors for the dishes they care about. When they decide they want to be able to track a dish, they create a new recipe by giving it a name that they will recognize and adding tags that reflect how they think about it (for example, cuisine, difficulty, or occasion). Each time they want the dish’s record to reflect another cooking experience, they add a new attempt to the recipe’s history. Later, when they are deciding what to cook or looking back on past cooking, they use the recipe’s name and tags to find it quickly and then review the sequence of attempts associated with it to see how often they have made it and how their results have changed. Occasionally they update the name or tags so that the recipe remains easy to find as their tastes and habits evolve.

**state**

* a set of `Recipes` with
  * a `name` of type `String`
  * a `description` of type `String`
  * a set of `snapshots` of type `Snapshot`
  * a `defaultSnapshot` of type `Snapshot` (optional)
  * a `owner` of type `User` (implied by create action arguments)

**actions**

* createRecipe (user: User, name: String, description: String): (recipe: Recipe)
* editRecipeName (recipe: Recipe, newName: String, description: String): (recipe: Recipe)
* deleteRecipe (recipe: Recipe): (recipe: Recipe)
* addSnapshot (snapshot: Snapshot, recipe: Recipe)
* removeSnapshot (snapshot: Snapshot, recipe: Recipe)
* setDefaultSnapshot (snapshot: Snapshot, recipe: Recipe)
