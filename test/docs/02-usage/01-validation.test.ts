import { expect } from 'chai';
import {
  check,
  UnmatchedTypeError,
  validate,
  define,
  UnequalValueError,
  propsOf,
} from '../../../src';

describe('01-validation', () => {
  describe('TypeScript api', () => {
    it('check', () => {
      expect(check<string>('im-a-string')).to.be.true;
      expect(() => check<number>('im-not-a-number')).to.throw(
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
      expect(validate('im-a-string', String)).to.be.true;
      expect(() => validate('im-not-a-number', Number)).to.throw(
        UnmatchedTypeError,
        `Expected String("im-not-a-number") to be a Number`
      );
    });
    it('validate #4', () => {
      @define()
      class Unicorn {
        sentence: 'sparkle';

        constructor(sentence: 'sparkle') {
          validate({ sentence }, propsOf(Unicorn));
          this.sentence = sentence;
        }
      }
      expect(() => new Unicorn('🦄🦄 Charrlieee! 🍌👑' as any)).to.throw(
        UnequalValueError
      );
    });
  });
});
