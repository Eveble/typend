import { isPlainObject } from 'lodash';
import { isClass } from '@eveble/helpers';
import { Pattern } from '../pattern';
import { InvalidDefinitionError, InvalidTypeError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Collection } from './collection';

export class Class extends Pattern implements types.Pattern {
  public static kind = KINDS.CLASS;

  public type: types.Class;

  public properties: Record<keyof any, any> | Collection;

  /**
   * Creates an instance of an Class(pattern).
   * @param type - Type constructor.
   * @param properties - Properties that describes class.
   * @throws {InvalidTypeError}
   * Thrown if provided type is invalid(is not a class).
   * @throws {InvalidDefinitionError}
   * Thrown if provided properties are invalid(is not an plain object or instance of `Collection` pattern).
   */
  constructor(type: any, properties: types.Type) {
    super();
    if (!isClass(type)) {
      throw new InvalidTypeError(
        `Class type is invalid. Expected type to be a class constructor, got ${this.describe(
          properties
        )}`
      );
    }
    if (!isPlainObject(properties) && !(properties instanceof Collection)) {
      throw new InvalidDefinitionError(
        `Class properties are invalid. Expected properties to be a plain object or Collection instance describing class properties, got ${this.describe(
          properties
        )}`
      );
    }
    this.type = type;
    this.properties = properties;
  }
}
