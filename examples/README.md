# Examples

Runnable, self-checking examples. Each one exits 0 on success and 1 on
failure, so they double as smoke tests (CI runs them all).

Run them all:

```sh
npm run examples
```

Or individually:

```sh
node examples/01-basic-assertions.mjs
```

| Example | Shows |
| --- | --- |
| [01-basic-assertions.mjs](./01-basic-assertions.mjs) | The core assertions (`ok`, `equal`, `deepequal`, `throws`, ...), `plan()`, and the TAP output a test produces. |
| [02-subtests.mjs](./02-subtests.mjs) | `subtestpass` / `subtestfail` — asserting on the outcome of a nested test, including using `subtestfail` to verify that bad input is rejected. |
| [03-deepdeepequal.mjs](./03-deepdeepequal.mjs) | Why plain `deepequal` silently can't see Map/Set contents, and how `deepdeepequal` compares Maps, Sets, and circular references. |
| [04-exit-code.mjs](./04-exit-code.mjs) | A deliberately failing test run in a child process, asserting it exits 1 (the silent CI false-green fixed in pop-quiz 1.0.1). |

The examples import from `../index.mjs` so they run straight from a clone
with no install step. In your own project, import from
`@johnhenry/tester` instead.
