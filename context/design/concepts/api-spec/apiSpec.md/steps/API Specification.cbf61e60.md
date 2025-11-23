---
timestamp: 'Sun Nov 23 2025 14:42:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144247.07ffceb6.md]]'
content_id: cbf61e60f2d8cd555c34f9326c0b482116691b89055f439a94ef6f63021d9c0e
---

# API Specification: RecipeBook Concept

**Purpose:** Provide each person with named collections of dish entries, organized through a table of contents, so they can quickly locate and choose among a manageable set of recipes.

***

## API Endpoints

### POST /api/RecipeBook/createRecipeBook

**Description:** Creates a new recipe book collection.

**Requirements:**

* The `user` must exist.

**Effects:**

* Creates a new recipe book `b` with the given name and owner.
* Initializes with an empty set of recipes.
* Returns the book ID.

**Request Body:**

```json
{
  "user": "string (ID)",
  "name": "string"
}
```

**Success Response Body (Action):**

```json
{
  "book": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/RecipeBook/editRecipeBookName

**Description:** Renames a recipe book.

**Requirements:**

* The `book` must exist.

**Effects:**

* Sets the name of the `book` to `newName`.

**Request Body:**

```json
{
  "book": "string (ID)",
  "newName": "string"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/RecipeBook/addRecipeToBook

**Description:** Adds a recipe entry to the book.

**Requirements:**

* The `recipe` and `book` must exist.

**Effects:**

* Adds the `recipe` to the set of recipes in the `book`.

**Request Body:**

```json
{
  "recipe": "string (ID)",
  "book": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/RecipeBook/removeRecipeFromBook

**Description:** Removes a recipe entry from the book.

**Requirements:**

* The `book` must exist.

**Effects:**

* Removes the `recipe` from the set of recipes in the `book`.

**Request Body:**

```json
{
  "recipe": "string (ID)",
  "book": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/RecipeBook/deleteRecipeBook

**Description:** Deletes the entire recipe book.

**Requirements:**

* The `book` must exist.

**Effects:**

* Removes the `book` from the set of RecipeBooks.

**Request Body:**

```json
{
  "book": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/RecipeBook/\_getBooks

**Description:** Retrieves all recipe books owned by a user.

**Requirements:**

* The `user` must exist.

**Effects:**

* Returns all books belonging to the user.

**Request Body:**

```json
{
  "user": "string (ID)"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "string (ID)",
    "user": "string (ID)",
    "recipes": ["string (ID)"],
    "name": "string"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/RecipeBook/\_getBook

**Description:** Retrieves the details of a specific recipe book.

**Requirements:**

* The `book` must exist.

**Effects:**

* Returns the specific book document.

**Request Body:**

```json
{
  "book": "string (ID)"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "string (ID)",
    "user": "string (ID)",
    "recipes": ["string (ID)"],
    "name": "string"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```
