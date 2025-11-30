import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix
const PREFIX = "Recipe.";

// Concept types
type User = ID;
type Dish = ID;
type Recipe = ID;
type FilePath = string;
type Ranking = number;

/**
 * a set of `recipes` with
 *   a `user` of type `User`
 *   an `ingredientsList` of type `String`
 *   an `instructions` of type `String`
 *   a `note` of type `String`
 *   a `ranking` of type `Number`
 *   a `subname` of type `String`
 *   a set of `pictures` of type `FilePath`
 *   a `date` of type `Date`
 *   a `dish` of type `Dish`
 */
interface RecipesDoc {
  _id: Recipe;
  user: User;
  ingredientsList: string;
  instructions: string;
  note: string;
  ranking: Ranking;
  subname: string;
  pictures: FilePath[];
  date: Date;
  dish: Dish;
}

export default class RecipeConcept {
  recipes: Collection<RecipesDoc>;

  constructor(private readonly db: Db) {
    this.recipes = this.db.collection<RecipesDoc>(PREFIX + "recipes");
  }

  /**
   * createRecipe (ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking, dish: Dish): (recipe: Recipe)
   *
   * **requires** ranking is between 1 and 5
   *
   * **effects** creates a new recipe with the given arguments
   */
  async createRecipe(
    inputs: {
      user: User;
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
      dish: Dish;
    },
  ): Promise<{ recipe?: Recipe; error?: string }> {
    const {
      user,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      dish,
    } = inputs;

    if (ranking < 1 || ranking > 5) {
      return { error: "Ranking must be between 1 and 5" };
    }

    const _id: Recipe = freshID();
    const newRecipe: RecipesDoc = {
      _id,
      user,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      dish,
    };

    await this.recipes.insertOne(newRecipe);

    return { recipe: _id };
  }

  /**
   * editRecipe (recipe: Recipe, ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking):(recipe: Recipe)
   *
   * **requires** recipe exists
   *
   * **effects** updates the recipe with the given edits
   */
  async editRecipe(
    inputs: {
      recipe: Recipe;
      ingredientsList?: string;
      subname?: string;
      pictures?: FilePath[];
      date?: Date;
      instructions?: string;
      note?: string;
      ranking?: Ranking;
    },
  ): Promise<{ recipe?: Recipe; error?: string }> {
    const {
      recipe,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
    } = inputs;

    // Validate ranking if provided
    if (ranking !== undefined && (ranking < 1 || ranking > 5)) {
      return { error: "Ranking must be between 1 and 5" };
    }

    // Build the update object dynamically
    const updateFields: Partial<RecipesDoc> = {};
    if (ingredientsList !== undefined) updateFields.ingredientsList = ingredientsList;
    if (subname !== undefined) updateFields.subname = subname;
    if (pictures !== undefined) updateFields.pictures = pictures;
    if (date !== undefined) updateFields.date = date;
    if (instructions !== undefined) updateFields.instructions = instructions;
    if (note !== undefined) updateFields.note = note;
    if (ranking !== undefined) updateFields.ranking = ranking;

    if (Object.keys(updateFields).length === 0) {
      return { error: "No fields to update" };
    }

    const result = await this.recipes.updateOne(
      { _id: recipe },
      { $set: updateFields },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe does not exist" };
    }

    return { recipe };
  }

  /**
   * deleteRecipe(recipe: Recipe):(recipe: Recipe)
   *
   * **requires** recipe exists
   *
   * **effects** deletes the given recipe
   */
  async deleteRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<{ recipe?: Recipe; error?: string }> {
    const result = await this.recipes.deleteOne({ _id: recipe });

    if (result.deletedCount === 0) {
      return { error: "Recipe does not exist" };
    }

    return { recipe };
  }

  /**
   * deleteAllRecipesForDish(dish: Dish)
   *
   * **requires** True
   *
   * **effects** deletes all recipes associated with the given dish
   */
  async deleteAllRecipesForDish(
    { dish }: { dish: Dish },
  ): Promise<Empty> {
    await this.recipes.deleteMany({ dish });
    return {};
  }

  /**
   * _getRecipes (dish: Dish): (recipe: Recipe)
   *
   * **requires** True
   *
   * **effects** returns set of all recipes associated with the dish
   */
  async _getRecipes(
    { dish }: { dish: Dish },
  ): Promise<RecipesDoc[]> {
    return await this.recipes.find({ dish }).toArray();
  }
}
