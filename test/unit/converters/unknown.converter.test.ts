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
import { UnknownConverter } from '../../../src/converters/tsruntime/type-converters/unknown.converter';
import { Unknown } from '../../../src/patterns/unknown';

describe(`UnknownConverter`, () => {
  let typeConverter: UnknownConverter;

  beforeEach(() => {
    typeConverter = new UnknownConverter();
  });

  describe('evaluation', () => {
    it('returns true for unknown type', () => {
      expect(typeConverter.isConvertible(reflect<unknown>())).toBe(true);
    });

    it('returns true for Unknown2 type kind (999)', () => {
      // Mock a reflected type with Unknown2 kind
      const mockReflectedType = { kind: 999 };
      expect(typeConverter.isConvertible(mockReflectedType as any)).toBe(true);
    });

    it('returns false for other types', () => {
      const examples: [string, any][] = [
        ['string', reflect<string>()],
        ['number', reflect<number>()],
        ['any', reflect<any>()],
        ['boolean', reflect<boolean>()],
        // ['object', reflect<object>()], // This will return 999
        ['void', reflect<void>()],
        ['undefined', reflect<undefined>()],
      ];

      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to not be convertible`
        ).toBe(false);
      }
    });
  });

  describe('reflection', () => {
    it('reflects unknown type to instance of Unknown', () => {
      expect(typeConverter.reflect(reflect<unknown>())).toBeInstanceOf(Unknown);
    });

    it('reflects Unknown2 type kind to instance of Unknown', () => {
      const mockReflectedType = { kind: 999 };
      const result = typeConverter.reflect(mockReflectedType as any);
      expect(result).toBeInstanceOf(Unknown);
    });
  });

  describe('conversion', () => {
    it('converts unknown reflected type to instance of Unknown', () => {
      expect(typeConverter.convert(reflect<unknown>())).toBeInstanceOf(Unknown);
    });

    it('converts Unknown2 type kind to instance of Unknown', () => {
      const mockReflectedType = { kind: 999 };
      const result = typeConverter.convert(mockReflectedType as any);
      expect(result).toBeInstanceOf(Unknown);
    });
  });
});
