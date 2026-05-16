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
import { VoidConverter } from '../../../src/converters/tsruntime/type-converters/void.converter';
import { Void } from '../../../src/patterns/void';

describe(`VoidConverter`, () => {
  let typeConverter: VoidConverter;

  beforeAll(() => {
    typeConverter = new VoidConverter();
  });

  describe('evaluation', () => {
    it('returns true for void type', () => {
      expect(typeConverter.isConvertible(reflect<void>())).toBe(true);
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<null>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<string>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<any>())).toBe(false);
    });
  });

  describe('reflection', () => {
    it('reflects void type to Void instance', () => {
      const result = typeConverter.reflect(reflect<void>());
      expect(result).toBeInstanceOf(Void);
    });
  });

  describe('conversion', () => {
    it('converts void type to Void pattern', () => {
      const result = typeConverter.convert(reflect<void>());
      expect(result).toBeInstanceOf(Void);
    });
  });
});
