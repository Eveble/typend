import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { Any } from '../../../patterns/any';

// TypeKind.Any = 1
export class AnyConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Any;
  }

  public convert(reflectedType: tsruntimeTypes.ReflectedType): Any {
    return new Any();
  }

  public reflect(reflectedType: tsruntimeTypes.ReflectedType): Any {
    return new Any();
  }
}
