import { expect } from 'chai';
import { validable } from '../../../src/annotations/validable';
import { isValidable } from '../../../src/helpers';

describe(`validable`, function () {
  @validable(false)
  class Parent {}

  @validable(true)
  class Child extends Parent {}

  @validable()
  class ExplicitValidable {}

  @validable(true)
  class ExplicitTrueValidable {}

  class ImplicitValidable {}

  it('returns false on annotated parent class that is not validable', () => {
    expect(isValidable(Parent)).to.be.false;
  });

  it('ensures that child class annotation does not leak to parent class', () => {
    expect(isValidable(Child)).to.be.true;
  });

  it('returns true on explicit annotated class as validable', () => {
    expect(isValidable(ExplicitValidable)).to.be.true;
  });

  it('returns true on explicit annotated class with passed true argument as validable', () => {
    expect(isValidable(ExplicitTrueValidable)).to.be.true;
  });

  it('returns true on classes without annotation that are always validable', () => {
    expect(isValidable(ImplicitValidable)).to.be.true;
  });
});
