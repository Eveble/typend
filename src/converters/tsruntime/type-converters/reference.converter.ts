import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from "../../../types";
import { isPlainObjectFast } from "../../../helpers";
import { InstanceOf } from '../../../patterns/instance-of';
import { List } from '../../../patterns/list';
import { Collection } from '../../../patterns/collection';
import { TypeKind } from '../../../enums/type-kind.enum';

// TypeKind.Reference = 18
export class ReferenceConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Reference;
  }

  public convert(reflectedType: tsruntimeTypes.ReferenceType, converter: types.Converter): any {
    if (converter.getConverter(TypeKind.Array).isConvertible(reflectedType)) {
      return converter.getConverter(TypeKind.Array).convert(reflectedType, converter);
    }
    if (converter.getConverter(TypeKind.Class).isConvertible(reflectedType)) {
      return converter.getConverter(TypeKind.Class).convert(reflectedType, converter);
    }

    // Handle Array<T> special case
    if (reflectedType.type === Array && reflectedType.arguments) {
      const expectations: any[] = [];
      for (const argument of reflectedType.arguments) {
        if (argument.kind === TypeKind.Reference) {
          expectations.push(new InstanceOf((argument as tsruntimeTypes.ReferenceType).type));
        } else {
          expectations.push(converter.convert(argument));
        }
      }
      const pattern = new List(...expectations);
      if (reflectedType.initializer) {
        pattern.setInitializer(reflectedType.initializer());
      }
      return pattern;
    }

    // Handle plain objects
    if (isPlainObjectFast(reflectedType.type)) {
      return new Collection(reflectedType.type);
    }

    // Handle regular references
    let pattern = new InstanceOf(reflectedType.type);
    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  public reflect(reflectedType: tsruntimeTypes.ReferenceType, converter: types.Converter): any {

    if (converter.getConverter(TypeKind.Array).isConvertible(reflectedType)) {
      return converter.getConverter(TypeKind.Array).reflect(reflectedType, converter);
    }
    if (converter.getConverter(TypeKind.Class).isConvertible(reflectedType)) {
      return converter.getConverter(TypeKind.Class).reflect(reflectedType, converter);
    }
    // Handle Array<T> special case
    if (reflectedType.type === Array && reflectedType.arguments) {
      const expectations: any[] = [];
      for (const arg of reflectedType.arguments) {
        if (arg.kind === TypeKind.Reference) {
          expectations.push((arg as tsruntimeTypes.ReferenceType).type);
        } else {
          expectations.push(converter.reflect(arg));
        }
      }
      return expectations;
    }

    if (isPlainObjectFast(reflectedType.type)) {
      return reflectedType.type;
    }

    return reflectedType.type;
  }

}
