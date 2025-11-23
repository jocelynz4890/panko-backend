import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix
const PREFIX = "RecipeBook.";

// Generic types mapping
type User = ID;
type Recipe = ID;
type BookID = ID;

/**
 * State:
 * a set of RecipeBooks with
 *   a user of type User
 *   a recipes set of Recipe
 *   a name of type String
 */
interface RecipeBookDoc {
  _id: BookID;
  user: User;
  recipes: Recipe[];
  name: string;
}

export default class RecipeBookConcept {
  books: Collection<RecipeBookDoc>;

  constructor(private readonly db: Db) {
    this.books = this.db.collection<RecipeBookDoc>(PREFIX + "books");
  }

  /**
   * createRecipeBook (user: User, name: String): (book: RecipeBook)
   *
   * **requires** user exists
   * **effects** creates a new recipe book `b`; sets user of `b` to `user`; sets name of `b` to `name`; sets recipes of `b` to empty; returns `b` as `book`
   */
  async createRecipeBook(
    { user, name }: { user: User; name: string },
  ): Promise<{ book: BookID } | { error: string }> {
    if (!user) {
      return { error: "User is required" };
    }

    const bookID = freshID();
    const doc: RecipeBookDoc = {
      _id: bookID,
      user,
      name,
      recipes: [],
    };

    await this.books.insertOne(doc);
    return { book: bookID };
  }

  /**
   * editRecipeBookName (book: RecipeBook, newName: String)
   *
   * **requires** `book` exists
   * **effects** sets name of `book` to `newName`
   */
  async editRecipeBookName(
    { book, newName }: { book: BookID; newName: string },
  ): Promise<Empty | { error: string }> {
    const result = await this.books.updateOne(
      { _id: book },
      { $set: { name: newName } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe book not found" };
    }

    return {};
  }

  /**
   * addRecipeToBook (recipe: Recipe, book: RecipeBook)
   *
   * **requires** `recipe` and `book` exist
   * **effects** adds `recipe` to the set of recipes in `book`
   */
  async addRecipeToBook(
    { recipe, book }: { recipe: Recipe; book: BookID },
  ): Promise<Empty | { error: string }> {
    if (!recipe) {
      return { error: "Recipe is required" };
    }

    // We use $addToSet to maintain the "set" property (no duplicates)
    const result = await this.books.updateOne(
      { _id: book },
      { $addToSet: { recipes: recipe } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe book not found" };
    }

    return {};
  }

  /**
   * removeRecipeFromBook (recipe: Recipe, book: RecipeBook)
   *
   * **requires** `book` exists
   * **effects** removes `recipe` from the set of recipes in `book`
   */
  async removeRecipeFromBook(
    { recipe, book }: { recipe: Recipe; book: BookID },
  ): Promise<Empty | { error: string }> {
    const result = await this.books.updateOne(
      { _id: book },
      { $pull: { recipes: recipe } },
    );

    if (result.matchedCount === 0) {
      return { error: "Recipe book not found" };
    }

    return {};
  }

  /**
   * deleteRecipeBook (book: RecipeBook)
   *
   * **requires** `book` exists
   * **effects** removes `book` from the set of RecipeBooks
   */
  async deleteRecipeBook(
    { book }: { book: BookID },
  ): Promise<Empty | { error: string }> {
    const result = await this.books.deleteOne({ _id: book });

    if (result.deletedCount === 0) {
      return { error: "Recipe book not found" };
    }

    return {};
  }

  // --- Queries ---

  /**
   * _getBooks (user: User)
   *
   * **requires** user exists
   * **effects** returns all books belonging to the user
   */
  async _getBooks(
    { user }: { user: User },
  ): Promise<Array<RecipeBookDoc>> {
    return await this.books.find({ user }).toArray();
  }

  /**
   * _getBook (book: RecipeBook)
   *
   * **requires** book exists
   * **effects** returns the specific book details
   */
  async _getBook(
    { book }: { book: BookID },
  ): Promise<Array<RecipeBookDoc>> {
    return await this.books.find({ _id: book }).toArray();
  }
}
