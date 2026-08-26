/**
 * The failure value returned (not thrown) by assertions.
 *
 * A test result is a failure exactly when it is `instanceof TestError`;
 * anything else (normally a string message) counts as a pass. The `val`
 * object's key-value pairs become the indented diagnostic block under a
 * `not ok` line in TAP output (conventionally `actual`, `expected`, and
 * `operator`).
 */
export default class extends Error {
  /**
   * @param {string} message - The expected-behavior message, e.g. "should be truthy".
   * @param {Object} [val={}] - Diagnostic key-value pairs shown in TAP output.
   */
  constructor(message, val = {}) {
    super(message);
    this.val = val;
  }
  /**
   * Iterates `[key, value]` pairs of the diagnostic object, so a TestError
   * can be consumed with `for...of` when rendering TAP diagnostics.
   * @returns {Iterator<[string, *]>}
   */
  [Symbol.iterator]() {
    return Object.entries(this.val).values();
  }
}
