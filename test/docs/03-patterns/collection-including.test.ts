import { expect } from 'chai';
import {
  validate,
  ValidationError,
  CollectionIncluding,
} from '../../../src/index';

describe('CollectionIncluding', () => {
  it('validate strict', () => {
    expect(validate({ foo: 'foo' }, new CollectionIncluding({ foo: 'foo' }))).to
      .be.true;

    expect(
      validate(
        { foo: 'foo', bar: 'bar' },
        new CollectionIncluding({ foo: 'foo' })
      )
    ).to.be.true;

    expect(() =>
      validate(
        { foo: 'NOT_foo', bar: 'bar' },
        new CollectionIncluding({ foo: 'foo' })
      )
    ).to.throw(ValidationError);
  });

  it('validate loose', () => {
    validate({ foo: 'foo' }, { foo: 'foo' }, false);
  });
});
