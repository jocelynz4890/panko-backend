# Panko Backend

## Initial setup

1. Run `git clone` to clone this repo (make sure to clone both the frontend and backend repo into the same folder)
2.

## Debugging Tips

Make sure to restart the backend server when debugging locally to see changes.

## Using the concept backend

The concept backend repo is located at https://github.com/61040-fa25/concept_backend.

Make sure that the current remote is similar the following with `git remote -v`:

```
origin  git@github.com:jocelynz4890/panko-backend.git (fetch)
origin  git@github.com:jocelynz4890/panko-backend.git (push)
upstream        https://github.com/61040-fa25/concept_backend.git (fetch)
upstream        https://github.com/61040-fa25/concept_backend.git (push)
```

If not, run `git remote add upstream https://github.com/61040-fa25/concept_backend.git`.

Now to sync the concept backend repo, you can run `git pull upstream main` after making sure all changes are stashed or committed. If you get an error message about refusing to merge unrelated histories, run it with the flag `--allow-unrelated-histories`.
