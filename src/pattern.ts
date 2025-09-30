import 'reflect-metadata';
import { types } from './types';
import { Optional } from './patterns/optional';
import { INITIALIZER_KEY } from './constants/metadata-keys';

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
