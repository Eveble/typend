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
import { NullConverter } from '../../../src/converters/tsruntime/type-converters/null.converter';

describe(`NullConverter`, () => {
  let typeConverter: NullConverter;

  beforeAll(() => {
    typeConverter = new NullConverter();
  });

  describe('evaluation', () => {
    it('returns true for null', () => {
      expect(typeConverter.isConvertible(reflect<null>())).toBe(true);
    });

    it('returns false for undefined', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).toBe(false);
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).toBe(false);
    });
  });

  describe('reflection', () => {
    it('reflects null', () => {
      expect(typeConverter.reflect(reflect<null>())).toEqual(null);
    });
  });

  describe('conversion', () => {
    it('converts null', () => {
      expect(typeConverter.convert(reflect<null>())).toEqual(null);
    });
  });
});
