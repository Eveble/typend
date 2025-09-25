import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { Equals } from '../../../patterns/equals';

// TypeKind.TrueLiteral = 8
export class TrueLiteralConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.TrueLiteral;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Equals {
    return new Equals(true);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): true {
    return true;
  }
}
