import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';

export class NilConverter implements types.TypeConverter {
  static MAPPINGS: Record<number, any> = {
    12: undefined,
    13: null,
  };

  /**
   * Evaluates if provided reflected type is nil.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is nil, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return [12, 13].includes(reflectedType.kind);
  }

  /**
   * Converts reflected type to nil for validation.
   * @param reflectedType - Reflected type.
   * @returns Returns converted reflected type as `null` or `undefined`.
   */
  public convert(
    reflectedType: tsruntimeTypes.ReflectedType
  ): null | undefined {
    return this.reflect(reflectedType);
  }

  /**
   * Reflects type to nil.
   * @param reflectedType - Reflected type.
   * @returns Returns reflected type as `null` or `undefined`.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType
  ): null | undefined {
    return NilConverter.MAPPINGS[reflectedType.kind];
  }
}
