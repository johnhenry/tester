import type TestError from "../testerror.mjs";

/** The value yielded by an assertion: a message on pass, a TestError on fail. */
export type AssertionResult = string | TestError;

/** `plan(n)` declares the expected assertion count; see `TAPRunner.run`. */
export type PlanFunction = (n: number) => void;

/** A test/subtest body: a (possibly async) generator of assertion results. */
export type SubtestFunction = (
  plan: PlanFunction
) =>
  | Generator<AssertionResult, void, unknown>
  | AsyncGenerator<AssertionResult, void, unknown>;

/**
 * Assert that a value is truthy.
 * @param actual - Value under test.
 * @param message - Reported on pass or fail. Default: "should be truthy".
 * @param operator - Operator name in TAP diagnostics. Default: "ok".
 */
export declare function ok(
  actual: unknown,
  message?: string,
  operator?: string
): AssertionResult;

/**
 * Assert that a value is falsy.
 * @param actual - Value under test.
 * @param message - Reported on pass or fail. Default: "should be falsy".
 * @param operator - Operator name in TAP diagnostics. Default: "notok".
 */
export declare function notok(
  actual: unknown,
  message?: string,
  operator?: string
): AssertionResult;

/**
 * Assert strict (`===`) equality. Two different objects with identical
 * contents are NOT equal here — use `deepequal`/`deepdeepequal` for that.
 * Note `NaN === NaN` is false, so two NaNs fail this assertion.
 * @param actual - Value under test.
 * @param expected - Value it must strictly equal.
 * @param message - Reported on pass or fail. Default: "should be strictly equal".
 * @param operator - Operator name in TAP diagnostics. Default: "equal".
 */
export declare function equal(
  actual: unknown,
  expected: unknown,
  message?: string,
  operator?: string
): AssertionResult;

/**
 * Assert strict (`!==`) inequality.
 * @param actual - Value under test.
 * @param unexpected - Value it must not strictly equal.
 * @param message - Reported on pass or fail. Default: "should be strictly not equal".
 * @param operator - Operator name in TAP diagnostics. Default: "notequal".
 */
export declare function notequal(
  actual: unknown,
  unexpected: unknown,
  message?: string,
  operator?: string
): AssertionResult;

/**
 * Assert deep structural equality of plain values: primitives, arrays,
 * plain objects (own enumerable string keys), RegExp, and objects with a
 * custom `valueOf`/`toString` (e.g. Date). Two NaNs are equal.
 *
 * Known blind spots — use `deepdeepequal` when they matter: Map/Set
 * contents are invisible, and circular references recurse until the stack
 * overflows.
 * @param actual - Value under test.
 * @param expected - Value it must deeply equal.
 * @param message - Reported on pass or fail. Default: "should be deep equal".
 * @param operator - Operator name in TAP diagnostics. Default: "deepequal".
 */
export declare function deepequal(
  actual: unknown,
  expected: unknown,
  message?: string,
  operator?: string
): AssertionResult;

/**
 * Assert deep structural equality including everything `deepequal` covers,
 * plus Map/Set contents and matching circular references.
 * @param actual - Value under test.
 * @param expected - Value it must deeply equal.
 * @param message - Reported on pass or fail. Default: "should be deeply-deeply equal".
 * @param operator - Operator name in TAP diagnostics. Default: "deepdeepequal".
 */
export declare function deepdeepequal(
  actual: unknown,
  expected: unknown,
  message?: string,
  operator?: string
): AssertionResult;

/**
 * An assertion that always passes. Useful as a placeholder or to mark a
 * point in a test as reached.
 * @param message - Reported message. Default: "should always pass".
 */
export declare function pass(message?: string): string;

/**
 * An assertion that always fails. Useful to mark unfinished tests or
 * unreachable branches.
 * @param message - Reported message. Default: "should always fail".
 */
export declare function fail(message?: string): TestError;

/**
 * Assert that a nested test passes: runs the given test and fails if ANY
 * of its results is a TestError. An empty subtest passes vacuously. The
 * subtest's own results are consumed silently — they do not appear in TAP
 * output.
 * @param actual - The subtest.
 * @param message - Reported on pass or fail. Default: "should pass all subtests".
 * @param operator - Operator name in TAP diagnostics. Default: "subtestpass".
 */
export declare function subtestpass(
  actual: SubtestFunction,
  message?: string,
  operator?: string
): Promise<AssertionResult>;

/**
 * Assert that a nested test fails completely: passes only when EVERY
 * assertion in the subtest fails (an empty subtest passes vacuously). The
 * subtest's own results are consumed silently — they do not appear in TAP
 * output.
 * @param actual - The subtest.
 * @param message - Reported on pass or fail. Default: "should fail all subtests".
 * @param operator - Operator name in TAP diagnostics. Default: "subtestfail".
 */
export declare function subtestfail(
  actual: SubtestFunction,
  message?: string,
  operator?: string
): Promise<AssertionResult>;

/**
 * Assert that calling a function throws (or rejects — the call is awaited,
 * so async functions work too).
 * @param actual - Function invoked with no arguments.
 * @param message - Reported on pass or fail. Default: "should throw error".
 * @param operator - Operator name in TAP diagnostics. Default: "throws".
 */
export declare function throws(
  actual: () => unknown,
  message?: string,
  operator?: string
): Promise<AssertionResult>;

/**
 * Assert that calling a function does not throw (or reject — the call is
 * awaited, so async functions work too).
 * @param actual - Function invoked with no arguments.
 * @param message - Reported on pass or fail. Default: "should not throw error".
 * @param operator - Operator name in TAP diagnostics. Default: "doesnotthrow".
 */
export declare function doesnotthrow(
  actual: () => unknown,
  message?: string,
  operator?: string
): Promise<AssertionResult>;
