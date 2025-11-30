import { actions, Sync, Frames } from "@engine";
import { Recipe, Requesting, Authentication } from "@concepts";

// Create recipe - requires authentication
export const CreateRecipeRequest: Sync = ({ request, token, user, ingredientsList, subname, pictures, date, instructions, note, ranking, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/createRecipe", token, ingredientsList, subname, pictures, date, instructions, note, ranking, dish }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Recipe.createRecipe, { user, ingredientsList, subname, pictures, date, instructions, note, ranking, dish }]),
});

export const CreateRecipeResponse: Sync = ({ request, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/createRecipe" }, { request }],
    [Recipe.createRecipe, {}, { recipe }],
  ),
  then: actions([Requesting.respond, { request, recipe }]),
});

export const CreateRecipeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/createRecipe" }, { request }],
    [Recipe.createRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Edit recipe - requires authentication
export const EditRecipeRequest: Sync = ({ request, token, user, recipe, ingredientsList, subname, pictures, date, instructions, note, ranking }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/editRecipe", token, recipe, ingredientsList, subname, pictures, date, instructions, note, ranking }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Recipe.editRecipe, { recipe, ingredientsList, subname, pictures, date, instructions, note, ranking }]),
});

export const EditRecipeResponse: Sync = ({ request, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/editRecipe" }, { request }],
    [Recipe.editRecipe, {}, { recipe }],
  ),
  then: actions([Requesting.respond, { request, recipe }]),
});

export const EditRecipeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/editRecipe" }, { request }],
    [Recipe.editRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete recipe - requires authentication
export const DeleteRecipeRequest: Sync = ({ request, token, user, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/deleteRecipe", token, recipe }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Recipe.deleteRecipe, { recipe }]),
});

export const DeleteRecipeResponse: Sync = ({ request, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/deleteRecipe" }, { request }],
    [Recipe.deleteRecipe, {}, { recipe }],
  ),
  then: actions([Requesting.respond, { request, recipe }]),
});

export const DeleteRecipeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/deleteRecipe" }, { request }],
    [Recipe.deleteRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete all recipes for dish - requires authentication
export const DeleteAllRecipesForDishRequest: Sync = ({ request, token, user, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/deleteAllRecipesForDish", token, dish }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Recipe.deleteAllRecipesForDish, { dish }]),
});

export const DeleteAllRecipesForDishResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/deleteAllRecipesForDish" }, { request }],
    [Recipe.deleteAllRecipesForDish, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

// Add recipe picture - requires authentication
export const AddRecipePictureRequest: Sync = ({ request, token, user, recipe, pictureUrl }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/addRecipePicture", token, recipe, pictureUrl }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Recipe.addRecipePicture, { recipe, pictureUrl }]),
});

export const AddRecipePictureResponse: Sync = ({ request, recipe }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/addRecipePicture" }, { request }],
    [Recipe.addRecipePicture, {}, { recipe }],
  ),
  then: actions([Requesting.respond, { request, recipe }]),
});

export const AddRecipePictureErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/addRecipePicture" }, { request }],
    [Recipe.addRecipePicture, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get recipes - public query (handled via passthrough or direct query in where clause)
export const GetRecipesRequest: Sync = ({ request, dish, recipes }) => ({
  when: actions(
    [Requesting.request, { path: "/Recipe/_getRecipes", dish }, { request }],
  ),
  where: async (frames) => {
    // Preserve original frames (with actionIds) before any queries
    const originalFrames = frames.length > 0 ? frames : [];
    
    frames = await frames.query(Recipe._getRecipes, { dish }, { recipes });
    // Ensure recipes is always bound, even if empty
    if (frames.length === 0 || !frames.some(($) => $[recipes] !== undefined)) {
      // Create a frame with empty recipes array, preserving all bindings from original frame
      const baseFrame = frames[0] || originalFrames[0] || {};
      return new Frames({ ...baseFrame, [recipes]: [] });
    }
    return frames;
  },
  then: actions([Requesting.respond, { request, recipes }]),
});
