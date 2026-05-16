import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
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
    ).toBe(true);

    expect(
      validate({ included: { foo: 'foo' } }, new CollectionWithin(expectation))
    ).toBe(true);

    expect(() =>
      validate(
        { included: { foo: 'NOT_foo' } },
        new CollectionWithin(expectation)
      )
    ).toThrow(ValidationError);
  });
});
