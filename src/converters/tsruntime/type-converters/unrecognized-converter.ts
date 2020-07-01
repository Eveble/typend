import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Unrecognized } from '../../../patterns/unrecognized';

export class UnrecognizedConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is an unrecognized.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is unrecognized, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return [999].includes(reflectedType.kind);
  }

  /**
   * Converts unrecognized definition.
   * @param reflectedType - Reflected type.
   * @returns Returns `Unrecognized` pattern instance.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): Unrecognized {
    return this.reflect(reflectedType);
  }

  /**
   * Reflects unrecognized definition.
   * @returns Returns `Unrecognized` pattern instance.
   */
  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Unrecognized {
    return reflectedType ? new Unrecognized() : new Unrecognized();
  }
}
