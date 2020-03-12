import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { List } from '../../../patterns/list';
import { KINDS } from '../../../constants/literal-keys';
import { InstanceOf } from '../../../patterns/instance-of';

export class ArrayConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is an reference to array.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is an reference to an array, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return (
      reflectedType.kind === 18 &&
      (reflectedType as tsruntimeTypes.ReferenceType).type === Array
    );
  }

  /**
   * Converts reflected type to array.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns converted reflected type as array wrapped in `List` pattern.
   */
  public convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): List {
    const expectations: any[] = [];
    for (const argument of (reflectedType as tsruntimeTypes.ReferenceType)
      .arguments) {
      // If array contains a value, that is a class type - point to the
      // type constructor without converting the type.
      const classConverter = converter.getConverter(
        KINDS.CLASS
      ) as types.TypeConverter;
      if (classConverter?.isConvertible(argument)) {
        expectations.push(
          new InstanceOf((argument as tsruntimeTypes.ReferenceType).type)
        );
      } else {
        expectations.push(converter.convert(argument));
      }
    }

    const pattern = new List(...expectations);
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  /**
   * Reflects array type.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns reflected type as an `Array`.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): any[] {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.ReferenceType)
      .arguments) {
      // If array contains a value, that is a class type - point to the
      // type constructor without converting the type.
      const classConverter = converter.getConverter(
        KINDS.CLASS
      ) as types.TypeConverter;

      if (classConverter?.isConvertible(arg)) {
        expectations.push((arg as tsruntimeTypes.ReferenceType).type);
      } else {
        expectations.push(converter.reflect(arg));
      }
    }
    return expectations;
  }
}
