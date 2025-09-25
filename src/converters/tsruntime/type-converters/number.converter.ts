import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from "../../../types";
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { InstanceOf } from '../../../patterns/instance-of';

// TypeKind.Number = 3
export class NumberConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Number;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    return new InstanceOf(Number);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof Number {
    return Number;
  }
}
