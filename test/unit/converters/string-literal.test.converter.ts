import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { StringLiteralConverter } from '../../../src/converters/tsruntime/type-converters/string-literal.converter';
import { Equals } from '../../../src/patterns/equals';

describe(`StringLiteralConverter`, function () {
  let typeConverter: StringLiteralConverter;

  before(() => {
    typeConverter = new StringLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for string literal types', () => {
      const examples: [string, any][] = [
        [`'my-string'`, reflect<'my-string'>()],
        [`'hello world'`, reflect<'hello world'>()],
        [`''`, reflect<''>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<number>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<69>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects string literal to its value', () => {
      const reflectedType = { kind: 5, value: 'my-string' };
      expect(typeConverter.reflect(reflectedType)).to.be.equal('my-string');
    });

    it('reflects empty string literal', () => {
      const reflectedType = { kind: 5, value: '' };
      expect(typeConverter.reflect(reflectedType)).to.be.equal('');
    });
  });

  describe('conversion', () => {
    it('converts string literal to instance of Equals pattern', () => {
      const reflectedType = { kind: 5, value: 'my-string' };
      const result = typeConverter.convert(reflectedType);
      expect(result).to.be.instanceof(Equals);
      expect(result).to.be.eql(new Equals('my-string'));
    });
  });
});
