import 'reflect-metadata';
import { Types as tsrTypes, getClassType } from 'tsruntime';
import { isClass, getTypeName } from '@eveble/helpers';
import merge from 'deepmerge';
import { KINDS } from '../../../constants/literal-keys';
import { types } from '../../../types';
import { UndefinableClassError } from '../../../errors';
import {
  getMatchingParentProto,
  isDefined,
  isPlainRecord,
  isPatternClass,
} from '../../../helpers';
import {
  PROPERTIES_KEY,
  REFLECTION_KEY,
} from '../../../constants/metadata-keys';
import { Class } from '../../../patterns/class';
import { Collection } from '../../../patterns/collection';

export class ClassConverter implements types.TypeConverter {
  public transformers: Map<string, types.TypeTransformer>;

  /**
   * Creates an instance of ClassConverter.
   * @param transformers - Optional transformer mappings implementing `TypeTransformer` interface.
   */
  constructor(transformers?: Map<string, types.TypeTransformer>) {
    this.transformers = transformers || new Map();
  }

  /**
   * Evaluates if provided reflected type or argument is a class.
   * @param reflectedTypeOrClass - Reflected type or argument as a class.
   * @returns Returns `true` if reflected type or argument is class type, else `false`.
   */
  public isConvertible(
    reflectedTypeOrClass: tsrTypes.ReflectedType | any
  ): boolean {
    return (
      this.isReflectedReference(reflectedTypeOrClass) ||
      // Passed direct result of tsruntime's getClassType
      this.isReflectedClass(reflectedTypeOrClass) ||
      isClass(reflectedTypeOrClass)
    );
  }

  /**
   * Converts class.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns converted class properties as instance of `Class` pattern.
   */
  public convert(
    reflectedType:
      | (tsrTypes.ReflectedType | tsrTypes.ReferenceType | tsrTypes.ClassType)
      | types.Class,
    converter: types.Converter
  ): Class | any {
    const type: types.Class = this.resolveType(reflectedType);
    // Allow for custom Pattern types like `Integer`
    if (isPatternClass(type)) {
      return type;
    }
    const properties: Record<keyof any, any> = this.resolveProperties(
      type,
      converter,
      true
    );

    const classType = new Class(type, properties);
    const transformedClassType = this.transformType(classType);
    const transformedProps = transformedClassType.properties;
    this.cacheProperties(type, transformedProps, true);

    return transformedClassType;
  }

  /**
   * Reflect class properties and their matching expectations.
   * @param reflectedType - Reflected type.
   * @param converter - Converter instance.
   * @returns Returns reflected class properties as an `Object`.
   */
  public reflect(
    reflectedType:
      | (tsrTypes.ReflectedType | tsrTypes.ReferenceType | tsrTypes.ClassType)
      | types.Class,
    converter: types.Converter
  ): Record<keyof any, any> {
    const type: types.Class = this.resolveType(reflectedType);
    const properties: Record<keyof any, any> = this.resolveProperties(
      type,
      converter,
      false
    );

    const transformedClassType = this.transformType(
      new Class(type, properties)
    );
    const transformedProps = transformedClassType.properties;
    this.cacheProperties(type, transformedProps, false);

    return transformedProps;
  }

  /**
   * Resolves class properties and their matching expectations.
   * @param type - Type's constructor.
   * @param converter - Converter instance.
   * @param isConverted - Flag indicating that type is converted.
   * @returns Resolved class properties as an `Object` or `Collection` instance.
   */
  protected resolveProperties(
    type: types.Class,
    converter: types.Converter,
    isConverted: boolean
  ): Record<keyof any, any> {
    let properties: Record<keyof any, any>;

    if (this.isCached(type, isConverted)) {
      properties = this.resolveCached(type, isConverted);
    } else {
      const reflectedClass: tsrTypes.ClassType = this.reflectClassType(type);
      const parentProperties: Record<
        keyof any,
        any
      > = this.resolveParentProperties(type, converter, isConverted);

      const objConverter = converter.getConverter(
        KINDS.OBJECT
      ) as types.TypeConverter;
      const classProperties: Record<keyof any, any> = isConverted
        ? objConverter.convert(reflectedClass, converter)
        : objConverter.reflect(reflectedClass, converter);

      properties = merge(parentProperties, classProperties, {
        isMergeableObject: isPlainRecord,
      });
      properties = isConverted ? new Collection(properties) : properties;
    }
    return properties;
  }

  /**
   * Resolves type constructor from reflected type.
   * @param reflectedType - Reflected type.
   * @returns Type's constructor.
   */
  protected resolveType(
    reflectedType: tsrTypes.ReflectedType | types.Class
  ): types.Class {
    return isClass(reflectedType)
      ? reflectedType
      : (reflectedType as tsrTypes.ReferenceType).type;
  }

  /**
   * Evaluate if properties were previously resolved, and by it: cached - so
   * they can be resolved from cache.
   * @param type - Type's constructor.
   * @param isConverted - Flag indicating that type is converted.
   * @returns Returns `true` if class properties were previously cached, else `false`.
   */
  protected isCached(type: types.Class, isConverted: boolean): boolean {
    return Reflect.hasOwnMetadata(this.getCacheMetadataKey(isConverted), type);
  }

  /**
   * Resolves cached class properties from type's metadata. Modification of
   * properties after first initial resolving should NEVER be allowed.
   * Assuming that cached version - is the 'final' version MUST be ALWAYS valid.
   * @param type - Type's constructor.
   * @param isConverted - Flag indicating that type is converted.
   * @returns Cached properties for conversion or reflection as an `Object` instance.
   */
  protected resolveCached(
    type: types.Class,
    isConverted: boolean
  ): Record<keyof any, any> {
    return Reflect.getOwnMetadata(this.getCacheMetadataKey(isConverted), type);
  }

  /**
   * Reflects class type with `tsruntime`.
   * @param type - Type constructor.
   * @returns Reflected tsruntime's class type.
   */
  protected reflectClassType(type: types.Class): tsrTypes.ClassType {
    const reflectedClass: tsrTypes.ClassType = getClassType(type);
    if (reflectedClass === undefined) {
      throw new UndefinableClassError(getTypeName(type) as string);
    }
    return reflectedClass;
  }

  /**
   * Evaluates if reflected type is a reference.
   * @param reflectedType - Reflected type.
   * @returns Returns true if reflected type is a reference, else false.
   */
  protected isReflectedReference(
    reflectedType: tsrTypes.ReflectedType
  ): boolean {
    if (reflectedType?.kind !== 18) {
      return false;
    }
    const referenceType = reflectedType as tsrTypes.ReferenceType;
    return referenceType.type !== undefined && isClass(referenceType.type);
  }

  /**
   * Evaluates if reflected type is a class.
   * @param reflectedType - Reflected type.
   * @returns Returns true if reflected type is a class, else false.
   */
  protected isReflectedClass(reflectedType: tsrTypes.ReflectedType): boolean {
    return reflectedType?.kind === 19;
  }

  /**
   * Resolves parent properties from type.
   * @param type - Type's constructor.
   * @param converter - Converter instance.
   * @param isConverted - Flag indicating that type is converted.
   * @returns Properties from parent prototype.
   */
  protected resolveParentProperties(
    type: types.Class,
    converter: types.Converter,
    isConverted: boolean
  ): Record<keyof any, any> {
    // Support 'classes' from 'polytype' for multi inheritance(mixin/traits etc.)
    const matcher = (evaluatedProto: types.Prototype): boolean => {
      return isDefined(evaluatedProto.constructor);
    };

    const parentProto: types.Prototype | undefined = getMatchingParentProto(
      type.prototype,
      matcher
    );
    if (parentProto === undefined) return {};

    const parentCtor = parentProto.constructor as types.Class;

    const parentProperties = isConverted
      ? this.convert(parentCtor, converter)
      : this.reflect(parentCtor, converter);

    // Since we don't need nested ClassPattern(s), we unwrap parent properties from Pattern
    if (parentProperties instanceof Class) {
      return (parentProperties as Class).properties;
    }
    return parentProperties;
  }

  /**
   * Transforms class type.
   * @param type - Class type.
   * @returns Transformed class type.
   */
  protected transformType(classType: Class): Class {
    let transformedClassType: Class = classType;
    for (const transformer of this.transformers.values()) {
      if (transformer.canTransform(transformedClassType)) {
        transformedClassType = transformer.transform(transformedClassType);
      }
    }
    return transformedClassType;
  }

  /**
   * Caches class properties.
   * @param type - Class type constructor.
   * @param properties - Class properties.
   * @param isConverted - Flag indicating that type is converted.
   */
  protected cacheProperties(
    type: types.Class,
    properties: types.Type,
    isConverted: boolean
  ): void {
    Reflect.defineMetadata(
      this.getCacheMetadataKey(isConverted),
      properties,
      type
    );
  }

  /**
   * Returns metadata key for caching properties or their reflection.
   * @param isConverted - Flag indicating that type is converted.
   * @returns Metadata string key under which cache is stored on type.
   */
  protected getCacheMetadataKey(isConverted: boolean): symbol {
    return isConverted ? PROPERTIES_KEY : REFLECTION_KEY;
  }
}
