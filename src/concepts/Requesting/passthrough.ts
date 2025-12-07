/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // All endpoints go through synchronizations for consistent handling
  // No direct passthrough routes are needed
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // Authentication endpoints - go through syncs for proper handling
  "/api/Authentication/register",
  "/api/Authentication/authenticate",
  "/api/Authentication/createSession",
  "/api/Authentication/validateSession",
  "/api/Authentication/invalidateSession",
  "/api/Authentication/_getUserByUsername",
  "/api/Authentication/_getUsernameById",
  "/api/Authentication/_getAllUsers",
  "/api/Authentication/_getUserBySession",

  // Dishes endpoints - go through syncs with authentication
  "/api/Dishes/createDish",
  "/api/Dishes/editDishName",
  "/api/Dishes/deleteDish",
  "/api/Dishes/addRecipe",
  "/api/Dishes/removeRecipe",
  "/api/Dishes/setDefaultRecipe",
  "/api/Dishes/_getDish",

  // Recipe endpoints (cooking attempts) - go through syncs with authentication
  "/api/Recipe/createRecipe",
  "/api/Recipe/editRecipe",
  "/api/Recipe/addRecipePicture",
  "/api/Recipe/deleteRecipe",
  "/api/Recipe/deleteAllRecipesForDish",
  "/api/Recipe/_getRecipes",
  "/api/Recipe/_getRecipe",

  // RecipeBook endpoints - go through syncs with authentication
  "/api/RecipeBook/createRecipeBook",
  "/api/RecipeBook/editRecipeBookName",
  "/api/RecipeBook/addDishToBook",
  "/api/RecipeBook/removeDishFromBook",
  "/api/RecipeBook/deleteRecipeBook",
  "/api/RecipeBook/_getBooks",
  "/api/RecipeBook/_getBook",

  // Calendar endpoints - go through syncs with authentication
  "/api/Calendar/assignRecipeToDate",
  "/api/Calendar/deleteScheduledRecipe",
  "/api/Calendar/deleteAllScheduledRecipesWithRecipe",
  "/api/Calendar/_getScheduledRecipes",
];
