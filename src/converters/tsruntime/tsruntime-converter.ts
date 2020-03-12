import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../types';
import { TypeConverterExists } from '../../errors';
import { KINDS } from '../../constants/literal-keys';

export class TSRuntimeConverter implements types.Converter {
  public typeConverters: Map<string, types.TypeConverter>;

  /**
   * Creates an instance of TSRuntimeConverter.
   * @param typeConverters - Optional mappings of `TypeConverter`(s) as a `Map` instance.
   */
  constructor(typeConverters?: Map<string, types.TypeConverter>) {
    this.typeConverters = typeConverters || new Map();
  }

  /**
   * Converts reflected by `tsruntime` Typescript's type declaration to native
   * type or `Pattern` instance for easy runtime-validation.
   * [!] Prior to conversion:
   * Classes  must have `@define` decorator applied.
   * @link https://github.com/goloveychuk/tsruntime|tsruntime
   * @param reflectedType - Reflected type that will be converted.
   * @returns Converted type as native type or `Pattern` instance.
   */
  public convert(reflectedType: tsruntimeTypes.ReflectedType): types.Type {
    for (const typeConverter of this.typeConverters.values()) {
      if (typeConverter.isConvertible(reflectedType, this) === true) {
        return typeConverter.convert(reflectedType, this);
      }
    }

    const unknownConverter = this.getConverter(
      KINDS.UNKNOWN
    ) as types.TypeConverter;
    return unknownConverter?.convert(reflectedType);
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
    for (const typeConverter of this.typeConverters.values()) {
      if (typeConverter.isConvertible(reflectedType, this) === true) {
        return typeConverter.reflect(reflectedType, this);
      }
    }
    const unknownConverter = this.getConverter(
      KINDS.UNKNOWN
    ) as types.TypeConverter;
    return unknownConverter?.reflect(reflectedType);
  }

  /**
   * Registers type converter on converter.
   * @param kind - Kind for which type converter mapping is registered.
   * @param typeConverter - `TypeConverter` instance for registration.
   * @param shouldOverride - Optional flag indicating that type mapping should be overridden if exist.
   * @throws {TypeConverterExists}
   * Thrown if mapping would overridden on existing type converter without explicit call.
   */
  public registerConverter(
    kind: string,
    typeConverter: types.TypeConverter,
    shouldOverride = false
  ): void {
    if (this.hasConverter(kind) && !shouldOverride) {
      throw new TypeConverterExists(kind);
    }
    this.typeConverters.set(kind, typeConverter);
  }

  /**
   * Overrides already existing type converter by kind mapping on converter.
   * @param kind - Kind for which type converter mapping is registered or overridden.
   * @param converter - `TypeConverter` instance for registration.
   */
  public overrideConverter(kind: string, converter: types.TypeConverter): void {
    this.registerConverter(kind, converter, true);
  }

  /**
   * Returns type converter.
   * @param kind - Kind as type converter mapping.
   * @returns `TypeConverter` instance if found, else `undefined`.
   */
  public getConverter(type: string): types.TypeConverter | undefined {
    return this.typeConverters.get(type);
  }

  /**
   * Evaluates if converter for type is already registered by mapping id.
   * @param kind - Kind as type converter mapping.
   * @returns Returns `true` if type is registered, else `false`.
   */
  public hasConverter(type: string): boolean {
    return this.typeConverters.has(type);
  }

  /**
   * Removes converter by mapping type.
   * @param kind - Kind as type converter mapping.
   */
  public removeConverter(type: string): void {
    this.typeConverters.delete(type);
  }
}
