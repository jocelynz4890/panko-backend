import { actions, Sync, Frames } from "@engine";
import { Calendar, Requesting, Authentication } from "@concepts";

// Assign recipe to date - requires authentication
export const AssignRecipeToDateRequest: Sync = ({ request, token, recipe, date }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/assignRecipeToDate", token, recipe, date }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const AssignRecipeToDateWithAuth: Sync = ({ request, user, recipe, date, scheduledRecipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/assignRecipeToDate" }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([Calendar.assignRecipeToDate, { user, recipe, date, scheduledRecipe }]),
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
export const DeleteScheduledRecipeRequest: Sync = ({ request, token, scheduledRecipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteScheduledRecipe", token, scheduledRecipe }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const DeleteScheduledRecipeWithAuth: Sync = ({ request, user, scheduledRecipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteScheduledRecipe" }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([Calendar.deleteScheduledRecipe, { scheduledRecipe }]),
});

export const DeleteScheduledRecipeResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteScheduledRecipe" }, { request }],
    [Calendar.deleteScheduledRecipe, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteScheduledRecipeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteScheduledRecipe" }, { request }],
    [Calendar.deleteScheduledRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete all scheduled recipes with recipe - requires authentication
export const DeleteAllScheduledRecipesWithRecipeRequest: Sync = ({ request, token, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteAllScheduledRecipesWithRecipe", token, recipe }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const DeleteAllScheduledRecipesWithRecipeWithAuth: Sync = ({ request, user, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteAllScheduledRecipesWithRecipe" }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([Calendar.deleteAllScheduledRecipesWithRecipe, { recipe }]),
});

export const DeleteAllScheduledRecipesWithRecipeResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteAllScheduledRecipesWithRecipe" }, { request }],
    [Calendar.deleteAllScheduledRecipesWithRecipe, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteAllScheduledRecipesWithRecipeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/deleteAllScheduledRecipesWithRecipe" }, { request }],
    [Calendar.deleteAllScheduledRecipesWithRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get scheduled recipes - requires authentication
export const GetScheduledRecipesRequest: Sync = ({ request, token }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/_getScheduledRecipes", token }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const GetScheduledRecipesWithAuth: Sync = ({ request, user, scheduledRecipes }) => ({
  when: actions(
    [Requesting.request, { path: "/Calendar/_getScheduledRecipes" }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  where: async (frames) => {
    // Query returns an array of documents, but we need to bind the entire array to scheduledRecipes
    // Wrap the query to return objects with a scheduledRecipes property
    const wrappedQuery = async (input: { user: string }) => {
      const result = await Calendar._getScheduledRecipes(input);
      // Return array with single object containing the entire scheduledRecipes array
      return [{ scheduledRecipes: result }];
    };
    
    frames = await frames.query(wrappedQuery, { user }, { scheduledRecipes });
    // Ensure scheduledRecipes is always bound, even if query returns empty
    if (frames.length === 0 || !frames.some(($) => $[scheduledRecipes] !== undefined)) {
      // Create a frame with empty scheduledRecipes array, preserving all bindings from first frame
      const firstFrame = frames[0] || {};
      return new Frames({ ...firstFrame, [scheduledRecipes]: [] });
    }
    // Return the first frame (should have the scheduledRecipes array bound)
    return new Frames(frames[0]);
  },
  then: actions([Requesting.respond, { request, scheduledRecipes }]),
});
