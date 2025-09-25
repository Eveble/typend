import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';

// TypeKind.Undefined = 12
export class UndefinedConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Undefined;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): undefined {
    return undefined;
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): undefined {
    return undefined;
  }
}
