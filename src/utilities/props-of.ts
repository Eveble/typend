import { isClass } from '@eveble/helpers';
import { InvalidTypeError } from '../errors';
import { types } from '../types';
import { Utility } from '../utility';
import { Collection } from '../patterns/collection';
import { Class } from '../patterns/class';
import { WrapperPattern } from '../wrapper-pattern';

export class PropsOf extends WrapperPattern implements types.Utility {
  /**
   * Ensures that provided expectations can be set on utility.
   * @param type - Type constructor.
   * @throws {InvalidTypeError}
   * Thrown if provided type is invalid(is not an class).
   */
  onValidation(type: any): boolean {
    if (!isClass(type)) {
      throw new InvalidTypeError(
        `PropsOf type is invalid. Expected type to be class, got ${Utility.describer.describe(
          type
        )}`
      );
    }
    return true;
  }

  /**
   * Generates explicit `Collection` pattern for type properties from type.
   * @param library - `Library` instance.
   * @returns Instance of `Collection` pattern as representation of type's properties.
   */
  public generate(library: types.Library): Collection {
    const type = this[0];
    const classType: Class = library.converter.convert(type) as Class;

    // Unwrap from Class pattern so properties are only validated and not matching type
    return new Collection({ ...classType.properties });
  }
}
