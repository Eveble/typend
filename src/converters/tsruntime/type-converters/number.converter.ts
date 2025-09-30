import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';

// TypeKind.Number = 3
export class NumberConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Number;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    const pattern = new InstanceOf(Number);
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof Number {
    return Number;
  }
}
