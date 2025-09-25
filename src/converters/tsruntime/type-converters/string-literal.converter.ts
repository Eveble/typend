import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { Equals } from '../../../patterns/equals';

// TypeKind.StringLiteral = 5
export class StringLiteralConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.StringLiteral;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Equals {
    return new Equals(
      (reflectedType as tsruntimeTypes.StringLiteralType).value
    );
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): string {
    return (reflectedType as tsruntimeTypes.StringLiteralType).value;
  }
}
