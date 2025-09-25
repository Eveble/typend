import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from "../../../types";
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { Unknown } from '../../../patterns/unknown';

// TypeKind.Unknown = 20 | 999
export class UnknownConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Unknown || reflectedType.kind === TypeKind.Unknown2;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Unknown {
    return new Unknown();
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Unknown {
    return new Unknown();
  }
}
