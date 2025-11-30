---
timestamp: 'Sun Nov 23 2025 13:44:08 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_134408.3fb6190d.md]]'
content_id: 6a12f163f25e8638ec65ab593cb2044d8fffd6f87b580a6ddcd41d7557f5150c
---

# trace:

1. **Principle Trace**:
   * **User Goal**: Track "Spaghetti Carbonara".
   * **Action**: `createRecipe` creates the container. State: `{ name: "Spaghetti...", snapshots: [] }`.
   * **Action**: `addSnapshot` (x2) populates history. State: `{ ..., snapshots: [s1, s2] }`.
   * **Action**: `setDefaultSnapshot` highlights a specific success. State: `{ ..., defaultSnapshot: s2 }`.
   * **Action**: `editRecipeName` refines the metadata. State: `{ name: "Authentic Carbonara", ... }`.
   * **Result**: The user has successfully anchored the dish and curated its history.
2. **Constraint Handling**:
   * When a snapshot is removed (`removeSnapshot`), the system checks if it was the default. If so, `defaultSnapshot` is cleared to ensure state consistency (a recipe cannot have a default that isn't in its history).
   * When setting a default, `setDefaultSnapshot` enforces that the target snapshot must already exist in the `snapshots` set via the query filter.
3. **Lifecycle**:
   * Creation and Deletion work as expected, cleaning up the document entirely.
