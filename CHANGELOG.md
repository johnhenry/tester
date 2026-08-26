# Changelog

This project has lived at three npm addresses. Its original working name
was **Tester**, but the unscoped `tester` name on npm was already taken, so
it shipped as **`pop-quiz`** (`0.0.0`–`0.0.7`, 2022–2025; then `1.0.0`/`1.0.1`
in July 2026 via a parallel publish from the vendored copy inside
`johnhenry/lib`). In August 2026 it was adopted into the `@johnhenry` scope
as **`@johnhenry/tester`**, restarting its version line at `0.0.0` — a new
address and era, not a maturity signal. The unscoped `pop-quiz` versions
remain on npm for existing consumers.

## [Unreleased]

### Added

- JSDoc on the public API (default export, all assertions, `TestError`,
  `TAPRunner` exports).
- Runnable, self-checking examples in `examples/` (`npm run examples`),
  also run in CI.
- This changelog.

## [0.0.0] - 2026-08-25

First release as `@johnhenry/tester` (third npm address; see provenance
above). Functionally equivalent to `pop-quiz@1.0.1`.

### Changed

- Package renamed `pop-quiz` → `@johnhenry/tester`; version restarted at
  `0.0.0` per the scope's convention.
- Publishes from CI on GitHub release, with npm provenance.

## pop-quiz (prior address)

### [1.0.1] - 2026-07-03

- **Fixed**: a failing TAP run now exits non-zero — `print` sets
  `process.exitCode = 1` when any assertion fails. Before this, a test
  file full of failures still exited `0`, so CI stayed silently green.
  All earlier versions (`<= 1.0.0`) have this bug.
- **Added**: `deepdeepequal` — deep equality that also compares Map and
  Set contents (plain `deepequal` silently can't see either) and
  tolerates matching circular references.
- **Added**: CI test workflow (Node 20/22/24).

### [1.0.0] - 2026-07-03

- Version bump published in parallel from the vendored copy of this
  package inside `johnhenry/lib`. No functional change over `0.0.7`.

### [0.0.0]–[0.0.7] - 2022-05-22 to 2025-04-28

- Original releases: the quiz/generator API, the bundled assertions
  (all of today's except `deepdeepequal`), `TAPRunner` (`run`/`print`),
  TAP output, browser entry points (`index.html`, `test.html`).
