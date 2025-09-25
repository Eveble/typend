import { expect, use } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { Validator } from '../../src/validator';
import { types } from '../../src/types';
import {
  PatternValidatorExistError,
  UnknownError,
  PatternValidatorNotFoundError,
} from '../../src/errors';
import { Pattern } from '../../src/pattern';

use(sinonChai);

describe(`Validator`, () => {
  class MyPattern extends Pattern implements types.Pattern {
    public static kind = 'MyValidator';

    public expectation: any;

    constructor(expectation: any) {
      super();
      this.expectation = expectation;
    }

    isValid(expectation: any): boolean {
      return typeof expectation === 'string';
    }
  }

  describe('construction', () => {
    it('takes validators map on construction', () => {
      const validators = new Map();
      const validator = new Validator(validators);
      expect(validator.getAllValidators()).to.be.equal(validators);
    });
  });

  describe('managing validators', () => {
    it(`allows to register validator`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.hasValidator(kind)).to.be.true;
    });

    it(`throws PatternValidatorExistError when overriding existing validator`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(() =>
        validator.registerValidator(kind, patternValidator)
      ).to.throw(
        PatternValidatorExistError,
        `Validator for type '${kind}' would be overwritten. To
    override existing validator use 'Validator::overrideValidator'`
      );
    });

    it(`allows to override existing validator`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();
      const otherValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      validator.overrideValidator(kind, otherValidator);
      expect(validator.getValidator(kind)).to.be.equal(otherValidator);
    });

    it(`returns registered validator `, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.getValidator(kind)).to.be.equal(patternValidator);
    });

    it(`throws PatternValidatorNotFoundError if validator for id can't be found`, () => {
      const kind = 'my-type';
      const validator = new Validator();
      expect(() => validator.getValidatorOrThrow(kind)).to.throw(
        PatternValidatorNotFoundError,
        `Validator for type '${kind}' can't be found`
      );
    });

    it(`returns true if validator is registered`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.hasValidator(kind)).to.be.true;
    });

    it(`returns false if validator is not registered`, () => {
      const validator = new Validator();
      expect(validator.hasValidator('my-not-registered-validator')).to.be.false;
    });

    it(`returns all validators in not-sorted order`, () => {
      const firstPatternValidator = stubInterface<types.PatternValidator>();
      const secondPatternValidator = stubInterface<types.PatternValidator>();
      const thirdPatternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator('first', firstPatternValidator);
      validator.registerValidator('second', secondPatternValidator);
      validator.registerValidator('third', thirdPatternValidator);

      const validators = validator.getValidators();
      expect(validators).to.be.instanceof(Array);
      expect(validators).to.have.length(3);
      expect(validators).to.include.members([
        firstPatternValidator,
        secondPatternValidator,
        thirdPatternValidator,
      ]);
    });

    it(`returns all registered validator mappings`, () => {
      const firstPatternValidator = stubInterface<types.PatternValidator>();
      const secondPatternValidator = stubInterface<types.PatternValidator>();
      const thirdPatternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator('first', firstPatternValidator);
      validator.registerValidator('second', secondPatternValidator);
      validator.registerValidator('third', thirdPatternValidator);

      const validators = validator.getAllValidators();
      expect(validators).to.be.instanceof(Map);
      expect(validators).to.have.length(3);
      expect(validators).to.be.eql(
        new Map([
          ['first', firstPatternValidator],
          ['second', secondPatternValidator],
          ['third', thirdPatternValidator],
        ])
      );
    });

    it(`removes validator by id`, () => {
      const kind = 'my-type';
      const patternValidator = stubInterface<types.PatternValidator>();

      const validator = new Validator();
      validator.registerValidator(kind, patternValidator);
      expect(validator.hasValidator(kind)).to.be.true;
      validator.removeValidator(kind);
      expect(validator.hasValidator(kind)).to.be.false;
    });
  });

  describe('managing validators order', () => {
    it(`allows to set sorting for patterns`, () => {
      const kind = 'my-type';
      const order = [kind];

      const validator = new Validator();
      validator.setOrder(order);
      expect(validator.getOrder()).to.be.equal(order);
    });

    it(`returns sorted patterns`, () => {
      const stubs: [string, types.PatternValidator][] = [
        ['first', stubInterface<types.PatternValidator>()],
        ['second', stubInterface<types.PatternValidator>()],
        ['third', stubInterface<types.PatternValidator>()],
      ];
      const validators = new Map(stubs);

      const validator = new Validator();
      validator.setValidators(validators);
      const order = ['third', 'first', 'second'];
      validator.setOrder(order);

      const sortedOrder = validator.getValidators();
      expect(sortedOrder.length).to.be.equal(3);
      expect(sortedOrder[0]).to.be.equal(stubs[2][1]);
      expect(sortedOrder[1]).to.be.equal(stubs[0][1]);
      expect(sortedOrder[2]).to.be.equal(stubs[1][1]);
    });
  });

  describe('delegated validation', () => {
    it(`throws PatternValidatorNotFoundError if validator for explicit pattern can't be found`, () => {
      const val = 'my-value';
      const expectation = 'my-expectation';
      const pattern = new MyPattern(expectation);

      const validator = new Validator();

      expect(() => validator.validate(val, pattern)).to.throw(
        PatternValidatorNotFoundError,
        `Validator for type 'MyValidator' can't be found`
      );
    });

    context('explicit patterns', () => {
      it('delegates validation for explicit pattern', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);
        const patternValidator = stubInterface<types.PatternValidator>();

        const validator = new Validator();
        validator.registerValidator('MyValidator', patternValidator);
        patternValidator.validate
          .withArgs(val, pattern, validator)
          .returns(true);

        expect(validator.validate(val, pattern)).to.be.true;
        expect(patternValidator.validate).to.be.calledOnce;
        expect(patternValidator.validate).to.be.calledWithExactly(
          val,
          pattern,
          validator
        );
      });

      it('instantiates pattern if passed expectation is pattern class constructor', () => {
        class MyOtherPattern extends Pattern {
          public static kind = 'MyValidator';

          key: 'my-other-pattern';
        }

        const val = 'my-value';
        const pattern = MyOtherPattern;
        const patternValidator = stubInterface<types.PatternValidator>();

        const validator = new Validator();
        validator.registerValidator('MyValidator', patternValidator);
        patternValidator.validate
          .withArgs(val, new MyOtherPattern(), validator)
          .returns(true);

        expect(validator.validate(val, pattern)).to.be.true;
        expect(patternValidator.validate).to.be.calledOnce;
        expect(patternValidator.validate).to.be.calledWithMatch(
          val,
          new MyOtherPattern(),
          validator
        );
      });
    });

    context('implicit expectations', () => {
      it('iterates over validators to evaluate applicable one for implicit expectation ', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const isStrict = true;

        const firstPatternValidator = stubInterface<types.PatternValidator>();
        const secondPatternValidator = stubInterface<types.PatternValidator>();
        const myValidator = stubInterface<types.PatternValidator>();
        const validator = new Validator();

        validator.registerValidator('first', firstPatternValidator);
        validator.registerValidator('second', secondPatternValidator);
        validator.registerValidator('MyValidator', myValidator);

        firstPatternValidator.canValidate
          .withArgs(expectation, isStrict)
          .returns(false);
        secondPatternValidator.canValidate
          .withArgs(expectation, isStrict)
          .returns(false);
        myValidator.canValidate.withArgs(expectation, isStrict).returns(true);
        myValidator.validate
          .withArgs(val, expectation, validator)
          .returns(true);

        expect(validator.validate(val, expectation, isStrict)).to.be.true;
        expect(myValidator.validate).to.be.calledOnce;
        expect(myValidator.validate).to.be.calledWithExactly(
          val,
          expectation,
          validator
        );
      });
    });

    it(`throws UnknownError if implicit expectation can't be validated by any of registered validators`, () => {
      const val = 'my-value';
      const expectation = 'my-expectation';
      const isStrict = true;
      const validator = new Validator();

      expect(() => validator.validate(val, expectation, isStrict)).to.throw(
        UnknownError,
        `Unknown expectation that can't be handled`
      );
    });
  });

  describe('evaluation', () => {
    describe('isValid', () => {
      it('returns true if value matches expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);
        const isStrict = true;

        const validator = new Validator();
        const validate = sinon.stub(validator, 'validate');
        validate.withArgs(val, pattern, isStrict).returns(true);

        expect(validator.isValid(val, pattern, isStrict)).to.be.true;
      });

      it('returns false if value does not match expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);
        const isStrict = true;

        const validator = new Validator();
        const validate = sinon.stub(validator, 'validate');
        validate.withArgs(val, pattern, isStrict).throws(new Error('my-error'));

        expect(validator.isValid(val, pattern, isStrict)).to.be.false;
      });
    });

    describe('isInstanceOf', () => {
      it('returns true if value is instance of expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);

        const validator = new Validator();
        const validate = sinon.stub(validator, 'validate');
        validate.withArgs(val, pattern).returns(true);

        expect(validator.isInstanceOf(val, pattern)).to.be.true;
      });

      it('returns false if value is not instance of expectation', () => {
        const val = 'my-value';
        const expectation = 'my-expectation';
        const pattern = new MyPattern(expectation);

        const validator = new Validator();
        const validate = sinon.stub(validator, 'validate');
        validate.withArgs(val, pattern).throws(new Error('my-error'));

        expect(validator.isInstanceOf(val, pattern)).to.be.false;
      });
    });
  });
});
