import tester, { ok, pass } from "../index.mjs";
import {
  escapeTapText,
  TAPResultTitle,
  TAPResultPass,
  TAPResultFail,
} from "../TAPRunner.mjs";
import TestError from "../testerror.mjs";

// Regression coverage for two audit findings in TAPRunner.mjs:
//
// 1. Unescaped '#' in a title/message can be misread by a spec-compliant
//    TAP parser as the start of a directive (e.g. "# SKIP ..."), silently
//    turning a pass into a "skip". Embedded newlines can likewise produce
//    orphan physical lines that a parser would misattribute.
// 2. Concurrent `tester()`/`print()` calls writing to the same log sink
//    used to interleave their output (multiple "TAP version 13" headers,
//    non-monotonic `ok N` indices, scattered `1..N` plan lines).
//
// Note: these formatters are tested directly (rather than via `print`)
// because `print` now holds a process-wide mutex for the duration of the
// test it's running (see finding 1's fix below) — calling `print` again
// from *inside* a running `tester()`/`print()` test would try to
// re-acquire that same, non-reentrant lock and deadlock. The mutex is
// meant to serialize independent, sibling `tester()` calls, not to
// support a test calling `print` on itself.

await tester("Test TAP text escaping", function* () {
  yield ok(
    TAPResultPass("# SKIP not really", 1) === "ok 1 - \\# SKIP not really",
    "'#' in a passing message is backslash-escaped, not left as a raw directive marker"
  );

  yield ok(
    TAPResultFail(new TestError("# TODO not really"), 1).startsWith(
      "not ok 1 - \\# TODO not really"
    ),
    "'#' in a failing message is backslash-escaped, not left as a raw directive marker"
  );

  yield ok(
    TAPResultTitle("# SKIP whole suite") === "# \\# SKIP whole suite",
    "'#' in a title is backslash-escaped, not left as a raw directive marker"
  );

  yield ok(
    TAPResultPass("line one\nline two", 1) === "ok 1 - line one\\nline two",
    "embedded newline in a message is escaped, not left as a raw line break that would orphan a physical line"
  );

  yield ok(
    escapeTapText("a\\#b") === "a\\\\\\#b",
    "escapeTapText escapes existing backslashes before introducing new escapes"
  );
});

// Run two `tester()` calls concurrently, sharing the real `console.log`
// sink, and record what actually gets written. This has to happen at
// module top level (not nested inside another `tester()`/`print()` call —
// see the note above) so the two calls are genuine siblings contending for
// the shared print mutex, the same way two independent test files running
// concurrently would.
const captured = [];
const originalLog = console.log;
const originalError = console.error;
console.log = (line) => captured.push(String(line));
console.error = (line) => captured.push(String(line));
try {
  await Promise.all([
    tester("Concurrent block A", async function* () {
      yield pass("A assertion 1");
      yield pass("A assertion 2");
      yield pass("A assertion 3");
    }),
    tester("Concurrent block B", async function* () {
      yield pass("B assertion 1");
      yield pass("B assertion 2");
    }),
  ]);
} finally {
  console.log = originalLog;
  console.error = originalError;
}

const headerIndices = captured
  .map((line, i) => (line === "TAP version 13" ? i : -1))
  .filter((i) => i !== -1);

const blocks = headerIndices.map((start, i) => {
  const end =
    i + 1 < headerIndices.length ? headerIndices[i + 1] : captured.length;
  return captured.slice(start, end);
});

const blockA = blocks.find((b) => b.some((l) => l.includes("A assertion")));
const blockB = blocks.find((b) => b.some((l) => l.includes("B assertion")));
const noCrossContamination = blocks.every((block) => {
  const hasA = block.some((l) => l.includes("A assertion"));
  const hasB = block.some((l) => l.includes("B assertion"));
  return !(hasA && hasB);
});

await tester(
  "Test concurrent tester() calls do not interleave",
  function* () {
    yield ok(
      headerIndices.length === 2,
      "exactly two TAP version headers, one per concurrent call"
    );
    yield ok(
      noCrossContamination,
      "each TAP block contains only one concurrent call's assertions (no interleaving)"
    );
    yield ok(
      !!blockA && blockA.includes("1..3"),
      "block A's plan line is present and un-scattered within its own block"
    );
    yield ok(
      !!blockB && blockB.includes("1..2"),
      "block B's plan line is present and un-scattered within its own block"
    );
  },
  false
);
