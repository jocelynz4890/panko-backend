---
timestamp: 'Sun Nov 23 2025 14:26:14 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_142614.83240ccc.md]]'
content_id: dc4bb2f0d2acdd2fe4f91ab374ff688ee50b68f75dd06ed13cf0796496e57aff
---

# solution:

Explicitly type the `this.db.collection` call with `<Snapshots>` to ensure the returned collection instance aligns with the class property type and correctly respects the `ID` type for `_id`.
