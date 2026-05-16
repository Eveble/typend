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
  UnmatchedTypeError,
  string,
  number,
  PropTypes,
} from '../../../src/index';

describe('instanceOf', () => {
  it('check', () => {
    check<string>('foo');
    check<number>(1337);
    expect(() => check<number>('foo')).toThrow(UnmatchedTypeError);
  });

  it('validate', () => {
    validate('foo', String);
    validate(1337, PropTypes.instanceOf(Number));
    validate('foo', string);
    validate(1337, number);
  });
});
