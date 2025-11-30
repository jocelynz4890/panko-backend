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

export const CreateDishResponse: Sync = ({ request, dish, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/createDish" }, { request }],
    [Dishes.createDish, {}, { dish, error }],
  ),
  then: actions([Requesting.respond, { request, dish, error }]),
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

export const EditDishNameResponse: Sync = ({ request, dish, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/editDishName" }, { request }],
    [Dishes.editDishName, {}, { dish, error }],
  ),
  then: actions([Requesting.respond, { request, dish, error }]),
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

export const DeleteDishResponse: Sync = ({ request, dish, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/deleteDish" }, { request }],
    [Dishes.deleteDish, {}, { dish, error }],
  ),
  then: actions([Requesting.respond, { request, dish, error }]),
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

export const SetDefaultRecipeResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/setDefaultRecipe" }, { request }],
    [Dishes.setDefaultRecipe, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get dish - public query (handled via query in where clause)
export const GetDishRequest: Sync = ({ request, dish }) => ({
  when: actions(
    [Requesting.request, { path: "/Dishes/_getDish", dish }, { request }],
  ),
  where: async (frames) => {
    frames = await frames.query(Dishes._getDish, { dish }, { dishes });
    return frames;
  },
  then: actions([Requesting.respond, { request, dishes }]),
});
