---
timestamp: 'Sun Nov 23 2025 14:17:15 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251123_141715.6ab9e436.md]]'
content_id: c90c370d8129ca8ffb1a46ec4783fee36e90033f2029f40495a348bd74538f75
---

# file: src/concepts/Calendar/CalendarConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

const PREFIX = "Calendar.";

// Generic Types
type User = ID;
type Snapshot = ID;
type ScheduledRecipe = ID;

/**
 * a set of ScheduledRecipes with
 *   a user User
 *   a snapshot Snapshot
 *   a date Date
 */
interface ScheduledRecipes {
  _id: ScheduledRecipe;
  user: User;
  snapshot: Snapshot;
  date: Date;
}

export default class CalendarConcept {
  scheduledRecipes: Collection<ScheduledRecipes>;

  constructor(private readonly db: Db) {
    this.scheduledRecipes = this.db.collection(PREFIX + "scheduledRecipes");
  }

  /**
   * assignSnapshotToDate (user: User, snapshot: Snapshot, date: Date): (scheduledRecipe: ScheduledRecipe)
   *
   * **requires** snapshot exists
   *
   * **effects** adds a new ScheduledRecipe to the state associating the user, snapshot, and date; returns the new ID
   */
  async assignSnapshotToDate(
    { user, snapshot, date }: { user: User; snapshot: Snapshot; date: Date },
  ): Promise<{ scheduledRecipe: ScheduledRecipe } | { error: string }> {
    const _id = freshID();
    try {
      await this.scheduledRecipes.insertOne({
        _id,
        user,
        snapshot,
        date,
      });
      return { scheduledRecipe: _id };
    } catch (e) {
      return { error: `Could not assign snapshot to date: ${e}` };
    }
  }

  /**
   * deleteScheduledRecipe (scheduledRecipe: ScheduledRecipe)
   *
   * **requires** scheduledRecipe exists
   *
   * **effects** removes the identified ScheduledRecipe from the state
   */
  async deleteScheduledRecipe(
    { scheduledRecipe }: { scheduledRecipe: ScheduledRecipe },
  ): Promise<Empty | { error: string }> {
    try {
      await this.scheduledRecipes.deleteOne({ _id: scheduledRecipe });
      return {};
    } catch (e) {
      return { error: `Could not delete scheduled recipe: ${e}` };
    }
  }

  /**
   * deleteAllScheduledRecipesWithSnapshot (snapshot: Snapshot)
   *
   * **requires** true
   *
   * **effects** finds all ScheduledRecipes associated with the given snapshot and deletes them
   */
  async deleteAllScheduledRecipesWithSnapshot(
    { snapshot }: { snapshot: Snapshot },
  ): Promise<Empty | { error: string }> {
    try {
      await this.scheduledRecipes.deleteMany({ snapshot });
      return {};
    } catch (e) {
      return { error: `Could not delete scheduled recipes for snapshot: ${e}` };
    }
  }

  /**
   * _getScheduledRecipes (user: User): (scheduledRecipe: {scheduledRecipe: ScheduledRecipe, snapshot: Snapshot, date: Date})
   *
   * **requires** true
   *
   * **effects** returns all scheduled recipes for the given user
   */
  async _getScheduledRecipes(
    { user }: { user: User },
  ): Promise<
    Array<{
      scheduledRecipe: {
        scheduledRecipe: ScheduledRecipe;
        snapshot: Snapshot;
        date: Date;
      };
    }>
  > {
    const recipes = await this.scheduledRecipes.find({ user }).toArray();
    
    // Map internal state to output format
    return recipes.map((r) => ({
      scheduledRecipe: {
        scheduledRecipe: r._id,
        snapshot: r.snapshot,
        date: r.date,
      },
    }));
  }
}
```
