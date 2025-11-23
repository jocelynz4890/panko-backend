---
timestamp: 'Sun Nov 23 2025 14:42:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144247.07ffceb6.md]]'
content_id: 1ee67d6a3e8782c8c5c3eea8433016c7cb4b65aba556f2b7a205b82eac13bfc1
---

# API Specification: Recipes Concept

**Purpose:** Provide a stable identity and high-level categorization for a dish, together with a history of its recorded attempts.

***

## API Endpoints

### POST /api/Recipes/createRecipe

**Description:** Creates a new recipe container.

**Requirements:**

* The `user` must exist.

**Effects:**

* Creates a new recipe with the given `name`, `description`, and owner `user`.
* Initializes an empty set of snapshots.

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

* The `recipe` must exist.

**Effects:**

* Updates the `name` and `description` of the recipe.

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

* The `recipe` must exist.

**Effects:**

* Deletes the given recipe.

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

* The `recipe` and `snapshot` must exist.

**Effects:**

* Adds the `snapshot` to the recipe's set of snapshots.

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

* The `recipe` and `snapshot` must exist.

**Effects:**

* Removes the `snapshot` from the recipe's set of snapshots.
* If the snapshot was the default, it is unset.

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

* The `snapshot` must exist and already be linked to the `recipe`.

**Effects:**

* Sets `defaultSnapshot` of the recipe to the given `snapshot`.

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

* The `recipe` must exist.

**Effects:**

* Returns the full state of the recipe including its name, description, snapshots list, and default snapshot.

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

***
