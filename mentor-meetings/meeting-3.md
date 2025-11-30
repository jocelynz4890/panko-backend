# Meeting 3

## Agenda

Sunday, November 30
3 pm


## Progress Report

- renamed Concepts to be clearer:
    - Recipe -> Dish
    - Snapshot -> Recipe
- Implemented uploading images on backend
- Fixed calendar implementation. Save changes is now working
- Fixed a bunch of bugs on frontend:
    - [BUG] Order of tabs in a Dish goes from newest to oldest, should be oldest to newest.
    - [BUG] On Table of Contents, when a new Dish is created, the previous dishes' attempts do not show
    - [BUG] In the Table of Contents and Rankings page, when you click on a dish, it takes you to a new dish and not the existing dish.
    - [BUG] Recipes without snapshots cannot be assigned
    - [BUG] Weird “unnamed recipe” events appearing on calendar.

- Implemented syncs
- In the process of refactoring frontend to use syncs
- Added many more recipe book cover options

## Design changes

- renamed Concepts to be clearer:
    - Recipe -> Dish
    - Snapshot -> Recipe

## Issues


### list of problems and issues to address
- [TODO] Refactor frontend to use syncs + new concept names
- [TODO] For calendar events, implement a delete modal instead of making it an alert
- [TODO] Link calendar event to recipe
- [TODO] Debug uploading images on frontend
- [BUG] Recibe Book covers are randomized. We need a cover index for the covers.
- [QUESTIONS] For the next week assignments, is populating our app with data required?

## Plans and Decisions

Decisions made:
- Using Cloudinary instead of imgur because imgur api is outdated(?)

Plans for next week:
- Lotsss of testing and debugging!
- Refine styling
- Optimize backend requests
