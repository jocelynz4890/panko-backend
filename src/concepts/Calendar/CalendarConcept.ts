import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

const PREFIX = "Calendar.";

// Generic Types
type User = ID;
type Recipe = ID;
type ScheduledRecipe = ID;

/**
 * a set of ScheduledRecipes with
 *   a user User
 *   a recipe Recipe
 *   a date Date
 */
interface ScheduledRecipes {
  _id: ScheduledRecipe;
  user: User;
  recipe: Recipe;
  date: Date;
}

export default class CalendarConcept {
  scheduledRecipes: Collection<ScheduledRecipes>;

  constructor(private readonly db: Db) {
    this.scheduledRecipes = this.db.collection(PREFIX + "scheduledRecipes");
  }

  /**
   * assignRecipeToDate (user: User, recipe: Recipe, date: Date): (scheduledRecipe: ScheduledRecipe)
   *
   * **requires** recipe exists
   *
   * **effects** adds a new ScheduledRecipe to the state associating the user, recipe, and date; returns the new ID
   */
  async assignRecipeToDate(
    { user, recipe, date }: { user: User; recipe: Recipe; date: Date },
  ): Promise<{ scheduledRecipe: ScheduledRecipe } | { error: string }> {
    const _id = freshID();
    try {
      await this.scheduledRecipes.insertOne({
        _id,
        user,
        recipe,
        date,
      });
      return { scheduledRecipe: _id };
    } catch (e) {
      return { error: `Could not assign recipe to date: ${e}` };
    }
  }

  /**
   * deleteScheduledRecipe (scheduledRecipe: ScheduledRecipe)
   *
   * **requires** scheduledRecipe exists
   *
   * **effects** removes the identified ScheduledRecipe from the state
   */
  async deleteScheduledRecipe(
    { scheduledRecipe }: { scheduledRecipe: ScheduledRecipe },
  ): Promise<Empty | { error: string }> {
    try {
      await this.scheduledRecipes.deleteOne({ _id: scheduledRecipe });
      return {};
    } catch (e) {
      return { error: `Could not delete scheduled recipe: ${e}` };
    }
  }

  /**
   * deleteAllScheduledRecipesWithRecipe (recipe: Recipe)
   *
   * **requires** true
   *
   * **effects** finds all ScheduledRecipes associated with the given recipe and deletes them
   */
  async deleteAllScheduledRecipesWithRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<Empty | { error: string }> {
    try {
      await this.scheduledRecipes.deleteMany({ recipe });
      return {};
    } catch (e) {
      return { error: `Could not delete scheduled recipes for recipe: ${e}` };
    }
  }

  /**
   * _getScheduledRecipes (user: User): (scheduledRecipe: {scheduledRecipe: ScheduledRecipe, recipe: Recipe, date: Date})
   *
   * **requires** true
   *
   * **effects** returns all scheduled recipes for the given user
   */
  async _getScheduledRecipes(
    { user }: { user: User },
  ): Promise<
    Array<{
      scheduledRecipe: {
        scheduledRecipe: ScheduledRecipe;
        recipe: Recipe;
        date: Date;
      };
    }>
  > {
    const recipes = await this.scheduledRecipes.find({ user }).toArray();

    // Map internal state to output format
    return recipes.map((r) => ({
      scheduledRecipe: {
        scheduledRecipe: r._id,
        recipe: r.recipe,
        date: r.date,
      },
    }));
  }
}
