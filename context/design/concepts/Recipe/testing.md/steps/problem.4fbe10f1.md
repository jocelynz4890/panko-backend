---
timestamp: 'Sun Nov 23 2025 14:26:14 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_142614.83240ccc.md]]'
content_id: 4fbe10f1339b3f05c6994eafd890552e252ca63a5fcc84cca8d7382d229735f4
---

# problem:

The `mongodb` driver infers `Collection` types as `Collection<Document>` by default if a generic is not provided. `Document` typically assumes `_id` is an `ObjectId` (or allows lenient string typing depending on driver version), but our `Snapshots` interface strictly defines `_id` as the branded `ID` type (which is a subtype of string). When assigning `this.db.collection(...)` to `this.snapshots` (typed `Collection<Snapshots>`), TypeScript detects a mismatch in the `_id` field compatibility, raising "Type 'string' is not assignable to type 'ID'" in internal mapping types.
