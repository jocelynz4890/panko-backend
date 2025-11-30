---
timestamp: 'Sun Nov 23 2025 13:35:59 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_133559.1e2a1c1e.md]]'
content_id: 94c7b3fd0ef3c71a7aec133eaba40f7337302edb97f6d63e725f3a3981e6adf9
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
