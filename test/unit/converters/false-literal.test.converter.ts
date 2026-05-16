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
import { FalseLiteralConverter } from '../../../src/converters/tsruntime/type-converters/false-literal.converter';
import { Equals } from '../../../src';

describe(`FalseLiteralConverter`, () => {
  let typeConverter: FalseLiteralConverter;

  beforeEach(() => {
    typeConverter = new FalseLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for false literal type', () => {
      const falseLiteralType = { kind: 7 }; // TypeKind.FalseLiteral
      expect(typeConverter.isConvertible(falseLiteralType)).toBe(true);
    });

    it('returns false for non-false-literal types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 4 }, // Boolean
        { kind: 8 }, // TrueLiteral
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).toBe(false);
      }
    });
  });

  describe('reflection', () => {
    it('reflects false literal type as false', () => {
      const falseLiteralType = { kind: 7 };
      expect(typeConverter.reflect(falseLiteralType)).toBe(false);
    });
  });

  describe('conversion', () => {
    it('converts false literal type to Equals pattern with false', () => {
      const falseLiteralType = { kind: 7 };
      const result = typeConverter.convert(falseLiteralType);
      expect(result).toBeInstanceOf(Equals);
      expect(result).toEqual(new Equals(false));
    });
  });
});
