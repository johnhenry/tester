import TestError from "../testerror.mjs";
export const DefaultMessage = "should be strictly not equal";
/**
 * Assert strict (`!==`) inequality.
 * @param {*} actual - Value under test.
 * @param {*} unexpected - Value it must not strictly equal.
 * @param {string} [message="should be strictly not equal"] - Reported on pass or fail.
 * @param {string} [operator="notequal"] - Operator name in TAP diagnostics.
 * @returns {string|TestError} `message` on pass; a TestError on failure.
 */
export default (
  actual,
  unexpected,
  message = DefaultMessage,
  operator = "notequal"
) => {
  if (actual !== unexpected) {
    return message;
  }
  return new TestError(message, { actual, unexpected, message, operator });
};
