/**
 * Infinite generator of unique values of a given kind, each prefixed with
 * `prefix`. `kind` selects the value type; anything other than `"symbol"`,
 * `"string"`, or `"bigint"` (including the default) falls through to
 * numbers.
 */
export declare function unique(
  kind: "symbol",
  prefix?: string
): Generator<symbol, void, unknown>;
export declare function unique(
  kind: "string",
  prefix?: string
): Generator<string, void, unknown>;
export declare function unique(
  kind: "bigint",
  prefix?: string
): Generator<bigint, void, unknown>;
export declare function unique(
  kind?: "number",
  prefix?: string
): Generator<number, void, unknown>;

export default unique;
