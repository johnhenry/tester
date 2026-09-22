# Tester

[![npm version](https://img.shields.io/npm/v/%40johnhenry%2Ftester.svg)](https://www.npmjs.com/package/@johnhenry/tester)
[![CI](https://github.com/johnhenry/tester/actions/workflows/test.yaml/badge.svg)](https://github.com/johnhenry/tester/actions/workflows/test.yaml)
[![license](https://img.shields.io/npm/l/%40johnhenry%2Ftester.svg)](LICENSE)

Full documentation: [opensource.johnhenry.me/tester](https://opensource.johnhenry.me/tester/)

`@johnhenry/tester@0.0.0`

A context-independent testing framework inspired by [tape](https://github.com/substack/tape).

## Provenance

This project's original working name was **Tester**, but it was published to
npm as **`pop-quiz`** (npm doesn't rename packages, and the unscoped `tester`
name was already taken by an unrelated package). `pop-quiz` was published
`0.0.0`–`0.0.7` between 2022 and 2025, then bumped to `1.0.0`/`1.0.1` in July
2026 by a parallel publish from a vendored copy of this package inside
`johnhenry/lib`.

The GitHub repository has since been renamed from `pop-quiz` back to
`tester`, and the package is now adopted into the `@johnhenry` npm scope as
**`@johnhenry/tester`**, restarting its version at **`0.0.0`** per this
scope's convention (a new address is a new era). The prior `pop-quiz`
versions (last published: `1.0.1`) remain on npm, unscoped and undeprecated,
for existing consumers.

## Comparison to Tape

Like Tape, tester

- can be run directly using [node](https://nodejs.org) without any binaries or transformations.
- produces output using the standard [Test Anything Protocol](https://testanything.org/).

Unlike Tape, tester

- can be run directly in [node](https://nodejs.org), [deno](https://deno.land), and browser environments
  without any binaries or transformations.
- requires no dependencies
- uses external assertions and makes it easy to write your own.

## Context-Agnostic

Tests run in same context as your application. No special executables needed.

## TAP Output

Tester outputs to the console using a partial implementation of the [Test Anything Protocol](https://testanything.org/tap-specification.html).

## Installation

Install via npm with `npm install @johnhenry/tester`
or
import directly from website:

```javascript
import quiz from "https://cdn.jsdelivr.net/npm/@johnhenry/tester@0.0.0/index.mjs";
```

## Examples

Runnable, self-checking examples live in [./examples](./examples/) — basic
assertions and TAP output, subtests, `deepdeepequal` (Map/Set/circular),
and exit-code behavior. Run them all with `npm run examples`.

## API

Tester's API consists of two main components:

- The "quiz" function acts on a group of assertions.
- The assertions themselves, which return errors if a given condition is not satisfied.

### Quiz

The quiz function is the default export.

It takes as its only argument a [possibly asynchronous] generator. We call this a "test".

Results of assertions are yielded from within the body of a test.

```javascript
import quiz from "@johnhenry/tester";
quiz(function* () {
  yield /*some assertion result*/;
  yield /*some other assertion result*/;
});
```

### Assertions

The named exports are assertions.

Call them within a test and yield their results.

```javascript
import quiz, { ok, notok } from "@johnhenry/tester";

quiz(function* () {
  yield ok(true);
  yield notok(false);
});
```

#### Included Assertions

Besides ok and notok, a number of assertions are included:

- ok -- test passes if and only if the given argument to a test is TRUTHY.
- notok -- test passes if and only if the given argument to a test is FALSY.
- equal -- test passes if and only if the two given arguments are THE SAME object.
- notequal -- test passes if and only if the two given arguments are NOT THE SAME object.
- deepequal -- test passes if and only if two objects are deeply equal.
- deepdeepequal -- like deepequal, but also compares Map/Set contents (deepequal can't see them — neither has own enumerable string keys) and tolerates matching circular references.
- pass -- test ALWAYS PASSES
- fail -- test ALWAYS FAILS
- subtestpass -- test passes if and only if the given argument is a test in which ALL THE ASSERTIONS PASS.
- subtestfail -- test passes if and only if the given argument is a test in which EVERY ASSERTION FAILS.
- throws -- test passes if and only if the given function THROWS AN ERROR when called
- doesnotthrow -- test passes if and only if the given function DOES NOT THROW AN ERROR when called

### plan

When using the run function, the first argument passed to given generator is a function.
We'll call it "plan", but you can name it anything you like ("expect", "assertions", etc.)
When _plan_ is called with an integer, it dictates the number of expected assertions in a given test function.

```javascript
import quiz, { ok } from "@johnhenry/tester";

quiz(function* (plan) {
  plan(1);
  yield ok(true);
});
```

## Adding a new assertion

`deepdeepequal` is the best real worked example in this package's own
history (see the CHANGELOG's `pop-quiz 1.0.1` entry) — the harder of the two
cases, because unlike a one-line comparison it needs its own recursion and a
`seen` map for circular references, on top of the shared convention every
assertion follows.

Every assertion is a plain function following one small, repeatable pattern,
so a new one does too:

1. **`assertions/<name>.mjs`** — the assertion itself. The last parameter is
   an _operator string_ (used for the TAP protocol, overridable); the
   next-to-last is a _default expected message_ (also overridable); every
   preceding argument is a condition to test. Returns the message on pass,
   or `new TestError(message, details)` on fail, where `details` is an
   object whose key-value pairs are displayed as part of TAP output.

   ```javascript
   import TestError from "../testerror.mjs";

   export default (/*given conditions*/, message = "...", operator = "<name>") => {
     if (/*conditions are met*/) {
       return message;
     }
     return new TestError(message, /*details object*/);
   };
   ```

2. **`assertions/index.mjs`** — one line: `export { default as <name> } from
   "./<name>.mjs";`. This is the only place a new assertion needs to be
   registered — root `index.mjs` re-exports everything from here
   (`export * from "./assertions/index.mjs"`), so nothing else needs to know
   a new assertion exists.

**The one part that isn't boilerplate: the condition check itself.**
Everything above the `if` is convention; the `if` is the actual assertion
logic. `deepdeepequal`'s is the least trivial one in this package: plain
`deepequal`'s `Object.keys()` comparison can't see Map/Set contents (neither
has own enumerable string keys, so two different-content Maps both compare
as "0 keys === 0 keys"), and a naive deep-equal recurses forever on a cycle.
`deepdeepequal` threads a `seen` map of `(a, b)` pairs already being
compared on the current path, so a cycle that lines up on both sides is
treated as equal instead of overflowing the stack — see
[`assertions/deepdeepequal.mjs`](assertions/deepdeepequal.mjs).

Run `node examples/03-deepdeepequal.mjs` to see it work for real, or
`npm run examples` for the full set.

### TestError API

The test error is constructed with two items:

- An expected message.
- An object whose key-value pairs are displayed as part of TAP output.

## TAPRunner, print, run

The file "/TAPRunner.mjs" export methods "print" and "run".
"print" functions similarly to the default export of "index.mjs" --
both of which rely on "run" to execute underlying code.

When called with a single argument (a test),
"run" yields only the results of the test (string or Error) without additional processing.
