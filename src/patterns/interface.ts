import 'reflect-metadata';
import { isPlainObject } from 'lodash';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Collection } from './collection';
import { INTERFACE_NAME_KEY } from '../constants/metadata-keys';

export class Interface extends Pattern implements types.Pattern {
  public static kind = KINDS.INTERFACE;

  /**
   * Creates an instance of an Interface(pattern).
   * @param properties - Properties that describes interface.
   * @throws {InvalidTypeError}
   * Thrown if provided properties is not an plain object or instance of `Collection` pattern.
   */
  constructor(properties: Record<keyof any, any>) {
    super();
    if (!isPlainObject(properties) && !(properties instanceof Collection)) {
      throw new InvalidTypeError(
        `Interface properties are invalid. Expected properties to be a plain object or Collection instance describing interface properties, got ${this.describe(
          properties
        )}`
      );
    }
    Object.assign(this, properties);
  }

  /**
   * Sets interface name as type's metadata.
   * @param name - Interface name.
   */
  setName(name: string): void {
    Reflect.defineMetadata(INTERFACE_NAME_KEY, name, this);
  }

  /**
   * Returns interface name from metadata.
   * @returns Interface name as a `string`.
   */
  getName(): string {
    return Reflect.getOwnMetadata(INTERFACE_NAME_KEY, this);
  }
}
