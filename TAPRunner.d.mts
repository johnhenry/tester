import type TestError from "./testerror.mjs";

/** The value yielded by an assertion: a message on pass, a TestError on fail. */
export type AssertionResult = string | TestError;

/** `plan(n)` declares the expected assertion count (call at most once). */
export type PlanFunction = (n: number) => void;

/** A test body: a (possibly async) generator function yielding assertion results. */
export type TestFunction = (
  plan: PlanFunction
) =>
  | Generator<AssertionResult, void, unknown>
  | AsyncGenerator<AssertionResult, void, unknown>;

/**
 * Escape text so it's safe to interpolate into a single TAP result/comment
 * line: escapes backslashes, `#`, and embedded newlines.
 * @param text - Value to escape (coerced to a string).
 */
export declare function escapeTapText(text: unknown): string;

/**
 * Format a TAP plan line, e.g. `1..20`.
 * @param num - Number of assertions.
 */
export declare function TAPResultRange(num: number): string;

/**
 * Format a title as a TAP comment line, e.g. `# my title`.
 * @param title
 */
export declare function TAPResultTitle(title: string): string;

/**
 * Format a failing result as a `not ok N - message` line followed by an
 * indented diagnostic block built from the TestError's key-value pairs.
 * @param output - The failing result.
 * @param index - 1-based assertion index.
 */
export declare function TAPResultFail(output: TestError, index: number): string;

/**
 * Format a passing result as an `ok N - message` line.
 * @param output - The passing result's message.
 * @param index - 1-based assertion index.
 */
export declare function TAPResultPass(output: string, index: number): string;

/**
 * Format the trailing `# tests / # pass / # fail` summary block.
 * @param tests - Total assertions run.
 * @param pass - Passing count.
 * @param fail - Failing count.
 */
export declare function TAPResultCounts(
  tests: number,
  pass: number,
  fail: number
): string;

/**
 * Execute a test and yield each result, optionally formatted.
 *
 * With only a `test` argument, yields raw results — the assertion's message
 * string on pass, or its TestError on failure — with no plan line, counts,
 * or other framing. The formatter arguments let a caller (like `print`)
 * turn the same stream into TAP text.
 * @param test - Yields assertion results.
 * @param title - Yielded first, verbatim, when non-empty.
 * @param resultPass - `(message, index) => output` for passes.
 * @param resultFail - `(testError, index) => output` for failures.
 * @param resultCounts - `(tests, pass, fail) => output`; falsy return is skipped.
 * @param resultRange - `(count) => output`; falsy return is skipped.
 */
export declare function run(
  test: TestFunction,
  title?: string,
  resultPass?: (message: string, index: number) => unknown,
  resultFail?: (testError: TestError, index: number) => unknown,
  resultCounts?: (tests: number, pass: number, fail: number) => unknown,
  resultRange?: (count: number) => unknown
): AsyncGenerator<unknown, void, unknown>;

/**
 * Run a test and log its results as TAP text.
 *
 * This is what the package's default export delegates to. Emits an optional
 * `TAP version 13` header, the title (verbatim), `ok`/`not ok` lines, the
 * `1..N` plan line, and the `# tests / # pass / # fail` summary.
 * @param test - Yields assertion results.
 * @param title - Printed before results when non-empty.
 * @param log - Sink for output lines. Default: `console.log`.
 * @param logError - Sink for unformatted TestErrors. Default: `console.error`.
 * @param logVersion - Print the `TAP version 13` header. Default: `true`.
 * @returns `true` when no assertion failed.
 */
export declare function print(
  test: TestFunction,
  title?: string,
  log?: (...args: unknown[]) => void,
  logError?: (...args: unknown[]) => void,
  logVersion?: boolean
): Promise<boolean>;
