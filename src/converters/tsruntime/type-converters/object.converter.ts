import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Collection } from '../../../patterns/collection';
import { Interface } from '../../../patterns/interface';
import { isPatternClass, isPlainObjectFast } from '../../../helpers';
import { InstanceOf } from '../../../patterns/instance-of';
import { isClass } from '@eveble/helpers';
import { TypeKind } from '../../../enums/type-kind.enum';

// TypeKind.Object = 15
export class ObjectConverter implements types.TypeConverter {
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === TypeKind.Object;
  }

  public convert(
    reflectedType: tsruntimeTypes.ObjectType,
    converter: types.Converter
  ): Collection | Interface {
    const properties = this.resolveProperties(reflectedType, converter, true);

    let pattern;
    if (this.isInterface(reflectedType)) {
      const intf = new Interface(properties);
      intf.setName(reflectedType.name as string);
      pattern = intf;
    } else {
      pattern = new Collection(properties);
    }

    return pattern;
  }

  public reflect(
    reflectedType: tsruntimeTypes.ObjectType,
    converter: types.Converter
  ): Record<keyof any, any> {
    return this.resolveProperties(reflectedType, converter, false);
  }

  private resolveProperties(
    reflectedType: tsruntimeTypes.ObjectType,
    converter: types.Converter,
    isConverting: boolean
  ): Record<keyof any, any> {
    const props: Record<keyof any, any> = {};
    for (const key of Reflect.ownKeys(reflectedType.properties)) {
      const reflectedProp: tsruntimeTypes.ReflectedType =
        reflectedType.properties[key as any];

      if (!isPlainObjectFast(reflectedProp)) continue;

      if (reflectedProp.kind === TypeKind.Reference) {
        const reflectedRefType = reflectedProp as tsruntimeTypes.ReferenceType;
        let expectation: any;

        if (isConverting) {
          if (reflectedRefType.type === Array && reflectedRefType.arguments) {
            expectation = converter
              .getConverter(TypeKind.Array)
              .convert(reflectedProp, converter) as any;
          } else if (isPatternClass(reflectedProp.type)) {
            expectation = reflectedProp.type;
          } else if (
            isClass(reflectedRefType.type) === false &&
            isPlainObjectFast(reflectedRefType.type) === true
          ) {
            expectation = new Collection(reflectedRefType.type);
          } else {
            expectation = new InstanceOf(reflectedRefType.type);
          }
        } else {
          if (reflectedRefType.type === Array && reflectedRefType.arguments) {
            const expectations: any[] = [];
            for (const argument of reflectedRefType.arguments) {
              if (argument.kind === TypeKind.Reference) {
                expectations.push(
                  (argument as tsruntimeTypes.ReferenceType).type
                );
              } else {
                expectations.push(converter.reflect(argument));
              }
            }
            expectation = expectations;
          } else {
            expectation = reflectedRefType.type;
          }
        }

        props[key as any] = expectation;
        continue;
      }

      props[key as any] = isConverting
        ? converter.convert(reflectedProp)
        : converter.reflect(reflectedProp);
    }
    return props;
  }

  private isInterface(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return (
      reflectedType.kind === TypeKind.Object &&
      (reflectedType as tsruntimeTypes.ObjectType).name !== undefined &&
      (reflectedType as tsruntimeTypes.ObjectType).name !== '__type'
    );
  }
}
