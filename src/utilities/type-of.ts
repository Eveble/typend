import { isClass, getTypeName } from '@eveble/helpers';
import { Utility } from '../utility';
import { InvalidTypeError, UndefinableClassError } from '../errors';
import { types } from '../types';
import { isValidable, isDefined } from '../helpers';
import { Class } from '../patterns/class';
import { Any } from '../patterns/any';
import { WrapperPattern } from '../wrapper-pattern';

export class TypeOf extends WrapperPattern implements types.Utility {
  /**
   * Ensures that provided expectations can be set on utility.
   * @param type - Type constructor.
   * @throws {InvalidTypeError}
   * Thrown if provided type is invalid(is not an class).
   */
  onValidation(type: any): boolean {
    if (!isClass(type)) {
      throw new InvalidTypeError(
        `Type is invalid. Expected type to be a class constructor, got ${Utility.describer.describe(
          type
        )}`
      );
    }
    return true;
  }

  /**
   * Generates explicit `Type` pattern for type.
   * @param library - `Library` instance.
   * @returns Instance of `Type` pattern or instance of `Any` pattern if type is not validable.
   */
  public generate(library: types.Library): Class | Any {
    const type = this[0];
    if (!isDefined(type)) {
      throw new UndefinableClassError(getTypeName(type));
    }
    if (!isValidable(type)) {
      return new Any();
    }
    return library.converter.convert(type) as Class;
  }
}
