# User Testing Report
## Participant 1
Participant #1, who lives in a cook-for-yourself dorm and regularly cooks and bakes for themselves, was able to pick up the core structure of the app fairly quickly. Even when they hesitated, they tended to resolve their confusion on their own after brief exploration. Overall, navigating between recipe books, dishes, and individual recipes felt intuitive to them, and they completed most tasks efficiently once they understood how the system was structured.

One interesting moment came from their initial confusion about the distinction between “Dishes” and “Recipes.” Because they’re used to traditional recipe books where each recipe book contains a bunch of individual recipes, the idea of a dish having multiple recipe variations was unfamiliar. However, their confusion quickly cleared up once they interacted more with the interface.

A similar issue arose during recipe editing. The user wasn’t immediately sure whether they were editing the dish name or the recipe name. They eventually noticed that the larger top field corresponded to the dish and the smaller lower field to the specific recipe variation.

The user had no issues navigating through the recipe books and recipes of dishes using the alphabetized table of contents and the tabs of a dish.

On the calendar interface, the user had no issues reading the calendar and moving and deleting planned recipes. However, when the user was still inside of a recipe book and we asked them to schedule a recipe for a certain date, they expected a “schedule recipe” button directly on the recipe page. When they couldn't find a schedule button, they navigated to the calendar page and used drag-and-drop to schedule. They briefly struggled to locate the recipe within the calendar sidebar of recipes but ultimately found the recipe.

The user really liked the overall aesthetic of the app and said the website felt intuitive to use. They noted that some additional features would make the website nicer to use like a rich markdown feature for the instructions field.

### Opportunities for Improvements

-  Differentiate the "Dish Name" and "Recipe Name" fields more strongly through visually or with clearer , more intuitive names (eg. Dish vs Recipe Attempt Name)

- Add a "Schedule This Recipe" button to the recipe page. This action could open a calendar popup to let the user select a date to schedule the recipe.

- Implement a search or filter function in the calendar's recipe panel

## Participant 2

This participant was able to move through most of the task list smoothly: they could sign in, navigate around the app, and generally understood the idea of managing dishes and recipes. They described the app as useful and liked the overall UI, suggesting that the main screens provide a reasonably clear mental model of “my dishes” and their associated information.

The main breakdowns appeared during creating and editing dishes/recipes. When creating a new dish, the screen loaded slowly, which left the participant waiting without clear feedback. This lag increased uncertainty about whether their action had registered. During image upload, the app automatically opened a new tab and silently saved the recipe, which violated the participant’s expectations that they remained in a single, continuous flow. This surprise suggests a mismatch between the user’s mental model of “I’m still editing” and the system’s navigation model.

Several smaller confusions were about labeling. The placeholder text “New Dish” required manual deletion, whereas “Recipe name” allowed immediate typing; this inconsistency made the interface feel slightly clunky accoridng to the participant. The participant was also confused by the distinction between “dish name” and “recipe name,” and did not recognize that the tab with the star icon led to rankings. In both cases, the app relied too heavily on icons or internal terminology without enough explanatory text.

The participant had no issues with using the calendar page and scheulding/moving around recipes, but noted that a better way to display the list of recipes on the calendar page would make it easier to use.

After becoming more familiar with the structure of the app, the user was able to comfortable navigate through the website and complete all tasks without any issues.

---

### Opportunities for Improvement

1. **Slow loading when creating a dish**

   * **What:** The “create dish” screen was noticeably slow to load.
   * **Why:** Likely due to heavy initial data fetching or client-side rendering
   * **Fix:** Optimize the underlying query/initialization

2. **Image upload unexpectedly opens a new tab and auto-saves**

   * **What:** Uploading a picture opened a new tab and automatically saved the recipe there, disrupting the editing flow.
   * **Why:** The upload flow is implemented as a navigation to a different route or external page that triggers a save side effect.
   * **Fix:** Handle uploads inline in the same view (modal or in-place file picker), and only save when the user explicitly clicks “Save”.

3. **Off-by-one error in saved dates**

   * **What:** The date attached to the recipe was one day off from what the user expected.
   * **Why:** Probably a timezone or date-handling bug (e.g., storing in UTC but rendering incorrectly locally).
   * **Fix:** Audit date storage and rendering, standardize on one timezone strategy, and verify that the date shown always matches the date the user selected.

4. **Annoying “New Dish” placeholder behavior**

   * **What:** The “New Dish” placeholder had to be manually deleted before typing, unlike the “Recipe name” field.
   * **Why:** The dish name is pre-filled as real text instead of using placeholder text, leading to inconsistent behavior across fields.
   * **Fix:** Use true placeholder text for both fields and auto-select/focus the dish name field so typing replaces the placeholder immediately.

5. **Unclear navigation and terminology (star tab, dish vs. recipe)**

   * **What:** The participant did not realize the star icon leads to rankings and was confused by “dish name” vs. “recipe name.”
   * **Why:** The design relies on iconography and internal terminology without explicit labels or brief explanations.
   * **Fix:** Add short text labels or tooltips (e.g., “Rankings”) next to the star icon, and clarify the model with helper text (e.g., “Dish = overall meal, Recipe = specific version/attempt”) or a brief onboarding hint.
