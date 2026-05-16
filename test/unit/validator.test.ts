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
import { stubInterface } from '../vitest-helper';
import { Validator } from '../../src/validator';
import { types } from '../../src/types';
import {
  PatternValidatorExistError,
  UnknownError,
  PatternValidatorNotFoundError,
} from '../../src/errors';
import { Pattern } from '../../src/pattern';

describe(`Validator`, () => {
  class MyPattern extends Pattern implements types.Pattern {
    public static kind = 'MyValidator';

    public expectation: any;

    constructor(expectation: any) {
      super();
      this.expectation = expectation;
    }

    isValid(expectation: any): boolean {
      return typeof expectation === 'string';
    }
  }

  describe('construction', () => {
    it('takes validators map on construction', () => {
      const validators = new Map();
      const validator = new Validator(validators);
      expect(validator.getAllValidators()).toBe(validators);
    });
  });

  describe('managing validators', () => {
    it(`allows to register validator`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.hasValidator(kind)).toBe(true);
    });

    it(`throws PatternValidatorExistError when overriding existing validator`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(() => validator.registerValidator(kind, patternValidator)).toThrow(
        PatternValidatorExistError,
        `Validator for type '${kind}' would be overwritten. To
    override existing validator use 'Validator::overrideValidator'`
      );
    });

    it(`allows to override existing validator`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();
      const otherValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      validator.overrideValidator(kind, otherValidator);
      expect(validator.getValidator(kind)).toBe(otherValidator);
    });

    it(`returns registered validator `, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.getValidator(kind)).toBe(patternValidator);
    });

    it(`throws PatternValidatorNotFoundError if validator for id can't be found`, () => {
      const kind = 'my-type';
      const validator = new Validator();
      expect(() => validator.getValidatorOrThrow(kind)).toThrow(
        PatternValidatorNotFoundError,
        `Validator for type '${kind}' can't be found`
      );
    });

    it(`returns true if validator is registered`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.hasValidator(kind)).toBe(true);
    });

    it(`returns false if validator is not registered`, () => {
      const validator = new Validator();
      expect(validator.hasValidator('my-not-registered-validator')).toBe(false);
    });

    it(`returns all validators in not-sorted order`, () => {
      const firstPatternValidator = stubInterface<types.PatternValidator>();
      const secondPatternValidator = stubInterface<types.PatternValidator>();
      const thirdPatternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator('first', firstPatternValidator);
      validator.registerValidator('second', secondPatternValidator);
      validator.registerValidator('third', thirdPatternValidator);

      const validators = validator.getValidators();
      expect(validators).toBeInstanceOf(Array);
      expect(validators).toHaveLength(3);
      expect(validators).toEqual(
        expect.arrayContaining([
          firstPatternValidator,
          secondPatternValidator,
          thirdPatternValidator,
        ])
      );
    });

    it(`returns all registered validator mappings`, () => {
      const firstPatternValidator = stubInterface<types.PatternValidator>();
      const secondPatternValidator = stubInterface<types.PatternValidator>();
      const thirdPatternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator('first', firstPatternValidator);
      validator.registerValidator('second', secondPatternValidator);
      validator.registerValidator('third', thirdPatternValidator);

      const validators = validator.getAllValidators();
      expect(validators).toBeInstanceOf(Map);
      expect(validators).toHaveLength(3);
      expect(validators).toEqual(
        new Map([
          ['first', firstPatternValidator],
          ['second', secondPatternValidator],
          ['third', thirdPatternValidator],
        ])
      );
    });

    it(`removes validator by id`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.hasValidator(kind)).toBe(true);
      validator.removeValidator(kind);
      expect(validator.hasValidator(kind)).toBe(false);
    });
  });

  describe('managing validators order', () => {
    it(`allows to set sorting for patterns`, () => {
      const kind = 'my-type';
      const order = [kind];

      const validator = new Validator();
      validator.setOrder(order);
      expect(validator.getOrder()).toBe(order);
    });

    it(`returns sorted patterns`, () => {
      const stubs: [string, types.PatternValidator][] = [
        ['first', stubInterface<types.PatternValidator>()],
        ['second', stubInterface<types.PatternValidator>()],
        ['third', stubInterface<types.PatternValidator>()],
      ];
      const validators = new Map(stubs);

      const validator = new Validator();
      validator.setValidators(validators);
      const order = ['third', 'first', 'second'];
      validator.setOrder(order);

      const sortedOrder = validator.getValidators();
      expect(sortedOrder.length).toBe(3);
      expect(sortedOrder[0]).toBe(stubs[2][1]);
      expect(sortedOrder[1]).toBe(stubs[0][1]);
      expect(sortedOrder[2]).toBe(stubs[1][1]);
    });
  });

  describe('delegated validation', () => {
    it(`throws PatternValidatorNotFoundError if validator for explicit pattern can't be found`, () => {
      const val = 'my-value';
      const expectation = 'my-expectation';
      const pattern = new MyPattern(expectation);

      const validator = new Validator();

      expect(() => validator.validate(val, pattern)).toThrow(
        PatternValidatorNotFoundError,
        `Validator for type 'MyValidator' can't be found`
      );
    });

    describe('explicit patterns', () => {
      it('delegates validation for explicit pattern', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);
        const patternValidator = stubInterface<types.PatternValidator>();

        const validator = new Validator();
        validator.registerValidator('MyValidator', patternValidator);
        patternValidator.validate
          .withArgs(val, pattern, validator)
          .returns(true);

        expect(validator.validate(val, pattern)).toBe(true);
        expect(patternValidator.validate).toHaveBeenCalledTimes(1);
        expect(patternValidator.validate).toHaveBeenCalledWith(
          val,
          pattern,
          validator
        );
      });

      it('instantiates pattern if passed expectation is pattern class constructor', () => {
        class MyOtherPattern extends Pattern {
          public static kind = 'MyValidator';

          key: 'my-other-pattern';
        }

        const val = 'my-value';
        const pattern = MyOtherPattern;
        const patternValidator = stubInterface<types.PatternValidator>();

        const validator = new Validator();
        validator.registerValidator('MyValidator', patternValidator);
        patternValidator.validate
          .withArgs(val, new MyOtherPattern(), validator)
          .returns(true);

        expect(validator.validate(val, pattern)).toBe(true);
        expect(patternValidator.validate).toHaveBeenCalledTimes(1);
        expect(patternValidator.validate).toHaveBeenCalledWith(
          val,
          new MyOtherPattern(),
          validator
        );
      });
    });

    describe('implicit expectations', () => {
      it('iterates over validators to evaluate applicable one for implicit expectation ', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const isStrict = true;

        const firstPatternValidator = stubInterface<types.PatternValidator>();
        const secondPatternValidator = stubInterface<types.PatternValidator>();
        const myValidator = stubInterface<types.PatternValidator>();
        const validator = new Validator();

        validator.registerValidator('first', firstPatternValidator);
        validator.registerValidator('second', secondPatternValidator);
        validator.registerValidator('MyValidator', myValidator);

        firstPatternValidator.canValidate
          .withArgs(expectation, isStrict)
          .returns(false);
        secondPatternValidator.canValidate
          .withArgs(expectation, isStrict)
          .returns(false);
        myValidator.canValidate.withArgs(expectation, isStrict).returns(true);
        myValidator.validate
          .withArgs(val, expectation, validator)
          .returns(true);

        expect(validator.validate(val, expectation, isStrict)).toBe(true);
        expect(myValidator.validate).toHaveBeenCalledTimes(1);
        expect(myValidator.validate).toHaveBeenCalledWith(
          val,
          expectation,
          validator
        );
      });
    });

    it(`throws UnknownError if implicit expectation can't be validated by any of registered validators`, () => {
      const val = 'my-value';
      const expectation = 'my-expectation';
      const isStrict = true;
      const validator = new Validator();

      expect(() => validator.validate(val, expectation, isStrict)).toThrow(
        UnknownError,
        `Unknown expectation that can't be handled`
      );
    });
  });

  describe('evaluation', () => {
    describe('isValid', () => {
      it('returns true if value matches expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);
        const isStrict = true;

        const validator = new Validator();
        const validate = vi.spyOn(validator, 'validate');
        validate.mockImplementation((...args: any[]) => {
          const callArgs = [val, pattern, isStrict];
          if (
            args.length === callArgs.length &&
            args.every((arg: any, i: number) => arg === callArgs[i])
          ) {
            return true;
          }
          return undefined;
        });

        expect(validator.isValid(val, pattern, isStrict)).toBe(true);
      });

      it('returns false if value does not match expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);
        const isStrict = true;

        const validator = new Validator();
        const validate = vi.spyOn(validator, 'validate');
        validate.mockImplementation((...args: any[]) => {
          const callArgs = [val, pattern, isStrict];
          if (
            args.length === callArgs.length &&
            args.every((arg: any, i: number) => arg === callArgs[i])
          ) {
            throw new Error('my-error');
          }
          return undefined;
        });

        expect(validator.isValid(val, pattern, isStrict)).toBe(false);
      });
    });

    describe('isInstanceOf', () => {
      it('returns true if value is instance of expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);

        const validator = new Validator();
        const validate = vi.spyOn(validator, 'validate');
        validate.mockImplementation((...args: any[]) => {
          const callArgs = [val, pattern];
          if (
            args.length === callArgs.length &&
            args.every((arg: any, i: number) => arg === callArgs[i])
          ) {
            return true;
          }
          return undefined;
        });

        expect(validator.isInstanceOf(val, pattern)).toBe(true);
      });

      it('returns false if value is not instance of expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);

        const validator = new Validator();
        const validate = vi.spyOn(validator, 'validate');
        validate.mockImplementation((...args: any[]) => {
          const callArgs = [val, pattern];
          if (
            args.length === callArgs.length &&
            args.every((arg: any, i: number) => arg === callArgs[i])
          ) {
            throw new Error('my-error');
          }
          return undefined;
        });

        expect(validator.isInstanceOf(val, pattern)).toBe(false);
      });
    });
  });
});
