---
timestamp: 'Sun Nov 23 2025 14:18:27 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_141827.faf39dbe.md]]'
content_id: f42ab6035345ff5003027c156512dcc11d1364b8f3fc6eec57819f9384bc1855
---

# trace:

The test suite demonstrates the functionality of the **Calendar** concept through four scenarios:

1. **Principle Verification**: Alice assigns a "Pizza" snapshot to a specific date. This directly tests the principle: "when a person decides they want to make a particular dish on a specific day, they create a calendar entry that links that plan to the chosen date." The `assignSnapshotToDate` action is called, and the state is verified using `_getScheduledRecipes`.
2. **Single Deletion**: Alice removes the specific "Pizza" entry. This confirms the ability to `deleteScheduledRecipe` as required by the actions list.
3. **Bulk Deletion**: Alice schedules "Pasta" multiple times. Then `deleteAllScheduledRecipesWithSnapshot` is called (which would typically happen via a sync if the underlying Snapshot/Recipe was deleted). The trace verifies that all "Pasta" entries are gone, but the "Pizza" entry remains, ensuring specificity of the delete action.
4. **Isolation**: Bob schedules items. The trace confirms that querying Alice's calendar does not return Bob's items, fulfilling the implicit requirement that `_getScheduledRecipes` filters by the user provided.
