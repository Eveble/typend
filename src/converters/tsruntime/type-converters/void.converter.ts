import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { Void } from '../../../patterns/void';

// TypeKind.Void = 11
export class VoidConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Void;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Void {
    return new Void();
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Void {
    return new Void();
  }
}
