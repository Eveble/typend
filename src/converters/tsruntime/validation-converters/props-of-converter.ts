import { get } from 'lodash';
import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Collection } from '../../../patterns/collection';
import { Class } from '../../../patterns/class';
import {
  VALIDATION_TYPE_KEY,
  VALIDATION_PAYLOAD_KEY,
  KINDS,
} from '../../../constants/literal-keys';
import { TypeKind } from '../../../enums/type-kind.enum';

export class PropsOfConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type uses utility type `$PropsOf`.
   * @param reflectedType - Reflected type.
   * @param converter - Instance of converter.
   * @returns Returns `true` if reflected type is a utility type `$PropsOf` and has valid class type payload, else `false`.
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
    if (validationType?.value !== KINDS.PROPERTIES_OF) {
      return false;
    }

    const validationPayload = get(
      reflectedType,
      `properties.${VALIDATION_PAYLOAD_KEY.toString()}`
    );
    const classConverter = converter.getConverter(
      TypeKind.Class
    ) as types.TypeConverter;
    return classConverter.isConvertible(validationPayload, converter);
  }

  /**
   * Converts reflected utility type to properties of class.
   * @param reflectedType - Reflected type.
   * @param converter - Instance of converter.
   * @returns Returns converted class properties as instance of `Collection` pattern.
   */
  convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Collection {
    const nestedReflectedType = get(
      reflectedType,
      `properties.${VALIDATION_PAYLOAD_KEY.toString()}`
    );

    const classConverter = converter.getConverter(
      TypeKind.Class
    ) as types.TypeConverter;
    const classType: Class | undefined = classConverter.convert(
      nestedReflectedType,
      converter
    ) as Class;
    const properties = classType !== undefined ? classType.properties : {};
    return new Collection({ ...properties });
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
