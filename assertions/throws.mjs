import TestError from "../testerror.mjs";
export const DefaultMessage = "should throw error";
/**
 * Assert that calling a function throws (or rejects — the call is awaited,
 * so async functions work too).
 * @param {Function} actual - Function invoked with no arguments.
 * @param {string} [message="should throw error"] - Reported on pass or fail.
 * @param {string} [operator="throws"] - Operator name in TAP diagnostics.
 * @returns {Promise<string|TestError>} `message` if it threw; a TestError if it did not.
 */
export default async (
  actual,
  message = DefaultMessage,
  operator = "throws"
) => {
  try {
    await actual();
  } catch {
    return message;
  }
  return new TestError(message, { actual, operator });
};
