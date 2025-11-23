---
timestamp: 'Sun Nov 23 2025 14:42:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144247.07ffceb6.md]]'
content_id: 1bae375626e14a97b37e0753c0652e32e01a84212955cd21324b81b1b05ea458
---

# API Specification: Calendar Concept

**Purpose:** Let a person commit planned dishes to specific dates so they can see at a glance what is coming up and avoid forgetting what they intended to cook on a given day.

***

## API Endpoints

### POST /api/Calendar/assignSnapshotToDate

**Description:** Schedules a specific recipe snapshot for a specific date.

**Requirements:**

* The `snapshot` must exist.

**Effects:**

* Adds a new ScheduledRecipe associating the `user`, `snapshot`, and `date`.
* Returns the new ScheduledRecipe ID.

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

* The `scheduledRecipe` must exist.

**Effects:**

* Removes the identified ScheduledRecipe from the state.

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

* True (Always allowed).

**Effects:**

* Finds all ScheduledRecipes associated with the given `snapshot` and deletes them.

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

* True.

**Effects:**

* Returns all scheduled recipes for the given `user`.

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

***
