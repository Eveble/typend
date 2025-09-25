import { isArray } from 'lodash';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { InvalidTypeError } from '../errors';
import { List } from '../patterns/list';

export class ListValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `List` or expectation matches array with value or its `Array` constructor, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return (
      expectation instanceof List ||
      expectation === Array ||
      (isArray(expectation) &&
        (expectation.length === 0 || expectation.length === 1))
    );
  }

  /**
   * Validates if value matches list expectation.
   * @param value - Value that is validated against expectation.
   * @param listOrExpect -Explicit pattern as `List` instance or implicit expectation
   * against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching definition, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an array.
   * @throws {ValidationError}
   * Thrown if the value does not match expectation.
   */
  public validate(
    value: any,
    listOrExpect: List | any[] | any,
    validator: types.Validator
  ): boolean {
    const values = value;
    if (!isArray(values)) {
      throw new InvalidTypeError(
        'Expected %s to be an Array',
        this.describe(values)
      );
    }

    // Scenario 1: Definition just requires that the type is Array(like: `[]`, `any[]`, `Array`)
    if (
      // Array class or simple notation([])
      listOrExpect === Array ||
      listOrExpect.length === 0
    ) {
      return true;
    }

    // Cache first expectation and value length
    const firstExpectation = listOrExpect[0];

    // Scenario 2: types.PatternValidator by provided type definition
    for (let i = 0; i < values.length; i++) {
      const valueItem = values[i];
      // List accepts definitions like:
      // new List(String), new List(Number) etc..
      // or
      // new List(new OneOf(String, Number)) etc...
      // We always assume that first element of array is the required definition for all the checked values.
      // For mor tuple a like behavior in arrays use TuplePattern.
      try {
        validator.validate(valueItem, firstExpectation);
      } catch (err) {
        // In case isClass(@eveble/helpers) throws error, ignore
        if (err.message !== 'Cannot call a class as a function') {
          throw new err.constructor(
            `Expected %s to be matching an %s`,
            this.describe(values),
            this.describe(listOrExpect)
          );
        }
      }
    }
    return true;
  }
}
