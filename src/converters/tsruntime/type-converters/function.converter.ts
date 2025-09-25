import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { InstanceOf } from '../../../patterns/instance-of';
import { isClass } from '@eveble/helpers';

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
