// Subtests: asserting on the outcome of a nested test.
//
// Run: node examples/02-subtests.mjs
//
// `subtestpass(test)` passes only if EVERY assertion in the nested test
// passes. `subtestfail(test)` passes only if EVERY assertion in the nested
// test fails — which makes it the way to assert that an assertion (perhaps
// one you wrote yourself) correctly rejects bad input. Either way the
// subtest's own results are consumed silently: they never appear in the
// outer TAP output.
import tester, {
  ok,
  equal,
  fail,
  subtestpass,
  subtestfail,
} from "../index.mjs";

const allPassed = await tester("subtests", function* () {
  // A nested group of assertions, checked as a single outer assertion.
  yield subtestpass(function* () {
    yield ok(true);
    yield equal(2 * 2, 4);
  }, "a healthy subtest passes as one assertion");

  // Assert that bad input is rejected: every assertion inside must fail.
  yield subtestfail(function* () {
    yield equal(1, 2); // fails, as intended
    yield fail("this branch should never be reachable"); // also fails
  }, "a subtest of failures is itself a pass for subtestfail");

  // Subtests may be async generators, like any test.
  yield subtestpass(async function* () {
    const value = await Promise.resolve(42);
    yield equal(value, 42);
  }, "async subtests work too");
});

console.log(`# allPassed: ${allPassed}`);
if (!allPassed) process.exit(1);
