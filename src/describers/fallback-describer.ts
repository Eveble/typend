import { capitalize } from 'lodash';
import { types } from '../types';
import { Description } from '../description';

export class FallbackDescriber implements types.TypeDescriber {
  /**
   * Describes argument as a fallback describer to human readable form.
   * @param arg - Argument to describe.
   * @returns Description instance.
   */
  describe(arg: any): types.Stringifiable {
    const value: string | undefined = this.describeValue(arg);
    const type: string = this.describeType(arg);
    const message: string = this.generateMessage(value, type);
    return new Description({
      value,
      type,
      message,
    });
  }

  /**
   * Processes argument's value to human readable form.
   * @param arg - Argument to describe.
   * @returns Human readable representation of argument as a string result from JSON.stringify.
   */
  protected describeValue(arg: any): string | undefined {
    return JSON.stringify(arg);
  }

  /**
   * Processes argument's type to human readable form.
   * @param arg - Argument to describe.
   * @returns Human readable type of argument as a string.
   */
  protected describeType(arg: any): string {
    return capitalize(typeof arg);
  }

  /**
   * Generates description message of the argument.
   * @param value - Human readable argument's value.
   * @param type - Human readable argument's type.
   * @returns Human readable message that describes argument value and its type.
   */
  protected generateMessage(value: string | undefined, type: string): string {
    let msg: string;
    if (type && value) {
      msg = `${type || ''}(${value})`;
      // Type
    } else {
      msg = type;
    }
    return msg;
  }
}
