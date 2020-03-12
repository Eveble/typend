import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Any } from '../../../patterns/any';
import { Void } from '../../../patterns/void';
import { Never } from '../../../patterns/never';

export class NativeConverter implements types.TypeConverter {
  static MAPPINGS: Record<number, any> = {
    1: new Any(), // any
    11: new Void(), // void
    14: new Never(), // never
  };

  /**
   * Evaluates if provided reflected type is a native type.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is a native type, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return [1, 11, 14].includes(reflectedType.kind);
  }

  /**
   * Converts type to native type for validation.
   * @param reflectedType - Reflected type.
   * @returns Returns converted reflected type as instance of pattern `Any` for `any` | `Void` for `void` | `Never` for `never`.
   */
  public convert(
    reflectedType: tsruntimeTypes.ReflectedType
  ): Any | Void | Never {
    return this.reflect(reflectedType);
  }

  /**
   * Reflects type to Pattern based equivalent of native type.
   * @param reflectedType - Reflected type.
   * @returns Returns reflected type as instance of pattern `Any` for `any` | `Void` for `void` | `Never` for `never`.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType
  ): Any | Void | Never {
    return NativeConverter.MAPPINGS[reflectedType.kind];
  }
}
