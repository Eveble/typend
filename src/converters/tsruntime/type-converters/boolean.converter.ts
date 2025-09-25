import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from "../../../types";
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { InstanceOf } from '../../../patterns/instance-of';

// TypeKind.Boolean = 4
export class BooleanConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Boolean;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    return new InstanceOf(Boolean);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof Boolean {
    return Boolean;
  }
}
