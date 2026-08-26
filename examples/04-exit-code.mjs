// Exit codes: a failing test file exits 1, so CI actually notices.
//
// Run: node examples/04-exit-code.mjs
//
// Versions before pop-quiz 1.0.1 exited 0 even when assertions failed —
// a silent false-green in CI. Since then, `print` sets
// `process.exitCode = 1` when any assertion fails. This example runs a
// deliberately failing test in a CHILD process and asserts on the child's
// exit code, so the example itself still passes (exits 0).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import tester, { equal, ok } from "../index.mjs";

const indexPath = fileURLToPath(new URL("../index.mjs", import.meta.url));

const runChild = (body) =>
  spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import tester, { ok, fail } from ${JSON.stringify(indexPath)};
       await tester("child", function* () { ${body} });`,
    ],
    { encoding: "utf8" }
  );

const failing = runChild(`yield ok(true); yield fail("deliberate failure");`);
const passing = runChild(`yield ok(true);`);

const allPassed = await tester("exit codes", function* () {
  yield equal(
    failing.status,
    1,
    "a test file with a failing assertion exits 1"
  );
  yield ok(
    failing.stdout.includes("not ok 2 - deliberate failure"),
    "the failure appears as a `not ok` line in the child's TAP output"
  );
  yield ok(
    failing.stdout.includes("# fail  1"),
    "the child's summary counts the failure"
  );
  yield equal(passing.status, 0, "an all-passing test file exits 0");
});

console.log(`# allPassed: ${allPassed}`);
if (!allPassed) process.exit(1);
