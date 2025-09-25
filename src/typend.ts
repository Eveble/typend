import { types } from './types';
import { isPatternClass, isUtility, isInstanceOfExpectation } from './helpers';
import { Pattern } from './pattern';
import { PatternValidator } from './pattern-validator';
import { Utility } from './utility';
import { InvalidTypeError } from './errors';

class Typend implements types.Library {
  public converter: types.Converter;

  public describer: types.Describer;

  public validator: types.Validator;

  /**
   * Creates an instance of Typend.
   * @param converter - Conversion library matching `Converter` interface.
   * @param describer - Description library matching `Describer` interface.
   * @param validator - Validation library matching `Validator` interface.
   */
  constructor(
    converter: types.Converter,
    describer: types.Describer,
    validator: types.Validator
  ) {
    this.converter = converter;
    this.setDescriber(describer);
    this.validator = validator;
  }

  /**
   * Validates if a value matches an expectation or throws.
   * @param value - Value that needs to validated.
   * @param expectation - Expectation as explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated.
   * @param isStrict - Flag indicating that evaluation should be done in strict mode.
   * @returns Returns `true` if validation is successful, else throws.
   * @throws {ValidationError}
   * Thrown if the value does not match provided expectation.
   */
  public validate(
    value: any,
    expectation: types.Expectation | Utility,
    isStrict = true
  ): boolean {

    return this.validator.validate(
      value,
      this.processExpectation(expectation),
      isStrict
    );
  }

  /**
   * Validates if a value matches an expectation.
   * @param value - Value that needs to validated.
   * @param expectation - Expectation as explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated.
   * @param isStrict - Flag indicating that evaluation should be done in strict mode.
   * @returns Returns `true` if validation is successful, else `false`.
   */
  public isValid(
    value: any,
    expectation: types.Expectation | Utility,
    isStrict = true
  ): boolean {
    return this.validator.isValid(
      value,
      this.processExpectation(expectation),
      isStrict
    );
  }

  /**
   * Validates if a value is instance of expectation.
   * @param value - Value that needs to validated.
   * @param expectation - Expectation as explicit `Class`, `InstanceOf`, `Interface` pattern instance against which value will be validated.
   * @returns Returns `true` if validation is successful, else `false`.
   */
  public isInstanceOf(value: any, expectation: any): boolean {
    if (!isInstanceOfExpectation(expectation)) {
      throw new InvalidTypeError(
        `Provided expectation to instanceOf is invalid. Expected type or interface, got ${this.describer.describe(
          expectation
        )}`
      );
    }
    return this.validator.isInstanceOf(
      value,
      this.processExpectation(expectation)
    );
  }

  /**
   * Setup debugging mode on Typend.
   * @param isDebugging - `Boolean` flags indicating that debugging should be enabled.
   */
  public debug(isDebugging = true): void {
    if (this.describer !== undefined) {
      const formatting = isDebugging ? 'debug' : 'default';
      this.describer.setFormatting(formatting);
    }
  }

  /**
   * Sets describing library.
   * @param describer - Conversion library matching `Converter` interface.
   */
  public setDescriber(describer: types.Describer): void {
    this.describer = describer;

    ((Pattern as any) as types.PatternType).setDescriber(describer);
    ((PatternValidator as any) as types.PatternValidatorType).setDescriber(
      describer
    );
    ((Utility as any) as types.UtilityType).setDescriber(describer);
  }

  /**
   * Returns describing library.
   * @returns Describer library instance.
   */
  public getDescriber(): types.Describer {
    return this.describer;
  }

  /**
   * Sets converting library.
   * @param converter - Description library matching `Describer` interface.
   */
  public setConverter(converter: types.Converter): void {
    this.converter = converter;
  }

  /**
   * Returns converting library.
   * @returns Converter library instance.
   */
  public getConverter(): types.Converter {
    return this.converter;
  }

  /**
   * Sets validator library.
   * @param validator - Validation library matching `Validator` interface.
   */
  public setValidator(validator: types.Validator): void {
    this.validator = validator;
  }

  /**
   * Returns validator library.
   * @returns Validator library instance.
   */
  public getValidator(): types.Validator {
    return this.validator;
  }

  /**
   * Processes expectation to applicable form.
   * @param expectation - Expectation as explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated.
   * @returns Generated pattern from `Utility` instance; new instance of `Pattern` from `Pattern` class or returns expectation as unchanged.
   */
  protected processExpectation(expectation: types.Expectation): any {
    if (isUtility(expectation)) {
      const utility: types.Utility = (expectation as any) as types.Utility;
      return utility.generate(this);
    }
    if (isPatternClass(expectation)) {
      const PatternCtor = expectation;
      return new PatternCtor();
    }
    return expectation;
  }
}

export { Typend };
