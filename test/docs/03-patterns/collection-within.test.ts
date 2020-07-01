import { expect } from 'chai';
import {
  validate,
  CollectionWithin,
  ValidationError,
} from '../../../src/index';

describe('CollectionWithin', () => {
  it('validate', () => {
    const expectation = {
      included: {
        foo: 'foo',
      },
      omitted: {
        bar: 'bar',
      },
    };

    expect(
      validate(
        { included: { foo: 'foo' }, omitted: { bar: 'bar' } },
        new CollectionWithin(expectation)
      )
    ).to.be.true;

    expect(
      validate({ included: { foo: 'foo' } }, new CollectionWithin(expectation))
    ).to.be.true;

    expect(() =>
      validate(
        { included: { foo: 'NOT_foo' } },
        new CollectionWithin(expectation)
      )
    ).to.throw(ValidationError);
  });
});
