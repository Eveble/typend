import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from "../../../types";
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { Never } from '../../../patterns/never';

// TypeKind.Never = 14
export class NeverConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Never;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Never {
    return new Never();
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Never {
    return new Never();
  }
}
