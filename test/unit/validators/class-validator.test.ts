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
import { Class } from '../../../src/patterns/class';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { ClassValidator } from '../../../src/validators/class-validator';
import {
  UnequalValueError,
  InvalidTypeError,
  UnexpectedKeyError,
  ValidationError,
  UnmatchedTypeError,
} from '../../../src/errors';

describe(`ClassValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = mock<types.Describer>();
    validator = mock<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  class MyClass {
    key: string;

    constructor(props: Record<string, any>) {
      Object.assign(this, props);
    }
  }

  it(`extends PatternValidator`, () => {
    expect(ClassValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Class', () => {
        const classValidator = new ClassValidator();
        expect(
          classValidator.canValidate(new Class(MyClass, { key: String }))
        ).toBe(true);
      });
    });

    describe('implicit expectation', () => {
      it('does not support implicit expectations', () => {
        const classValidator = new ClassValidator();
        expect(classValidator.canValidate(undefined)).toBe(false);
        expect(classValidator.canValidate(null)).toBe(false);
        expect(classValidator.canValidate(true)).toBe(false);
        expect(classValidator.canValidate(false)).toBe(false);
        expect(classValidator.canValidate({})).toBe(false);
      });
    });
  });

  describe(`validation`, () => {
    it(`throws InvalidTypeError if provided value is not a class instance`, () => {
      const classValidator = new ClassValidator();

      const val = {
        key: 'value',
      };
      const expectation = new Class(MyClass, {
        key: String,
      });
      const valStr = inspect(val);
      describer.describe.mockReturnValue(valStr);

      expect(() =>
        classValidator.validate(val, expectation, validator)
      ).toThrow(
        InvalidTypeError,
        `Expected ${valStr} to be an instance of MyClass`
      );
      expect(describer.describe).toHaveBeenCalled();
      expect(describer.describe).toHaveBeenCalledWith(val);
    });

    it('ensures that properties are pulled from Class pattern instance correctly', () => {
      const classValidator = new ClassValidator();
      const value = new MyClass({ key: 'value' });
      const expectation = new Class(MyClass, { key: String });

      expect(classValidator.validate(value, expectation, validator)).toBe(true);
    });

    describe('valid values', () => {
      it(`iterates through each expected properties entries and validates them against validator`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          first: string;

          second: number;

          constructor(props: Record<string, any>) {
            Object.assign(this, props);
          }
        }

        const val = new MyOtherClass({
          first: 'value',
          second: 2,
        });
        const expectation = new Class(MyOtherClass, {
          first: String,
          second: Number,
        });
        validator.validate.calledWith('value', String).mockReturnValue(true);
        validator.validate.calledWith(2, Number).mockReturnValue(true);

        expect(classValidator.validate(val, expectation, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
      });
    });

    describe('invalid values', () => {
      it(`throws UnexpectedKeyError if provided value contain keys not listed on expected properties`, () => {
        const classValidator = new ClassValidator();

        const val = new MyClass({
          first: 'value',
          second: 2,
        });
        const expectation = new Class(MyClass, {
          first: String,
        });
        const valStr = JSON.stringify(val);
        describer.describe.calledWith(val).mockReturnValue(valStr);
        validator.validate.calledWith('value', String).mockReturnValue(true);
        validator.validate.calledWith(2, undefined).mockImplementation(() => {
          throw new UnequalValueError(`Expected Number(2) to be a undefined`);
        });

        expect(() =>
          classValidator.validate(val, expectation, validator)
        ).toThrow(UnexpectedKeyError, `Unexpected key 'second' in ${valStr}`);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
      });

      it(`pass-through errors from type validator validation if provided instance contain nested properties that does not match expected ones`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          foo: {
            bar: {
              a: string;
              b: number;
            };
            baz: {
              c: 'value';
            };
          };

          constructor(props: Record<string, any>) {
            Object.assign(this, props);
          }
        }

        const expectation = new Class(MyOtherClass, {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'value',
            },
          },
        });
        const val = new MyOtherClass({
          foo: {
            bar: {
              a: 'a-value',
              b: 'b-invalid-not-a-number',
            },
            baz: {
              c: 'c-value',
            },
          },
        });
        const valStr = JSON.stringify(val);
        describer.describe.calledWith(val).mockReturnValue(valStr);

        validator.validate.calledWith('a-value', String).mockReturnValue(true);
        validator.validate
          .calledWith('b-invalid-not-a-number', Number)
          .mockImplementation(() => {
            throw new UnequalValueError(
              `Expected Number, got String("invalid-should-be-number")`
            );
          });
        validator.validate.calledWith('c-value', String).mockReturnValue(true);

        expect(() =>
          classValidator.validate(val, expectation, validator)
        ).toThrow(
          UnequalValueError,
          `(Key 'foo.bar.b': Expected Number, got String("invalid-should-be-number") in {"foo":{"bar":{"a":"a-value","b":"b-invalid-not-a-number"},"baz":{"c":"c-value"}}})`
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('a-value', String);
        expect(validator.validate).toHaveBeenCalledWith(
          'b-invalid-not-a-number',
          Number
        );
      });

      it(`throws UnexpectedKeyError if provided value contain nested keys not listed in the expected properties`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          foo: {
            foo: {
              bar: {
                a: string;
                b: number;
              };
              baz: {
                c: 'c-value';
              };
            };
          };

          constructor(props: Record<string, any>) {
            Object.assign(this, props);
          }
        }

        const props = new Class(MyOtherClass, {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'c-value',
            },
          },
        });

        const val = new MyOtherClass({
          foo: {
            bar: {
              a: 'a-value',
              b: 2,
            },
            baz: {
              c: 'c-value',
              unknown: 'unknown',
            },
          },
        });
        const valStr = JSON.stringify(val);
        describer.describe.calledWith(val).mockReturnValue(valStr);

        validator.validate.calledWith('a-value', String).mockReturnValue(true);
        validator.validate.calledWith(2, Number).mockReturnValue(true);
        validator.validate.calledWith('c-value', String).mockReturnValue(true);
        validator.validate
          .calledWith(
            expect.objectContaining({
              c: 'c-value',
              unknown: 'unknown',
            }),
            expect.objectContaining({
              c: 'c-value',
            })
          )
          .mockImplementation(() => {
            throw new UnexpectedKeyError(
              `Unexpected key unknown in {"c":"value","unknown":"unknown"}`
            );
          });

        expect(() => classValidator.validate(val, props, validator)).toThrow(
          ValidationError,
          `(Key 'foo.baz': Unexpected key unknown in {"c":"value","unknown":"unknown"} in {"foo":{"bar":{"a":"a-value","b":2},"baz":{"c":"c-value","unknown":"unknown"}}})`
        );
        expect(validator.validate).toHaveBeenCalledTimes(3);
        expect(validator.validate).toHaveBeenCalledWith('a-value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
        expect(validator.validate).toHaveBeenCalledWith(
          {
            c: 'c-value',
            unknown: 'unknown',
          },
          {
            c: 'c-value',
          }
        );
      });

      it(`throws UnmatchedTypeError if provided value does not match expected type`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          first: string;
        }

        const val = new MyClass({
          first: 'value',
        });
        const expectation = new Class(MyOtherClass, {
          first: String,
        });
        const valStr = JSON.stringify(val);
        describer.describe.calledWith(val).mockReturnValue(valStr);
        validator.validate.calledWith('value', String).mockReturnValue(true);

        expect(() =>
          classValidator.validate(val, expectation, validator)
        ).toThrow(
          UnmatchedTypeError,
          `Expected ${valStr} to be a instance of MyOtherClass`
        );
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
      });
    });
  });
});
