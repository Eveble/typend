import { KINDS } from '../constants/literal-keys';
import { types } from '../types';

/**
 * Validates if value is undefined or matches the expectation.
 * @returns  Returns `true` if value is an undefined or matches expectation, else throws.
 * @example
 * ```ts
 * import {
 *   check,
 *   define,
 *   Class,
 *   Optional,
 *   ValidationError,
 *   convert,
 *   validate,
 *   PropTypes,
 * } from 'typend';
 *
 * @define()
 * class Sandwich {
 *   pickles?: boolean;
 * }
 *
 * expect(convert<Sandwich>()).to.be.eql(
 *   new Class(Sandwich, {
 *     pickles: PropTypes.equal(Boolean).isOptional,
 *   })
 * );
 * check<undefined | string>('foo');
 * check<undefined | string>(undefined);
 * expect(() => check<undefined | number>('foo')).to.throw(ValidationError);
 *
 * validate(undefined, PropTypes.equal(String).isOptional);
 * validate('foo', PropTypes.instanceOf(String).isOptional);
 * validate('foo', new Optional(String));
 * expect(() => validate('foo', PropTypes.equal(Number).isOptional)).to.throw(
 *   ValidationError
 * );
 * ```
 */
export class Optional extends Array implements types.Pattern {
  public static kind = KINDS.OPTIONAL;

  public static describer: types.Describer;

  /**
   * Creates an instance of a WrapperPattern.
   * @param expectations - Expectations that will be assigned to pattern container.
   */
  // eslint-disable-next-line no-unused-vars
  constructor(...expectations: any[]) {
    // Can't put negative numbers on construction.
    // 👏👏 -Infinity/10, meme review.
    // https://airbrake.io/blog/javascript-error-handling/rangeerror-invalid-array-length
    super();
    this.push(...expectations);
  }

  /**
   * Sets describing library.
   * @param describer - Describer library instance.
   */
  static setDescriber(describer: types.Describer): void {
    this.describer = describer;
  }

  /**
   * Returns describing library.
   * @returns Describer library instance.
   */
  static getDescriber(): types.Describer {
    return this.describer;
  }

  /**
   * Describes value in human readable form.
   * @param value - Value that needs to be described.
   * @returns Human readable value described as a string.
   */
  public describe(value: any): string {
    return (this.constructor as any).getDescriber().describe(value);
  }

  /**
   * Returns for which kind pattern is created.
   * @returns Kind represented as a string.
   */
  public getKind(): string {
    return (this.constructor as types.PatternType).kind;
  }
}
