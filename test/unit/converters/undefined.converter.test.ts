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
import { UndefinedConverter } from '../../../src/converters/tsruntime/type-converters/undefined.converter';

describe(`UndefinedConverter`, () => {
  let typeConverter: UndefinedConverter;

  beforeAll(() => {
    typeConverter = new UndefinedConverter();
  });

  describe('evaluation', () => {
    it('returns true for undefined', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).toBe(true);
    });

    it('returns false for null', () => {
      expect(typeConverter.isConvertible(reflect<null>())).toBe(false);
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).toBe(false);
    });
  });

  describe('reflection', () => {
    it('reflects undefined', () => {
      expect(typeConverter.reflect(reflect<undefined>())).toEqual(undefined);
    });
  });

  describe('conversion', () => {
    it('converts undefined', () => {
      expect(typeConverter.convert(reflect<undefined>())).toEqual(undefined);
    });
  });
});
