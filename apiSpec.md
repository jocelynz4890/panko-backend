# API Specification: Authentication Concept

**Purpose:** Authenticate users so that each user of the app is a real person.

---

## API Endpoints

### POST /api/Authentication/register

**Description:** Registers a new user with a username and password.

**Requirements:**

- No user exists with the given `username`.

**Effects:**

- Creates and stores a new User with the given `username` and a hashed version of the `password`.
- Returns the new user ID.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**

```json
{
  "user": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Authentication/authenticate

**Description:** Authenticates a user with username and password.

**Requirements:**

- A user must exist with the given `username`.

**Effects:**

- If the `username` exists and the `password` matches, returns the user ID.
- If validation fails, access is denied.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**

```json
{
  "user": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Authentication/createSession

**Description:** Creates a new session for an authenticated user.

**Requirements:**

- The `user` must exist.

**Effects:**

- Creates a new session with a random token for the user.
- Returns the session token.

**Request Body:**

```json
{
  "user": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{
  "token": "string"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Authentication/validateSession

**Description:** Validates a session token and returns the associated user.

**Requirements:**

- A session must exist with the given `token`.

**Effects:**

- Returns the user ID associated with the session if valid.

**Request Body:**

```json
{
  "token": "string"
}
```

**Success Response Body (Action):**

```json
{
  "user": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

---

# API Specification: Calendar Concept

**Purpose:** Let a person commit planned dishes to specific dates so they can see at a glance what is coming up and avoid forgetting what they intended to cook on a given day.

---

## API Endpoints

### POST /api/Calendar/assignSnapshotToDate

**Description:** Schedules a specific recipe snapshot for a specific date.

**Requirements:**

- The `snapshot` must exist.

**Effects:**

- Adds a new ScheduledRecipe associating the `user`, `snapshot`, and `date`.
- Returns the new ScheduledRecipe ID.

**Request Body:**

```json
{
  "user": "string (ID)",
  "snapshot": "string (ID)",
  "date": "string (Date)"
}
```

**Success Response Body (Action):**

```json
{
  "scheduledRecipe": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Calendar/deleteScheduledRecipe

**Description:** Removes a scheduled recipe entry from the calendar.

**Requirements:**

- The `scheduledRecipe` must exist.

**Effects:**

- Removes the identified ScheduledRecipe from the state.

**Request Body:**

```json
{
  "scheduledRecipe": "string (ID)"
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

### POST /api/Calendar/deleteAllScheduledRecipesWithSnapshot

**Description:** Removes all calendar entries associated with a specific snapshot.

**Requirements:**

- True (Always allowed).

**Effects:**

- Finds all ScheduledRecipes associated with the given `snapshot` and deletes them.

**Request Body:**

```json
{
  "snapshot": "string (ID)"
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

### POST /api/Calendar/\_getScheduledRecipes

**Description:** Retrieves all scheduled recipes for a specific user.

**Requirements:**

- True.

**Effects:**

- Returns all scheduled recipes for the given `user`.

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
    "scheduledRecipe": {
      "scheduledRecipe": "string (ID)",
      "snapshot": "string (ID)",
      "date": "string (Date)"
    }
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

---

# API Specification: Recipes Concept

**Purpose:** Provide a stable identity and high-level categorization for a dish, together with a history of its recorded attempts.

---

## API Endpoints

### POST /api/Recipes/createRecipe

**Description:** Creates a new recipe container.

**Requirements:**

- The `user` must exist.

**Effects:**

- Creates a new recipe with the given `name`, `description`, and owner `user`.
- Initializes an empty set of snapshots.

**Request Body:**

```json
{
  "user": "string (ID)",
  "name": "string",
  "description": "string"
}
```

**Success Response Body (Action):**

```json
{
  "recipe": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Recipes/editRecipeName

**Description:** Updates the metadata of a recipe.

**Requirements:**

- The `recipe` must exist.

**Effects:**

- Updates the `name` and `description` of the recipe.

**Request Body:**

```json
{
  "recipe": "string (ID)",
  "newName": "string",
  "description": "string"
}
```

**Success Response Body (Action):**

```json
{
  "recipe": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Recipes/deleteRecipe

**Description:** Deletes a recipe and its associated metadata.

**Requirements:**

- The `recipe` must exist.

**Effects:**

- Deletes the given recipe.

**Request Body:**

```json
{
  "recipe": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{
  "recipe": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Recipes/addSnapshot

**Description:** Links a snapshot to a recipe.

**Requirements:**

- The `recipe` and `snapshot` must exist.

**Effects:**

- Adds the `snapshot` to the recipe's set of snapshots.

**Request Body:**

```json
{
  "snapshot": "string (ID)",
  "recipe": "string (ID)"
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

### POST /api/Recipes/removeSnapshot

**Description:** Unlinks a snapshot from a recipe.

**Requirements:**

- The `recipe` and `snapshot` must exist.

**Effects:**

- Removes the `snapshot` from the recipe's set of snapshots.
- If the snapshot was the default, it is unset.

**Request Body:**

```json
{
  "snapshot": "string (ID)",
  "recipe": "string (ID)"
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

### POST /api/Recipes/setDefaultSnapshot

**Description:** Sets a specific snapshot as the primary representation of the recipe.

**Requirements:**

- The `snapshot` must exist and already be linked to the `recipe`.

**Effects:**

- Sets `defaultSnapshot` of the recipe to the given `snapshot`.

**Request Body:**

```json
{
  "snapshot": "string (ID)",
  "recipe": "string (ID)"
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

### POST /api/Recipes/\_getRecipe

**Description:** Retrieves the full details of a specific recipe.

**Requirements:**

- The `recipe` must exist.

**Effects:**

- Returns the full state of the recipe including its name, description, snapshots list, and default snapshot.

**Request Body:**

```json
{
  "recipe": "string (ID)"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "string (ID)",
    "owner": "string (ID)",
    "name": "string",
    "description": "string",
    "snapshots": ["string (ID)"],
    "defaultSnapshot": "string (ID) (optional)"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

---

# API Specification: Snapshot Concept

**Purpose:** Record individual attempts at preparing a dish, including context and outcome, so that the cook can compare attempts, learn from variations, and see how their results change over time.

---

## API Endpoints

### POST /api/Snapshot/createSnapshot

**Description:** Creates a new record of a cooking attempt.

**Requirements:**

- `ranking` must be between 1 and 5.

**Effects:**

- Creates a new snapshot with the provided ingredients, pictures (URLs), date, instructions, note, ranking, and associated recipe.
- Returns the new snapshot ID.

**Request Body:**

```json
{
  "user": "string (ID)",
  "ingredientsList": "string",
  "subname": "string",
  "pictures": ["string (URL/Path)"],
  "date": "string (Date)",
  "instructions": "string",
  "note": "string",
  "ranking": "number",
  "recipe": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{
  "snapshot": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Snapshot/editSnapshot

**Description:** Edits an existing cooking attempt record.

**Requirements:**

- The `snapshot` must exist.
- `ranking` (if provided) must be between 1 and 5.

**Effects:**

- Updates the snapshot details with the given arguments.

**Request Body:**

```json
{
  "snapshot": "string (ID)",
  "ingredientsList": "string",
  "subname": "string",
  "pictures": ["string (URL/Path)"],
  "date": "string (Date)",
  "instructions": "string",
  "note": "string",
  "ranking": "number"
}
```

**Success Response Body (Action):**

```json
{
  "snapshot": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Snapshot/deleteSnapshot

**Description:** Deletes a specific snapshot.

**Requirements:**

- The `snapshot` must exist.

**Effects:**

- Deletes the given snapshot.

**Request Body:**

```json
{
  "snapshot": "string (ID)"
}
```

**Success Response Body (Action):**

```json
{
  "snapshot": "string (ID)"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

### POST /api/Snapshot/deleteAllSnapshotsForRecipe

**Description:** Deletes all snapshots belonging to a specific recipe.

**Requirements:**

- True.

**Effects:**

- Deletes all snapshots associated with the given `recipe` ID.

**Request Body:**

```json
{
  "recipe": "string (ID)"
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

### POST /api/Snapshot/\_getSnapshots

**Description:** Retrieves all snapshots for a specific recipe.

**Requirements:**

- True.

**Effects:**

- Returns the set of all snapshots associated with the recipe.

**Request Body:**

```json
{
  "recipe": "string (ID)"
}
```

**Success Response Body (Query):**

```json
[
  {
    "_id": "string (ID)",
    "user": "string (ID)",
    "ingredientsList": "string",
    "instructions": "string",
    "note": "string",
    "ranking": "number",
    "subname": "string",
    "pictures": ["string (URL/Path)"],
    "date": "string (Date)",
    "recipe": "string (ID)"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

---

# API Specification: RecipeBook Concept

**Purpose:** Provide each person with named collections of dish entries, organized through a table of contents, so they can quickly locate and choose among a manageable set of recipes.

---

## API Endpoints

### POST /api/RecipeBook/createRecipeBook

**Description:** Creates a new recipe book collection.

**Requirements:**

- The `user` must exist.

**Effects:**

- Creates a new recipe book `b` with the given name and owner.
- Initializes with an empty set of recipes.
- Returns the book ID.

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

- The `book` must exist.

**Effects:**

- Sets the name of the `book` to `newName`.

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

- The `recipe` and `book` must exist.

**Effects:**

- Adds the `recipe` to the set of recipes in the `book`.

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

- The `book` must exist.

**Effects:**

- Removes the `recipe` from the set of recipes in the `book`.

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

- The `book` must exist.

**Effects:**

- Removes the `book` from the set of RecipeBooks.

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

- The `user` must exist.

**Effects:**

- Returns all books belonging to the user.

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

- The `book` must exist.

**Effects:**

- Returns the specific book document.

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
