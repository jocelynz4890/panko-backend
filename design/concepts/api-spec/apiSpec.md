[@authentication-concept-code](../Authentication/implementation.md)

[@calendar-concept-code](../Calendar/implementation.md)

[@dishes-concept-code](../Dishes/implementation.md)

[@recipe-concept-code](../Recipe/implementation.md)

[@recipebook-concept-code](../RecipeBook/implementation.md)

[@api-extraction-from-code](../../tools/api-extraction-from-code.md)


Prompt: Now, analyze the following Concept Implementations and generate the API documentation based on these instructions.

# response:

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

**Description:** Authenticates a user and generates a session token.

**Requirements:**
- A user must exist with the given `username`.

**Effects:**
- If the `username` exists and the `password` matches, generates a session token and updates the user state.
- Returns the user ID and the token.
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
  "user": "string (ID)",
  "token": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/Authentication/validateToken

**Description:** Verifies that a user is currently authenticated with a valid token.

**Requirements:**
- The `user` exists.
- The `token` matches the stored token for that user.

**Effects:**
- Returns the user ID if authenticated.

**Request Body:**
```json
{
  "user": "string (ID)",
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

### POST /api/Calendar/assignRecipeToDate

**Description:** Schedules a specific recipe attempt for a specific date.

**Requirements:**
- The `recipe` must exist.

**Effects:**
- Adds a new ScheduledRecipe associating the `user`, `recipe`, and `date`.
- Returns the new ScheduledRecipe ID.

**Request Body:**
```json
{
  "user": "string (ID)",
  "recipe": "string (ID)",
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

### POST /api/Calendar/deleteAllScheduledRecipesWithRecipe

**Description:** Removes all calendar entries associated with a specific recipe attempt.

**Requirements:**
- True (Always allowed).

**Effects:**
- Finds all ScheduledRecipes associated with the given `recipe` and deletes them.

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

### POST /api/Calendar/_getScheduledRecipes

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
      "recipe": "string (ID)",
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

# API Specification: Dishes Concept

**Purpose:** Provide a stable identity and high-level categorization for a dish, together with a history of its recorded attempts.

---

## API Endpoints

### POST /api/Dishes/createDish

**Description:** Creates a new dish container.

**Requirements:**
- The `user` must exist.

**Effects:**
- Creates a new dish with the given `name`, `description`, and owner `user`.
- Initializes an empty set of recipes.

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
  "dish": "string (ID)"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/Dishes/editDishName

**Description:** Updates the metadata of a dish.

**Requirements:**
- The `dish` must exist.

**Effects:**
- Updates the `name` and `description` of the dish.

**Request Body:**
```json
{
  "dish": "string (ID)",
  "newName": "string",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "dish": "string (ID)"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/Dishes/deleteDish

**Description:** Deletes a dish and its associated metadata.

**Requirements:**
- The `dish` must exist.

**Effects:**
- Deletes the given dish.

**Request Body:**
```json
{
  "dish": "string (ID)"
}
```

**Success Response Body (Action):**
```json
{
  "dish": "string (ID)"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/Dishes/addRecipe

**Description:** Links a recorded recipe attempt to a dish.

**Requirements:**
- The `dish` and `recipe` must exist.

**Effects:**
- Adds the `recipe` to the dish's set of recipes.

**Request Body:**
```json
{
  "recipe": "string (ID)",
  "dish": "string (ID)"
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

### POST /api/Dishes/removeRecipe

**Description:** Unlinks a recorded recipe attempt from a dish.

**Requirements:**
- The `dish` and `recipe` must exist.

**Effects:**
- Removes the `recipe` from the dish's set of recipes.
- If the recipe was the default, it is unset.

**Request Body:**
```json
{
  "recipe": "string (ID)",
  "dish": "string (ID)"
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

### POST /api/Dishes/setDefaultRecipe

**Description:** Sets a specific recipe attempt as the primary representation of the dish.

**Requirements:**
- The `recipe` must exist and already be linked to the `dish`.

**Effects:**
- Sets `defaultRecipe` of the dish to the given `recipe`.

**Request Body:**
```json
{
  "recipe": "string (ID)",
  "dish": "string (ID)"
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

### POST /api/Dishes/_getDish

**Description:** Retrieves the full details of a specific dish.

**Requirements:**
- The `dish` must exist.

**Effects:**
- Returns the full state of the dish including its name, description, recipes list, and default recipe.

**Request Body:**
```json
{
  "dish": "string (ID)"
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
    "recipes": ["string (ID)"],
    "defaultRecipe": "string (ID) (optional)"
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

# API Specification: Recipe Concept

**Purpose:** Record individual attempts at preparing a dish, including context and outcome, so that the cook can compare attempts, learn from variations, and see how their results change over time.

---

## API Endpoints

### POST /api/Recipe/createRecipe

**Description:** Creates a new record of a cooking attempt.

**Requirements:**
- `ranking` must be between 1 and 5.

**Effects:**
- Creates a new recipe attempt with the provided ingredients, pictures (URLs), date, instructions, note, ranking, and associated dish.
- Returns the new recipe ID.

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
  "dish": "string (ID)"
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

### POST /api/Recipe/editRecipe

**Description:** Edits an existing cooking attempt record.

**Requirements:**
- The `recipe` must exist.
- `ranking` (if provided) must be between 1 and 5.

**Effects:**
- Updates the recipe details with the given arguments.

**Request Body:**
```json
{
  "recipe": "string (ID)",
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
  "recipe": "string (ID)"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

### POST /api/Recipe/deleteRecipe

**Description:** Deletes a specific recipe attempt.

**Requirements:**
- The `recipe` must exist.

**Effects:**
- Deletes the given recipe attempt.

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

### POST /api/Recipe/deleteAllRecipesForDish

**Description:** Deletes all recipe attempts belonging to a specific dish.

**Requirements:**
- True.

**Effects:**
- Deletes all recipes associated with the given `dish` ID.

**Request Body:**
```json
{
  "dish": "string (ID)"
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

### POST /api/Recipe/_getRecipes

**Description:** Retrieves all recipe attempts for a specific dish.

**Requirements:**
- True.

**Effects:**
- Returns the set of all recipes associated with the dish.

**Request Body:**
```json
{
  "dish": "string (ID)"
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
    "dish": "string (ID)"
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

### POST /api/RecipeBook/_getBooks

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

### POST /api/RecipeBook/_getBook

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