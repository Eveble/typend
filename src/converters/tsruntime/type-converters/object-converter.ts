import 'reflect-metadata';
import { Types as tsrTypes } from 'tsruntime';
import { isPlainObject } from 'lodash';
import { types } from '../../../types';
import { Collection } from '../../../patterns/collection';
import { InstanceOf } from '../../../patterns/instance-of';
import { KINDS } from '../../../constants/literal-keys';
import { Interface } from '../../../patterns/interface';
import { isSpecial, isPatternClass } from '../../../helpers';

export class ObjectConverter implements types.TypeConverter {
  /**
   * Evaluates if provided reflected type is an object(or interface - they are
   * reflected as same kind).
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is an `Object` or interface, else `false`.
   */
  public isConvertible(reflectedType: tsrTypes.ReflectedType): boolean {
    return reflectedType.kind === 15 && !isSpecial(reflectedType);
  }

  /**
   * Converts reflected type object.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns converted object properties as instance of `Collection` pattern for object or instance of `Interface` for interfaces.
   */
  public convert(
    reflectedType: tsrTypes.ObjectType,
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

    if (reflectedType.initializer) {
      pattern.setInitializer(reflectedType.initializer());
    }
    return pattern;
  }

  /**
   * Reflect object type.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns reflected object properties as instance of an `Object`.
   */
  public reflect(
    reflectedType: tsrTypes.ObjectType,
    converter: types.Converter
  ): Record<keyof any, any> {
    return this.resolveProperties(reflectedType, converter, false);
  }

  /**
   * Resolves reflected object type properties.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @param isConverting - Flag indicating that resolving is done in converting mode.
   * @returns Returns resolved properties of an reflected object type in converting or resolving mode.
   */
  protected resolveProperties(
    reflectedType: tsrTypes.ObjectType,
    converter: types.Converter,
    isConverting: boolean
  ): Record<keyof any, any> {
    const { properties } = reflectedType;
    const props: Record<keyof any, any> = {};
    for (const key of Reflect.ownKeys(properties)) {
      const reflectedProp: tsrTypes.ReflectedType = properties[key as any];
      // Skips internal('native') keys that are reflected by Reflect.ownKeys like 'length' etc.
      if (!isPlainObject(reflectedProp)) continue;

      // If object contains a value, that is a class type as properties, point to the
      // type constructor without resolving type's properties.
      const classConverter = converter.getConverter(
        KINDS.CLASS
      ) as types.TypeConverter;

      if (classConverter?.isConvertible(reflectedProp)) {
        const reflectedRefType = reflectedProp as tsrTypes.ReferenceType;

        let expectation: any;
        if (isConverting) {
          if (isPatternClass(reflectedRefType.type)) {
            expectation = reflectedRefType.type;
          } else {
            expectation = new InstanceOf(reflectedRefType.type);
          }
          /*
          Covers examples where new instance of type is assigned as initializer:

          class Engine {}

          class Car {
            engine: Engine = new Engine();
          }

          Useful for building configuration that have all required properties set by default with initializers.
          */
          if (reflectedProp.initializer) {
            expectation.setInitializer(reflectedProp.initializer());
          }
        } else {
          expectation = reflectedRefType.type;
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

  /**
   * Determines whether reflected type is an interface.
   * @param reflectedType - Reflected type that will be converted.
   * @returns Returns `true` if reflected type is interface, `else` false.
   */
  public isInterface(reflectedType: tsrTypes.ReflectedType): boolean {
    return (
      reflectedType.kind === 15 &&
      (reflectedType as tsrTypes.ObjectType).name !== undefined
    );
  }
}
