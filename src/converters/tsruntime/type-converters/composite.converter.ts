import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { last } from 'lodash';

export class CompositeTypeConverter implements types.TypeConverter {
  private converters: types.TypeConverter[] = [];

  constructor(converters: types.TypeConverter[] = []) {
    this.converters = [...converters];
    this.sortByPriority();
  }
  /**
   * Evaluates if provided reflected type is an object(or interface - they are
   * reflected as same kind).
   * @param reflectedType - Reflected type.
   * @returns Returns `true` if reflected type is an `Object` or interface, else `false`.
   */
  public isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean {
    return reflectedType.kind === 15;
  }

  add(converter: types.TypeConverter, atIndex?: number): void {
    if (atIndex !== undefined) {
      this.converters.splice(atIndex, 0, converter);
    } else {
      this.converters.push(converter);
    }
    this.sortByPriority();
  }

  remove(converter: types.TypeConverter): boolean {
    const index = this.converters.indexOf(converter);
    if (index > -1) {
      this.converters.splice(index, 1);
      return true;
    }
    return false;
  }

  removeAt(index: number): types.TypeConverter | undefined {
    if (index >= 0 && index < this.converters.length) {
      return this.converters.splice(index, 1)[0];
    }
    return undefined;
  }

  private sortByPriority(): void {
    this.converters.sort((a, b) => {
      const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
      const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;
      return priorityA - priorityB;
    });
  }

  convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): types.Type {
    const applicableConverter = this.findApplicableConverter(
      reflectedType,
      converter
    );
    if (!applicableConverter) {
      throw new Error(
        `No applicable converter found for type: ${JSON.stringify(
          reflectedType
        )}`
      );
    }
    return applicableConverter.convert(reflectedType, converter);
  }

  reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): types.Type {
    const applicableConverter = this.findApplicableConverter(
      reflectedType,
      converter
    );
    if (!applicableConverter) {
      throw new Error(
        `No applicable converter found for type: ${JSON.stringify(
          reflectedType
        )}`
      );
    }
    return applicableConverter.reflect(reflectedType, converter);
  }

  private findApplicableConverter(
    reflectedType: tsruntimeTypes.ReflectedType,
    tsRuntimeConverter: types.Converter
  ): types.TypeConverter | undefined {
    const result = this.converters.find((converter) => {
      if (converter.isConvertible) {
        return converter.isConvertible(reflectedType, tsRuntimeConverter);
      }
      // If no canConvert method, assume it can handle the type
      return true;
    });
    if (result === undefined) {
      return last(this.converters);
    }
    return result;
  }

  getConverters(): readonly types.TypeConverter[] {
    return [...this.converters];
  }

  size(): number {
    return this.converters.length;
  }
}
