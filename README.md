# Taskboard

A tiny full-stack task board (Node.js backend + plain HTML/JS frontend) used as the practice app for the Ágora CI/CD sprint. It has **zero dependencies**: only Node's built-in modules. That keeps installs fast, so your attention stays on the pipeline.

## Requirements
Node.js 20 or newer.

## Commands
| Command | What it does | In CI it proves… |
|---|---|---|
| `npm ci` | Installs exactly what `package-lock.json` says | the install is reproducible |
| `npm run lint` | Syntax check, no `debugger`, no TAB characters in `.js`/`.yml` | the code is clean |
| `npm test` | Runs 8 tests in `test/` (Node's built-in test runner) | the logic and the API work |
| `npm run build` | Packages the frontend into `dist/` with a build-info file | the app can be packaged |
| `npm start` | Starts the server on http://localhost:3000 | (not used in CI) |

## API
- `GET /health` → `{ "status": "ok", "version": "..." }` (version comes from the `APP_VERSION` env var)
- `GET /api/tasks` → list of tasks
- `POST /api/tasks` with `{ "title": "..." }` → creates a task (title required, max 100 characters)
- `PATCH /api/tasks/:id/done` → marks a task as done

## Structure
```
src/      server code (app.js = routes, tasks.js = logic, server.js = start)
public/   frontend
test/     tests
scripts/  lint and build scripts
```
