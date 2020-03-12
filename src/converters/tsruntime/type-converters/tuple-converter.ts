import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Tuple } from '../../../patterns/tuple';
import { InstanceOf } from '../../../patterns/instance-of';
import { KINDS } from '../../../constants/literal-keys';

export class TupleConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is a tuple.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is tuple, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === 16;
  }

  /**
   * Converts tuple.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns converted tuple as an instance of `Tuple` pattern.
   */
  public convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Tuple {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.TupleType)
      .elementTypes) {
      // If tuple contains a value, that is a class type - point to the
      // type constructor without converting the type.
      const classConverter = converter.getConverter(
        KINDS.CLASS
      ) as types.TypeConverter;

      if (classConverter?.isConvertible(arg)) {
        expectations.push(
          new InstanceOf((arg as tsruntimeTypes.ReferenceType).type)
        );
      } else {
        expectations.push(converter.convert(arg));
      }
    }
    const pattern = new Tuple(...expectations);
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  /**
   * Reflects tuple.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns reflected tuple as an `Array`.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): any[] {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.TupleType)
      .elementTypes) {
      // If tuple contains a value, that is a class type - point to the
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
