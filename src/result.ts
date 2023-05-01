export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function wrap<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Result<ReturnType<T>> {
  return function (...args: Parameters<T>): Result<ReturnType<T>> {
    try {
      const value = fn(...args);
      return {
        ok: true,
        value,
      };
    } catch (error) {
      return {
        ok: false,
        error: error as Error,
      };
    }
  };
}

export function wrapAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<Result<ReturnType<T>>> {
  return async function (
    ...args: Parameters<T>
  ): Promise<Result<ReturnType<T>>> {
    try {
      const value = await fn(...args);
      return {
        ok: true,
        value,
      };
    } catch (error) {
      return {
        ok: false,
        error: error as Error,
      };
    }
  };
}
