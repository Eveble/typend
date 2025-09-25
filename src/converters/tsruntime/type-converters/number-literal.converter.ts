import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { Equals } from '../../../patterns/equals';

// TypeKind.NumberLiteral = 6
export class NumberLiteralConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.NumberLiteral;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Equals {
    return new Equals(
      (reflectedType as tsruntimeTypes.NumberLiteralType).value
    );
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): number {
    return (reflectedType as tsruntimeTypes.NumberLiteralType).value;
  }
}
