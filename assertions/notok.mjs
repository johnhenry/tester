import TestError from "../testerror.mjs";
export const DefaultMessage = "should be falsy";
/**
 * Assert that a value is falsy.
 * @param {*} actual - Value under test.
 * @param {string} [message="should be falsy"] - Reported on pass or fail.
 * @param {string} [operator="notok"] - Operator name in TAP diagnostics.
 * @returns {string|TestError} `message` on pass; a TestError on failure.
 */
export default (actual, message = DefaultMessage, operator = "notok") => {
  if (!actual) {
    return message;
  }
  return new TestError(message, { actual, operator });
};
