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
import { EnumLiteralConverter } from '../../../src/converters/tsruntime/type-converters/enum-literal.converter';
import { Equals } from '../../../src/patterns/equals';

describe(`EnumLiteralConverter`, () => {
  let typeConverter: EnumLiteralConverter;

  beforeEach(() => {
    typeConverter = new EnumLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for enum literal type', () => {
      const enumLiteralType = { kind: 9, value: 'ENUM_VALUE' }; // TypeKind.EnumLiteral
      expect(typeConverter.isConvertible(enumLiteralType)).toBe(true);
    });

    it('returns false for non-enum-literal types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 2 }, // String
        { kind: 5, value: 'literal' }, // StringLiteral
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).toBe(false);
      }
    });
  });

  describe('reflection', () => {
    it('reflects enum literal type as its value', () => {
      const enumLiteralType = { kind: 9, value: 'TEST_ENUM' };
      expect(typeConverter.reflect(enumLiteralType)).toBe('TEST_ENUM');
    });
  });

  describe('conversion', () => {
    it('converts enum literal type to Equals pattern', () => {
      const enumLiteralType = { kind: 9, value: 'TEST_ENUM' };
      const result = typeConverter.convert(enumLiteralType);
      expect(result).toBeInstanceOf(Equals);
      expect(result).toEqual(new Equals('TEST_ENUM'));
    });
  });
});
