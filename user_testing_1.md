### Study Report – Participant 1

This participant was able to move through most of the task list smoothly: they could sign in, navigate around the app, and generally understood the idea of managing dishes and recipes. They described the app as useful and liked the overall UI, suggesting that the main screens provide a reasonably clear mental model of “my dishes” and their associated information (good support for the gulf of evaluation on the primary flows).

The main breakdowns appeared during creation and editing flows. When creating a new dish, the screen loaded slowly, which left the participant waiting without clear feedback. This lag increased uncertainty about whether their action had registered, reflecting a gulf of evaluation issue: the system was doing work, but its status was not visible. During image upload, the app automatically opened a new tab and silently saved the recipe, which violated the participant’s expectations that they remained in a single, continuous flow. This surprise suggests a mismatch between the user’s mental model of “I’m still editing” and the system’s navigation model.

Several smaller confusions were about labeling and affordances. The placeholder text “New Dish” required manual deletion, whereas “Recipe name” allowed immediate typing; this inconsistency added friction and made the interface feel slightly clunky. The participant was also confused by the distinction between “dish name” and “recipe name,” and did not recognize that the tab with the star icon led to rankings. In both cases, the app relied too heavily on icons or internal terminology without enough explanatory text, making it harder for the user to bridge the gulf of execution when trying to find rankings or understand how information is structured.

---

### Flaws / Opportunities for Improvement

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
