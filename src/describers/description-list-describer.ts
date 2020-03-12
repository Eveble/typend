import { types } from '../types';
import { Description } from '../description';

export class DescriptionListDescriber implements types.TypeDescriber {
  /**
   * Describes description list instance to human readable form.
   * @param arg - Argument to describe.
   * @returns Description instance.
   */
  describe(arg: any): types.Stringifiable {
    const value = arg.toString();
    const type = 'DescriptionList';
    const message = `[${arg.toString()}]`;
    return new Description({
      value,
      type,
      message,
    });
  }
}
