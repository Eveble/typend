import { Types as tsruntimeTypes } from 'tsruntime';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { types } from '../../../types';
import { OneOf } from '../../../patterns/one-of';
import { Optional } from '../../../patterns/optional';
import { InstanceOf } from '../../../patterns/instance-of';
import { List } from '../../../patterns/list';

// TypeKind.Union = 17
export class UnionConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Union;
  }

  public convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Optional | OneOf {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.UnionType).types) {
      if (arg.kind === TypeKind.Reference) {
        if (arg.type !== Array) {
          expectations.push(
            new InstanceOf((arg as tsruntimeTypes.ReferenceType).type)
          );
        } else {
          for (const argument of arg.arguments) {
            expectations.push(new List(converter.convert(argument)));
          }
        }
      } else {
        expectations.push(converter.convert(arg));
      }
    }

    let pattern;
    if (expectations.length === 2 && expectations.includes(undefined)) {
      const expectation =
        expectations[0] !== undefined ? expectations[0] : expectations[1];
      pattern = new Optional(expectation);
    } else {
      pattern = new OneOf(...expectations);
    }

    return pattern;
  }

  public reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): any[] {
    const expectations: any[] = [];
    for (const arg of (reflectedType as tsruntimeTypes.UnionType).types) {
      if (arg.kind === TypeKind.Reference) {
        expectations.push((arg as tsruntimeTypes.ReferenceType).type);
      } else {
        expectations.push(converter.reflect(arg));
      }
    }
    return expectations.sort();
  }
}
