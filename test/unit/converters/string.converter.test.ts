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
import { StringConverter } from '../../../src/converters/tsruntime/type-converters/string.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`StringConverter`, () => {
  let typeConverter: StringConverter;

  beforeAll(() => {
    typeConverter = new StringConverter();
  });

  describe('evaluation', () => {
    it('returns true for string type', () => {
      expect(typeConverter.isConvertible(reflect<string>())).toBe(true);
    });

    it('returns false for other primitive types', () => {
      expect(typeConverter.isConvertible(reflect<number>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<boolean>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<symbol>())).toBe(false);
    });
  });

  describe('reflection', () => {
    it('reflects string type to String constructor', () => {
      expect(typeConverter.reflect(reflect<string>())).toBe(String);
    });

    it('reflects string as a type with initializer', () => {
      const reflectedType = {
        kind: 2,
        initializer: (): string => {
          return 'my-string';
        },
      };
      const result = typeConverter.reflect(reflectedType);
      expect(result).toBe(String);
    });
  });

  describe('conversion', () => {
    it('converts string type to instance of InstanceOf with String type', () => {
      const result = typeConverter.convert(reflect<string>());
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result).toEqual(new InstanceOf(String));
    });

    it('converts string as type with initializer', () => {
      const reflectedType = {
        kind: 2,
        initializer: (): string => {
          return 'my-string';
        },
      };
      const result = typeConverter.convert(reflectedType);
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result).toEqual(new InstanceOf(String));
      expect(result.hasInitializer()).toBe(true);
      expect(result.getInitializer()).toBe('my-string');
    });
  });
});
