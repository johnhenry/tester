# Agent playbook

`@johnhenry/tester` — a context-independent, zero-dependency TAP testing
framework, inspired by tape, that runs unchanged in Node, Deno, and the
browser. Single package, Node >= 26, `node tester.test.mjs` runs the suite
(`npm test`); ships source directly (`main`/`exports` point straight at
`index.mjs` and friends), no build step.

`CLAUDE.md` in this directory is a symlink to this file.

## The verification loop (before every push)

1. `npm test` — `node tester.test.mjs`, which imports every file under
   `tests/` (`assertions.mjs`, `run.mjs`, `deep.mjs`, `tap-format.mjs`).
2. `npm run examples` — every file in `examples/*.mjs` is self-checking and
   exits non-zero on failure; CI runs the same command.
3. `npm pack --dry-run` — confirm `files` (`index.mjs`, `TAPRunner.mjs`,
   `assertions`, `unique`, `testerror.mjs`) still matches what actually
   ships; there is no build step to catch a missing entry for you.
4. A genuinely fresh clone:
   `git clone . /tmp/tester-verifyN && cd $_ && npm ci && npm test`.
5. Commit, push, close the issue with a comment naming the commit SHA.

CI (`.github/workflows/test.yaml`) runs `npm test` then the examples smoke
step; match that order locally.

## Repo-specific gotchas

- **Zero dependencies is the point, not an accident.** The pitch is
  "context-independent" — runs unchanged in Node, Deno, and a browser
  `<script type="module">`. Anything added to `index.mjs`, `TAPRunner.mjs`,
  `assertions/`, `unique/`, or `testerror.mjs` (i.e. anything in `files`)
  must not assume a Node-only global. Where Node-only behavior is genuinely
  needed (setting an exit code), guard it — see `TAPRunner.mjs`'s
  `typeof process !== "undefined"` check before touching
  `process.exitCode`. Test-only files (`tester.test.mjs`, `tests/`) are not
  under this constraint.
- **A failing run must exit non-zero, and it's easy to regress silently.**
  `pop-quiz@<=1.0.0` shipped without `process.exitCode = 1` on failure, so a
  test file full of failing assertions still exited `0` and CI stayed
  green. The fix lives in `print()`'s exit-code branch — any refactor of
  `TAPRunner.mjs` needs `examples/04-exit-code.mjs` to keep passing (it
  runs a deliberately failing test in a child process and asserts the exit
  code).
- **This project has shipped under three npm addresses** (`tester` working
  name → `pop-quiz` on npm → `@johnhenry/tester`). See the README's
  [Provenance](README.md#provenance) section and `CHANGELOG.md` before
  assuming "tester" is a name available anywhere else, or that version
  history before `0.0.0` here lives in this repo's own git log (it doesn't
  — it was vendored inside `johnhenry/lib`).

## Definition of done

A change is done when all of the following hold, not just when tests pass:
- A regression test exists for any bug fixed — fixing a bug without a test
  that would have caught it means it can come back unnoticed.
- Anything the feature does **not** do is stated in the README, not only in
  an issue comment.
- `CHANGELOG.md` has an entry (this repo's changelog is one of the more
  complete in the family — match its level of detail, don't thin it out).
- A new assertion follows [Adding a new assertion](README.md#adding-a-new-assertion)
  and is added to `assertions/index.mjs`.

## Releases

Bump `version` in `package.json`, add the `CHANGELOG.md` entry, merge, then
`gh release create v<version>` — the release event triggers
`.github/workflows/npm-publish.yaml` (CI itself runs from the separate
`test.yaml`), which is idempotent (skips if the version is already on npm).
