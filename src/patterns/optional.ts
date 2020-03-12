import { KINDS } from '../constants/literal-keys';
import { types } from '../types';
import { INITIALIZER_KEY } from '../constants/metadata-keys';

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

  /**
   * Sets as non-enumerable the initializing value for type if present on conversion.
   * @param initializer - Initializer value provided on conversion.
   */
  setInitializer(initializer: any): void {
    Reflect.defineMetadata(INITIALIZER_KEY, initializer, this);
  }

  /**
   * Evaluates if initializing value was assigned to type.
   * @returns Returns `true` if initializing value is set for type, else false.
   */
  hasInitializer(): boolean {
    return Reflect.hasOwnMetadata(INITIALIZER_KEY, this);
  }

  /**
   * Returns the initializing value.
   * @returns Initializing value, else undefined.
   */
  getInitializer(): any | undefined {
    return Reflect.getOwnMetadata(INITIALIZER_KEY, this);
  }
}
