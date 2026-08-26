import TestError from "../testerror.mjs";
import { run } from "../TAPRunner.mjs";

export const DefaultMessage = "should fail all subtests";
/**
 * Assert that a nested test fails completely: runs the given test and
 * fails if ANY of its results passes — i.e. it passes only when EVERY
 * assertion in the subtest fails (an empty subtest passes vacuously).
 * The subtest's own results are consumed silently — they do not appear in
 * TAP output.
 * @param {GeneratorFunction|AsyncGeneratorFunction} actual - The subtest.
 * @param {string} [message="should fail all subtests"] - Reported on pass or fail.
 * @param {string} [operator="subtestfail"] - Operator name in TAP diagnostics.
 * @returns {Promise<string|TestError>} `message` if every subtest assertion failed.
 */
export default async (
  actual,
  message = DefaultMessage,
  operator = "subtestfail"
) => {
  for await (const result of run(actual)) {
    if (!(result instanceof TestError)) {
      return new TestError(message, { actual, operator });
    }
  }
  return message;
};
