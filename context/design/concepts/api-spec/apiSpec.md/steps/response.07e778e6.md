---
timestamp: 'Sun Nov 23 2025 14:41:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_144147.7f1a1117.md]]'
content_id: 07e778e6d1d67aca0f0fb9a4fb2e1a3f364aea349fd3ab7ef831fc02ab0567f2
---

# response:

In the Concept Design architecture, because concepts must be **independent** and **modular**, you should not modify the `Snapshot` concept to handle binary data. Instead, you should introduce a general-purpose concept (e.g., `Media` or `Files`) to handle the storage, and then link the two conceptually.

Here is the architectural approach to handling picture uploads in this app.

### 1. The Strategy: "Upload First, Link Second"

Since the `Snapshot` concept expects a `FilePath` (string), the application workflow should be:

1. **Phase 1 (Storage):** The App uploads the binary file to a `Media` concept. The `Media` concept returns a public URL or internal path.
2. **Phase 2 (Logic):** The App passes that URL string to the `Snapshot.createSnapshot` action.

### 2. The Solution: A Generic `Media` Concept

You should define a new concept dedicated to file handling. This allows you to reuse file uploading logic for User Profiles, Recipe images, or any other future feature without rewriting code.

**Concept Spec:**

```text
concept Media

purpose: allow the storage and retrieval of binary assets via persistent identifiers

principle: if a user uploads a file, they receive a unique locator for that file; the file remains available at that locator until explicitly deleted.

state:
  a set of Files with
    a url String
    a owner User

actions:
  upload (name: String, data: StringBase64): (url: String)
  delete (url: String)
```

**Implementation Note:** In a real-world TypeScript implementation, the `upload` action might handle `Multipart/Form-Data` or return a "Pre-signed Upload URL" (for S3) to keep the backend stateless, but logically it serves the same purpose.

### 3. The Application Workflow

Here is how the "App" (the glue code or frontend) orchestrates these two independent concepts:

```typescript
// Frontend / Orchestration Layer

import MediaConcept from "@concepts/MediaConcept.ts";
import SnapshotConcept from "@concepts/SnapshotConcept.ts";

async function handleUserSubmittingSnapshot(formData: any) {
  
  // 1. Extract the raw file from the form
  const rawFile = formData.get("picture");
  
  // 2. Interact with the Media Concept first
  // (Assuming Media.upload handles the binary transfer)
  const uploadResult = await MediaConcept.upload({
    name: "snapshot-01.jpg", 
    data: rawFile
  });
  
  if (uploadResult.error) {
    alert("Image upload failed");
    return;
  }

  const imageUrl = uploadResult.url; // e.g., "https://s3.aws.../img1.jpg"

  // 3. Interact with the Snapshot Concept second
  // We pass the URL, not the file
  const snapshotResult = await SnapshotConcept.createSnapshot({
    user: currentUser.id,
    pictures: [imageUrl], // <--- Linking the concepts here
    instructions: formData.instructions,
    ranking: formData.ranking,
    // ... other fields
  });

  if (snapshotResult.error) {
    // Optional: Cleanup the uploaded image if the snapshot creation failed
    await MediaConcept.delete({ url: imageUrl });
  }
}
```

### 4. Advanced: Cleaning up with `Sync`

One of the advantages of Concept Design is using **Syncs** to manage dependencies.

If a user deletes a Snapshot, you might want to delete the associated image to save storage space. Since `Snapshot` doesn't know about `Media`, you write a synchronization rule:

```text
sync CleanupSnapshotImages
when 
    Snapshot.deleteSnapshot(s)
where
    in Snapshot: pictures of s is picList
    p is in picList
then
    Media.delete(p)
```

This keeps your `Snapshot` concept pure (it only cares about culinary history) and your `Media` concept pure (it only cares about file storage), while the `Sync` handles the relationship between them.
