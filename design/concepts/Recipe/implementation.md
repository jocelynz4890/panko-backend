[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@Recipe](Recipe.md)

# implement: Recipe

# response:


# response:

# concept: Recipes
**concept** Recipes [User, Snapshot]

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

# file: src/concepts/Recipes/RecipesConcept.ts
```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Concept Prefix
const PREFIX = "Recipes.";

// Generic Types
type User = ID;
type Snapshot = ID;
type Recipe = ID;

/**
 * State:
 * a set of Recipes with
 *   a name of type String
 *   a description of type String
 *   a set of snapshots of type Snapshot
 *   a defaultSnapshot of type Snapshot
 */
interface RecipeDoc {
  _id: Recipe;
  owner: User; // Stored to satisfy "create with given arguments"
  name: string;
  description: string;
  snapshots: Snapshot[];
  defaultSnapshot?: Snapshot;
}

export default class RecipesConcept {
  recipes: Collection<RecipeDoc>;

  constructor(private readonly db: Db) {
    this.recipes = this.db.collection<RecipeDoc>(PREFIX + "recipes");
  }

  /**
   * createRecipe (user: User, name: String, description: String): (recipe: Recipe)
   *
   * **requires** user exists
   *
   * **effects** create a new recipe with given arguments and an empty set of snapshots
   */
  async createRecipe(
    { user, name, description }: {
      user: User;
      name: string;
      description: string;
    },
  ): Promise<{ recipe: Recipe }> {
    const recipeId = freshID();
    await this.recipes.insertOne({
      _id: recipeId,
      owner: user,
      name,
      description,
      snapshots: [],
      defaultSnapshot: undefined,
    });
    return { recipe: recipeId };
  }

  /**
   * editRecipeName (recipe: Recipe, newName: String, description: String): (recipe: Recipe)
   *
   * **requires** recipe exists
   *
   * **effects** edits recipe with new name and description
   *
   * *Note: The spec used 'snapshot' as the first argument name, but functionality implies 'recipe'.*
   */
  async editRecipeName(
    { recipe, newName, description }: {
      recipe: Recipe;
      newName: string;
      description: string;
    },
  ): Promise<{ recipe: Recipe } | { error: string }> {
    const result = await this.recipes.updateOne(
      { _id: recipe },
      { $set: { name: newName, description } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe not found" };
    }

    return { recipe };
  }

  /**
   * deleteRecipe (recipe: Recipe): (recipe: Recipe)
   *
   * **requires** recipe exists
   *
   * **effects** deletes the given recipe
   */
  async deleteRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<{ recipe: Recipe } | { error: string }> {
    const result = await this.recipes.deleteOne({ _id: recipe });

    if (result.deletedCount === 0) {
      return { error: "Recipe not found" };
    }

    return { recipe };
  }

  /**
   * addSnapshot (snapshot: Snapshot, recipe: Recipe)
   *
   * **requires** recipe and snapshot exists
   *
   * **effects** adds the snapshot the set of snapshots
   */
  async addSnapshot(
    { snapshot, recipe }: { snapshot: Snapshot; recipe: Recipe },
  ): Promise<Empty | { error: string }> {
    const result = await this.recipes.updateOne(
      { _id: recipe },
      { $addToSet: { snapshots: snapshot } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe not found" };
    }

    return {};
  }

  /**
   * removeSnapshot (snapshot: Snapshot, recipe: Recipe)
   *
   * **requires** recipe and snapshot exists
   *
   * **effects** removes the snapshot from the given recipe’s set of snapshots
   */
  async removeSnapshot(
    { snapshot, recipe }: { snapshot: Snapshot; recipe: Recipe },
  ): Promise<Empty | { error: string }> {
    // We also unset defaultSnapshot if it matches the one being removed
    // to maintain state consistency, though not explicitly detailed in spec.
    const result = await this.recipes.updateOne(
      { _id: recipe },
      {
        $pull: { snapshots: snapshot },
      },
    );

    // If the removed snapshot was the default, we should clear it.
    await this.recipes.updateOne(
      { _id: recipe, defaultSnapshot: snapshot },
      { $unset: { defaultSnapshot: "" } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe not found" };
    }

    return {};
  }

  /**
   * setDefaultSnapshot (snapshot: Snapshot, recipe: Recipe)
   *
   * **requires** snapshot exists and is in recipe’s set of snapshots
   *
   * **effects** sets defaultSnapshot of recipe to given snapshot
   */
  async setDefaultSnapshot(
    { snapshot, recipe }: { snapshot: Snapshot; recipe: Recipe },
  ): Promise<Empty | { error: string }> {
    // We strictly check the requirement: snapshot must be in the set
    const result = await this.recipes.updateOne(
      { _id: recipe, snapshots: snapshot },
      { $set: { defaultSnapshot: snapshot } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe not found or Snapshot not in Recipe" };
    }

    return {};
  }

  /**
   * _getRecipe (recipe: Recipe): (recipe: RecipeDoc)
   *
   * **requires** recipe exists
   *
   * **effects** returns the full state of the recipe
   */
  async _getRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<RecipeDoc[]> {
    const doc = await this.recipes.findOne({ _id: recipe });
    return doc ? [doc] : [];
  }
}
```