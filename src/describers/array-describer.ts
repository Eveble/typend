import { types } from '../types';
import { Description } from '../description';

export class ArrayDescriber implements types.TypeDescriber {
  /**
   * Describes array to human readable form.
   * @param arg - Argument as an array.
   * @param describer - Instance of describer.
   * @returns Description instance.
   */
  describe(arg: any, describer: types.Describer): types.Stringifiable {
    const args: string | undefined = this.describeArguments(arg, describer);
    const type = 'Array';
    const message: string = this.generateMessage(args);
    return new Description({
      value: args,
      type,
      message,
    });
  }

  /**
   * Processes array arguments to human readable form.
   * @param arg - Argument as an array.
   * @param describer - Instance of describer.
   * @returns Human readable representation of array arguments as a string.
   */
  protected describeArguments(
    arg: any,
    describer: types.Describer
  ): string | undefined {
    const readableArgs: string[] = [];
    for (const element of arg) {
      const message: string = describer.describe(element);
      readableArgs.push(message);
    }
    return readableArgs.join(', ');
  }

  /**
   * Generates description message of the array.
   * @param args - Human readable arguments(content) of the array.
   * @returns Human readable message that describes array and its arguments.
   */
  protected generateMessage(args): string {
    return `[${args}]`;
  }
}
