import { getNativeType } from '@eveble/helpers';
import { types } from '../types';
import { Description } from '../description';

export class NativeTypeDescriber implements types.TypeDescriber {
  /**
   * Describes native type to human readable form.
   * @param arg - Native type argument.
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
   * Processes native type's value to human readable form.
   * @param arg - Native type argument.
   * @returns Human readable representation of native type value as a string.
   */
  protected describeValue(arg: any): string | undefined {
    let readableValue: string | undefined;

    if (arg instanceof RegExp) {
      readableValue = arg.toString();
    } else {
      readableValue = JSON.stringify(arg);
    }
    return readableValue;
  }

  /**
   * Processes native type's - type to human readable form.
   * @param arg - Native type argument.
   * @returns Human readable type of native type as a string.
   */
  protected describeType(arg: any): string {
    let type: string;
    if (arg === undefined) {
      type = 'undefined';
    } else if (arg === null) {
      type = 'null';
    } else if (arg instanceof RegExp) {
      type = 'RegExp';
    } else if (arg instanceof Array) {
      type = 'Array';
    } else if (arg instanceof Date) {
      type = 'Date';
    } else {
      type = (getNativeType(arg) as any).name;
    }
    return type;
  }

  /**
   * Generates description message of the native type.
   * @param value - Human readable argument's value.
   * @param type - Human readable argument's type.
   * @returns Human readable message that describes native type: its value and type.
   */
  protected generateMessage(value: string | undefined, type: string): string {
    let msg: string;
    // as Type(value)
    if (!['undefined', 'null'].includes(type) && type && value) {
      msg = `${type || ''}(${value})`;
      // as Type
    } else {
      msg = type;
    }
    return msg;
  }
}
