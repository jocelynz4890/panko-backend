import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix
const PREFIX = "RecipeBook.";

// Generic types mapping
type User = ID;
type Dish = ID;
type BookID = ID;

/**
 * State:
 * a set of RecipeBooks with
 *   a user of type User
 *   a dishes set of Dish
 *   a name of type String
 *   a coverIndex of type Number (optional, for frontend cover selection)
 */
interface RecipeBookDoc {
  _id: BookID;
  user: User;
  dishes: Dish[];
  name: string;
  coverIndex?: number;
}

export default class RecipeBookConcept {
  books: Collection<RecipeBookDoc>;

  constructor(private readonly db: Db) {
    this.books = this.db.collection<RecipeBookDoc>(PREFIX + "books");
  }

  /**
   * createRecipeBook (user: User, name: String, coverIndex?: Number): (book: RecipeBook)
   *
   * **requires** user exists
   * **effects** creates a new recipe book `b`; sets user of `b` to `user`; sets name of `b` to `name`; sets dishes of `b` to empty; sets coverIndex of `b` to `coverIndex` if provided; returns `b` as `book`
   */
  async createRecipeBook(
    { user, name, coverIndex }: { user: User; name: string; coverIndex?: number },
  ): Promise<{ book: BookID } | { error: string }> {
    if (!user) {
      return { error: "User is required" };
    }

    const bookID = freshID();
    const doc: RecipeBookDoc = {
      _id: bookID,
      user,
      name,
      dishes: [],
      ...(coverIndex !== undefined && { coverIndex }),
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
   * addDishToBook (dish: Dish, book: RecipeBook)
   *
   * **requires** `dish` and `book` exist
   * **effects** adds `dish` to the set of dishes in `book`
   */
  async addDishToBook(
    { dish, book }: { dish: Dish; book: BookID },
  ): Promise<Empty | { error: string }> {
    if (!dish) {
      return { error: "Dish is required" };
    }

    // We use $addToSet to maintain the "set" property (no duplicates)
    const result = await this.books.updateOne({ _id: book }, {
      $addToSet: { dishes: dish },
    });

    if (result.matchedCount === 0) {
      return { error: "Recipe book not found" };
    }

    return {};
  }

  /**
   * removeDishFromBook (dish: Dish, book: RecipeBook)
   *
   * **requires** `book` exists
   * **effects** removes `dish` from the set of dishes in `book`
   */
  async removeDishFromBook(
    { dish, book }: { dish: Dish; book: BookID },
  ): Promise<Empty | { error: string }> {
    const result = await this.books.updateOne({ _id: book }, {
      $pull: { dishes: dish },
    });

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
