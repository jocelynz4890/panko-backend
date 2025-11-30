import { actions, Sync, Frames } from "@engine";
import { RecipeBook, Requesting, Authentication } from "@concepts";

// Create recipe book - requires authentication
export const CreateRecipeBookRequest: Sync = ({ request, token, user, name }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/createRecipeBook", token, name }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([RecipeBook.createRecipeBook, { user, name }]),
});

export const CreateRecipeBookResponse: Sync = ({ request, book, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/createRecipeBook" }, { request }],
    [RecipeBook.createRecipeBook, {}, { book, error }],
  ),
  then: actions([Requesting.respond, { request, book, error }]),
});

// Edit recipe book name - requires authentication
export const EditRecipeBookNameRequest: Sync = ({ request, token, user, book, newName }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/editRecipeBookName", token, book, newName }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([RecipeBook.editRecipeBookName, { book, newName }]),
});

export const EditRecipeBookNameResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/editRecipeBookName" }, { request }],
    [RecipeBook.editRecipeBookName, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Add dish to book - requires authentication
export const AddDishToBookRequest: Sync = ({ request, token, user, dish, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/addDishToBook", token, dish, book }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([RecipeBook.addDishToBook, { dish, book }]),
});

export const AddDishToBookResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/addDishToBook" }, { request }],
    [RecipeBook.addDishToBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Remove dish from book - requires authentication
export const RemoveDishFromBookRequest: Sync = ({ request, token, user, dish, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/removeDishFromBook", token, dish, book }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([RecipeBook.removeDishFromBook, { dish, book }]),
});

export const RemoveDishFromBookResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/removeDishFromBook" }, { request }],
    [RecipeBook.removeDishFromBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Delete recipe book - requires authentication
export const DeleteRecipeBookRequest: Sync = ({ request, token, user, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/deleteRecipeBook", token, book }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      return frames.filter(($) => $[user] !== undefined);
    }
    return new Frames();
  },
  then: actions([RecipeBook.deleteRecipeBook, { book }]),
});

export const DeleteRecipeBookResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/deleteRecipeBook" }, { request }],
    [RecipeBook.deleteRecipeBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get books - requires authentication (handled via query in where clause)
export const GetBooksRequest: Sync = ({ request, token, user }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/_getBooks", token }, { request }],
  ),
  where: async (frames) => {
    if (token) {
      frames = await frames.query(Authentication._getUserBySession, { token }, { user });
      frames = frames.filter(($) => $[user] !== undefined);
      if (frames.length > 0) {
        frames = await frames.query(RecipeBook._getBooks, { user }, { books });
      }
      return frames;
    }
    return new Frames();
  },
  then: actions([Requesting.respond, { request, books }]),
});

// Get book - public query (handled via query in where clause)
export const GetBookRequest: Sync = ({ request, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/_getBook", book }, { request }],
  ),
  where: async (frames) => {
    frames = await frames.query(RecipeBook._getBook, { book }, { books });
    return frames;
  },
  then: actions([Requesting.respond, { request, books }]),
});
