import { isPlainObject } from 'lodash';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

export class Collection extends Pattern implements types.Pattern {
  public static kind = KINDS.OBJECT;

  /**
   * Creates an instance of an Collection.
   * @param properties - Properties that will be used to validate value.
   * @throws {InvalidTypeError}
   * Thrown if provided properties is not an object.
   */
  constructor(properties: Record<keyof any, any>) {
    super();
    if (!isPlainObject(properties)) {
      throw new InvalidTypeError(
        `Collection properties are invalid. Expected properties to be a plain object, got ${this.describe(
          properties
        )}`
      );
    }
    Object.assign(this, properties);
  }
}
