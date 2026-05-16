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
import { reflect } from 'tsruntime';
import { TrueLiteralConverter } from '../../../src/converters/tsruntime/type-converters/true-literal.converter';
import { Equals } from '../../../src/patterns/equals';

describe(`TrueLiteralConverter`, () => {
  let typeConverter: TrueLiteralConverter;

  beforeAll(() => {
    typeConverter = new TrueLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for true literal type', () => {
      expect(typeConverter.isConvertible(reflect<true>())).toBe(true);
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<false>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<boolean>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<string>())).toBe(false);
    });
  });

  describe('reflection', () => {
    it('reflects true literal to true value', () => {
      const reflectedType = { kind: 8 };
      expect(typeConverter.reflect(reflectedType)).toBe(true);
    });
  });

  describe('conversion', () => {
    it('converts true literal to instance of Equals pattern', () => {
      const reflectedType = { kind: 8 };
      const result = typeConverter.convert(reflectedType);
      expect(result).toBeInstanceOf(Equals);
      expect(result).toEqual(new Equals(true));
    });
  });
});
