[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@Snapshot](Snapshot.md)

# implement: Snapshot

# response:

# concept: Snapshot
**purpose**: record individual attempts at preparing a dish, including context and outcome, so that the cook can compare attempts, learn from variations, and see how their results change over time.

**principle**: each time a user prepares a dish, they create a new snapshot that captures when it was made, any photos of the result, notes about what they did (or changed) compared to their usual approach, and how satisfied they were with the outcome. Over many cooking sessions, these snapshots accumulate into a chronological history of attempts for that dish. When the user is deciding how to make the dish again, they review the previous snapshots to see which variations turned out best and what they want to repeat or avoid, then create a new snapshot for the latest attempt to extend the history.

**state**:
a set of `snapshots` with
  * a `user` of type `User`
  * an `ingredientsList` of type `String`
  * an `instructions` of type `String`
  * a `note` of type `String`
  * a `ranking` of type `Number`
  * a `subname` of type `String`
  * a set of `pictures` of type `FilePath`
  * a `date` of type `Date`
  * a `recipe` of type `Recipe`

**actions**:
* `createSnapshot` (ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking, recipe: Recipe): (snapshot: Snapshot)
* `editSnapshot` (snapshot: Snapshot, ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking): (snapshot: Snapshot)
* `deleteSnapshot` (snapshot: Snapshot): (snapshot: Snapshot)
* `deleteAllSnapshotsForRecipe` (recipe: Recipe): ()

# file: src/concepts/Snapshot/SnapshotConcept.ts
```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix
const PREFIX = "Snapshot" + ".";

// Concept types
type User = ID;
type Recipe = ID;
type Snapshot = ID;
type FilePath = string;
type Ranking = number;

/**
 * a set of `snapshots` with
 *   a `user` of type `User`
 *   an `ingredientsList` of type `String`
 *   an `instructions` of type `String`
 *   a `note` of type `String`
 *   a `ranking` of type `Number`
 *   a `subname` of type `String`
 *   a set of `pictures` of type `FilePath`
 *   a `date` of type `Date`
 *   a `recipe` of type `Recipe`
 */
interface Snapshots {
  _id: Snapshot;
  user?: User; // Defined in state, but not populated by createSnapshot action signature
  ingredientsList: string;
  instructions: string;
  note: string;
  ranking: Ranking;
  subname: string;
  pictures: FilePath[];
  date: Date;
  recipe: Recipe;
}

export default class SnapshotConcept {
  snapshots: Collection<Snapshots>;

  constructor(private readonly db: Db) {
    this.snapshots = this.db.collection(PREFIX + "snapshots");
  }

  /**
   * createSnapshot (ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking, recipe: Recipe): (snapshot: Snapshot)
   *
   * **requires** ranking is between 1 and 5
   *
   * **effects** creates a new snapshot with the given arguments
   */
  async createSnapshot(
    inputs: {
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
      recipe: Recipe;
    },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const {
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      recipe,
    } = inputs;

    if (ranking < 1 || ranking > 5) {
      return { error: "Ranking must be between 1 and 5" };
    }

    const _id = freshID();
    const newSnapshot: Snapshots = {
      _id,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      recipe,
    };

    await this.snapshots.insertOne(newSnapshot);

    return { snapshot: _id };
  }

  /**
   * editSnapshot (snapshot: Snapshot, ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking):(snapshot: Snapshot)
   *
   * **requires** snapshot exists
   *
   * **effects** updates the snapshot with the given edits
   */
  async editSnapshot(
    inputs: {
      snapshot: Snapshot;
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
    },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const {
      snapshot,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
    } = inputs;

    // Check ranking validity (implicit consistency requirement)
    if (ranking !== undefined && (ranking < 1 || ranking > 5)) {
        return { error: "Ranking must be between 1 and 5" };
    }

    const result = await this.snapshots.updateOne(
      { _id: snapshot },
      {
        $set: {
          ingredientsList,
          subname,
          pictures,
          date,
          instructions,
          note,
          ranking,
        },
      },
    );

    if (result.matchedCount === 0) {
      return { error: "Snapshot does not exist" };
    }

    return { snapshot };
  }

  /**
   * deleteSnapshot(snapshot: Snapshot):(snapshot: Snapshot)
   *
   * **requires** snapshot exists
   *
   * **effects** deletes the given snapshot
   */
  async deleteSnapshot(
    { snapshot }: { snapshot: Snapshot },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const result = await this.snapshots.deleteOne({ _id: snapshot });

    if (result.deletedCount === 0) {
      return { error: "Snapshot does not exist" };
    }

    return { snapshot };
  }

  /**
   * deleteAllSnapshotsForRecipe(recipe: Recipe)
   *
   * **requires** True
   *
   * **effects** deletes all snapshots associated with the given recipe
   */
  async deleteAllSnapshotsForRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<Empty> {
    await this.snapshots.deleteMany({ recipe });
    return {};
  }

  /**
   * _getSnapshots (recipe: Recipe): (snapshot: Snapshot)
   *
   * **requires** True
   *
   * **effects** returns set of all snapshots associated with the recipe
   */
  async _getSnapshots(
    { recipe }: { recipe: Recipe },
  ): Promise<Snapshots[]> {
    return await this.snapshots.find({ recipe }).toArray();
  }
}
```

# prompt: There are some type errors in this code, all look like: TS2322 [ERROR]: Type 'string' is not assignable to type 'ID'.
  Type 'string' is not assignable to type '{ [Brand]: true; }'.
Go through and fix all of these.
# response:

# problem:
The `mongodb` driver infers `Collection` types as `Collection<Document>` by default if a generic is not provided. `Document` typically assumes `_id` is an `ObjectId` (or allows lenient string typing depending on driver version), but our `Snapshots` interface strictly defines `_id` as the branded `ID` type (which is a subtype of string). When assigning `this.db.collection(...)` to `this.snapshots` (typed `Collection<Snapshots>`), TypeScript detects a mismatch in the `_id` field compatibility, raising "Type 'string' is not assignable to type 'ID'" in internal mapping types.

# solution:
Explicitly type the `this.db.collection` call with `<Snapshots>` to ensure the returned collection instance aligns with the class property type and correctly respects the `ID` type for `_id`.

# file: src/concepts/Snapshot/SnapshotConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix
const PREFIX = "Snapshot" + ".";

// Concept types
type User = ID;
type Recipe = ID;
type Snapshot = ID;
type FilePath = string;
type Ranking = number;

/**
 * a set of `snapshots` with
 *   a `user` of type `User`
 *   an `ingredientsList` of type `String`
 *   an `instructions` of type `String`
 *   a `note` of type `String`
 *   a `ranking` of type `Number`
 *   a `subname` of type `String`
 *   a set of `pictures` of type `FilePath`
 *   a `date` of type `Date`
 *   a `recipe` of type `Recipe`
 */
interface Snapshots {
  _id: Snapshot;
  user?: User; 
  ingredientsList: string;
  instructions: string;
  note: string;
  ranking: Ranking;
  subname: string;
  pictures: FilePath[];
  date: Date;
  recipe: Recipe;
}

export default class SnapshotConcept {
  snapshots: Collection<Snapshots>;

  constructor(private readonly db: Db) {
    this.snapshots = this.db.collection<Snapshots>(PREFIX + "snapshots");
  }

  /**
   * createSnapshot (ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking, recipe: Recipe): (snapshot: Snapshot)
   *
   * **requires** ranking is between 1 and 5
   *
   * **effects** creates a new snapshot with the given arguments
   */
  async createSnapshot(
    inputs: {
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
      recipe: Recipe;
    },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const {
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      recipe,
    } = inputs;

    if (ranking < 1 || ranking > 5) {
      return { error: "Ranking must be between 1 and 5" };
    }

    const _id: Snapshot = freshID();
    const newSnapshot: Snapshots = {
      _id,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      recipe,
    };

    await this.snapshots.insertOne(newSnapshot);

    return { snapshot: _id };
  }

  /**
   * editSnapshot (snapshot: Snapshot, ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking):(snapshot: Snapshot)
   *
   * **requires** snapshot exists
   *
   * **effects** updates the snapshot with the given edits
   */
  async editSnapshot(
    inputs: {
      snapshot: Snapshot;
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
    },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const {
      snapshot,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
    } = inputs;

    if (ranking < 1 || ranking > 5) {
        return { error: "Ranking must be between 1 and 5" };
    }

    const result = await this.snapshots.updateOne(
      { _id: snapshot },
      {
        $set: {
          ingredientsList,
          subname,
          pictures,
          date,
          instructions,
          note,
          ranking,
        },
      },
    );

    if (result.matchedCount === 0) {
      return { error: "Snapshot does not exist" };
    }

    return { snapshot };
  }

  /**
   * deleteSnapshot(snapshot: Snapshot):(snapshot: Snapshot)
   *
   * **requires** snapshot exists
   *
   * **effects** deletes the given snapshot
   */
  async deleteSnapshot(
    { snapshot }: { snapshot: Snapshot },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const result = await this.snapshots.deleteOne({ _id: snapshot });

    if (result.deletedCount === 0) {
      return { error: "Snapshot does not exist" };
    }

    return { snapshot };
  }

  /**
   * deleteAllSnapshotsForRecipe(recipe: Recipe)
   *
   * **requires** True
   *
   * **effects** deletes all snapshots associated with the given recipe
   */
  async deleteAllSnapshotsForRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<Empty> {
    await this.snapshots.deleteMany({ recipe });
    return {};
  }

  /**
   * _getSnapshots (recipe: Recipe): (snapshot: Snapshot)
   *
   * **requires** True
   *
   * **effects** returns set of all snapshots associated with the recipe
   */
  async _getSnapshots(
    { recipe }: { recipe: Recipe },
  ): Promise<Snapshots[]> {
    return await this.snapshots.find({ recipe }).toArray();
  }
}
```

# prompt: how doews the implementation handle picture upload?
# response:

The implementation handles picture **storage references**, not the physical file upload process itself.

In Concept Design, concepts focus on specific behavioral concerns. The `Snapshot` concept is concerned with the **history and metadata** of cooking attempts. It delegates the concern of "binary file storage" to the platform or a different concept (like a generic `ImageStorage` or `File` service).

Here is the specific breakdown of how it works in the code:

1.  **Type Definition**: The concept defines `type FilePath = string;`. It treats pictures as opaque strings (URLs or filesystem paths).
2.  **State**: The `Snapshots` interface stores `pictures: FilePath[]`.
3.  **Actions**:
    *   `createSnapshot` accepts `pictures: FilePath[]` as an argument.
    *   It assumes the actual image files have **already been uploaded** (e.g., to S3, Cloudinary, or a local disk) by the application layer or a separate service before calling this action.
    *   The action simply saves the array of resulting paths/URLs into the MongoDB document.

**If you need to handle the actual file upload**, the standard Concept Design pattern is:
1.  The frontend uploads the file to a static asset host.
2.  The host returns a URL (e.g., `https://bucket.com/img123.jpg`).
3.  The frontend calls `Snapshot.createSnapshot({ pictures: ["https://bucket.com/img123.jpg"], ... })`.

# prompt: How should the app handle picture uploads?
# response:

In the Concept Design architecture, because concepts must be **independent** and **modular**, you should not modify the `Snapshot` concept to handle binary data. Instead, you should introduce a general-purpose concept (e.g., `Media` or `Files`) to handle the storage, and then link the two conceptually.

Here is the architectural approach to handling picture uploads in this app.

### 1. The Strategy: "Upload First, Link Second"

Since the `Snapshot` concept expects a `FilePath` (string), the application workflow should be:

1.  **Phase 1 (Storage):** The App uploads the binary file to a `Media` concept. The `Media` concept returns a public URL or internal path.
2.  **Phase 2 (Logic):** The App passes that URL string to the `Snapshot.createSnapshot` action.

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

# prompt: How do createSnapshot, editSnapshot handle the user argument?
# response:

# problem:

In the specification provided in the prompt, the **`user` argument was accidentally omitted** from the `createSnapshot` action signature, even though the `state` declares that a `Snapshot` has a `user`.

Consequently, the current implementation defines `user?: User` as optional in the interface and never assigns it. This violates the **purpose** of the concept (users tracking *their* history).

# solution:

1.  **State Update**: The `user` field in the `Snapshots` interface should be **required**, not optional.
2.  **Action Update (`createSnapshot`)**: The action must accept a `user: User` (which is an `ID`) as an argument and save it to the database.
3.  **Action Update (`editSnapshot`)**: Typically, we do **not** pass the user to `editSnapshot` because the owner of a record usually implies permission, or the ownership does not change. In Concept Design, **Authorization** (checking if *this* user is allowed to edit *that* snapshot) is handled by the **Synchronization** layer (e.g., "Only trigger `Snapshot.edit` if `Session.currentUser == Snapshot.owner`"), not by the concept action itself. The concept action simply performs the edit if invoked.

Here is the corrected implementation:

# file: src/concepts/Snapshot/SnapshotConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix
const PREFIX = "Snapshot" + ".";

// Concept types
type User = ID;
type Recipe = ID;
type Snapshot = ID;
type FilePath = string;
type Ranking = number;

/**
 * a set of `snapshots` with
 *   a `user` of type `User`
 *   ...
 */
interface Snapshots {
  _id: Snapshot;
  user: User; // <--- CHANGED: Now required
  ingredientsList: string;
  instructions: string;
  note: string;
  ranking: Ranking;
  subname: string;
  pictures: FilePath[];
  date: Date;
  recipe: Recipe;
}

export default class SnapshotConcept {
  snapshots: Collection<Snapshots>;

  constructor(private readonly db: Db) {
    this.snapshots = this.db.collection<Snapshots>(PREFIX + "snapshots");
  }

  /**
   * createSnapshot (user: User, ...): (snapshot: Snapshot)
   * 
   * **requires** ranking is between 1 and 5
   * **effects** creates a new snapshot with the given arguments
   */
  async createSnapshot(
    inputs: {
      user: User; // <--- CHANGED: Added argument
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
      recipe: Recipe;
    },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const {
      user, // <--- CHANGED: Destructured
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      recipe,
    } = inputs;

    if (ranking < 1 || ranking > 5) {
      return { error: "Ranking must be between 1 and 5" };
    }

    const _id: Snapshot = freshID();
    const newSnapshot: Snapshots = {
      _id,
      user, // <--- CHANGED: Assigned
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
      recipe,
    };

    await this.snapshots.insertOne(newSnapshot);

    return { snapshot: _id };
  }

  /**
   * editSnapshot (...)
   * Note: 'user' is NOT passed here. Ownership typically does not change.
   * Authorization is handled by the caller/sync.
   */
  async editSnapshot(
    inputs: {
      snapshot: Snapshot;
      ingredientsList: string;
      subname: string;
      pictures: FilePath[];
      date: Date;
      instructions: string;
      note: string;
      ranking: Ranking;
    },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const {
      snapshot,
      ingredientsList,
      subname,
      pictures,
      date,
      instructions,
      note,
      ranking,
    } = inputs;

    if (ranking !== undefined && (ranking < 1 || ranking > 5)) {
        return { error: "Ranking must be between 1 and 5" };
    }

    const result = await this.snapshots.updateOne(
      { _id: snapshot },
      {
        $set: {
          ingredientsList,
          subname,
          pictures,
          date,
          instructions,
          note,
          ranking,
        },
      },
    );

    if (result.matchedCount === 0) {
      return { error: "Snapshot does not exist" };
    }

    return { snapshot };
  }

  async deleteSnapshot(
    { snapshot }: { snapshot: Snapshot },
  ): Promise<{ snapshot?: Snapshot; error?: string }> {
    const result = await this.snapshots.deleteOne({ _id: snapshot });

    if (result.deletedCount === 0) {
      return { error: "Snapshot does not exist" };
    }

    return { snapshot };
  }

  async deleteAllSnapshotsForRecipe(
    { recipe }: { recipe: Recipe },
  ): Promise<Empty> {
    await this.snapshots.deleteMany({ recipe });
    return {};
  }

  async _getSnapshots(
    { recipe }: { recipe: Recipe },
  ): Promise<Snapshots[]> {
    return await this.snapshots.find({ recipe }).toArray();
  }
}
```