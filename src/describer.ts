import {
  isMultidimensionalArray,
  isNativeType,
  isNativeTypeInstance,
  isErrorClass,
  isErrorInstance,
  isClass,
  isClassInstance,
} from '@eveble/helpers';
import { isArray, isPlainObject } from 'lodash';
import { DebugDescriber } from './describers/debug-describer';
import { CompactDescriber } from './describers/compact-describer';
import { DescriptionList } from './description';
import { types } from './types';
import { TypeDescriberExistsError, TypeDescriberNotFoundError } from './errors';
import { NativeTypeDescriber } from './describers/native-type-describer';
import { ErrorDescriber } from './describers/error-describer';
import { ArrayDescriber } from './describers/array-describer';
import { ObjectDescriber } from './describers/object-describer';
import { ClassDescriber } from './describers/class-describer';
import { FallbackDescriber } from './describers/fallback-describer';
import { DescriptionListDescriber } from './describers/description-list-describer';
import { KINDS } from './constants/literal-keys';

export class Describer implements types.Describer {
  static describers: Record<string, any> = {
    [KINDS.NATIVE]: NativeTypeDescriber,
    [KINDS.ERROR]: ErrorDescriber,
    [KINDS.ARRAY]: ArrayDescriber,
    [KINDS.OBJECT]: ObjectDescriber,
    [KINDS.CLASS]: ClassDescriber,
    [KINDS.UNKNOWN]: FallbackDescriber,
    [KINDS.DESCRIPTION_LIST]: DescriptionListDescriber,
  };

  private describers: Map<string, types.TypeDescriber>;

  /**
   * Creates an instance of Describer.
   */
  constructor(describers?: Map<string, types.TypeDescriber>) {
    this.describers = describers || new Map();
  }

  /**
   * Describes value or list of values as human readable string.
   * @param value - Any value or list of values.
   * @returns String description of provided value(s).
   */
  public describe(value: any | any[]): string {
    const description: types.Stringifiable = this.createDescription(value);
    if (description instanceof DescriptionList) {
      const describer: types.TypeDescriber | undefined = this.getDescriber(
        KINDS.DESCRIPTION_LIST
      );
      if (describer === undefined) {
        return `[${description.toString()}]`;
      }
      return describer.describe(description).toString();
    }
    return description.toString();
  }

  /**
   * Describes individual value or list of values(as an array).
   * @param value - Any value or list of values.
   * @returns Instance of Description for single value or DescriptionList instance as list of values.
   */
  public createDescription(value: any | any[]): types.Stringifiable {
    if (isMultidimensionalArray(value)) {
      return this.createDescriptionList(value);
    }
    return this.createIndividualDescription(value);
  }

  /**
   * Describe individual value.
   * @param value - Non-array value to be described.
   * @returns Instance of types.describing.
   */
  protected createIndividualDescription(arg: any): types.Stringifiable {
    let type = KINDS.UNKNOWN;
    if (isArray(arg)) {
      type = KINDS.ARRAY;
    } else if (isPlainObject(arg)) {
      type = KINDS.OBJECT;
    } else if (isNativeType(arg) || isNativeTypeInstance(arg)) {
      type = KINDS.NATIVE;
    } else if (isErrorClass(arg) || isErrorInstance(arg)) {
      type = KINDS.ERROR;
    } else if (isClass(arg) || isClassInstance(arg)) {
      type = KINDS.CLASS;
    }
    const describer: types.TypeDescriber | undefined = this.getDescriber(type);
    if (describer === undefined) {
      throw new TypeDescriberNotFoundError(type);
    }
    return describer.describe(arg, this);
  }

  /**
   * Describe list of values.
   * @param values - List of values.
   * @returns Instance of DescriptionList with Description instance for each described value.
   */
  protected createDescriptionList(values: any[]): types.Stringifiable {
    const descriptions: types.Stringifiable[] = [];
    for (const value of values) {
      descriptions.push(this.createIndividualDescription(value));
    }
    return new DescriptionList(descriptions);
  }

  /**
   * Registers describer on describer.
   * @param type - Type for which mapping will be created.
   * @param describer - Describer for registration.
   * @param shouldOverride - Flag indicating that mapping should be overriden if exist.
   * @throws {TypeDescriberExistsError}
   * Thrown if mapping would overridden on describer without explicit call.
   */
  public registerDescriber(
    type: string,
    describer: types.TypeDescriber,
    shouldOverride = false
  ): void {
    if (this.hasDescriber(type) && !shouldOverride) {
      throw new TypeDescriberExistsError(type);
    }
    this.describers.set(type, describer);
  }

  /**
   * Overrides already existing describer by mapping on describer.
   * @param type - Type for which mapping will be created or overriden.
   * @param describer - Describer for registration.
   */
  public overrideDescriber(type: string, describer: types.TypeDescriber): void {
    this.registerDescriber(type, describer, true);
  }

  /**
   * Returns describer by mapping.
   * @param type - Mapping type for describer.
   * @returns Registered describer instance, else undefined.
   */
  public getDescriber(type: string): types.TypeDescriber | undefined {
    return this.describers.get(type);
  }

  /**
   * Evaluates if describer is already registered by mapping id.
   * @param type - Mapping type for describer.
   * @returns Returns true if describer is registered, else false.
   */
  public hasDescriber(type: string): boolean {
    return this.describers.has(type);
  }

  /**
   * Removes describer by mapping id.
   * @param type - Mapping type for describer.
   */
  public removeDescriber(type: string): void {
    this.describers.delete(type);
  }

  /**
   * Returns all registered describers.
   * @returns Registered describers mappings.
   */
  public getDescribers(): Map<string, types.TypeDescriber> {
    return this.describers;
  }

  /**
   * Describer initializer.
   * @param formatting - Formatting for describer as one of values: `compact`, `debug`, `default`.
   */
  public setFormatting(formatting: types.DescriberFormatting): void {
    switch (formatting) {
      case 'compact':
        for (const type of Object.keys(Describer.describers)) {
          this.overrideDescriber(type, new CompactDescriber());
        }
        break;
      case 'debug':
        for (const type of Object.keys(Describer.describers)) {
          this.overrideDescriber(type, new DebugDescriber());
        }
        break;
      default:
        for (const [type, TypeDescriber] of Object.entries(
          Describer.describers
        )) {
          this.overrideDescriber(type, new TypeDescriber());
        }
        break;
    }
  }
}
