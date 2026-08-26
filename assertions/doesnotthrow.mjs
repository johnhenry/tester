import TestError from "../testerror.mjs";
export const DefaultMessage = "should not throw error";
/**
 * Assert that calling a function does not throw (or reject — the call is
 * awaited, so async functions work too).
 * @param {Function} actual - Function invoked with no arguments.
 * @param {string} [message="should not throw error"] - Reported on pass or fail.
 * @param {string} [operator="doesnotthrow"] - Operator name in TAP diagnostics.
 * @returns {Promise<string|TestError>} `message` if it returned normally; a TestError if it threw.
 */
export default async (
  actual,
  message = DefaultMessage,
  operator = "doesnotthrow"
) => {
  try {
    await actual();
    return message;
  } catch {
    return new TestError(message, { actual, operator });
  }
};
