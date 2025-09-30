import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';
import { Tuple } from '../../../patterns/tuple';

// TypeKind.Tuple = 16
export class TupleConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Tuple;
  }

  public convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Tuple {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.TupleType)
      .elementTypes) {
      if (arg.kind === TypeKind.Reference) {
        expectations.push(
          new InstanceOf((arg as tsruntimeTypes.ReferenceType).type)
        );
      } else {
        expectations.push(converter.convert(arg));
      }
    }

    const pattern = new Tuple(...expectations);
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): any[] {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.TupleType)
      .elementTypes) {
      if (arg.kind === TypeKind.Reference) {
        expectations.push((arg as tsruntimeTypes.ReferenceType).type);
      } else {
        expectations.push(converter.reflect(arg));
      }
    }
    return expectations;
  }
}
