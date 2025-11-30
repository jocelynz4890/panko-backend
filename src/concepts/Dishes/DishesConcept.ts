import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Concept Prefix
const PREFIX = "Dishes.";

// Generic Types
type User = ID;
type Recipe = ID;
type Dish = ID;

/**
 * State:
 * a set of Dishes with
 *   a name of type String
 *   a description of type String
 *   a set of recipes of type Recipe
 *   a defaultRecipe of type Recipe
 */
interface DishesDoc {
  _id: Dish;
  owner: User; // Stored to satisfy "create with given arguments"
  name: string;
  description: string;
  recipes: Recipe[];
  defaultRecipe?: Recipe;
}

export default class DishesConcept {
  dishes: Collection<DishesDoc>;

  constructor(private readonly db: Db) {
    this.dishes = this.db.collection<DishesDoc>(PREFIX + "dishes");
  }

  /**
   * createDish (user: User, name: String, description: String): (dish: Dish)
   *
   * **requires** user exists
   *
   * **effects** create a new dish with given arguments and an empty set of recipes
   */
  async createDish(
    { user, name, description }: {
      user: User;
      name: string;
      description: string;
    },
  ): Promise<{ dish: Dish }> {
    const dishId = freshID();
    await this.dishes.insertOne({
      _id: dishId,
      owner: user,
      name,
      description,
      recipes: [],
      defaultRecipe: undefined,
    });
    return { dish: dishId };
  }

  /**
   * editDishName (dish: Dish, newName: String, description: String): (dish: Dish)
   *
   * **requires** dish exists
   *
   * **effects** edits dish with new name and description
   *
   * *Note: The spec previously mislabeled this argument, but functionality implies 'dish'.*
   */
  async editDishName(
    { dish, newName, description }: {
      dish: Dish;
      newName: string;
      description: string;
    },
  ): Promise<{ dish: Dish } | { error: string }> {
    const result = await this.dishes.updateOne(
      { _id: dish },
      { $set: { name: newName, description } },
    );

    if (result.matchedCount === 0) {
      return { error: "Dish not found" };
    }

    return { dish };
  }

  /**
   * deleteDish (dish: Dish): (dish: Dish)
   *
   * **requires** dish exists
   *
   * **effects** deletes the given dish
   */
  async deleteDish(
    { dish }: { dish: Dish },
  ): Promise<{ dish: Dish } | { error: string }> {
    const result = await this.dishes.deleteOne({ _id: dish });

    if (result.deletedCount === 0) {
      return { error: "Dish not found" };
    }

    return { dish };
  }

  /**
   * addRecipe (recipe: Recipe, dish: Dish)
   *
   * **requires** dish and recipe exists
   *
   * **effects** adds the recipe the set of recipes
   */
  async addRecipe(
    { recipe, dish }: { recipe: Recipe; dish: Dish },
  ): Promise<Empty | { error: string }> {
    const result = await this.dishes.updateOne(
      { _id: dish },
      { $addToSet: { recipes: recipe } },
    );

    if (result.matchedCount === 0) {
      return { error: "Dish not found" };
    }

    return {};
  }

  /**
   * removeRecipe (recipe: Recipe, dish: Dish)
   *
   * **requires** dish and recipe exists
   *
   * **effects** removes the recipe from the given dish’s set of recipes
   */
  async removeRecipe(
    { recipe, dish }: { recipe: Recipe; dish: Dish },
  ): Promise<Empty | { error: string }> {
    // We also unset defaultRecipe if it matches the one being removed
    // to maintain state consistency, though not explicitly detailed in spec.
    const result = await this.dishes.updateOne(
      { _id: dish },
      {
        $pull: { recipes: recipe },
      },
    );

    // If the removed recipe was the default, we should clear it.
    await this.dishes.updateOne(
      { _id: dish, defaultRecipe: recipe },
      { $unset: { defaultRecipe: "" } },
    );

    if (result.matchedCount === 0) {
      return { error: "Dish not found" };
    }

    return {};
  }

  /**
   * setDefaultRecipe (recipe: Recipe, dish: Dish)
   *
   * **requires** recipe exists and is in dish’s set of recipes
   *
   * **effects** sets defaultRecipe of dish to given recipe
   */
  async setDefaultRecipe(
    { recipe, dish }: { recipe: Recipe; dish: Dish },
  ): Promise<Empty | { error: string }> {
    // We strictly check the requirement: recipe must be in the set
    const result = await this.dishes.updateOne(
      { _id: dish, recipes: recipe },
      { $set: { defaultRecipe: recipe } },
    );

    if (result.matchedCount === 0) {
      return { error: "Dish not found or Recipe not in Dish" };
    }

    return {};
  }

  /**
   * _getDish (dish: Dish): (dish: DishesDoc)
   *
   * **requires** dish exists
   *
   * **effects** returns the full state of the dish
   */
  async _getDish(
    { dish }: { dish: Dish },
  ): Promise<DishesDoc[]> {
    const doc = await this.dishes.findOne({ _id: dish });
    return doc ? [doc] : [];
  }
}
