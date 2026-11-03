# Ágora Lab — Day 1: your first real pipeline

**Rules**
- Write every YAML file **from memory**. Don't copy from the chat. If you're stuck for 10 minutes, ask me for a hint.
- **Predict before you push:** write down what you expect (green or red, which jobs run), then compare. Keep your predictions in `LAB-NOTES.md` at the root of the repo.
- Blocks of 45 minutes with a 10-minute break between them, away from screens. Stop at the end of Block 3, wherever you are.

---

## Block 1 (45 min): get it running

1. **Run it locally first.** Unzip, open a terminal in the folder and run, in order:
   `npm ci` → `npm run lint` → `npm test` → `npm run build` → `npm start`
   Open http://localhost:3000, add a task, click it to mark it done.
   *Note: what does each command print when it succeeds?*

2. **Create a public GitHub repo** named `taskboard`, and push this code to `main`.

3. **Write `.github/workflows/ci.yml` from memory.** Requirements:
   - Name: `CI`. Runs on pushes to `main` and on every pull request.
   - Job `lint-and-test` on `ubuntu-latest`: checkout → set up Node 20 → `npm ci` → `npm run lint` → `npm test`
   - Job `build`: only if `lint-and-test` succeeded **and** only on `main`. Checkout → Node 20 → `npm ci` → `npm run build`

4. Commit, push, and open the **Actions** tab on GitHub. Click into the run and open each step's log.
   ✅ **Checkpoint:** both jobs green on `main`.
   *Tip: the lint script fails on TAB characters, including in your `ci.yml`. That's on purpose.*

**Break: 10 minutes.**

---

## Block 2 (45 min): break it on purpose

5. **Break a test.** Create a branch `break-test`. In `src/tasks.js`, change the title limit from `100` to `10`. Push the branch and **open a pull request** into `main`.
   *Predict first (in LAB-NOTES.md): which job runs? Which is skipped? Is the PR red or green?*
   Then check. Open the failing log and find **the name of the failing test** and the **line number** where it failed.

6. **Fix it** on the same branch (put `100` back) and push. Watch the PR turn green. **Merge it.** Watch the run on `main`: does `build` run this time? Why?

7. **Break the lint.** Branch `break-lint`: put a TAB character at the start of a line in any `.js` file. Open a PR.
   *Predict: which step fails? Does `npm test` run after it? Why or why not?*
   Then answer: why might a team put lint and tests in **separate jobs** instead of one?
   Close the PR without merging.

8. *(Optional)* Break the **YAML itself**: remove one `- ` from your `ci.yml` on a branch. What does GitHub show? Is it the same as a failing test?

**Break: 10 minutes.**

---

## Block 3 (40 min, stretch): Docker in CI

9. Write a `Dockerfile` for the app: Node 20 alpine base image, copy the code, `npm ci --omit=dev`, expose port 3000, start with `npm start`.
   Build and run it locally, then check that `curl localhost:3000/health` answers.

10. Add a third job `docker-build` that runs only after `build` and only on `main`: checkout, then build the image tagged with the commit SHA.
    **Don't push the image yet**: that's Day 4.
    *Answer in LAB-NOTES.md: what would be missing for `docker push` to work here? (Remember tonight's question 9.)*

---

## When you finish
Send me in the chat:
- your final `ci.yml` (in a code block)
- your `LAB-NOTES.md` predictions vs. results
- anything that surprised you

I'll review it at the start of Day 2.
