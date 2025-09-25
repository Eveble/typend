import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from "../../../types";
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';

// TypeKind.Null = 13
export class NullConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Null;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): null {
    return null;
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): null {
    return null;
  }
}
