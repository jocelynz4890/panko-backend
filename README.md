# Panko Backend

[Problem Framing](problem-framing.md)

## File Structure

- `/context` contains files modified by the Context tool. DO NOT TOUCH.
- `/design` contains files related to the design and brainstorming of concepts, each of which contains
  - `<ConceptName>.md` contains the concept specification
  - `design.md` contains records of design changes for this concept
  - `implementation.md` contains records of Context usage to generate an implementation using the concept spec
  - `testing.md` contains the concept's tests, implemented using the Context tool
  - `testing-output.md` shows the output to the console after running the tests for this concept
- `/media` contains assets used in this repo
- `/src` contains source code
  - `/concepts` contains concepts, each with a `.ts` and `.test.ts` file
  - `/syncs` contains syncs
- `mentor-meetings` contains files with deliverables for each mentor meeting
- `design.md` detailing the overall design
- `team-contract.md` contains the team's contract
- `problem-framing.md` contains the problem framing assignment responses
- `functional_design.md` contains the deliverables for functional design

- `api.md` TODO after running api-extraction prompt (`api-extraction-from-code.md` using Context)

## Initial setup

1. Run `git clone` to clone this repo (make sure to clone both the frontend and backend repo into the same folder)
2. Make sure [deno](https://deno.com) is installed, and also make sure Obsidian is installed
3. Setup .env:

Copy or change `.env.template` to the environment file: `.env` and insert your Gemini API key and Mongo SRV:

```env
GEMINI_API_KEY=YOUR_KEY_HERE
GEMINI_MODEL=gemini-2.5-pro
GEMINI_CONFIG=./geminiConfig.json
MONGODB_URL=MONGO_URL_HERE
DB_NAME=PankoDB
```

## Helpful Commands

Prompting with context (remember to add @ in front of other files referenced as context, and make newlines):

```
./ctx prompt <relative_path_to_file>.md
```

Saving file history with context:

```
`./ctx save <relative_path_to_file.md>`
```

Run all tests:

```shell
deno test -A
```

After generating an API spec, start backend server:

```
deno task concepts
```

After implementing syncs, build and start backend action server that uses the Requesting concept:

```
deno run build
deno run start
```

## Concept Implementation Workflow

1. Carefully construct the concept specification, making sure to consider all edge cases.
2. Use the final concept specification as context for the implementation, and use `./ctx prompt` to continuously modify the implementation.
3. Once satisfied with the implementation, use it and the concept specification to run `./ctx prompt` to generate a testing file, making sure that it tests all actions/operational principle with consistent output formatting.
4. Copy the implementation and test code over into TypeScript files in `/src` to debug them so that they are passing the tests
5. Modify the test output to be more legible and better highlight the operational principle, and clearly show that it tests all components of the operational principle

## Debugging Tips

Make sure to restart/rebuild the backend server when debugging locally to see changes.

## Using the concept backend

The concept backend repo is located at https://github.com/61040-fa25/concept_backend.

Make sure that the current remote is similar to the following with `git remote -v`:

```
origin  git@github.com:jocelynz4890/panko-backend.git (fetch)
origin  git@github.com:jocelynz4890/panko-backend.git (push)
upstream        https://github.com/61040-fa25/concept_backend.git (fetch)
upstream        https://github.com/61040-fa25/concept_backend.git (push)
```

If not, run `git remote add upstream https://github.com/61040-fa25/concept_backend.git`.

Now to sync the concept backend repo, you can run `git pull upstream main` after making sure all changes are stashed or committed. If you get an error message about refusing to merge unrelated histories, run it with the flag `--allow-unrelated-histories`.
