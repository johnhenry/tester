// Regression fixture for https://github.com/johnhenry/tester/issues/12:
// `@johnhenry/tester` shipped no `.d.ts` for any subpath, so every import
// below needed `@ts-expect-error`. This file imports from the package by
// its published name (self-reference, resolved via package.json `exports`)
// and exercises real signatures from each subpath. It is typechecked by
// `npm run typecheck` and is not run — it only needs to compile.

import tester, {
  ok,
  notok,
  equal,
  deepdeepequal,
  pass,
  fail,
  throws,
  subtestpass,
} from "@johnhenry/tester";
import { run, print, escapeTapText } from "@johnhenry/tester/TAPRunner";
import { unique } from "@johnhenry/tester/unique";
import TestError from "@johnhenry/tester/testerror";

// Default export: `tester(title, test)` and `tester(test)` (no title).
async function runSuite(): Promise<boolean> {
  return tester("typecheck fixture", function* () {
    yield ok(true, "ok should accept a value and message");
    yield notok(false, "notok should accept a value and message");
    yield equal(1, 1, "equal should accept two values and a message");
    yield deepdeepequal(
      { a: 1 },
      { a: 1 },
      "deepdeepequal should accept two values and a message"
    );
    yield pass("pass should accept an optional message");
    yield fail("fail should accept an optional message");
  });
}

async function runSuiteNoTitle(): Promise<boolean> {
  return tester(function* () {
    yield pass();
  });
}

// Async assertions (`throws`, `subtestpass`) resolve to `string | TestError`.
async function runAsyncAssertions(): Promise<void> {
  const thrown: string | TestError = await throws(() => {
    throw new Error("boom");
  }, "throws should accept a thunk and message");

  const subtest: string | TestError = await subtestpass(function* () {
    yield pass();
  }, "subtestpass should accept a subtest generator");

  if (thrown instanceof TestError) {
    for (const [key, value] of thrown) {
      void key;
      void value;
    }
  }
  void subtest;
}

// `TAPRunner`'s `print`/`run`/`escapeTapText`.
async function runTAPRunner(): Promise<void> {
  const passed: boolean = await print(function* (plan) {
    plan(1);
    yield pass("print should run and resolve to a boolean");
  }, "TAPRunner.print fixture");
  void passed;

  for await (const line of run(function* () {
    yield pass("run should yield raw results");
  })) {
    void line;
  }

  const escaped: string = escapeTapText("# not a directive");
  void escaped;
}

// `unique()` yields values of the requested kind.
function runUnique(): void {
  const numbers = unique();
  const firstNumber: number = numbers.next().value as number;
  void firstNumber;

  const strings = unique("string", "prefix");
  const firstString: string = strings.next().value as string;
  void firstString;
}

// `TestError`: constructible, subclasses `Error`, iterable over its
// diagnostic key-value pairs.
function runTestError(): void {
  const error = new TestError("should be truthy", { actual: false });
  const message: string = error.message;
  const val: Record<string, unknown> = error.val;
  void message;
  void val;
}

void runSuite;
void runSuiteNoTitle;
void runAsyncAssertions;
void runTAPRunner;
void runUnique;
void runTestError;
