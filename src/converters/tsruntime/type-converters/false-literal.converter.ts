import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { Equals } from '../../../patterns/equals';

// TypeKind.FalseLiteral = 7
export class FalseLiteralConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.FalseLiteral;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Equals {
    return new Equals(false);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): false {
    return false;
  }
}
