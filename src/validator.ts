import { types } from './types';
import {
  PatternValidatorExistError,
  PatternValidatorNotFoundError,
  UnknownError,
} from './errors';
import { isPattern, isPatternClass } from './helpers';

export class Validator implements types.Validator {
  protected validators: Map<string, types.PatternValidator>;

  protected order: string[];

  /**
   * Creates an instance of Validator.
   * @param validators - Optional mappings of `PatternValidator`(s) as a `Map` instance.
   */
  constructor(validators?: Map<string, types.PatternValidator>) {
    this.validators = validators || new Map();
    this.order = [];
  }

  /**
   * Validates if a value matches an expectation or throws.
   * @param value - Value that needs to validated.
   * @param expectation - Explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated.
   * @param isStrict - Flag indicating that evaluation should be done in strict mode.
   * @returns Returns `true` if validation is successful, else throws.
   * @remarks
   * Current implementation uses isStrict to differentiate strict validator from the loose one
   * (Collection vs CollectionIncluding) to evaluate if implicit expectation of pattern
   * should use deep strict comparison pattern `Collection` or allow arbitrary(loose) values by
   * using `CollectionIncluding` for objects.
   * However, developers can create their own pattern that could use isStrict flag on
   * validation level(simplest example: different implementation of EqualsValidator
   * that could behave more like == in js).
   * @throws {ValidationError}
   * Thrown if the value does not match provided pattern.
   * @throws {UnknownError}
   * Thrown if the value can't be validated by any of registered validators.
   */
  validate(
    value: any,
    expectation: types.Expectation,
    isStrict = true
  ): boolean {
    let processedExpectation = expectation;
    if (isPatternClass(expectation)) {
      const PatternCtor = expectation;
      processedExpectation = new PatternCtor();
    }
    let result: boolean | undefined;
    if (isPattern(processedExpectation)) {
      const validatedValue = value;
      result = this.handleExplicitPattern(validatedValue, processedExpectation);
    }

    if (result === undefined) {
      result = this.handleImplicitExpectation(
        value,
        processedExpectation,
        isStrict
      );
    }

    if (result === undefined) {
      throw new UnknownError(`Unknown expectation that can't be handled`);
    }
    return result;
  }

  /**
   * Validates if a value matches an expectation.
   * @param value - Value that needs to validated.
   * @param expectation - Explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated.
   * @param isStrict - Optional flag indicating that evaluation should be done in strict mode.
   * @returns Returns `true` if validation is successful, else `false`.
   */
  public isValid(
    value: any,
    expectation: types.Expectation,
    isStrict = true
  ): boolean {
    try {
      return this.validate(value, expectation, isStrict);
    } catch (e) {
      return false;
    }
  }

  /**
   * Validates if a value is instance of expectation.
   * @param value - Value that needs to validated.
   * @param expectation - Expectation as explicit `Class`, `InstanceOf`, `Interface` pattern instance against which value will be validated.
   * @returns Returns `true` if validation is successful, else `false`.
   */
  public isInstanceOf(value: any, expectation: types.Expectation): boolean {
    try {
      return this.validate(value, expectation);
    } catch (e) {
      return false;
    }
  }

  /**
   * Registers validator on delegator.
   * @param kind - Id for which mapping will be created.
   * @param validator - Validator for registration.
   * @param shouldOverride - Optional flag indicating that mapping should be overridden if exist.
   * @throws {PatternValidatorExistError}
   * Thrown if mapping would overridden on delegator without explicit call.
   */
  public registerValidator(
    kind: string,
    validator: types.PatternValidator,
    shouldOverride = false
  ): void {
    if (this.hasValidator(kind) && !shouldOverride) {
      throw new PatternValidatorExistError(kind);
    }
    this.validators.set(kind, validator);
  }

  /**
   * Overrides already existing validator by mapping on delegator.
   * @param kind - Identifier for which type, `PatternValidator` instance is mapped.
   * @param validator - Validator for registration.
   */
  public overrideValidator(
    kind: string,
    validator: types.PatternValidator
  ): void {
    this.registerValidator(kind, validator, true);
  }

  /**
   * Returns validator by mapping.
   * @param kind - Identifier for which type, `PatternValidator` instance is mapped.
   * @returns Registered validator instance, else undefined.
   */
  public getValidator(kind: string): types.PatternValidator | undefined {
    return this.validators.get(kind);
  }

  /**
   * Returns validator by mapping or throws.
   * @param kind - Identifier for which type, `PatternValidator` instance is mapped.
   * @returns Registered validator instance, else throws.
   * @throws {PatternValidatorNotFoundError}
   * Thrown if pattern validator for kind does not existing on validator.
   */
  public getValidatorOrThrow(kind: string): types.PatternValidator {
    if (!this.hasValidator(kind)) {
      throw new PatternValidatorNotFoundError(kind);
    }
    return this.validators.get(kind) as types.PatternValidator;
  }

  /**
   * Evaluates if validator is already registered by mapping id.
   * @param kind - Identifier for which type, `PatternValidator` instance is mapped.
   * @returns Returns true if validator is registered, else false.
   */
  public hasValidator(kind: string): boolean {
    return this.validators.has(kind);
  }

  /**
   * Removes validator by mapping id.
   * @param kind - Identifier for which type, `PatternValidator` instance is mapped.
   */
  public removeValidator(kind: string): void {
    this.validators.delete(kind);
  }

  /**
   * Returns ordered validators.
   * @returns Ordered(if order is provided) list of validators.
   */
  public getValidators(): types.PatternValidator[] {
    // Fallback in case order list is not set
    if (this.order === undefined || this.order.length === 0) {
      return Array.from(this.validators.values());
    }

    const orderedValidators: types.PatternValidator[] = [];
    for (const kind of this.order) {
      const validator = this.getValidator(kind);
      if (validator !== undefined) orderedValidators.push(validator);
    }
    return orderedValidators;
  }

  /**
   * Returns all registered validators.
   * @returns Instance of a `Map` of all registered validators implementing `PatternValidator`.
   */
  public getAllValidators(): Map<string, types.PatternValidator> {
    return this.validators;
  }

  /**
   * Sets map of validators.
   * @param validators - `Map` instance with of validators implementing `PatternValidator`.
   */
  public setValidators(validators: Map<string, types.PatternValidator>): void {
    this.validators = validators;
  }

  /**
   * Set validators order by list with sorted ids.
   * @param order - List with registered validator id's in sorted order.
   */
  public setOrder(order: string[]): void {
    this.order = order;
  }

  /**
   * Returns validators order.
   * @returns List with registered validator id's in sorted order.
   */
  public getOrder(): string[] {
    return this.order;
  }

  /**
   * Handles explicit pattern with dedicated validator.
   * @param value - Value that needs to validated.
   * @param patternOrDef - Instance of a `Pattern`.
   * @returns Returns `true` if validation is successful, else throws.
   * @throws {PatternValidatorNotFoundError}
   * Thrown if assigned pattern validator for explicit pattern is not registered.
   */
  protected handleExplicitPattern(value: any, pattern: types.Pattern): boolean {
    const validatorKind = pattern.getKind();
    const validator = this.getValidator(validatorKind);

    if (validator === undefined) {
      throw new PatternValidatorNotFoundError(validatorKind);
    }

    return validator.validate(value, pattern, this);
  }

  /**
   * Handles implicit expectation by iterating over all registered validators like in chain of responsibility pattern to find applicable one.
   * @param value - Value that needs to validated.
   * @param expectation - Implicit definition.
   * @param isStrict - Flag indicating that evaluation should be done in strict mode.
   * @returns Returns true if validation is successful, else throws.
   */
  protected handleImplicitExpectation(
    value: any,
    expectation: types.Expectation,
    isStrict: boolean
  ): boolean | undefined {
    for (const validator of this.getValidators()) {
      if (validator.canValidate(expectation, isStrict)) {
        return validator.validate(value, expectation, this);
      }
    }

    return undefined;
  }
}
