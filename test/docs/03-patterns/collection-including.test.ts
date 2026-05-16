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
  ValidationError,
  CollectionIncluding,
} from '../../../src/index';

describe('CollectionIncluding', () => {
  it('validate strict', () => {
    expect(
      validate({ foo: 'foo' }, new CollectionIncluding({ foo: 'foo' }))
    ).toBe(true);

    expect(
      validate(
        { foo: 'foo', bar: 'bar' },
        new CollectionIncluding({ foo: 'foo' })
      )
    ).toBe(true);

    expect(() =>
      validate(
        { foo: 'NOT_foo', bar: 'bar' },
        new CollectionIncluding({ foo: 'foo' })
      )
    ).toThrow(ValidationError);
  });

  it('validate loose', () => {
    validate({ foo: 'foo' }, { foo: 'foo' }, false);
  });
});
