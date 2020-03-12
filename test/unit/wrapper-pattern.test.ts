import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { types } from '../../src/types';
import { WrapperPattern } from '../../src/wrapper-pattern';

chai.use(sinonChai);

describe(`WrapperPattern`, function() {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
  });

  it('wraps provided expectation as array', () => {
    class MyPattern extends WrapperPattern {}
    expect(new MyPattern('my-expectation')).to.be.eql(['my-expectation']);
  });

  it('runs onValidation hook before assigning expectation', () => {
    const onValidation = sinon.stub();
    class MyPattern extends WrapperPattern {
      onValidation(...expectations: any[]): boolean {
        onValidation(expectations);
        return true;
      }
    }

    const expectation = 'my-expectation';
    const instance = new MyPattern(expectation);
    expect(instance).to.be.eql([expectation]);
    expect(onValidation).to.be.calledOnce;
    expect(onValidation).to.be.calledWithExactly([expectation]);
  });

  it('returns patterns type kind', () => {
    class MyPattern extends WrapperPattern {
      static kind = 'my-kind';
    }
    expect(new MyPattern().getKind()).to.be.equal('my-kind');
  });

  it('allows to set describer on WrapperPattern', () => {
    WrapperPattern.setDescriber(describer);
    expect(WrapperPattern.getDescriber()).to.be.equal(describer);
  });

  it('describes provided value to string', () => {
    class MyPattern extends WrapperPattern {}
    MyPattern.setDescriber(describer);

    const pattern = new MyPattern();
    const val = 'my-value';
    const valStr = `String('my-value'`;
    describer.describe.withArgs(val).returns(valStr);

    expect(pattern.describe(val)).to.be.equal(valStr);
    expect(describer.describe).to.be.calledOnce;
    expect(describer.describe).to.be.calledWithExactly(val);
  });

  describe('property initializers', () => {
    class MyPattern extends WrapperPattern {}

    describe('evaluation', () => {
      it('returns true if property initializer is set on pattern', () => {
        const pattern = new MyPattern();
        pattern.setInitializer('my-initializer-value');
        expect(pattern.hasInitializer()).to.be.true;
      });
      it('returns false if property initializer is missing from pattern', () => {
        const pattern = new MyPattern();
        expect(pattern.hasInitializer()).to.be.false;
      });
    });
    it('sets the property initializer on pattern', () => {
      const pattern = new MyPattern();
      const initializer = 'my-initializer-value';
      pattern.setInitializer(initializer);
      expect(pattern.getInitializer()).to.be.equal(initializer);
    });
  });
});
