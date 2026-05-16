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
  check,
  validate,
  tuple,
  PropTypes,
  Tuple,
  NotAMemberError,
} from '../../../src/index';

describe('tuple', () => {
  it('check', () => {
    check<[string, number]>(['foo', 1337]);
    expect(() => check<[string]>(['foo', 1234])).toThrow(NotAMemberError);
    expect(() => check<[string, number]>(['foo'])).toThrow(NotAMemberError);
    expect(() => check<[string, number]>(['foo', 'bar'])).toThrow(
      NotAMemberError
    );
  });

  it('validate', () => {
    validate(['foo', 1337], [String, Number]);
    validate(['foo', 1337], PropTypes.tuple(String, Number));
    validate(['foo', 1337], tuple(String, Number));
    validate(['foo', 1337], new Tuple(String, Number));
  });
});
