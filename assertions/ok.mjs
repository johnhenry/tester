import TestError from "../testerror.mjs";
export const DefaultMessage = "should be truthy";
/**
 * Assert that a value is truthy.
 * @param {*} actual - Value under test.
 * @param {string} [message="should be truthy"] - Reported on pass or fail.
 * @param {string} [operator="ok"] - Operator name in TAP diagnostics.
 * @returns {string|TestError} `message` on pass; a TestError on failure.
 */
export default (actual, message = DefaultMessage, operator = "ok") => {
  if (actual) {
    return message;
  }
  return new TestError(message, { actual, operator });
};
