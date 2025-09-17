import 'reflect-metadata';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Collection } from './collection';
import { INTERFACE_NAME_KEY } from '../constants/metadata-keys';
import { isPlainObjectFast } from '../helpers';

/**
 *
 * Validates value against `Interface` pattern requiring it to match
 * expected properties and available methods(compared only by name - and not by with
 * method parameters).
 * The value may also contain other keys with arbitrary values not defined in
 * pattern(equivalent of Meteor's `Match.ObjectIncluding`).
 * @returns Returns `true` if value is matching `Interface` pattern
 * expectation, else throws.
 * @example
 * ```ts
 * import { check, ValidationError } from 'typend';
 *
 * interface PersonInterface {
 *   firstName: string;
 *   lastName: string;
 *   getFullName(): string;
 * }
 *
 * class Person implements PersonInterface {
 *   firstName: string;
 *
 *   lastName: string;
 *
 *   age: number; // Arbitrary key not listed on PersonInterface
 *
 *   getFullName(): string {
 *     return `${this.firstName} ${this.lastName}`;
 *   }
 *
 *   constructor(firstName: string, lastName: string, age: number) {
 *     this.firstName = firstName;
 *     this.lastName = lastName;
 *     this.age = age;
 *   }
 * }
 *
 *
 * check<PersonInterface>(new Person('Jane', 'Doe', 175));
 * expect(
 * () => check<PersonInterface>({ firstName: 'Jane', lastName: 'Don' }) // Missing getFullName method
 * ).to.throw(ValidationError);
 * ```
 */
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
    if (!isPlainObjectFast(properties) && !(properties instanceof Collection)) {
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
