# **Problem Framing**

### **Domain:**
Meal and recipe tracking — helping users document, organize, and improve their cooking experiences over time. The focus is on managing personal recipes, tracking when and how dishes are made, and planning future meals in a structured, enjoyable way.

### **Problem:**
Many home cooks lack an organized system to record and revisit their cooking experiences.

- There’s no convenient way to track all recipes made, when they were made, and how they compare in quality.
- Users can’t easily document variations or improvements across different attempts of the same recipe.
- Meal planning is difficult without a system to connect recipes with ingredient lists and calendars.
- There’s no integrated way to plan upcoming meals while keeping track of ingredients and dietary goals, making the task of choosing recipes a source of unnecessary decision fatigue.

As a result, users lose valuable information about their cooking progress, forget what worked or didn’t, and struggle to coordinate what to cook next.

### **Evidence:**

- [https://realfoodwholelife.com/feelgoodeffect/end-food-decision-fatigue/](https://realfoodwholelife.com/feelgoodeffect/end-food-decision-fatigue/)
  - This is an article about food decision fatigue. The article states that people make, on average, 227 decisions about food a day. According to the author, this can lead to mental exhaustion. A recommended way to lower this decision fatigue is to make decisions in advance, such as through a meal plan/calendar. Overall, this is good evidence that the problem of not knowing what to eat is prominent.
- [https://www.usda.gov/about-usda/news/blog/healthy-eating-budget?](https://www.usda.gov/about-usda/news/blog/healthy-eating-budget?utm_source=chatgpt.com)
  - This article from the USDA states that planning meals can help save money. It recommends finding recipes, planning what meals you are going to make, and using that to make a grocery list. This evidence shows how helpful the recipes to meal plan to grocery list strategy can be.
- [https://food52.com/story/9656-how-to-organize-your-multimedia-recipes](https://food52.com/story/9656-how-to-organize-your-multimedia-recipes)
  - This article is about the problems that come with keeping track of recipes. It describes the issues that come with recipes being spread out across mediums, and how it would be nice to be able to have them all in one place. It then gives solutions, such as printing everything out and making a binder, as well as some digital examples.
- [https://pantrypilot.com/blog/how-to-save-recipes-from-instagram](https://pantrypilot.com/blog/how-to-save-recipes-from-instagram)
  - This article explains that it is common for people to find a recipe that they like on Instagram, only to forget about it or have it get lost in their camera roll or saved posts. And even if they do remember to save it, there's no ability to tag the recipe to find it later, no way to extract a list of ingredients you need, etc.
- [https://food52.com/story/28178-erin-mcdowell-netflix-nailed-it](https://food52.com/story/28178-erin-mcdowell-netflix-nailed-it)
  - This is an interview transcript with a chef that was featured on a Netflix show. One tip she gives is to keep track of your iterations of a recipe so that you can make improvements. She says this is a good way to learn and perfect recipes because if something goes wrong you know exactly what recipe you used and can adjust. She mentions this is difficult to do for many at home cooks, and they don’t learn from their mistakes or improve their recipes as a result.

### **Comparables:**

- Beli ([https://beliapp.com/](https://beliapp.com/)) is a social restaurant discovery app that personalizes dining recommendations based on your taste. It learns what kinds of restaurants you enjoy from the places you rate, then curates a ranked list of spots you’ll probably also like. You can also follow friends, see their favorites, and share restaurant experiences. Traditional review platforms (like Yelp or Google Maps) show average ratings that don’t reflect your personal preferences or taste. Beli solves this by using taste-based personalization instead of crowdsourced averages. Beli also allows you to view your personal restaurant rankings as lists categorized by restaurant type, serving as a way to look back on all of the places you’ve been to.
- Paprika Recipe Manager ([https://www.paprikaapp.com/](https://www.paprikaapp.com/)) is an app for organizing recipes, making meal plans, and creating grocery lists. It enables users to find recipes from the web or make their own, add them to a meal plan calendar, and make a grocery list for the recipe.
- Samsung food ([https://samsungfood.com/](https://samsungfood.com/)) is a nutrition app that allows you to save recipes to a digital recipe box consisting of recipes from the web. It also has a discovery feature that allows users to browse recipes that other users liked. Another feature is that it tracks nutrition info and calculates a health score for a user based on their meals.
- Plan To Eat ([https://www.plantoeat.com/](https://www.plantoeat.com/)) is an app where users can save recipes and add them to their calendar. The app then creates a grocery list from the user’s meal plan. This app reports a few notable statistics, including a 47.5% reduction in time spent planning and grocery shopping, a 23% reduction in food costs, and a 73% increase in consumption of "healthier foods."
- AnyList ([https://www.anylist.com/](https://www.anylist.com/)) is a shared grocery list and recipe app. A user can make a grocery list, share it with someone, and any changes to the list get automatically updated on both ends (similar to a shared google doc). It also has a recipe organizer that keeps track of your recipes and allows you to add them from outside sources. A user then can add the recipe to their grocery list, updating the list.
- Pepper ([https://www.peppertheapp.com/](https://www.peppertheapp.com/)) is a social cookbook app that allows users to share recipes, as well as browse other recipes in their explore page. Users can build a “cookbook” of recipes that is visible to their friends on the app. The app also features recipes from some celebrity chefs. Another feature of this app is that you can make a “bucket list” of recipes to make and check them off as you make them.

## **Features:**

- The **home page** could feature different recipe books with a user-specified category, for example, they could represent different types of food/drinks, or courses of a meal such as appetizers and desserts.
- Each **recipe book** would contain
  - Table of contents, which lists each recipe along with useful metadata about that recipes (such as time to make or rating), for ease of reference
  - Recipe rankings, where each recipe can be ranked on a scale from 1-5 stars
  - The actual **recipes**, which are across 1-2 pages of the book UI that it is contained in, would include the following:
    - Picture of the dish \+ ingredient list \+ instructions \+ notes (these could explain the memories associated with the recipe, or extra details) \+ rating \+ number of times the recipe was made along with the associated dates \+ marking the recipe as ‘made’ or ‘want to make’
    - **Snapshots** of each time you made a recipe to track variations of the recipe or improvements on the recipe. This feature would include:
      - Pictures associated with the new iteration of the recipe
      - Notes of how the recipe changed from previous snapshots of the recipe
      - Rating associated with each snapshot of the recipe
      - Date that the new iteration of the recipe was made
- **Ingredient tracker** across recipes, that allows users to plan recipes to make with a specified number of servings by calculating the total amount of each ingredient needed based on the recipes that a user selects. This can then serve as a global list of ingredients to buy, which makes shopping and meal prep much more convenient for the user.
- **Recipe-to-make list** where a recipe can be scheduled to be made on a certain date, and can then be removed from the list once made. This could be incorporated into the **food diary/calendar** (see below).
- **Food diary/calendar** to show recipes that the user plans to make on a certain day. This could be expanded into a general food diary that includes food from restaurants as well (not just home-made), which would allow the app to also include nutrition tracking and diet analytics as a feature. In a calendar view, where an image of each recipe is shown under each day, this feature provides an easy way to see an overall collage of what the user has eaten during that month, making dining experiences more memorable and meaningful.
- **Export/import** functionality to easily share a PDF of a recipe or fill in the fields of a recipe to more easily complete its entry in a recipe book.
- If **friending** is included in the app, users could share recipes and have a **feed** that displays recipes that their friends have recently made. Users could interact with each other’s recipes, **upvoting** those that they find appealing, or **bookmarking** those that they want to make later.
- A **recommendations** page could show the user recipes similar to those that they create, or those that are trending.
- **Tagging** recipes in order to better support a **recommendation** functionality or a **search** functionality, where users can search from a database of publicly shared recipes. This could also support a **filtering** feature that allows the user to filter by recipes that take a certain amount of time to make, or have some specific qualities that would be defined in their tags.

## **Ethical Analysis**

### **Stakeholders**
**Insight 1 Direct Stakeholders**
**Observation:** Our primary direct stakeholders include home cooks and meal planners.
**Design Response** Users who plan meals often want to track the nutrition facts of their meals. As part of the food diary, we will include a feature where users will be able to log the nutrition of each of their meals and view their daily/weekly nutrition. Recipes can include nutrition facts as well.

### **Time**
**Insight 2 Accumulation of Recipes Over Time**
**Observation:** After years of use, users will accumulate a lot of recipes, leading to a large personal library to choose from when planning meals. However, with the number of accumulated recipes, users could feel overwhelmed by the amount of choices or struggle to find certain recipes.
**Design Response:** We will include a search and filtering system for users’ recipes. Users will be able to add tags to recipes and use these tags to filter and search for certain recipes.

**Insight 3 Adaptation (Lifestyle Changes)**
**Observation:** Users are able to save recipes and assign certain recipes for certain dates. The app’s meal tracking and planning features support a lifestyle change towards having more organized, home-cooked meals. In order to make these recipes, users have to go into each recipe and view the ingredients list. With users potentially planning three meals a day, this would be tedious
**Design Response:** We will introduce a shopping list feature that lets users add recipes to their shopping list. The ingredients across the recipes will aggregate into one list.

### **Values**
**Insight 4 Privacy vs Social Sharing Tension**
**Observation** Users may want to share some recipes and keep others private.
**Design Response** We will have a friendship system that lets users see others' activity and recipes. The app will also allow users to adjust the visibility settings of each recipe and meal (eg. public, private, visible to friends only)

**Insight 5: Environmental Sustainability**
**Observation:** The ingredient tracker and meal planner can support environmental sustainability by helping users track what ingredients they need to purchase for each of their meals, reducing food waste. However, this app could also encourage users to constantly cook new, trendy recipes leading to more food waste.
**Design Response:** We will have a meal planner and ingredient tracker/shopping list feature that allows users to assign recipes for a certain date and it automatically adds the ingredients the users need to buy to make those recipes. In order to encourage users to not waste ingredients, our search feature will allow users to search for recipes by ingredients.

### **Pervasiveness**
**Insight 6: Accounting for Culture**
**Observation:** A positive effect of the app's recipe sharing in one culture might be the celebration of regional cuisine. However, in another culture with strong traditions of oral recipe transmission or secret family dishes, this feature could be seen as a breakdown, devaluing culinary heritage and commodifying culturally significant knowledge.
**Design Response:** For recipes, users can label the type of cuisine for other users to more easily find. Additionally, Implement sharing controls. Allow users to mark recipes as private, shared with friends, or public.
