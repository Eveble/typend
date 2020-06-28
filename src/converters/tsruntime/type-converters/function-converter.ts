import { Types as tsruntimeTypes } from 'tsruntime';
import { isClass } from '@eveble/helpers';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';

export class FunctionConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is a function.
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is a function, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    // Reference
    if (reflectedType.kind === 18) {
      const referenceType = reflectedType as tsruntimeTypes.ReferenceType;
      return referenceType.type === Function && !isClass(referenceType.type);
    }
    // Function
    return (reflectedType as tsruntimeTypes.FunctionType).kind === 21;
  }

  /**
   * Converts to function.
   * @param reflectedType - Reflected type.
   * @returns Returns `Function` constructor wrapped in `InstanceOf` pattern.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    return reflectedType ? new InstanceOf(Function) : new InstanceOf(Function);
  }

  /**
   * Reflects function.
   * @returns Returns `Function` constructor.
   */
  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Function {
    return reflectedType ? Function : Function;
  }
}
