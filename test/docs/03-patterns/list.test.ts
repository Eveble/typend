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
  PropTypes,
  List,
  ValidationError,
} from '../../../src';

describe('List', () => {
  it('check', () => {
    check<string[]>(['foo']);
    expect(() => check<number>(['foo'])).toThrow(ValidationError);
  });
  it('validate', () => {
    validate(['foo'], [String]);
    validate(['foo'], PropTypes.arrayOf(String));
    validate(['foo'], new List(String));
  });
});
