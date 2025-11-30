---
timestamp: 'Sun Nov 23 2025 13:51:59 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_135159.728059b1.md]]'
content_id: 9419106bb21bc2abf128d8cfef3a9874006e68186814be85ad8a181454dbe6cb
---

# response:

The implementation handles picture **storage references**, not the physical file upload process itself.

In Concept Design, concepts focus on specific behavioral concerns. The `Snapshot` concept is concerned with the **history and metadata** of cooking attempts. It delegates the concern of "binary file storage" to the platform or a different concept (like a generic `ImageStorage` or `File` service).

Here is the specific breakdown of how it works in the code:

1. **Type Definition**: The concept defines `type FilePath = string;`. It treats pictures as opaque strings (URLs or filesystem paths).
2. **State**: The `Snapshots` interface stores `pictures: FilePath[]`.
3. **Actions**:
   * `createSnapshot` accepts `pictures: FilePath[]` as an argument.
   * It assumes the actual image files have **already been uploaded** (e.g., to S3, Cloudinary, or a local disk) by the application layer or a separate service before calling this action.
   * The action simply saves the array of resulting paths/URLs into the MongoDB document.

**If you need to handle the actual file upload**, the standard Concept Design pattern is:

1. The frontend uploads the file to a static asset host.
2. The host returns a URL (e.g., `https://bucket.com/img123.jpg`).
3. The frontend calls `Snapshot.createSnapshot({ pictures: ["https://bucket.com/img123.jpg"], ... })`.
