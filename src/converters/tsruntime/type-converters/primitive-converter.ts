import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';

export class PrimitiveConverter implements types.TypeConverter {
  static MAPPINGS: Record<number, any> = {
    2: String,
    3: Number,
    4: Boolean,
    10: Symbol,
  };

  /**
   * Evaluates if provided reflected type is a primitive type constructor.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is a primitive type constructor, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return [2, 3, 4, 10].includes(reflectedType.kind);
  }

  /**
   * Converts reflected type to primitive type constructor or value wrapped in pattern for validation.
   * @param reflectedType - Reflected type.
   * @returns Returns converted reflected type as primitive constructor wrapped in `InstanceOf` pattern.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    const pattern = new InstanceOf(this.reflect(reflectedType));
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  /**
   * Reflects type to primitive type constructor.
   * @param reflectedType - Reflected type.
   * @returns Returns primitive type constructor.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType
  ): string | number | boolean | symbol {
    return PrimitiveConverter.MAPPINGS[reflectedType.kind];
  }
}
