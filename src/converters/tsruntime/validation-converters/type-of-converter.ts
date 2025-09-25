import { get } from 'lodash';
import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Class } from '../../../patterns/class';
import {
  VALIDATION_TYPE_KEY,
  VALIDATION_PAYLOAD_KEY,
  KINDS,
} from '../../../constants/literal-keys';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';

export class TypeOfConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type uses utility type `$TypeOf`.
   * @param reflectedType - Reflected type.
   * @param converter - Instance of converter.
   * @returns Returns `true` if reflected type is a utility type `$TypeOf` and has valid class type payload, else `false`.
   */
  isConvertible(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): boolean {
    if (reflectedType.kind !== 15) {
      return false;
    }
    const validationType = get(
      reflectedType,
      `properties.${VALIDATION_TYPE_KEY.toString()}`
    );
    const validationPayload = get(
      reflectedType,
      `properties.${VALIDATION_PAYLOAD_KEY.toString()}`
    );

    const classConverter = converter.getConverter(
      TypeKind.Class
    ) as types.TypeConverter;
    return (
      validationType?.value === KINDS.TYPE_OF &&
      classConverter.isConvertible(validationPayload, converter)
    );
  }

  /**
   * Converts reflected utility type to type of class.
   * @param reflectedType - Reflected type.
   * @param converter - Instance of converter.
   * @returns Returns converted class type as instance of `Class` pattern.
   */
  convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Class {
    const nestedReflectedType = get(
      reflectedType,
      `properties.${VALIDATION_PAYLOAD_KEY.toString()}`
    );

    const classConverter = converter.getConverter(
      TypeKind.Class
    ) as types.TypeConverter;
    const classType: Class = classConverter.convert(
      nestedReflectedType,
      converter
    ) as Class;
    return classType;
  }

  /**
   * Reflects utility type to properties of class.
   * @param reflectedType - Reflected type.
   * @param converter - Instance of converter.
   * @returns Returns reflected class properties as instance of an `Object` pattern.
   */
  reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Record<keyof any, any> {
    const nestedReflectedType = get(
      reflectedType,
      `properties.${VALIDATION_PAYLOAD_KEY.toString()}`
    );

    const classConverter = converter.getConverter(
      TypeKind.Class
    ) as types.TypeConverter;
    return classConverter.reflect(nestedReflectedType, converter);
  }
}
