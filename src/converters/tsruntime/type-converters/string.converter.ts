import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';

// TypeKind.String = 2
export class StringConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.String;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    return new InstanceOf(String);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof String {
    return String;
  }
}
