import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { FunctionConverter } from '../../../../../src/converters/tsruntime/type-converters/function-converter';
import { InstanceOf } from '../../../../../src/patterns/instance-of';

describe(`FunctionConverter`, function() {
  let typeConverter: FunctionConverter;

  before(() => {
    typeConverter = new FunctionConverter();
  });

  class MyClass {
    key: string;
  }

  type Fn = () => void;

  describe('evaluation', () => {
    it('returns true for Function constructor(reflected as reference(kind:18))', () => {
      expect(typeConverter.isConvertible(reflect<Function>())).to.be.true;
    });

    it('returns true for function declaration(reflected as function(kind:21))', () => {
      expect(typeConverter.isConvertible(reflect<Fn>())).to.be.true;
    });

    it('returns false for class constructor', () => {
      expect(typeConverter.isConvertible(reflect<MyClass>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects Function constructor on Function', () => {
      expect(typeConverter.reflect(reflect<Function>())).to.be.eql(Function);
    });

    it('reflects Function constructor on function type reference', () => {
      expect(typeConverter.reflect(reflect<Fn>())).to.be.eql(Function);
    });
  });

  describe('conversion', () => {
    it('converts Function constructor to instance of InstanceOf with Function type', () => {
      const fnType = typeConverter.convert(reflect<Function>());
      expect(fnType).to.be.instanceof(InstanceOf);
      expect(fnType).to.be.eql(new InstanceOf(Function));
    });

    it('converts function definition to instance of InstanceOf with Function type', () => {
      const fnType = typeConverter.convert(reflect<Fn>());
      expect(fnType).to.be.instanceof(InstanceOf);
      expect(fnType).to.be.eql(new InstanceOf(Function));
    });
  });
});
