/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { types } from './types';
import { Optional } from './patterns/optional';

export abstract class WrapperPattern extends Array {
  public static kind: string | undefined;

  public static describer: types.Describer;

  /**
   * Creates an instance of a WrapperPattern.
   * @param expectations - Expectations that will be assigned to pattern container.
   */
  constructor(...expectations: any[]) {
    // Can't put negative numbers on construction.
    // 👏👏 -Infinity/10, meme review.
    // https://airbrake.io/blog/javascript-error-handling/rangeerror-invalid-array-length
    super();
    this.onValidation(...expectations);
    this.push(...expectations);
  }

  /**
   * Make current pattern optional.
   * @returns Pattern wrapped with instance of Optional pattern.
   */
  get isOptional(): Optional {
    return new Optional(this);
  }

  /**
   * Ensures that current pattern is required.
   * @returns Pattern that is unwrapped from Optional pattern.
   */
  get isRequired(): any {
    if (this instanceof Optional) {
      return this[0];
    }
    return this;
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
   * Ensures that provided expectations can be set on pattern.
   * @param expectations - Expectations that will be assigned to pattern container.
   */
  onValidation(...expectations: any[]): boolean {
    return true;
  }
}
