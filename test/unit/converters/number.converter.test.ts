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
import { NumberConverter } from '../../../src/converters/tsruntime/type-converters/number.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`NumberConverter`, () => {
  let typeConverter: NumberConverter;

  beforeAll(() => {
    typeConverter = new NumberConverter();
  });

  describe('evaluation', () => {
    it('returns true for number type', () => {
      expect(typeConverter.isConvertible(reflect<number>())).toBe(true);
    });

    it('returns false for other primitive types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<boolean>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<symbol>())).toBe(false);
    });
  });

  describe('reflection', () => {
    it('reflects number type to Number constructor', () => {
      expect(typeConverter.reflect(reflect<number>())).toBe(Number);
    });

    it('reflects number as a type with initializer', () => {
      const reflectedType = {
        kind: 3,
        initializer: (): number => {
          return 69;
        },
      };
      const result = typeConverter.reflect(reflectedType);
      expect(result).toBe(Number);
    });
  });

  describe('conversion', () => {
    it('converts number type to instance of InstanceOf with Number type', () => {
      const result = typeConverter.convert(reflect<number>());
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result).toEqual(new InstanceOf(Number));
    });

    it('converts number as type with initializer', () => {
      const reflectedType = {
        kind: 3,
        initializer: (): number => {
          return 69;
        },
      };
      const result = typeConverter.convert(reflectedType);
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result).toEqual(new InstanceOf(Number));
      expect(result.hasInitializer()).toBe(true);
      expect(result.getInitializer()).toBe(69);
    });
  });
});
