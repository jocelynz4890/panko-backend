[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@Recipe](Calendar.md)

# implement: Calendar

# response:

# concept: Calendar

**concept** Calendar [User, Snapshot]

**purpose** let a person commit planned dishes to specific dates so they can see at a glance what is coming up and avoid forgetting what they intended to cook on a given day.

**principle** when a person decides they want to make a particular dish on a specific day, they create a calendar entry that links that plan to the chosen date.

**state**
a set of ScheduledRecipes with
  a user User
  a snapshot Snapshot
  a date Date

**actions**
assignSnapshotToDate (user: User, snapshot: Snapshot, date: Date): (scheduledRecipe: ScheduledRecipe)
  **requires** snapshot exists
  **effects** adds a new ScheduledRecipe to the state associating the user, snapshot, and date; returns the new ID

deleteScheduledRecipe (scheduledRecipe: ScheduledRecipe)
  **requires** scheduledRecipe exists
  **effects** removes the identified ScheduledRecipe from the state

deleteAllScheduledRecipesWithSnapshot (snapshot: Snapshot)
  **requires** true
  **effects** removes all ScheduledRecipes associated with the given snapshot

**queries**
_getScheduledRecipes (user: User): (scheduledRecipe: {scheduledRecipe: ScheduledRecipe, snapshot: Snapshot, date: Date})
  **requires** true
  **effects** returns all scheduled recipes for the given user

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