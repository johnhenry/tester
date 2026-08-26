import TestError from "../testerror.mjs";
export const DefaultMessage = "should always fail";
/**
 * An assertion that always fails. Useful to mark unfinished tests or
 * unreachable branches.
 * @param {string} [message="should always fail"] - Reported message.
 * @returns {TestError} Always a TestError.
 */
export default (message = DefaultMessage) => {
  return new TestError(message, {
    actual: undefined,
    expected: undefined,
    message,
    operator: "fail",
  });
};
