import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { isClass } from '@eveble/helpers';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';

export class FunctionConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    // Function declaration
    if (reflectedType.kind === TypeKind.Function) {
      return true;
    }
    // Reference to Function
    const referenceType = reflectedType as tsruntimeTypes.ReferenceType;
    return referenceType.type === Function && !isClass(referenceType.type);
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    return new InstanceOf(Function);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof Function {
    return Function;
  }
}
