import TestError from "../testerror.mjs";
import { run } from "../TAPRunner.mjs";

export const DefaultMessage = "should pass all subtests";
/**
 * Assert that a nested test passes: runs the given test (a generator
 * function of assertion results, like any other test) and fails if ANY of
 * its results is a TestError. An empty subtest passes vacuously. The
 * subtest's own results are consumed silently — they do not appear in TAP
 * output.
 * @param {GeneratorFunction|AsyncGeneratorFunction} actual - The subtest.
 * @param {string} [message="should pass all subtests"] - Reported on pass or fail.
 * @param {string} [operator="subtestpass"] - Operator name in TAP diagnostics.
 * @returns {Promise<string|TestError>} `message` if every subtest assertion passed.
 */
export default async (
  actual,
  message = DefaultMessage,
  operator = "subtestpass"
) => {
  for await (const result of run(actual)) {
    if (result instanceof TestError) {
      return new TestError(message, { actual, operator });
    }
  }
  return message;
};
