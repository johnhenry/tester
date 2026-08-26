// deepdeepequal: Map/Set contents and circular references.
//
// Run: node examples/03-deepdeepequal.mjs
//
// Plain `deepequal` compares own enumerable string keys — which Map and
// Set don't have, so it silently sees two different-content Maps (or Sets)
// as equal, and it recurses forever on circular references.
// `deepdeepequal` handles both.
import tester, { ok, deepequal, deepdeepequal } from "../index.mjs";
import TestError from "../testerror.mjs";

const allPassed = await tester("deepdeepequal", function* () {
  const mapA = new Map([
    ["x", 1],
    ["y", 2],
  ]);
  const mapB = new Map([
    ["x", 1],
    ["y", 999], // different!
  ]);

  // The trap: deepequal can't see Map contents, so it calls these equal.
  yield ok(
    !(deepequal(mapA, mapB) instanceof TestError),
    "deepequal silently treats different-content Maps as equal (the trap)"
  );

  // deepdeepequal catches the difference.
  yield ok(
    deepdeepequal(mapA, mapB) instanceof TestError,
    "deepdeepequal catches differing Map content"
  );

  // Sets compare by deep membership, regardless of insertion order.
  yield deepdeepequal(
    new Set([{ id: 1 }, { id: 2 }]),
    new Set([{ id: 2 }, { id: 1 }]),
    "deepdeepequal matches Set content regardless of insertion order"
  );

  // Matching circular references are equal instead of a stack overflow.
  const circA = { name: "loop" };
  circA.self = circA;
  const circB = { name: "loop" };
  circB.self = circB;
  yield deepdeepequal(
    circA,
    circB,
    "deepdeepequal tolerates matching circular references"
  );
});

console.log(`# allPassed: ${allPassed}`);
if (!allPassed) process.exit(1);
