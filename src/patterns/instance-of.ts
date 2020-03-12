import 'reflect-metadata';
import { isArray } from 'lodash';
import { isClass, isSinonClockDate, isConstructor } from '@eveble/helpers';
import { InvalidTypeError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { Pattern } from '../pattern';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

export class InstanceOf extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.INSTANCE_OF;

  /**
   * Ensures that provided expectations can be set on pattern.
   * @param type - Type that will be used to validate value.
   * @throws {InvalidTypeError}
   * Thrown if provided type is not nil, native type constructor or class.
   */
  onValidation(type): boolean {
    if (!this.isValid(type)) {
      throw new InvalidTypeError(
        `InstanceOf type is invalid. Expected type to be nil, a native type constructor, class, got ${Pattern.describer.describe(
          type
        )}`
      );
    }
    return true;
  }

  /**
   * Evaluates if provided type is valid for pattern.
   * @param type - Type that will be used to validate value.
   * @returns Returns true if type is valid, else false.
   */
  protected isValid(type: any): boolean {
    if (isArray(type)) {
      return false;
    }
    return (
      type == null ||
      isClass(type) ||
      isConstructor(type) ||
      isSinonClockDate(type) ||
      [Symbol].includes(type as any)
    );
  }
}
