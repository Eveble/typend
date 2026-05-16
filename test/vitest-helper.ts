import { vi, expect } from 'vitest';
import { isDeepStrictEqual } from 'util';

const IGNORED_SYMBOLS = new Set([
  Symbol.iterator,
  Symbol.asyncIterator,
  Symbol.toPrimitive,
  Symbol.toStringTag,
  Symbol.hasInstance,
  Symbol.isConcatSpreadable,
]);

function argsMatch(pattern: any[], callArgs: any[]): boolean {
  if (pattern.length > callArgs.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (!isDeepStrictEqual(pattern[i], callArgs[i])) return false;
  }
  return true;
}

/**
 * Creates a stub function compatible with sinon's stub API, backed by vi.fn().
 * Supports withArgs().returns() and withArgs().throws() patterns.
 * withArgs uses prefix matching (matching args must be a prefix of call args).
 */
export function stubFn<T extends (...args: any[]) => any = any>(): any {
  type Behavior = { args: any[]; value?: any; error?: any };
  const behaviors: Behavior[] = [];
  let defaultReturn: any;

  const fn: any = vi.fn<T>((...callArgs: any[]) => {
    for (const behavior of behaviors) {
      if (argsMatch(behavior.args, callArgs)) {
        if (behavior.error !== undefined) throw behavior.error;
        return behavior.value;
      }
    }
    return defaultReturn;
  });

  fn.returns = (val: any) => {
    defaultReturn = val;
    return fn;
  };

  fn.withArgs = (...args: any[]) => {
    const behavior: Behavior = { args };
    behaviors.push(behavior);
    return {
      returns: (val: any) => {
        behavior.value = val;
        return fn;
      },
      throws: (err: any) => {
        behavior.error = err;
        return fn;
      },
    };
  };

  return fn;
}

/**
 * Creates a stub interface object (replacement for ts-sinon's stubInterface).
 * Any property access returns a vitest fn with sinon-compatible API.
 * Skips well-known symbols like Symbol.iterator to avoid breaking deep equality checks.
 */
export function stubInterface<T>(): T {
  return new Proxy({} as any, {
    get(target: any, prop: string | symbol) {
      if (typeof prop === 'symbol' && IGNORED_SYMBOLS.has(prop)) {
        return undefined;
      }
      if (!target[prop]) {
        target[prop] = stubFn();
      }
      return target[prop];
    },
  });
}

export { expect };
