---
timestamp: 'Sun Nov 23 2025 14:41:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144147.7f1a1117.md]]'
content_id: 432961c436f64adc34a566d9d26ae3721e35eead4a6675b1b0706bf63b7a10be
---

# solution:

1. **State Update**: The `user` field in the `Snapshots` interface should be **required**, not optional.
2. **Action Update (`createSnapshot`)**: The action must accept a `user: User` (which is an `ID`) as an argument and save it to the database.
3. **Action Update (`editSnapshot`)**: Typically, we do **not** pass the user to `editSnapshot` because the owner of a record usually implies permission, or the ownership does not change. In Concept Design, **Authorization** (checking if *this* user is allowed to edit *that* snapshot) is handled by the **Synchronization** layer (e.g., "Only trigger `Snapshot.edit` if `Session.currentUser == Snapshot.owner`"), not by the concept action itself. The concept action simply performs the edit if invoked.

Here is the corrected implementation:
