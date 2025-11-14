# **Problem Framing**

## **Domain:**
Meal and recipe tracking — helping users document, organize, and improve their cooking experiences over time. The focus is on managing personal recipes, tracking when and how dishes are made, and planning future meals in a structured, enjoyable way.

## **Problem:**
Home cooks lack a unified way to document their cooking experiences, reflect on how recipes evolve over time, and use that knowledge to plan future attempts/variations of the recipe. Without an integrated system that connects past attempts with future planning, they lose valuable insights, forget successful variations, and experience decision fatigue when choosing what to cook next.

## **Evidence:**

- [https://realfoodwholelife.com/feelgoodeffect/end-food-decision-fatigue/](https://realfoodwholelife.com/feelgoodeffect/end-food-decision-fatigue/)
  - This is an article about food decision fatigue. The article states that people make, on average, 227 decisions about food a day. According to the author, this can lead to mental exhaustion. A recommended way to lower this decision fatigue is to make decisions in advance, such as through a meal plan/calendar.
- [https://food52.com/story/9656-how-to-organize-your-multimedia-recipes](https://food52.com/story/9656-how-to-organize-your-multimedia-recipes)
  - This article is about the problems that come with keeping track of recipes. It describes the issues that come with recipes being spread out across mediums, and how it would be nice to be able to have them all in one place. It then gives solutions, such as printing everything out and making a binder, as well as some digital examples.
- [https://pantrypilot.com/blog/how-to-save-recipes-from-instagram](https://pantrypilot.com/blog/how-to-save-recipes-from-instagram)
  - This article explains that it is common for people to find a recipe that they like on Instagram, only to forget about it or have it get lost in their camera roll or saved posts. And even if they do remember to save it, there's no ability to tag the recipe to find it later, no way to extract a list of ingredients you need, etc.
- [https://food52.com/story/28178-erin-mcdowell-netflix-nailed-it](https://food52.com/story/28178-erin-mcdowell-netflix-nailed-it)
  - This is an interview transcript with a chef that was featured on a Netflix show. One tip she gives is to keep track of your iterations of a recipe so that you can make improvements. She says this is a good way to learn and perfect recipes because if something goes wrong you know exactly what recipe you used and can adjust. She mentions this is difficult to do for many at home cooks, and they don’t learn from their mistakes or improve their recipes as a result.

## **Comparables:**

- Beli ([https://beliapp.com/](https://beliapp.com/)) is a social restaurant discovery app that personalizes dining recommendations based on your taste. It learns what kinds of restaurants you enjoy from the places you rate, then curates a ranked list of spots you’ll probably also like. You can also follow friends, see their favorites, and share restaurant experiences. Traditional review platforms (like Yelp or Google Maps) show average ratings that don’t reflect your personal preferences or taste. Beli solves this by using taste-based personalization instead of crowdsourced averages. Beli also allows you to view your personal restaurant rankings as lists categorized by restaurant type, serving as a way to look back on all of the places you’ve been to.
- Paprika Recipe Manager ([https://www.paprikaapp.com/](https://www.paprikaapp.com/)) is an app for organizing recipes, making meal plans, and creating grocery lists. It enables users to find recipes from the web or make their own, add them to a meal plan calendar, and make a grocery list for the recipe.
- Samsung food ([https://samsungfood.com/](https://samsungfood.com/)) is a nutrition app that allows you to save recipes to a digital recipe box consisting of recipes from the web. It also has a discovery feature that allows users to browse recipes that other users liked. Another feature is that it tracks nutrition info and calculates a health score for a user based on their meals.
- Plan To Eat ([https://www.plantoeat.com/](https://www.plantoeat.com/)) is an app where users can save recipes and add them to their calendar. The app then creates a grocery list from the user’s meal plan. This app reports a few notable statistics, including a 47.5% reduction in time spent planning and grocery shopping, a 23% reduction in food costs, and a 73% increase in consumption of "healthier foods."
- AnyList ([https://www.anylist.com/](https://www.anylist.com/)) is a shared grocery list and recipe app. A user can make a grocery list, share it with someone, and any changes to the list get automatically updated on both ends (similar to a shared google doc). It also has a recipe organizer that keeps track of your recipes and allows you to add them from outside sources. A user then can add the recipe to their grocery list, updating the list.
- Pepper ([https://www.peppertheapp.com/](https://www.peppertheapp.com/)) is a social cookbook app that allows users to share recipes, as well as browse other recipes in their explore page. Users can build a “cookbook” of recipes that is visible to their friends on the app. The app also features recipes from some celebrity chefs. Another feature of this app is that you can make a “bucket list” of recipes to make and check them off as you make them.

## **Features:**

- The home page could feature different recipe books with a user-specified category, for example, they could represent different types of food/drinks, or courses of a meal such as appetizers and desserts.
- Each **recipe book** would contain
  - Table of contents, which lists each recipe along with useful metadata about that recipes (such as time to make or rating), for ease of reference
  - Recipe rankings, where each recipe can be ranked on a scale from 1-5 stars
  - The actual **recipes**, which are across 2 pages of the book UI that it is contained in, would include the following:
    - Picture of the dish \+ ingredient list \+ instructions \+ notes (these could explain the memories associated with the recipe, or extra details) \+ rating on a scale from 1-5
    - **Snapshots** of each time you made a recipe to track variations of the recipe or improvements on the recipe. This feature would include:
      - Pictures associated with the new iteration of the recipe
      - Notes of how the recipe changed from previous snapshots of the recipe
      - Rating associated with each snapshot of the recipe
      - Date that the new iteration of the recipe was made
- **Calendar** where you can schedule a snapshot of a recipe to be made on a certain date. This also gives user a nice visualization of past cooking attempts.

## **Ethical Analysis**

### **Stakeholders**
**Insight 1 Direct Stakeholders**
**Observation:** Our primary direct stakeholders are home cooks and chefs. These stakeholders frequently cook meals and have variations of the same recipe that they want to record.
**Design Response** To enable users to store multiple variations of the same recipe, we will introduce a concept called \`Snapshots\` that will allow users to record variations of the same recipe under a single \`Recipe\`. This will let users quickly see the different versions of a recipe quickly in one place.
## **Time**
**Insight 2 Accumulation of Recipes Over Time**
**Observation:** After years of use, users will accumulate a lot of recipes, leading to a large personal library to choose from when planning meals. However, with the number of accumulated recipes, users could feel overwhelmed by trying to find certain recipes
**Design Response:** We will add a Recipe Book feature that allows users to organize recipes into different recipe books containing a table of contents. This would make looking for recipes more efficient.


**Insight 3 Evolution of Purpose**
**Observation:** As time goes by and users accumulate many recipes, users may repurpose the app as a tool to help them plan their meals.
**Design Response:** Adding the calendar feature that lets users schedule certain recipes for certain dates allows users to use the app as a meal planning helper as well.

## **Values**
**Insight 4 Self-Efficacy**
**Observation:** Users may feel uncertain about their cooking skills or forget which variations of a dish worked best. Without visible feedback/reflection on past attempts, they may struggle to improve or repeat successful approaches.
**Design Response:** Features like snapshots, notes, ratings, and calendar entries directly address this by providing a written and visual record of prior cooking attempts and outcomes.

### **Pervasiveness**
**Insight 5: Widespread Use**
**Observation:** Scaling beyond one user is not necessary; the app remains individual-focused. Having many users may lead to social comparison and performance pressure.
**Design Response:** We will limit the app to personal-use. By designing personalized collections and snapshots and only letting users view their own recipes and calendar, the app avoids social comparisons, focusing on self-reflection and personal use.
