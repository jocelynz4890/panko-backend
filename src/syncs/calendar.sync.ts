import { actions, Sync, Frames } from "@engine";
import { Calendar, Requesting, Authentication } from "@concepts";

// Assign recipe to date - requires authentication
export const AssignRecipeToDateRequest: Sync = ({ request, token, user, recipe, date }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/assignRecipeToDate", token, recipe, date }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Calendar.assignRecipeToDate, { user, recipe, date }]),
});

export const AssignRecipeToDateResponse: Sync = ({ request, scheduledRecipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/assignRecipeToDate" }, { request }],
    [Calendar.assignRecipeToDate, {}, { scheduledRecipe }],
  ),
  then: actions([Requesting.respond, { request, scheduledRecipe }]),
});

export const AssignRecipeToDateErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/assignRecipeToDate" }, { request }],
    [Calendar.assignRecipeToDate, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete scheduled recipe - requires authentication
export const DeleteScheduledRecipeRequest: Sync = ({ request, token, user, scheduledRecipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteScheduledRecipe", token, scheduledRecipe }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Calendar.deleteScheduledRecipe, { scheduledRecipe }]),
});

export const DeleteScheduledRecipeResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteScheduledRecipe" }, { request }],
    [Calendar.deleteScheduledRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete all scheduled recipes with recipe - requires authentication
export const DeleteAllScheduledRecipesWithRecipeRequest: Sync = ({ request, token, user, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteAllScheduledRecipesWithRecipe", token, recipe }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Calendar.deleteAllScheduledRecipesWithRecipe, { recipe }]),
});

export const DeleteAllScheduledRecipesWithRecipeResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteAllScheduledRecipesWithRecipe" }, { request }],
    [Calendar.deleteAllScheduledRecipesWithRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get scheduled recipes - requires authentication (handled via query in where clause)
export const GetScheduledRecipesRequest: Sync = ({ request, token, user, scheduledRecipes }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/_getScheduledRecipes", token }, { request }],
  ),
  where: async (frames) => {
    // Preserve original frames (with actionIds) before any queries
    const originalFrames = frames.length > 0 ? frames : [];
    
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      frames = frames.filter(($) => $[user] !== undefined);
      if (frames.length > 0) {
        frames = await frames.query(Calendar._getScheduledRecipes, { user }, { scheduledRecipes });
        // Ensure scheduledRecipes is always bound, even if query returns empty
        if (frames.length === 0 || !frames.some(($) => $[scheduledRecipes] !== undefined)) {
          // Create a frame with empty scheduledRecipes array, preserving all bindings from first authenticated frame
          const firstFrame = frames[0] || originalFrames[0] || {};
          return new Frames({ ...firstFrame, [scheduledRecipes]: [] });
        }
        return frames;
      }
      // If no authenticated user, preserve original frame and add empty scheduledRecipes
      const baseFrame = originalFrames[0] || {};
      return new Frames({ ...baseFrame, [scheduledRecipes]: [] });
    }
    // If no token, preserve original frame and add empty scheduledRecipes
    const baseFrame = originalFrames[0] || {};
    return new Frames({ ...baseFrame, [scheduledRecipes]: [] });
  },
  then: actions([Requesting.respond, { request, scheduledRecipes }]),
});
