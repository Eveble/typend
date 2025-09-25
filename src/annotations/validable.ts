import 'reflect-metadata';
import { VALIDATION_KEY } from '../constants/metadata-keys';
import { types } from '../types';

/**
 * Flags class as supporting(true) or disabling(false) validation.
 * @param isValidable - Flag indicating if class supports validation.
 * @returns Class decorator function.
 */
export function Validable(isValidable = true): types.ClassDecorator {
  return <T>(target: T): T => {
    Reflect.defineMetadata(VALIDATION_KEY, isValidable, target as any);
    return target;
  };
}
