import { isPlainObject } from 'lodash';
import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

export class CollectionWithin extends Pattern implements types.Pattern {
  public static kind = KINDS.OBJECT_WITHIN;

  /**
   * Creates an instance of an CollectionWithin.
   * @param properties - Properties that will be used to validate value.
   * @throws {InvalidDefinitionError}
   * Thrown if provided properties is invalid(is not an object).
   */
  constructor(properties: Record<keyof any, any>) {
    super();
    if (!isPlainObject(properties)) {
      throw new InvalidDefinitionError(
        `CollectionWithin properties is invalid. Expected properties to be a plain object, got ${this.describe(
          properties
        )}`
      );
    }
    Object.assign(this, properties);
  }
}
