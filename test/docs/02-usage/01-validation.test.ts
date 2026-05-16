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
import {
  check,
  UnmatchedTypeError,
  validate,
  Type,
  UnequalValueError,
  propsOf,
} from '../../../src';

describe('01-validation', () => {
  describe('TypeScript api', () => {
    it('check', () => {
      expect(check<string>('im-a-string')).toBe(true);
      expect(() => check<number>('im-not-a-number')).toThrow(
        UnmatchedTypeError,
        `Expected String("im-not-a-number") to be a Number`
      );
    });
  });

  describe('JavaScript', () => {
    it('validate #1', () => {
      validate(
        new Date('December 17, 1995 03:24:00'),
        new Date('December 17, 1995 03:24:00')
      );
    });
    it('validate #2', () => {
      validate('foo', /foo/);
    });
    it('validate #3', () => {
      expect(validate('im-a-string', String)).toBe(true);
      expect(() => validate('im-not-a-number', Number)).toThrow(
        UnmatchedTypeError,
        `Expected String("im-not-a-number") to be a Number`
      );
    });
    it('validate #4', () => {
      @Type()
      class Unicorn {
        sentence: 'sparkle';

        constructor(sentence: 'sparkle') {
          validate({ sentence }, propsOf(Unicorn));
          this.sentence = sentence;
        }
      }
      expect(() => new Unicorn('🦄🦄 Charrlieee! 🍌👑' as any)).toThrow(
        UnequalValueError
      );
    });
  });
});
