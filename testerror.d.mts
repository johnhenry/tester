/**
 * The failure value returned (not thrown) by assertions.
 *
 * A test result is a failure exactly when it is `instanceof TestError`;
 * anything else (normally a string message) counts as a pass. The `val`
 * object's key-value pairs become the indented diagnostic block under a
 * `not ok` line in TAP output (conventionally `actual`, `expected`, and
 * `operator`).
 */
export default class TestError extends Error {
  /**
   * @param message - The expected-behavior message, e.g. "should be truthy".
   * @param val - Diagnostic key-value pairs shown in TAP output.
   */
  constructor(message: string, val?: Record<string, unknown>);

  /** Diagnostic key-value pairs shown in TAP output. */
  val: Record<string, unknown>;

  /**
   * Iterates `[key, value]` pairs of the diagnostic object, so a TestError
   * can be consumed with `for...of` when rendering TAP diagnostics.
   */
  [Symbol.iterator](): IterableIterator<[string, unknown]>;
}
