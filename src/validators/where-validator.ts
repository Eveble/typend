import { isFunction } from 'lodash';
import { isNativeType } from '@eveble/helpers';
import { ValidationError } from '../errors';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { Where } from '../patterns/where';

export class WhereValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern: is instance of `Where` or is a function that is not class constructor; else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return (
      expectation instanceof Where ||
      (isFunction(expectation) &&
        !isNativeType(expectation) &&
        ![Symbol].includes(expectation as any))
    );
  }

  /**
   * Validates if value matches pattern expectation.
   * @param value - Value that is validated against expectation.
   * @param whereOrExpect -Explicit pattern as `Where` instance or implicit expectation
   * against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if expectation function returns z for value, else throws.
   * @throws {ValidationError|Error}
   * Thrown if the value does not match expectation.
   */
  public validate(value: any, whereOrExpect: types.Expectation): boolean {
    const expectation =
      whereOrExpect instanceof Where ? whereOrExpect[0] : whereOrExpect;

    if (!expectation(value)) {
      // Fallback in case custom instance of ValidationError was not thrown inside function definition.
      throw new ValidationError('Failed Where validation');
    }
    return true;
  }
}
