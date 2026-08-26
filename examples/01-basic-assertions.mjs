// Basic assertions and the TAP output they produce.
//
// Run: node examples/01-basic-assertions.mjs
//
// A test is a generator function that yields assertion results. `tester`
// runs it and prints TAP: a `TAP version 13` header, the title, one
// `ok N - message` line per passing assertion, the `1..N` plan line, and
// a `# tests / # pass / # fail` summary.
import tester, {
  ok,
  notok,
  equal,
  notequal,
  deepequal,
  throws,
  doesnotthrow,
} from "../index.mjs";

const allPassed = await tester("basic assertions", function* (plan) {
  plan(7); // optional: declare the expected assertion count up front

  yield ok(1 + 1 === 2, "arithmetic still works");
  yield notok(undefined, "undefined is falsy");
  yield equal("a" + "b", "ab", "strings concatenate");
  yield notequal({}, {}, "two object literals are different references");
  yield deepequal(
    { a: 1, b: [2, 3] },
    { b: [2, 3], a: 1 },
    "deepequal ignores key order"
  );
  yield throws(() => {
    JSON.parse("{nope");
  }, "invalid JSON throws");
  yield doesnotthrow(() => {
    JSON.parse("{}");
  }, "valid JSON does not throw");
});

// tester resolves to a boolean; on failure it also sets process.exitCode = 1.
console.log(`# allPassed: ${allPassed}`);
if (!allPassed) process.exit(1);
