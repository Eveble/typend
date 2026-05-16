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
import { BooleanConverter } from '../../../src/converters/tsruntime/type-converters/boolean.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`BooleanConverter`, () => {
  let typeConverter: BooleanConverter;

  beforeEach(() => {
    typeConverter = new BooleanConverter();
  });

  describe('evaluation', () => {
    it('returns true for boolean type', () => {
      expect(typeConverter.isConvertible(reflect<boolean>())).toBe(true);
    });

    it('returns false for non-boolean types', () => {
      const examples = [
        reflect<string>(),
        reflect<number>(),
        reflect<any>(),
        reflect<true>(),
        reflect<false>(),
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).toBe(false);
      }
    });
  });

  describe('reflection', () => {
    it('reflects boolean type as Boolean constructor', () => {
      expect(typeConverter.reflect(reflect<boolean>())).toEqual(Boolean);
    });
  });

  describe('conversion', () => {
    it('converts boolean type to InstanceOf pattern with Boolean', () => {
      const result = typeConverter.convert(reflect<boolean>());
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result).toEqual(new InstanceOf(Boolean));
    });
  });
});
