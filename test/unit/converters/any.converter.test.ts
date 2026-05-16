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
import { AnyConverter } from '../../../src/converters/tsruntime/type-converters/any.converter';
import { Any } from '../../../src/patterns/any';

describe(`AnyConverter`, () => {
  let typeConverter: AnyConverter;

  beforeEach(() => {
    typeConverter = new AnyConverter();
  });

  describe('evaluation', () => {
    it('returns true for any type', () => {
      expect(typeConverter.isConvertible(reflect<any>())).toBe(true);
    });

    it('returns false for non-any types', () => {
      const examples = [
        reflect<string>(),
        reflect<number>(),
        reflect<boolean>(),
        reflect<object>(),
        reflect<undefined>(),
        reflect<null>(),
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).toBe(false);
      }
    });
  });

  describe('reflection', () => {
    it('reflects any type as Any pattern', () => {
      const result = typeConverter.reflect(reflect<any>());
      expect(result).toBeInstanceOf(Any);
    });
  });

  describe('conversion', () => {
    it('converts any type to Any pattern', () => {
      const result = typeConverter.convert(reflect<any>());
      expect(result).toBeInstanceOf(Any);
    });
  });
});
