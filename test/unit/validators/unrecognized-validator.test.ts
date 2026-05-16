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
import { stubInterface } from '../../vitest-helper';
import { inspect } from 'util';
import { UnrecognizedValidator } from '../../../src/validators/unrecognized-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { Unrecognized } from '../../../src/patterns/unrecognized';
import { types } from '../../../src/types';
import { UnknownError } from '../../../src/errors';

describe(`UnrecognizedValidator`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(UnrecognizedValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('construction', () => {
    it('takes default behavior as a boolean and assigns it', () => {
      expect(new UnrecognizedValidator(true).getDefaultBehavior()).toBe(true);
      expect(new UnrecognizedValidator(false).getDefaultBehavior()).toBe(false);
    });
  });

  describe('evaluation', () => {
    it('returns true for pattern instance of Unrecognized', () => {
      const unrecognizedValidator = new UnrecognizedValidator(true);
      expect(
        unrecognizedValidator.canValidate(
          new Unrecognized('unrecognized-value')
        )
      ).toBe(true);
    });

    it('returns false for any other implicit expectation', () => {
      const unrecognizedValidator = new UnrecognizedValidator(true);
      expect(unrecognizedValidator.canValidate(true)).toBe(false);
      expect(unrecognizedValidator.canValidate(false)).toBe(false);
      expect(unrecognizedValidator.canValidate(undefined)).toBe(false);
      expect(unrecognizedValidator.canValidate(null)).toBe(false);
    });
  });

  describe('validation', () => {
    it('returns true for unrecognized value as default behavior assigned on validator construction', () => {
      const unrecognizedValidator = new UnrecognizedValidator(true);
      const val = 'my-unrecognized-value';
      const unrecognized = new Unrecognized('unrecognized-value');
      expect(unrecognizedValidator.validate(val, unrecognized)).toBe(true);
    });

    it('throws UnknownError for unrecognized value as default behavior assigned on validator construction', () => {
      const unrecognizedValidator = new UnrecognizedValidator(false);
      const val = 'my-unrecognized-value';
      const expectation = 'unrecognized-value';
      const unrecognized = new Unrecognized(expectation);
      const valStr = inspect(val);
      const expectationStr = inspect(expectation);
      describer.describe.withArgs(val).returns(valStr);
      describer.describe.withArgs(expectation).returns(expectationStr);

      expect(() => unrecognizedValidator.validate(val, unrecognized)).toThrow(
        UnknownError,
        `Unrecognized expectation ${expectationStr} that cannot handle ${valStr} value`
      );
    });
  });
});
