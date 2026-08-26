const TAP_VERSION = 13;
import TestError from "./testerror.mjs";

/**
 * Format a TAP plan line, e.g. `1..20`.
 * @param {number} num - Number of assertions.
 * @returns {string}
 */
export const TAPResultRange = function (num) {
  return `1..${num}`;
};

/**
 * Format a title as a TAP comment line, e.g. `# my title`.
 * (Available for custom runners; `print` emits titles unprefixed.)
 * @param {string} title
 * @returns {string}
 */
export const TAPResultTitle = function (title) {
  return `# ${title}`;
};
/**
 * Format a failing result as a `not ok N - message` line followed by an
 * indented diagnostic block built from the TestError's key-value pairs.
 * @param {import("./testerror.mjs").default} output - The failing result.
 * @param {number} index - 1-based assertion index.
 * @returns {string}
 */
export const TAPResultFail = function (output, index) {
  const { message } = output;
  const result = [];
  result.push(`not ok ${index} - ${message}`);
  result.push(`  ---`);
  for (const [key, value] of output) {
    result.push(`    ${key}: ${value}`);
  }
  result.push(`  ...`);
  return result.join("\n");
};

/**
 * Format a passing result as an `ok N - message` line.
 * @param {string} output - The passing result's message.
 * @param {number} index - 1-based assertion index.
 * @returns {string}
 */
export const TAPResultPass = function (output, index) {
  return `ok ${index} - ${output}`;
};

/**
 * Format the trailing `# tests / # pass / # fail` summary block.
 * @param {number} tests - Total assertions run.
 * @param {number} pass - Passing count.
 * @param {number} fail - Failing count.
 * @returns {string}
 */
export const TAPResultCounts = function (tests, pass, fail) {
  const result = [];
  result.push(`# tests ${tests}`);
  result.push(`# pass  ${pass}`);
  result.push(`# fail  ${fail}`);
  return result.join("\n");
};

const empty = () => {};
const identity = (x) => x;
/**
 * Execute a test and yield each result, optionally formatted.
 *
 * With only a `test` argument, yields raw results — the assertion's message
 * string on pass, or its TestError on failure — with no plan line, counts,
 * or other framing. The formatter arguments let a caller (like `print`)
 * turn the same stream into TAP text.
 *
 * The test generator receives `plan(n)`: calling it (at most once) declares
 * the expected assertion count, which is emitted via `resultRange` before
 * the first result; if `plan` is never called the range is emitted after
 * the final result instead, using the actual count.
 *
 * @param {GeneratorFunction|AsyncGeneratorFunction} test - Yields assertion results.
 * @param {string} [title=""] - Yielded first, verbatim, when non-empty.
 * @param {Function} [resultPass] - `(message, index) => output` for passes.
 * @param {Function} [resultFail] - `(testError, index) => output` for failures.
 * @param {Function} [resultCounts] - `(tests, pass, fail) => output`; falsy return is skipped.
 * @param {Function} [resultRange] - `(count) => output`; falsy return is skipped.
 * @yields {*} Title, formatted results, and any range/counts output, in order.
 */
export const run = async function* (
  test,
  title = "",
  resultPass = identity,
  resultFail = identity,
  resultCounts = empty,
  resultRange = empty
) {
  if (title) {
    yield title;
  }
  let index = 1;
  let planCalled = false;
  let indexPrinted = false;
  let num;
  let started;
  const plan = (number) => {
    if (planCalled) {
      throw new Error("do not call plan more than once");
    }
    planCalled = true;
    num = number;
  };
  let tests = 0;
  let pass = 0;
  let fail = 0;
  for await (const output of test(plan)) {
    if (planCalled && !started) {
      let range;
      if (num === undefined) {
        range = resultRange(index - 1);
      } else {
        range = resultRange(num);
      }
      if (range) {
        yield range;
      }
      indexPrinted = true;
    }
    if (output instanceof TestError) {
      yield resultFail(output, index);
      fail++;
    } else {
      yield resultPass(output, index);
      pass++;
    }
    index++;
    tests++;
    started = true;
  }
  if (!indexPrinted) {
    const range = resultRange(index - 1);
    if (range) {
      yield range;
    }
  }
  const counts = resultCounts(tests, pass, fail);
  if (counts) {
    yield counts;
  }
};

/**
 * Run a test and log its results as TAP text.
 *
 * This is what the package's default export delegates to. Emits an optional
 * `TAP version 13` header, the title (verbatim), `ok`/`not ok` lines, the
 * `1..N` plan line, and the `# tests / # pass / # fail` summary.
 *
 * @param {GeneratorFunction|AsyncGeneratorFunction} test - Yields assertion results.
 * @param {string} [title] - Printed before results when non-empty.
 * @param {Function} [log=console.log] - Sink for output lines.
 * @param {Function} [logError=console.error] - Sink for unformatted TestErrors.
 * @param {boolean} [logVersion=true] - Print the `TAP version 13` header.
 * @returns {Promise<boolean>} `true` when no assertion failed. On failure,
 *   sets `process.exitCode = 1` where `process` exists (see comment below).
 */
export const print = async function (
  test,
  title,
  log = console.log,
  logError = console.error,
  logVersion = true
) {
  if (logVersion) {
    log(`TAP version ${TAP_VERSION}`);
  }
  let failCount = 0;
  const captureCounts = (tests, pass, fail) => {
    failCount = fail;
    return TAPResultCounts(tests, pass, fail);
  };
  for await (const output of run(
    test,
    title,
    TAPResultPass,
    TAPResultFail,
    captureCounts,
    TAPResultRange
  )) {
    if (output instanceof TestError) {
      logError(output);
    } else {
      log(output);
    }
  }
  // Without this, a failing TAP run still exits 0 — CI (or any script
  // checking the exit code) would never notice a failure. `process` isn't
  // guaranteed to exist here (this module also runs in the browser), so
  // this only takes effect where it's available.
  if (failCount > 0 && typeof process !== "undefined") {
    process.exitCode = 1;
  }
  return failCount === 0;
};
