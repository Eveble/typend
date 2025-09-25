import { Unrecognized } from '../patterns/unrecognized';
import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { UnknownError } from '../errors';

export class UnrecognizedValidator
  extends PatternValidator
  implements types.PatternValidator
{
  private readonly _isValid: boolean;

  /**
   * Creates an instance of UnrecognizedValidator.
   * @param isValid - Default behavior for unrecognized arguments.
   */
  constructor(isValid = false) {
    super();
    this._isValid = isValid;
  }

  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Unrecognized`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Unrecognized;
  }

  /**
   * Returns default behavior(result) that is returned upon validating unrecognized value.
   * @returns Returns `true` if default behavior is set to that behavior, else `false`.
   */
  public getDefaultBehavior(): boolean {
    return this._isValid;
  }

  /**
   * Validates if value matches pattern expectation(undefined).
   * @param value - Value that is validated against expectation.
   * @param unrecognized - Explicit pattern as `Unrecognized` instance.
   * @returns Returns the default behavior for validation of unrecognized arguments.
   * @throws {UnknownError}
   * Thrown as default behavior of unrecognized arguments.
   */
  public validate(value: any, unrecognized: Unrecognized): boolean {
    const expectation =
      unrecognized instanceof Unrecognized ? unrecognized[0] : unrecognized;

    if (!this._isValid) {
      throw new UnknownError(
        `Unrecognized expectation %s that cannot handle %s value`,
        this.describe(expectation),
        this.describe(value)
      );
    }
    return true;
  }
}
