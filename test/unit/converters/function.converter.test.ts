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
import { FunctionConverter } from '../../../src/converters/tsruntime/type-converters/function.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`FunctionConverter`, () => {
  let typeConverter: FunctionConverter;

  beforeEach(() => {
    typeConverter = new FunctionConverter();
  });

  describe('evaluation', () => {
    it('returns true for function types', () => {
      const examples: [string, any][] = [
        ['() => void', reflect<() => void>()],
        ['() => string', reflect<() => string>()],
        ['(x: number) => string', reflect<(x: number) => string>()],
        [
          '(x: number, y: string) => boolean',
          reflect<(x: number, y: string) => boolean>(),
        ],
        ['Function', reflect<Function>()],
      ];

      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns false for non-function types', () => {
      const examples: [string, any][] = [
        ['string', reflect<string>()],
        ['number', reflect<number>()],
        ['boolean', reflect<boolean>()],
        ['object', reflect<object>()],
        ['undefined', reflect<undefined>()],
        ['null', reflect<null>()],
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
    it('reflects function types to Function constructor', () => {
      expect(typeConverter.reflect(reflect<() => void>())).toEqual(Function);
      expect(typeConverter.reflect(reflect<(x: number) => string>())).toEqual(
        Function
      );
      expect(typeConverter.reflect(reflect<Function>())).toEqual(Function);
    });
  });

  describe('conversion', () => {
    it('converts function types to instance of InstanceOf pattern', () => {
      const result: any = typeConverter.convert(reflect<() => void>());
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result[0]).toEqual(Function);
    });

    it('converts complex function types to instance of InstanceOf pattern', () => {
      const result: any = typeConverter.convert(
        reflect<(x: number, y: string) => boolean>()
      );
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result[0]).toEqual(Function);
    });

    it('converts Function constructor to instance of InstanceOf pattern', () => {
      const result: any = typeConverter.convert(reflect<Function>());
      expect(result).toBeInstanceOf(InstanceOf);
      expect(result[0]).toEqual(Function);
    });
  });
});
