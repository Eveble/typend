import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Optional } from '../../../patterns/optional';
import { OneOf } from '../../../patterns/one-of';
import { KINDS } from '../../../constants/literal-keys';
import { InstanceOf } from '../../../patterns/instance-of';

export class UnionConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is an union.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is an union, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === 17;
  }

  /**
   * Converts union.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns converted union as an instance of `OneOf` pattern or instance of `Optional` pattern(for class properties defined with question mark symbol or matching pattern`[undefined, any]`).
   */
  public convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Optional | OneOf {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.UnionType).types) {
      // If union contains a value that is a class type - point to the
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

    let pattern;
    if (expectations.length === 2 && expectations.includes(undefined)) {
      const expectation =
        expectations[0] !== undefined ? expectations[0] : expectations[1];
      pattern = new Optional(expectation);
    } else {
      pattern = new OneOf(...expectations);
    }
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  /**
   * Reflects union.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns reflected union as an `Array`.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): any[] {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.UnionType).types) {
      // If union contains a value, that is a class type - point to the
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
    return expectations.sort();
  }
}
