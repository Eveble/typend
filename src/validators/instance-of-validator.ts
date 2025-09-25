import { isArray } from 'lodash';
import {
  isClass,
  getScalarType,
  isScalarType,
  isSinonClockDate,
  isConstructor,
} from '@eveble/helpers';
import { PatternValidator } from '../pattern-validator';
import { UnmatchedTypeError, InvalidTypeError } from '../errors';
import { types } from '../types';
import { InstanceOf } from '../patterns/instance-of';

export class InstanceOfValidator
  extends PatternValidator
  implements types.PatternValidator
{
  static MAPPINGS = {
    symbol: Symbol,
  } as const;

  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `InstanceOf` or is a native type class, nil, class constructor, error constructor, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    if (expectation instanceof InstanceOf) {
      return true;
    }
    if (isArray(expectation)) {
      return false;
    }
    return (
      expectation == null ||
      isClass(expectation) ||
      isConstructor(expectation) ||
      isSinonClockDate(expectation) ||
      [Symbol].includes(expectation as any)
    );
  }

  /**
   * Validates if value is instance of an expectation type.
   * @param value - Value that is validated against expectation.
   * @param instanceOfOrExpect - Explicit pattern as `InstanceOf` instance or a native type class, nil,
   * class constructor, error constructor against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value has same type as expectation, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is an array(use ArrayPattern for array values).
   * @throws {UnmatchedTypeError}
   * Thrown if the value is not same type as expectation require.
   */
  public validate(value: any, instanceOfOrExpect: types.Expectation): boolean {
    if (isArray(value)) {
      throw new InvalidTypeError(
        `InstanceOfValidator can't handle Array values, got %s`,
        this.describe(value)
      );
    }

    const expectation =
      instanceOfOrExpect instanceof InstanceOf
        ? instanceOfOrExpect[0]
        : instanceOfOrExpect;

    /*
      () => {} ->  Function
      new RegExp(/fail/) -> RegExp
      new MyClass() -> MyClass
      new Child() inheriting from Parent -> Parent
    */
    if (value != null && expectation != null && value instanceof expectation) {
      return true;
    }

    let isValid = false;
    if (expectation == null) {
      isValid = value === expectation;
    } else if (isSinonClockDate(expectation)) {
      isValid = true;
      /*
        Provided value is an instance of expected native constructor, examples:
        'abcd' -> String
        '0' ->  String
        1 -> Number
        true/false -> Boolean
      */
    } else if (isScalarType(expectation)) {
      const valueType = typeof value;
      isValid = valueType === getScalarType(expectation);
    } else if (expectation === Symbol) {
      isValid = typeof value === 'symbol';
    }

    if (!isValid) {
      throw new UnmatchedTypeError(
        `Expected %s to be a %s`,
        this.describe(value),
        this.describe(expectation)
      );
    }
    return true;
  }
}
