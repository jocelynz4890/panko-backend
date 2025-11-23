---
timestamp: 'Sun Nov 23 2025 13:52:21 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_135221.9fd23349.md]]'
content_id: 2ea0dd958a5201dc4feb41694417bcdba69ffb522f5af6465e2abc6507fa1382
---

# concept: RecipeBook

**concept** RecipeBook \[User, Recipe]

**purpose** provide each person with named collections of dish entries, organized through a table of contents, so they can quickly locate and choose among a manageable set of recipes instead of scanning their entire recipe history.

**principle** a person uses recipe books as focused collections of dishes that match how they plan meals. When they want to create a new collection, they define a recipe book by choosing a name that reflects the theme of that collection and associating it with themselves. Over time, as they decide which dishes belong in that collection, they add entries to the book’s table of contents, each entry linking the book to a particular dish and giving it a recognizable title. When they are deciding what to cook, they select one of their books, scan its table of contents entries to see which dishes fit their current constraints, and pick from that smaller set. Occasionally they rename a book or adjust its table of contents by adding, removing, or renaming entries so that the collections continue to match how they think about their cooking.

**state**
a set of RecipeBooks with
a user of type User
a recipes set of Recipe
a name of type String

**actions**
createRecipeBook (user: User, name: String): (book: RecipeBook)
**requires** user exists
**effects** creates a new recipe book `b`; sets user of `b` to `user`; sets name of `b` to `name`; sets recipes of `b` to empty; returns `b` as `book`

editRecipeBookName (book: RecipeBook, newName: String)
**requires** `book` exists
**effects** sets name of `book` to `newName`

addRecipeToBook (recipe: Recipe, book: RecipeBook)
**requires** `recipe` and `book` exist
**effects** adds `recipe` to the set of recipes in `book`

removeRecipeFromBook (recipe: Recipe, book: RecipeBook)
**requires** `book` exists
**effects** removes `recipe` from the set of recipes in `book`

deleteRecipeBook (book: RecipeBook)
**requires** `book` exists
**effects** removes `book` from the set of RecipeBooks
