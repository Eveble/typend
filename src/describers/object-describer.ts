import { types } from '../types';
import { Description } from '../description';

export class ObjectDescriber implements types.TypeDescriber {
  /**
   * Describes object to human readable form.
   * @param arg - Argument as an object.
   * @param describer - Instance of describer.
   * @returns Description instance.
   */
  describe(arg: any, describer: types.Describer): types.Stringifiable {
    const properties: string | undefined = this.describeProperties(
      arg,
      describer
    );
    const type = 'Object';
    const message: string = this.generateMessage(properties);
    return new Description({
      value: properties,
      type,
      message,
    });
  }

  /**
   * Processes object properties to human readable form.
   * @param arg - Argument as an object.
   * @param describer - Instance of describer.
   * @returns Human readable representation of object properties as a string.
   */
  protected describeProperties(
    arg: any,
    describer: types.Describer
  ): string | undefined {
    // This solution is fixing proper display of pattern definitions in object that uses direct native type mappings(like definition with expected `String`, `Number` etc.) where in comparison JSON.stringify will left them ignored(since `String` primitive type(constructor) can't be stringified)
    const values: string[] = [];
    for (const [k, v] of Object.entries(arg)) {
      const message: string = describer.describe(v);
      values.push(`"${k}":${message}`);
    }
    return values.join(', ');
  }

  /**
   * Generates description message of the object.
   * @param properties - Human readable properties of the object.
   * @returns Human readable message that describes object and its properties.
   */
  protected generateMessage(properties): string {
    return `{${properties}}`;
  }
}
