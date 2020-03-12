import { types } from './types';

export class Description implements types.Stringifiable {
  public value?: string;

  public type?: string;

  public message: string;

  /**
   * Creates an instance of Description.
   * @param props - Available descriptions for value as properties object.
   */
  constructor(props: { value?: string; type?: string; message: string }) {
    Object.assign(this, props);
  }

  /**
   * Converts description in to string.
   * @returns Returns message as a string.
   */
  toString(): string {
    return this.message;
  }
}

export class DescriptionList implements types.Stringifiable {
  public descriptions: types.Stringifiable[];

  /**
   * Creates an instance of DescriptionList.
   * @param descriptions - Description list as an array.
   */
  constructor(descriptions: types.Stringifiable[] = []) {
    this.descriptions = descriptions || [];
  }

  /**
   * Converts list of descriptions in to human readable string.
   * @returns Returns string representation of all descriptions in list.
   */
  toString(): string {
    const parts: string[] = [];
    for (const description of this.descriptions) {
      parts.push(description.toString());
    }
    return parts.join(', ');
  }
}
