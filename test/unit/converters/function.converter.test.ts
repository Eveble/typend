import { expect } from 'chai';
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
        ).to.be.true;
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
        ).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects function types to Function constructor', () => {
      expect(typeConverter.reflect(reflect<() => void>())).to.be.eql(Function);
      expect(typeConverter.reflect(reflect<(x: number) => string>())).to.be.eql(
        Function
      );
      expect(typeConverter.reflect(reflect<Function>())).to.be.eql(Function);
    });
  });

  describe('conversion', () => {
    it('converts function types to instance of InstanceOf pattern', () => {
      const result: any = typeConverter.convert(reflect<() => void>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result[0]).to.be.eql(Function);
    });

    it('converts complex function types to instance of InstanceOf pattern', () => {
      const result: any = typeConverter.convert(
        reflect<(x: number, y: string) => boolean>()
      );
      expect(result).to.be.instanceof(InstanceOf);
      expect(result[0]).to.be.eql(Function);
    });

    it('converts Function constructor to instance of InstanceOf pattern', () => {
      const result: any = typeConverter.convert(reflect<Function>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result[0]).to.be.eql(Function);
    });
  });
});
