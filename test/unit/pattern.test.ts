import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { types } from '../../src/types';
import { Pattern } from '../../src/pattern';

chai.use(sinonChai);

describe(`Pattern`, function () {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
  });

  it('returns patterns type kind', () => {
    class MyPattern extends Pattern {
      static kind = 'my-kind';
    }
    expect(new MyPattern().getKind()).to.be.equal('my-kind');
  });

  it('allows to set describer on Pattern', () => {
    Pattern.setDescriber(describer);
    expect(Pattern.getDescriber()).to.be.equal(describer);
  });

  it('describes provided value to string', () => {
    class MyPattern extends Pattern {}
    MyPattern.setDescriber(describer);

    const pattern = new MyPattern();
    const val = 'my-value';
    const valStr = `String('my-value'`;
    describer.describe.withArgs(val).returns(valStr);

    expect(pattern.describe(val)).to.be.equal(valStr);
    expect(describer.describe).to.be.calledOnce;
    expect(describer.describe).to.be.calledWithExactly(val);
  });
});
