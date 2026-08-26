export const DefaultMessage = "should always pass";
/**
 * An assertion that always passes. Useful as a placeholder or to mark a
 * point in a test as reached.
 * @param {string} [message="should always pass"] - Reported message.
 * @returns {string} Always `message`.
 */
export default (message = DefaultMessage) => {
  return message;
};
