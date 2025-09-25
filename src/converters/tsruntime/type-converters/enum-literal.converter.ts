import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { Equals } from '../../../patterns/equals';

// TypeKind.EnumLiteral = 9
export class EnumLiteralConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === (TypeKind.EnumLiteral as any);
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Equals {
    return new Equals((reflectedType as any).value);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): any {
    return (reflectedType as any).value;
  }
}
