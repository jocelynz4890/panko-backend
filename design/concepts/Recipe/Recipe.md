### Recipe Concept

- purpose: record individual attempts at preparing a dish, including context and outcome, so that the cook can compare attempts, learn from variations, and see how their results change over time.
- principle: each time a user prepares a dish, they create a new recipe entry that captures when it was made, any photos of the result, notes about what they did (or changed) compared to their usual approach, and how satisfied they were with the outcome. Over many cooking sessions, these recipes accumulate into a chronological history of attempts for that dish. When the user is deciding how to make the dish again, they review the previous recipes to see which variations turned out best and what they want to repeat or avoid, then create a new recipe entry for the latest attempt to extend the history.
- state:
  - A set of `recipes` with
    - a `user` of type `User`
    - an `ingredientsList` of type `String`
    - an `instructions` of type `String`
    - a `note` of type `String`
    - a `ranking` of type `Number`
    - a `subname` of type `String`
    - a set of `pictures` of type `FilePath`
    - a `date` of type `Date`
    - a `dish` of type `Dish`
- actions:
  - createRecipe (ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking, dish: Dish): (recipe: Recipe)
    - requires: ranking is between 1 and 5
    - effects: creates a new recipe entry with the given arguments
  - editRecipe (recipe: Recipe, ingredientsList: String, subname: String, pictures: Path, date: Date, instructions: String, note: String, ranking: Ranking):(recipe: Recipe)
    - requires: recipe exists
    - effect: updates the recipe with the given edits
  - deleteRecipe(recipe: Recipe):(recipe: Recipe)
    - requires: recipe exists
    - effect: deletes the given recipe entry
  - deleteAllRecipesForDish(dish: Dish)
    - requires: True
    - effect: deletes all recipes associated with the given dish
  - addRecipePicture(recipe: Recipe, pictureUrl: Path):(recipe: Recipe)
    - requires: recipe exists
    - effect: appends a new picture URL to the recipe's `pictures` list

### Recipe image upload workflow

- Endpoint: `POST ${REQUESTING_BASE_URL}/uploads/recipe-image` (defaults to `/api/uploads/recipe-image`).
- Request: `multipart/form-data` with fields:
  - `recipe` (string, required): recipe identifier.
  - `user` (string, optional): used for tagging Cloudinary uploads.
  - `file` (file, required): image in JPG, PNG, WEBP, or GIF. Max size defaults to 5 MB and can be overridden via `MAX_RECIPE_IMAGE_BYTES`.
- Behavior:
  1. Backend validates the form payload.
  2. The raw image is streamed to Cloudinary using the credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) and optional folder override (`CLOUDINARY_RECIPE_FOLDER`).
  3. On success, `Recipe.addRecipePicture` is called with the Cloudinary `secure_url`, ensuring the recipe state is updated atomically.
  4. Response payload contains `{ recipe, image, limits }`, where `image.secureUrl` is what the frontend should display and persist locally.

Example curl:

```
curl -X POST http://localhost:10000/api/uploads/recipe-image \
  -H "Authorization: Bearer <token>" \
  -F "recipe=<recipe-id>" \
  -F "user=<user-id>" \
  -F "file=@/path/to/pancake.jpg"
```
