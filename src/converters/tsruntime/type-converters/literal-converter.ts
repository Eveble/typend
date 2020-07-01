import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Equals } from '../../../patterns/equals';

export class LiteralConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is valued literal(has value).
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is valued literal, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return [5, 6, 7, 8].includes(reflectedType.kind);
  }

  /**
   * Converts reflected valued literal type for validation.
   * @param reflectedType - Reflected type.
   * @returns Returns converted reflected value literal type wrapped with `Equals` pattern.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): Equals {
    return new Equals(this.reflect(reflectedType));
  }

  /**
   * Reflects valued literal type.
   * @param reflectedType - Reflected type.
   * @returns Returns reflected valued literal type as literal `string`|`number`|`true`|`false`.
   */
  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType
  ): string | number | boolean {
    let value: string | number | boolean;
    if (reflectedType.kind === 7) {
      value = false;
    } else if ((reflectedType as any).kind === 8) {
      value = true;
    } else {
      value = (reflectedType as
        | tsruntimeTypes.StringLiteralType
        | tsruntimeTypes.NumberLiteralType).value;
    }
    return value;
  }
}
