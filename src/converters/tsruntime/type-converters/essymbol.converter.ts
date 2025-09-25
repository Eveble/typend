import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { InstanceOf } from '../../../patterns/instance-of';

// TypeKind.ESSymbol = 10
export class ESSymbolConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.ESSymbol;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    return new InstanceOf(Symbol);
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof Symbol {
    return Symbol;
  }
}
