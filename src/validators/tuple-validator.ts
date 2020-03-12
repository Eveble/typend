import { isArray } from 'lodash';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { InvalidTypeError, NotAMemberError } from '../errors';
import { Tuple } from '../patterns/tuple';

export class TupleValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Tuple` or expectation matches array with value or its `Array` constructor, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return (
      expectation instanceof Tuple ||
      (isArray(expectation) && expectation.length > 0)
    );
  }

  /**
   * Validates if value matches pattern expectation.
   * @param value - Value that is validated against expectation.
   * @param tupleOrExpect - Explicit pattern as `Tuple` instance or implicit expectation
   * against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching tuple expectation, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an array.
   * @throws {NotAMemberError}
   * Thrown if the value does not match provided pattern expectation.
   */
  public validate(
    value: any,
    tupleOrExpect: Tuple | [],
    validator: types.Validator
  ): boolean {
    if (!isArray(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Array',
        this.describe(value)
      );
    }

    for (let i = 0; i < tupleOrExpect.length; i++) {
      const valueElement = value[i];
      const expectationItem = tupleOrExpect[i];
      try {
        validator.validate(valueElement, expectationItem);
      } catch (err) {
        // Since there is no clean way to test if class is ES6 class at
        // current time, error from isClass(@eveble/helpers) will be ignored
        if (err.message !== 'Cannot call a class as a function') {
          throw new NotAMemberError(
            `Expected %s to be matching an %s`,
            this.describe(value),
            this.describe(tupleOrExpect)
          );
        }
      }
    }
    return true;
  }
}
