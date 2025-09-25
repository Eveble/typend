import { expect } from 'chai';
import { NeverConverter } from '../../../src/converters/tsruntime/type-converters/never.converter';
import { Never } from '../../../src/patterns/never';

describe(`NeverConverter`, () => {
  let typeConverter: NeverConverter;

  beforeEach(() => {
    typeConverter = new NeverConverter();
  });

  describe('evaluation', () => {
    it('returns true for never type', () => {
      const neverType = { kind: 14 }; // TypeKind.Never
      expect(typeConverter.isConvertible(neverType)).to.be.true;
    });

    it('returns false for non-never types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 11 }, // Void
        { kind: 12 }, // Undefined
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects never type as Never pattern', () => {
      const neverType = { kind: 14 };
      const result = typeConverter.reflect(neverType);
      expect(result).to.be.instanceof(Never);
    });
  });

  describe('conversion', () => {
    it('converts never type to Never pattern', () => {
      const neverType = { kind: 14 };
      const result = typeConverter.convert(neverType);
      expect(result).to.be.instanceof(Never);
    });
  });
});
