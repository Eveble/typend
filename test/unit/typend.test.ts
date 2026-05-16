import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import { mock } from 'vitest-mock-extended';
import { inspect } from 'util';
import { Class } from '../../src/patterns/class';
import { types } from '../../src/types';
import { Typend } from '../../src/typend';
import { PatternValidator } from '../../src/pattern-validator';
import { Pattern } from '../../src/pattern';
import { Utility } from '../../src/utility';
import { InvalidTypeError } from '../../src/errors';
import { InstanceOf } from '../../src/patterns/instance-of';
import { Interface } from '../../src/patterns/interface';

describe(`Typend`, () => {
  let converter: any;
  let describer: any;
  let validator: any;

  beforeEach(() => {
    converter = mock<types.Converter>();
    describer = mock<types.Describer>();
    validator = mock<types.Validator>();
  });

  describe('construction', () => {
    it('takes arguments: converters implementing Converter, describer implementing Describer, validator implementing Validator and assigns them', () => {
      const typend = new Typend(converter, describer, validator);
      expect(typend.converter).toBe(converter);
      expect(typend.describer).toBe(describer);
      expect(typend.validator).toBe(validator);
    });
  });

  describe('validation', () => {
    it('delegates validation of inexplicit expectation to validator', () => {
      const typend = new Typend(converter, describer, validator);
      const value = 'my-value';
      const expectation = 'my-expectation';
      const isStrict = true;
      validator.validate
        .calledWith(value, expectation, isStrict)
        .mockReturnValue(true);

      expect(typend.validate(value, expectation, isStrict)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(validator.validate).toHaveBeenCalledWith(
        value,
        expectation,
        isStrict
      );
    });

    it('delegates validation of generated pattern by utility to validator', () => {
      const pattern = mock<types.Pattern>();
      const utility = mock<types.Utility>();
      utility.generate.mockReturnValue(pattern);

      const typend = new Typend(converter, describer, validator);
      const value = 'my-value';
      const isStrict = true;
      validator.validate
        .calledWith(value, pattern, isStrict)
        .mockReturnValue(true);

      expect(typend.validate(value, utility, isStrict)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(validator.validate).toHaveBeenCalledWith(value, pattern, isStrict);
    });

    it('delegates validation of instantiated pattern from class by utility to validator', () => {
      class MyPattern {
        getKind(): string {
          return 'my-kind';
        }
      }

      const typend = new Typend(converter, describer, validator);
      const value = 'my-value';
      const isStrict = true;
      validator.validate.mockReturnValue(true);

      expect(typend.validate(value, MyPattern, isStrict)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(validator.validate.mock.calls[0][0]).toBe(value);
      expect(validator.validate.mock.calls[0][1]).toBeInstanceOf(MyPattern);
      expect(validator.validate.mock.calls[0][2]).toBe(isStrict);
    });
  });

  describe('evaluation', () => {
    describe('isValid', () => {
      it('delegates evaluation of inexplicit expectation to validator', () => {
        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const expectation = 'my-expectation';
        const isStrict = true;
        validator.isValid
          .calledWith(value, expectation, isStrict)
          .mockReturnValue(true);

        expect(typend.isValid(value, expectation, isStrict)).toBe(true);
        expect(validator.isValid).toHaveBeenCalledTimes(1);
        expect(validator.isValid).toHaveBeenCalledWith(
          value,
          expectation,
          isStrict
        );
      });

      it('delegates evaluation of generated pattern by utility to validator', () => {
        const pattern = mock<types.Pattern>();
        const utility = mock<types.Utility>();
        utility.generate.mockReturnValue(pattern);

        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const isStrict = true;
        validator.isValid
          .calledWith(value, pattern, isStrict)
          .mockReturnValue(true);

        expect(typend.isValid(value, utility, isStrict)).toBe(true);
        expect(validator.isValid).toHaveBeenCalledTimes(1);
        expect(validator.isValid).toHaveBeenCalledWith(
          value,
          pattern,
          isStrict
        );
      });

      it('delegates evaluation of instantiated pattern from class by utility to validator', () => {
        class MyPattern {
          getKind(): string {
            return 'my-kind';
          }
        }

        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const isStrict = true;
        validator.isValid.mockReturnValue(true);

        expect(typend.isValid(value, MyPattern, isStrict)).toBe(true);
        expect(validator.isValid).toHaveBeenCalledTimes(1);
        expect(validator.isValid.mock.calls[0][0]).toBe(value);
        expect(validator.isValid.mock.calls[0][1]).toBeInstanceOf(MyPattern);
        expect(validator.isValid.mock.calls[0][2]).toBe(isStrict);
      });
    });

    describe('isInstanceOf', () => {
      it('throws InvalidTypeError error if expectation is not a  class constructor or instance of pattern: Class, InstanceOf, Interface', () => {
        const expectation = 'my-expectation';
        const expectationStr = inspect(expectation);
        describer.describe
          .calledWith(expectation)
          .mockReturnValue(expectationStr);
        const typend = new Typend(converter, describer, validator);
        expect(() => typend.isInstanceOf(true, expectation)).toThrow(
          InvalidTypeError,
          `Provided expectation to instanceOf is invalid. Expected type or interface, got ${expectationStr}`
        );
      });

      it('delegates evaluation of implicit constructor pattern to validator', () => {
        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const expectation = String;
        validator.isInstanceOf
          .calledWith(value, expectation)
          .mockReturnValue(true);

        expect(typend.isInstanceOf(value, expectation)).toBe(true);
        expect(validator.isInstanceOf).toHaveBeenCalledTimes(1);
        expect(validator.isInstanceOf).toHaveBeenCalledWith(value, expectation);
      });

      it('delegates evaluation of explicit Class pattern instance to validator', () => {
        class MyClass {
          key: string;
        }
        const typend = new Typend(converter, describer, validator);
        const value = new MyClass();
        const expectation = new Class(MyClass, { key: String });
        validator.isInstanceOf
          .calledWith(value, expectation)
          .mockReturnValue(true);

        expect(typend.isInstanceOf(value, expectation)).toBe(true);
        expect(validator.isInstanceOf).toHaveBeenCalledTimes(1);
        expect(validator.isInstanceOf).toHaveBeenCalledWith(value, expectation);
      });

      it('delegates evaluation of explicit InstanceOf pattern instance to validator', () => {
        class MyClass {
          key: string;
        }
        const typend = new Typend(converter, describer, validator);
        const value = new MyClass();
        const expectation = new InstanceOf(MyClass);
        validator.isInstanceOf
          .calledWith(value, expectation)
          .mockReturnValue(true);

        expect(typend.isInstanceOf(value, expectation)).toBe(true);
        expect(validator.isInstanceOf).toHaveBeenCalledTimes(1);
        expect(validator.isInstanceOf).toHaveBeenCalledWith(value, expectation);
      });

      it('delegates evaluation of explicit Interface pattern instance to validator', () => {
        const typend = new Typend(converter, describer, validator);
        const value = {
          key: 'my-string',
        };
        const expectation = new Interface({
          key: String,
        });
        validator.isInstanceOf
          .calledWith(value, expectation)
          .mockReturnValue(true);

        expect(typend.isInstanceOf(value, expectation)).toBe(true);
        expect(validator.isInstanceOf).toHaveBeenCalledTimes(1);
        expect(validator.isInstanceOf).toHaveBeenCalledWith(value, expectation);
      });
    });
  });

  describe('overriding', () => {
    it('allows to override converter', () => {
      const otherConverter = mock<types.Converter>();
      const typend = new Typend(converter, describer, validator);
      expect(typend.getConverter()).toBe(converter);

      typend.setConverter(otherConverter);
      expect(typend.getConverter()).toBe(otherConverter);
    });

    it('allows to override describer', () => {
      const otherDescriber = mock<types.Describer>();
      const typend = new Typend(converter, describer, validator);
      expect(Pattern.getDescriber()).toBe(describer);
      expect(PatternValidator.getDescriber()).toBe(describer);
      expect(Utility.getDescriber()).toBe(describer);

      typend.setDescriber(otherDescriber);
      expect(typend.getDescriber()).toBe(otherDescriber);
      expect(Pattern.getDescriber()).toBe(otherDescriber);
      expect(PatternValidator.getDescriber()).toBe(otherDescriber);
      expect(Utility.getDescriber()).toBe(otherDescriber);
    });

    it('allows to override validator', () => {
      const otherValidator = mock<types.Validator>();
      const typend = new Typend(converter, describer, validator);
      expect(typend.getValidator()).toBe(validator);

      typend.setValidator(otherValidator);
      expect(typend.getValidator()).toBe(otherValidator);
    });
  });

  describe('debugging', () => {
    it('enables debugging on library on inexplicit call', () => {
      const typend = new Typend(converter, describer, validator);
      typend.debug();
      expect(describer.setFormatting).toHaveBeenCalledTimes(1);
      expect(describer.setFormatting).toHaveBeenCalledWith('debug');
    });

    it('enables debugging on library on explicit call', () => {
      const typend = new Typend(converter, describer, validator);
      typend.debug(true);
      expect(describer.setFormatting).toHaveBeenCalledTimes(1);
      expect(describer.setFormatting).toHaveBeenCalledWith('debug');
    });

    it('disables debugging on library on explicit call', () => {
      const typend = new Typend(converter, describer, validator);
      typend.debug(false);
      expect(describer.setFormatting).toHaveBeenCalledTimes(1);
      expect(describer.setFormatting).toHaveBeenCalledWith('default');
    });
  });
});
