import { isClass, getTypeName } from '@eveble/helpers';
import { types } from '../types';
import { Description } from '../description';

export class ClassDescriber implements types.TypeDescriber {
  /**
   * Describes class to human readable form.
   * @param arg - Class argument as constructor or instance.
   * @returns Description instance.
   */
  describe(arg: any): types.Stringifiable {
    const properties: string | undefined = this.describeProperties(arg);
    const type: string = this.describeType(arg);
    const message: string = this.generateMessage(properties, type);
    return new Description({
      value: properties,
      type,
      message,
    });
  }

  /**
   * Processes class properties to human readable form.
   * @param arg - Class argument as constructor or instance.
   * @returns Human readable representation of class properties as a string.
   */
  protected describeProperties(arg: any): string | undefined {
    return JSON.stringify(arg);
  }

  /**
   * Processes class type to human readable form.
   * @param arg - Class argument as constructor or instance.
   * @returns Human readable type as type name or constructor name as a string.
   */
  protected describeType(arg: any): string {
    if (isClass(arg)) {
      return getTypeName(arg) as string;
    }
    return getTypeName(arg.constructor) as string;
  }

  /**
   * Generates description message of the class.
   * @param properties - Human readable properties.
   * @param type - Human readable class type name or constructor name.
   * @returns Human readable message that describes class: type and properties.
   */
  protected generateMessage(
    properties: string | undefined,
    type: string
  ): string {
    let msg: string;
    if (type && properties) {
      msg = `${type || ''}(${properties})`;
      // Type
    } else {
      msg = type;
    }
    return msg;
  }
}
