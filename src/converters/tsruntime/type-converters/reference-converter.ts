import { Types as tsruntimeTypes } from 'tsruntime';
import { isPlainObject } from 'lodash';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';
import { KINDS } from '../../../constants/literal-keys';
import { isPatternClass } from '../../../helpers';
import { Collection } from '../../../patterns/collection';

export class ReferenceConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is referenced(examples: reference to Class, constructor Function(RegExp))
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if type is referenced, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === 18;
  }

  /**
   * Converts reflected type reference.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns converted reflected type reference as the referenced value, constructor function wrapped in `InstanceOf` pattern, array wrapped in `List` pattern.
   */
  public convert(
    reflectedType: tsruntimeTypes.ReferenceType,
    converter: types.Converter
  ): any {
    if (isPlainObject(reflectedType.type)) {
      return new Collection(reflectedType.type);
    }

    if (reflectedType.type === Array && reflectedType.arguments) {
      const arrayConverter = converter.getConverter(
        KINDS.ARRAY
      ) as types.TypeConverter;
      return arrayConverter.convert(reflectedType);
    }

    let pattern: any;
    if (isPatternClass(reflectedType.type)) {
      pattern = reflectedType.type;
    } else {
      pattern = new InstanceOf(reflectedType.type);
    }

    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  /**
   * Reflects reference type.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns reflected reference type as any referenced value.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReferenceType,
    converter: types.Converter
  ): any {
    if (isPlainObject(reflectedType.type)) {
      return reflectedType.type;
    }

    if (reflectedType.type === Array && reflectedType.arguments) {
      const arrayConverter = converter.getConverter(
        KINDS.ARRAY
      ) as types.TypeConverter;
      return arrayConverter.reflect(reflectedType);
    }
    return reflectedType.type;
  }
}
