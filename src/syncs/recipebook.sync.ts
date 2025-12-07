import { actions, Sync, Frames } from "@engine";
import { RecipeBook, Requesting, Authentication } from "@concepts";

// Create recipe book - requires authentication
export const CreateRecipeBookRequest: Sync = ({ request, token, name, coverIndex }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/createRecipeBook", token, name, coverIndex }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const CreateRecipeBookWithAuth: Sync = ({ request, user, name, coverIndex }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/createRecipeBook", name, coverIndex }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([RecipeBook.createRecipeBook, { user, name, coverIndex }]),
});

export const CreateRecipeBookResponse: Sync = ({ request, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/createRecipeBook" }, { request }],
    [RecipeBook.createRecipeBook, {}, { book }],
  ),
  then: actions([Requesting.respond, { request, book }]),
});

export const CreateRecipeBookErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/createRecipeBook" }, { request }],
    [RecipeBook.createRecipeBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Edit recipe book name - requires authentication
export const EditRecipeBookNameRequest: Sync = ({ request, token, book, newName }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/editRecipeBookName", token, book, newName }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const EditRecipeBookNameWithAuth: Sync = ({ request, user, book, newName }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/editRecipeBookName", book, newName }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([RecipeBook.editRecipeBookName, { book, newName }]),
});

export const EditRecipeBookNameSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/editRecipeBookName" }, { request }],
    [RecipeBook.editRecipeBookName, {}, {}],
  ),
  then: actions([Requesting.respond, { request, success: true }]),
});

export const EditRecipeBookNameErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/editRecipeBookName" }, { request }],
    [RecipeBook.editRecipeBookName, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Add dish to book - requires authentication
export const AddDishToBookRequest: Sync = ({ request, token, dish, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/addDishToBook", token, dish, book }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const AddDishToBookWithAuth: Sync = ({ request, user, dish, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/addDishToBook", dish, book }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
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
export const RemoveDishFromBookRequest: Sync = ({ request, token, dish, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/removeDishFromBook", token, dish, book }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const RemoveDishFromBookWithAuth: Sync = ({ request, user, dish, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/removeDishFromBook", dish, book }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
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
export const DeleteRecipeBookRequest: Sync = ({ request, token, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/deleteRecipeBook", token, book }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const DeleteRecipeBookWithAuth: Sync = ({ request, user, book }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/deleteRecipeBook", book }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([RecipeBook.deleteRecipeBook, { book }]),
});

export const DeleteRecipeBookSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/deleteRecipeBook" }, { request }],
    [RecipeBook.deleteRecipeBook, {}, {}],
  ),
  then: actions([Requesting.respond, { request, success: true }]),
});

export const DeleteRecipeBookErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/deleteRecipeBook" }, { request }],
    [RecipeBook.deleteRecipeBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Get books - requires authentication
export const GetBooksRequest: Sync = ({ request, token }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/_getBooks", token }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const GetBooksWithAuth: Sync = ({ request, user, books }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/_getBooks" }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  where: async (frames) => {
    // Query returns an array of documents, but we need to bind the entire array to books
    // Wrap the query to return objects with a books property
    const wrappedQuery = async (input: { user: string }) => {
      const result = await RecipeBook._getBooks(input);
      // Return array with single object containing the entire books array
      return [{ books: result }];
    };
    
    frames = await frames.query(wrappedQuery, { user }, { books });
    // Ensure books is always bound, even if query returns empty
    if (frames.length === 0 || !frames.some(($) => $[books] !== undefined)) {
      // Create a frame with empty books array, preserving all bindings from first frame
      const firstFrame = frames[0] || {};
      return new Frames({ ...firstFrame, [books]: [] });
    }
    // Return the first frame (should have the books array bound)
    return new Frames(frames[0]);
  },
  then: actions([Requesting.respond, { request, books }]),
});

// Get book - public query (handled via query in where clause)
export const GetBookRequest: Sync = ({ request, book, books }) => ({
  when: actions(
    [Requesting.request, { path: "/RecipeBook/_getBook", book }, { request }],
  ),
  where: async (frames) => {
    // Query returns an array of documents, but we need to bind the entire array to books
    // Wrap the query to return objects with a books property
    const wrappedQuery = async (input: { book: string }) => {
      const result = await RecipeBook._getBook(input);
      // Return array with single object containing the entire books array
      return [{ books: result }];
    };
    
    frames = await frames.query(wrappedQuery, { book }, { books });
    // Ensure books is always bound, even if empty
    if (frames.length === 0 || !frames.some(($) => $[books] !== undefined)) {
      // Create a frame with empty books array, preserving all bindings from first frame
      const firstFrame = frames[0] || {};
      return new Frames({ ...firstFrame, [books]: [] });
    }
    // Return the first frame (should have the books array bound)
    return new Frames(frames[0]);
  },
  then: actions([Requesting.respond, { request, books }]),
});
