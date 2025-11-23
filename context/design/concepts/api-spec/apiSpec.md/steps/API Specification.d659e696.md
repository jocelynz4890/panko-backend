---
timestamp: 'Sun Nov 23 2025 14:42:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144247.07ffceb6.md]]'
content_id: d659e6960e6304a13f3e55e31a8e9d92fd82a78a9b79ed9b846c8db4392405a7
---

# API Specification: Snapshot Concept

**Purpose:** Record individual attempts at preparing a dish, including context and outcome, so that the cook can compare attempts, learn from variations, and see how their results change over time.

***

## API Endpoints

### POST /api/Snapshot/createSnapshot

**Description:** Creates a new record of a cooking attempt.

**Requirements:**

* `ranking` must be between 1 and 5.

**Effects:**

* Creates a new snapshot with the provided ingredients, pictures (URLs), date, instructions, note, ranking, and associated recipe.
* Returns the new snapshot ID.

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

* The `snapshot` must exist.
* `ranking` (if provided) must be between 1 and 5.

**Effects:**

* Updates the snapshot details with the given arguments.

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

* The `snapshot` must exist.

**Effects:**

* Deletes the given snapshot.

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

* True.

**Effects:**

* Deletes all snapshots associated with the given `recipe` ID.

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

* True.

**Effects:**

* Returns the set of all snapshots associated with the recipe.

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

***
