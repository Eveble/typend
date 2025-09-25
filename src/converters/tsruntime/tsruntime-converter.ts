import { Types as tsruntimeTypes } from 'tsruntime';
import { isClass } from '@eveble/helpers';
import { types } from '../../types';
import { TypeConverterExists } from '../../errors';
import { Pattern } from '../../pattern';
import { TypeKind } from '../../enums/type-kind.enum';

export class TSRuntimeConverter implements types.Converter {
  // Fast O(1) lookup array indexed by TypeKind
  public typeConverters: Array<types.TypeConverter | undefined> = [];

  protected definitionCache = new Map<any, types.TypeDefinition>();

  protected patternCache = new Map<string, Pattern>();

  /**
   * Creates an instance of TSRuntimeConverter.
   * @param typeConverters - Optional mappings of `TypeConverter`(s) as a `Map` instance.
   */
  constructor(typeConverters?: Array<types.TypeConverter | undefined>) {
    this.typeConverters = typeConverters || [];
  }

  /**
   * Ultra-fast converter resolution using direct array indexing
   */
  private findConverter(
    reflectedType: tsruntimeTypes.ReflectedType
  ): types.TypeConverter | undefined {
    return this.typeConverters[reflectedType.kind];
  }

  /**
   * Converts reflected by `tsruntime` Typescript's type declaration to native
   * type or `Pattern` instance for easy runtime-validation.
   * [!] Prior to conversion:
   * Classes  must have `@Type` decorator applied.
   * @link https://github.com/goloveychuk/tsruntime|tsruntime
   * @param reflectedType - Reflected type that will be converted.
   * @returns Converted type as native type or `Pattern` instance.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): types.Type {
    const cacheKey = this.createCacheKey(reflectedType);
    // if (this.patternCache.has(cacheKey)) {
    //   return this.patternCache.get(cacheKey)!;
    // }
    const converter = this.findConverter(reflectedType);

    if (converter) {
      const pattern = converter.convert(reflectedType, this);
      this.patternCache.set(cacheKey, pattern);
      return pattern;
    }

    if (isClass(reflectedType)) {
      const classConverter = this.getConverter(TypeKind.Class);
      const pattern = classConverter.convert(reflectedType, this);
      this.patternCache.set(cacheKey, pattern);
      return pattern;
    }

    // Fallback to unknown converter if no direct match found
    const unknownConverter = this.typeConverters[TypeKind.Unknown];
    const pattern = unknownConverter?.convert(reflectedType, this);
    if (pattern) {
      this.patternCache.set(cacheKey, pattern);
    }
    return pattern;
  }

  public createCacheKey(reflectedType: tsruntimeTypes.ReflectedType): string {
    if (reflectedType.kind === TypeKind.Reference) {
      // Create a unique key for reference types that includes function names
      const parts = [
        `kind:${reflectedType.kind}`,
        `type:${reflectedType.type?.name || 'unknown'}`,
        `args:${reflectedType.arguments?.length || 0}`,
      ];

      if (reflectedType.arguments) {
        reflectedType.arguments.forEach((arg, index) => {
          parts.push(`arg${index}:${this.createCacheKey(arg)}`);
        });
      }

      return parts.join('|');
    }

    // For non-reference types, use JSON stringify
    return JSON.stringify(reflectedType);
  }

  /**
   * Reflects with `tsruntime` Typescript's type declaration to native type
   * or `Pattern` instance(when native type representation is unavailable) for easier processing.
   * [!] Prior to reflection:
   * Classes  must have `@define` decorator applied.
   * @link https://github.com/goloveychuk/tsruntime|tsruntime
   * @param reflectedType - Reflected type that will be reflected.
   * @returns Reflected type as native type or `Pattern` instance.
   */
  public reflect(reflectedType: tsruntimeTypes.ReflectedType): types.Type {
    const converter = this.findConverter(reflectedType);

    if (converter) {
      return converter.reflect(reflectedType, this);
    }

    // Fallback to unknown converter
    const unknownConverter = this.typeConverters[TypeKind.Unknown];
    return unknownConverter?.reflect(reflectedType, this);
  }

  /**
   * Registers type converter on converter.
   * @param kind - `TypeKind` for which type converter mapping is registered.
   * @param typeConverter - `TypeConverter` instance for registration.
   * @param shouldOverride - Optional flag indicating that type mapping should be overridden if exist.
   * @throws {TypeConverterExists}
   * Thrown if mapping would overridden on existing type converter without explicit call.
   */
  public registerConverter(
    kind: TypeKind,
    typeConverter: types.TypeConverter,
    shouldOverride = false
  ): void {
    if (this.hasConverter(kind) && !shouldOverride) {
      throw new TypeConverterExists(kind);
    }
    this.typeConverters[kind] = typeConverter;
  }

  /**
   * Overrides already existing type converter by kind mapping on converter.
   * @param kind - Kind for which type converter mapping is registered or overridden.
   * @param converter - `TypeConverter` instance for registration.
   */
  public overrideConverter(
    kind: TypeKind,
    converter: types.TypeConverter
  ): void {
    this.registerConverter(kind, converter, true);
  }

  /**
   * Returns type converter.
   * @param kind - Kind as type converter mapping `TypeKind`.
   * @returns `TypeConverter` instance if found, else `undefined`.
   * @throws {Error}
   * Thrown if type converter for kind is not registered.
   */
  public getConverter(type: TypeKind): types.TypeConverter {
    if (this.typeConverters[type] === undefined) {
      throw new Error(`Type converter for kind '${type}' is not registered.`);
    }
    return this.typeConverters[type] as types.TypeConverter;
  }

  /**
   * Evaluates if converter for type is already registered by mapping id.
   * @param kind - Kind as type converter mapping.
   * @returns Returns `true` if type is registered, else `false`.
   */
  public hasConverter(type: TypeKind): boolean {
    return this.typeConverters[type] !== undefined;
  }

  /**
   * Removes converter by mapping type.
   * @param kind - Kind as type converter mapping.
   */
  public removeConverter(type: TypeKind): void {
    this.typeConverters[type] = undefined;
  }
}
