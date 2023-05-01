import assert from "assert/strict";
// @ts-ignore
import test, { describe } from "node:test";
import { Result, wrap, wrapAsync } from "./result";

describe("result type", () => {
  test("use result type in a function with success", () => {
    function identity<T>(arg: T): Result<T> {
      return {
        ok: true,
        value: arg,
      };
    }

    const result = identity("test");
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, "test");
  });

  test("use result type in a function with failure", () => {
    function identity<T>(arg: T): Result<T> {
      return {
        ok: false,
        error: new Error("oops"),
      };
    }

    const result = identity("test");
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.message, "oops");
  });
});

describe("wrap", () => {
  test("with success", () => {
    const result = wrap(JSON.stringify)({ test: "value " });
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, '{"test":"value "}');
  });

  test("with error", () => {
    const result = wrap(JSON.parse)("nonsense");
    assert.strictEqual(result.ok, false);
    assert.strictEqual(
      result.error.message,
      `Unexpected token \'o\', "nonsense" is not valid JSON`
    );
  });
});

describe("wrapAsync", () => {
  async function asyncIdentityResolve<V>(arg: V): Promise<V> {
    return arg;
  }

  async function asyncIdentityReject<V>(arg: V): Promise<V> {
    throw new Error("oops");
  }

  test("with success", async () => {
    const result = await wrapAsync(asyncIdentityResolve)("test");
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, "test");
  });

  test("with error", async () => {
    const result = await wrapAsync(asyncIdentityReject)("test");
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.message, "oops");
  });
});
