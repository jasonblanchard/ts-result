export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function wrap<T extends (...args: any[]) => any>(
  fn: T
): Result<ReturnType<T>> {
  try {
    const value = fn();
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
}

export async function wrapAsync<T>(promise: Promise<T>): Promise<Result<T>> {
  return promise
    .then((value) => {
      return {
        ok: true as true,
        value,
      };
    })
    .catch((error: Error) => {
      return {
        ok: false as false,
        error: error,
      };
    });
}
