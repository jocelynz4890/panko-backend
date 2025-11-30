import { actions, Sync, Frames } from "@engine";
import { Dishes, Requesting, Authentication } from "@concepts";

// Create dish - requires authentication
export const CreateDishRequest: Sync = ({ request, token, user, name, description }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/createDish", token, name, description }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Dishes.createDish, { user, name, description }]),
});

export const CreateDishResponse: Sync = ({ request, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/createDish" }, { request }],
    [Dishes.createDish, {}, { dish }],
  ),
  then: actions([Requesting.respond, { request, dish }]),
});

export const CreateDishErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/createDish" }, { request }],
    [Dishes.createDish, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Edit dish name - requires authentication
export const EditDishNameRequest: Sync = ({ request, token, user, dish, newName, description }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/editDishName", token, dish, newName, description }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Dishes.editDishName, { dish, newName, description }]),
});

export const EditDishNameResponse: Sync = ({ request, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/editDishName" }, { request }],
    [Dishes.editDishName, {}, { dish }],
  ),
  then: actions([Requesting.respond, { request, dish }]),
});

export const EditDishNameErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/editDishName" }, { request }],
    [Dishes.editDishName, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete dish - requires authentication
export const DeleteDishRequest: Sync = ({ request, token, user, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/deleteDish", token, dish }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Dishes.deleteDish, { dish }]),
});

export const DeleteDishResponse: Sync = ({ request, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/deleteDish" }, { request }],
    [Dishes.deleteDish, {}, { dish }],
  ),
  then: actions([Requesting.respond, { request, dish }]),
});

export const DeleteDishErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/deleteDish" }, { request }],
    [Dishes.deleteDish, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Add recipe to dish - requires authentication
export const AddRecipeToDishRequest: Sync = ({ request, token, user, recipe, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/addRecipe", token, recipe, dish }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Dishes.addRecipe, { recipe, dish }]),
});

export const AddRecipeToDishResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/addRecipe" }, { request }],
    [Dishes.addRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Remove recipe from dish - requires authentication
export const RemoveRecipeFromDishRequest: Sync = ({ request, token, user, recipe, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/removeRecipe", token, recipe, dish }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Dishes.removeRecipe, { recipe, dish }]),
});

export const RemoveRecipeFromDishResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/removeRecipe" }, { request }],
    [Dishes.removeRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Set default recipe - requires authentication
export const SetDefaultRecipeRequest: Sync = ({ request, token, user, recipe, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/setDefaultRecipe", token, recipe, dish }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([Dishes.setDefaultRecipe, { recipe, dish }]),
});

export const SetDefaultRecipeResponse: Sync = ({ request, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/setDefaultRecipe" }, { request }],
    [Dishes.setDefaultRecipe, {}, { dish }],
  ),
  then: actions([Requesting.respond, { request, dish }]),
});

export const SetDefaultRecipeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/setDefaultRecipe" }, { request }],
    [Dishes.setDefaultRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get dish - public query (handled via query in where clause)
export const GetDishRequest: Sync = ({ request, dish, dishes }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/_getDish", dish }, { request }],
  ),
  where: async (frames) => {
    // Query returns an array of documents, but we need to bind the entire array to dishes
    // Wrap the query to return objects with a dishes property
    const wrappedQuery = async (input: { dish: string }) => {
      const result = await Dishes._getDish(input);
      // Return array with single object containing the entire dishes array
      return [{ dishes: result }];
    };
    
    frames = await frames.query(wrappedQuery, { dish }, { dishes });
    // Ensure dishes is always bound, even if empty
    if (frames.length === 0 || !frames.some(($) => $[dishes] !== undefined)) {
      // Create a frame with empty dishes array, preserving all bindings from first frame
      const firstFrame = frames[0] || {};
      return new Frames({ ...firstFrame, [dishes]: [] });
    }
    // Return the first frame (should have the dishes array bound)
    return new Frames(frames[0]);
  },
  then: actions([Requesting.respond, { request, dishes }]),
});
