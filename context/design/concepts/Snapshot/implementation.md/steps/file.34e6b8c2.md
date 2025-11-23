---
timestamp: 'Sun Nov 23 2025 14:00:13 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_140013.c252304c.md]]'
content_id: 34e6b8c29d0328ba6a30a57bbedee94a4d0c42166a83cc72f240bab2495e2b58
---

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
