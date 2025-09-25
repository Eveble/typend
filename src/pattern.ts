import 'reflect-metadata';
import { types } from './types';
import { Optional } from './patterns/optional';

export abstract class Pattern extends Object {
  public static kind = '';

  public static describer: types.Describer;

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
   * Returns for which kind pattern is created.
   * @returns Kind represented as a string.
   */
  public getKind(): string {
    return (this.constructor as types.PatternType).kind;
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
}
