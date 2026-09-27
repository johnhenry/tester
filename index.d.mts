import type { TestFunction } from "./TAPRunner.mjs";

/**
 * Run a test and print its results as TAP.
 *
 * A "test" is a (possibly async) generator function that yields assertion
 * results. It receives a single argument, `plan` — call `plan(n)` at most
 * once to declare the expected number of assertions.
 *
 * May be called as `tester(title, test)` or `tester(test)` (no title).
 * @returns `true` if every assertion passed. On failure, also sets
 *   `process.exitCode = 1` where `process` exists (Node), so a failing
 *   test file exits non-zero; in the browser it simply resolves `false`.
 */
declare function tester(
  title: string,
  test: TestFunction,
  primaryTest?: boolean
): Promise<boolean>;
declare function tester(
  test: TestFunction,
  primaryTest?: boolean
): Promise<boolean>;

export default tester;

export * from "./assertions/index.mjs";
