import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Unknown } from '../../../patterns/unknown';

export class UnknownConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is an unknown.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is unknown, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === 20;
  }

  /**
   * Converts unknown definition.
   * @param reflectedType - Reflected type.
   * @returns Returns `Unknown` pattern instance.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): Unknown {
    return this.reflect(reflectedType);
  }

  /**
   * Reflects unknown definition.
   * @returns Returns `Unknown` pattern instance.
   */
  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Unknown {
    return reflectedType ? new Unknown() : new Unknown();
  }
}
