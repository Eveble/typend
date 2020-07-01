import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { types } from '../../src/types';
import { PatternValidator } from '../../src/pattern-validator';

chai.use(sinonChai);

describe(`PatternValidator`, function () {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
  });

  it('allows to set describer on Validator', () => {
    PatternValidator.setDescriber(describer);
    expect(PatternValidator.getDescriber()).to.be.equal(describer);
  });

  it('describes provided value to string', () => {
    class MyValidator extends PatternValidator {}
    MyValidator.setDescriber(describer);

    const validator = new MyValidator();
    const val = 'my-value';
    const valStr = `String('my-value'`;
    describer.describe.withArgs(val).returns(valStr);

    expect(validator.describe(val)).to.be.equal(valStr);
    expect(describer.describe).to.be.calledOnce;
    expect(describer.describe).to.be.calledWithExactly(val);
  });
});
