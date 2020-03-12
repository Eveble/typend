import { getTypeName, isErrorInstance } from '@eveble/helpers';
import { types } from '../types';
import { Description } from '../description';

export class ErrorDescriber implements types.TypeDescriber {
  /**
   * Describes error to human readable form.
   * @param arg - Error argument as constructor or instance.
   * @returns Description instance.
   */
  describe(arg: any): types.Stringifiable {
    let errorMessage: string | undefined;
    let type: string;

    if (isErrorInstance(arg)) {
      errorMessage = `'${arg.message}'`;
      type = getTypeName(arg.constructor) as string;
    } else {
      type = getTypeName(arg) as string;
    }
    const message: string = this.generateMessage(errorMessage, type);
    return new Description({
      value: errorMessage,
      type,
      message,
    });
  }

  /**
   * Generates description message of the error.
   * @param value - Human readable error message.
   * @param type - Human readable type.
   * @returns Human readable message that describes error: its type and its value(error message if instance is passed).
   */
  protected generateMessage(value: string | undefined, type: string): string {
    let msg: string;
    // as Type(value)
    if (type && value) {
      msg = `${type || ''}(${value})`;
      // as Type
    } else {
      msg = type;
    }
    return msg;
  }
}
