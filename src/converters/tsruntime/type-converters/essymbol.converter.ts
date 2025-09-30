import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';

// TypeKind.ESSymbol = 10
export class ESSymbolConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.ESSymbol;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf {
    const pattern = new InstanceOf(Symbol);
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof Symbol {
    return Symbol;
  }
}
