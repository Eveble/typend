import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Class } from '../../src/patterns/class';
import { types } from '../../src/types';
import { Typend } from '../../src/typend';
import { PatternValidator } from '../../src/pattern-validator';
import { Pattern } from '../../src/pattern';
import { Utility } from '../../src/utility';
import { InvalidTypeError } from '../../src/errors';
import { InstanceOf } from '../../src/patterns/instance-of';
import { Interface } from '../../src/patterns/interface';

chai.use(sinonChai);

describe(`Typend`, () => {
  let converter: any;
  let describer: any;
  let validator: any;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
  });

  describe('construction', () => {
    it('takes arguments: converters implementing Converter, describer implementing Describer, validator implementing Validator and assigns them', () => {
      const typend = new Typend(converter, describer, validator);
      expect(typend.converter).to.be.equal(converter);
      expect(typend.describer).to.be.equal(describer);
      expect(typend.validator).to.be.equal(validator);
    });
  });

  describe('validation', () => {
    it('delegates validation of inexplicit expectation to validator', () => {
      const typend = new Typend(converter, describer, validator);
      const value = 'my-value';
      const expectation = 'my-expectation';
      const isStrict = true;
      validator.validate.withArgs(value, expectation, isStrict).returns(true);

      expect(typend.validate(value, expectation, isStrict)).to.be.true;
      expect(validator.validate).to.be.calledOnce;
      expect(validator.validate).to.be.calledWithExactly(
        value,
        expectation,
        isStrict
      );
    });

    it('delegates validation of generated pattern by utility to validator', () => {
      const pattern = stubInterface<types.Pattern>();
      const utility = stubInterface<types.Utility>();
      utility.generate.returns(pattern);

      const typend = new Typend(converter, describer, validator);
      const value = 'my-value';
      const isStrict = true;
      validator.validate.withArgs(value, pattern, isStrict).returns(true);

      expect(typend.validate(value, utility, isStrict)).to.be.true;
      expect(validator.validate).to.be.calledOnce;
      expect(validator.validate).to.be.calledWithExactly(
        value,
        pattern,
        isStrict
      );
    });

    it('delegates validation of instantiated pattern from class by utility to validator', () => {
      class MyPattern {
        getKind(): string {
          return 'my-kind';
        }
      }

      const typend = new Typend(converter, describer, validator);
      const value = 'my-value';
      const isStrict = true;
      validator.validate.returns(true);

      expect(typend.validate(value, MyPattern, isStrict)).to.be.true;
      expect(validator.validate).to.be.calledOnce;
      expect(validator.validate.getCall(0).args[0]).to.be.equal(value);
      expect(validator.validate.getCall(0).args[1]).to.be.instanceOf(MyPattern);
      expect(validator.validate.getCall(0).args[2]).to.be.equal(isStrict);
    });
  });

  describe('evaluation', () => {
    describe('isValid', () => {
      it('delegates evaluation of inexplicit expectation to validator', () => {
        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const expectation = 'my-expectation';
        const isStrict = true;
        validator.isValid.withArgs(value, expectation, isStrict).returns(true);

        expect(typend.isValid(value, expectation, isStrict)).to.be.true;
        expect(validator.isValid).to.be.calledOnce;
        expect(validator.isValid).to.be.calledWithExactly(
          value,
          expectation,
          isStrict
        );
      });

      it('delegates evaluation of generated pattern by utility to validator', () => {
        const pattern = stubInterface<types.Pattern>();
        const utility = stubInterface<types.Utility>();
        utility.generate.returns(pattern);

        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const isStrict = true;
        validator.isValid.withArgs(value, pattern, isStrict).returns(true);

        expect(typend.isValid(value, utility, isStrict)).to.be.true;
        expect(validator.isValid).to.be.calledOnce;
        expect(validator.isValid).to.be.calledWithExactly(
          value,
          pattern,
          isStrict
        );
      });

      it('delegates evaluation of instantiated pattern from class by utility to validator', () => {
        class MyPattern {
          getKind(): string {
            return 'my-kind';
          }
        }

        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const isStrict = true;
        validator.isValid.returns(true);

        expect(typend.isValid(value, MyPattern, isStrict)).to.be.true;
        expect(validator.isValid).to.be.calledOnce;
        expect(validator.isValid.getCall(0).args[0]).to.be.equal(value);
        expect(validator.isValid.getCall(0).args[1]).to.be.instanceOf(
          MyPattern
        );
        expect(validator.isValid.getCall(0).args[2]).to.be.equal(isStrict);
      });
    });

    describe('isInstanceOf', () => {
      it('throws InvalidTypeError error if expectation is not a  class constructor or instance of pattern: Class, InstanceOf, Interface', () => {
        const expectation = 'my-expectation';
        const expectationStr = inspect(expectation);
        describer.describe.withArgs(expectation).returns(expectationStr);
        const typend = new Typend(converter, describer, validator);
        expect(() => typend.isInstanceOf(true, expectation)).to.throw(
          InvalidTypeError,
          `Provided expectation to instanceOf is invalid. Expected type or interface, got ${expectationStr}`
        );
      });

      it('delegates evaluation of implicit constructor pattern to validator', () => {
        const typend = new Typend(converter, describer, validator);
        const value = 'my-value';
        const expectation = String;
        validator.isInstanceOf.withArgs(value, expectation).returns(true);

        expect(typend.isInstanceOf(value, expectation)).to.be.true;
        expect(validator.isInstanceOf).to.be.calledOnce;
        expect(validator.isInstanceOf).to.be.calledWithExactly(
          value,
          expectation
        );
      });

      it('delegates evaluation of explicit Class pattern instance to validator', () => {
        class MyClass {
          key: string;
        }
        const typend = new Typend(converter, describer, validator);
        const value = new MyClass();
        const expectation = new Class(MyClass, { key: String });
        validator.isInstanceOf.withArgs(value, expectation).returns(true);

        expect(typend.isInstanceOf(value, expectation)).to.be.true;
        expect(validator.isInstanceOf).to.be.calledOnce;
        expect(validator.isInstanceOf).to.be.calledWithExactly(
          value,
          expectation
        );
      });

      it('delegates evaluation of explicit InstanceOf pattern instance to validator', () => {
        class MyClass {
          key: string;
        }
        const typend = new Typend(converter, describer, validator);
        const value = new MyClass();
        const expectation = new InstanceOf(MyClass);
        validator.isInstanceOf.withArgs(value, expectation).returns(true);

        expect(typend.isInstanceOf(value, expectation)).to.be.true;
        expect(validator.isInstanceOf).to.be.calledOnce;
        expect(validator.isInstanceOf).to.be.calledWithExactly(
          value,
          expectation
        );
      });

      it('delegates evaluation of explicit Interface pattern instance to validator', () => {
        const typend = new Typend(converter, describer, validator);
        const value = {
          key: 'my-string',
        };
        const expectation = new Interface({
          key: String,
        });
        validator.isInstanceOf.withArgs(value, expectation).returns(true);

        expect(typend.isInstanceOf(value, expectation)).to.be.true;
        expect(validator.isInstanceOf).to.be.calledOnce;
        expect(validator.isInstanceOf).to.be.calledWithExactly(
          value,
          expectation
        );
      });
    });
  });

  describe('overriding', () => {
    it('allows to override converter', () => {
      const otherConverter = stubInterface<types.Converter>();
      const typend = new Typend(converter, describer, validator);
      expect(typend.getConverter()).to.be.equal(converter);

      typend.setConverter(otherConverter);
      expect(typend.getConverter()).to.be.equal(otherConverter);
    });

    it('allows to override describer', () => {
      const otherDescriber = stubInterface<types.Describer>();
      const typend = new Typend(converter, describer, validator);
      expect(Pattern.getDescriber()).to.be.equal(describer);
      expect(PatternValidator.getDescriber()).to.be.equal(describer);
      expect(Utility.getDescriber()).to.be.equal(describer);

      typend.setDescriber(otherDescriber);
      expect(typend.getDescriber()).to.be.equal(otherDescriber);
      expect(Pattern.getDescriber()).to.be.equal(otherDescriber);
      expect(PatternValidator.getDescriber()).to.be.equal(otherDescriber);
      expect(Utility.getDescriber()).to.be.equal(otherDescriber);
    });

    it('allows to override validator', () => {
      const otherValidator = stubInterface<types.Validator>();
      const typend = new Typend(converter, describer, validator);
      expect(typend.getValidator()).to.be.equal(validator);

      typend.setValidator(otherValidator);
      expect(typend.getValidator()).to.be.equal(otherValidator);
    });
  });

  describe('debugging', () => {
    it('enables debugging on library on inexplicit call', () => {
      const typend = new Typend(converter, describer, validator);
      typend.debug();
      expect(describer.setFormatting).to.be.calledOnce;
      expect(describer.setFormatting).to.be.calledWithExactly('debug');
    });

    it('enables debugging on library on explicit call', () => {
      const typend = new Typend(converter, describer, validator);
      typend.debug(true);
      expect(describer.setFormatting).to.be.calledOnce;
      expect(describer.setFormatting).to.be.calledWithExactly('debug');
    });

    it('disables debugging on library on explicit call', () => {
      const typend = new Typend(converter, describer, validator);
      typend.debug(false);
      expect(describer.setFormatting).to.be.calledOnce;
      expect(describer.setFormatting).to.be.calledWithExactly('default');
    });
  });
});
