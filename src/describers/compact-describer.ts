import { inspect } from 'util';
import { types } from '../types';
import { Description } from '../description';

export class CompactDescriber implements types.TypeDescriber {
  private options: Record<string, any>;

  /**
   * Creates an instance of CompactDescriber.
   * @param options - Options object that can be passed to Node's inspect util.
   */
  constructor(options = { compact: true, colors: false }) {
    this.options = options;
  }

  /**
   * Describes argument to human readable form.
   * @param arg - Argument to describe.
   * @returns Description instance.
   */
  describe(arg: any): types.Stringifiable {
    const message = inspect(arg, this.options);
    return new Description({
      message,
    });
  }
}
