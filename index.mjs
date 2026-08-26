import { print } from "./TAPRunner.mjs";
/**
 * Run a test and print its results as TAP.
 *
 * A "test" is a (possibly async) generator function that yields assertion
 * results. It receives a single argument, `plan` — call `plan(n)` at most
 * once to declare the expected number of assertions.
 *
 * May be called as `tester(title, test)` or `tester(test)` (no title).
 *
 * @param {string|GeneratorFunction|AsyncGeneratorFunction} title - Test
 *   title, or the test itself when called with a single argument.
 * @param {GeneratorFunction|AsyncGeneratorFunction} [test] - The test to run.
 * @param {boolean} [primaryTest=true] - Whether to print the leading
 *   `TAP version 13` line. Pass `false` for secondary test groups so the
 *   header appears only once per run.
 * @returns {Promise<boolean>} `true` if every assertion passed. On failure,
 *   also sets `process.exitCode = 1` where `process` exists (Node), so a
 *   failing test file exits non-zero; in the browser it simply resolves
 *   `false`.
 */
export default (title, test, primaryTest = true) =>
  test
    ? print(test, title, undefined, undefined, primaryTest)
    : print(title, undefined, undefined, undefined, primaryTest);
export * from "./assertions/index.mjs";
