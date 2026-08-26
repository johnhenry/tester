import TestError from "../testerror.mjs";
export const DefaultMessage = "should be strictly equal";
/**
 * Assert strict (`===`) equality. Two different objects with identical
 * contents are NOT equal here — use `deepequal`/`deepdeepequal` for that.
 * Note `NaN === NaN` is false, so two NaNs fail this assertion.
 * @param {*} actual - Value under test.
 * @param {*} expected - Value it must strictly equal.
 * @param {string} [message="should be strictly equal"] - Reported on pass or fail.
 * @param {string} [operator="equal"] - Operator name in TAP diagnostics.
 * @returns {string|TestError} `message` on pass; a TestError on failure.
 */
export default (
  actual,
  expected,
  message = DefaultMessage,
  operator = "equal"
) => {
  if (actual === expected) {
    return message;
  }
  return new TestError(message, { actual, expected, message, operator });
};
