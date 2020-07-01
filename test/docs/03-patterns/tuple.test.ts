import { expect } from 'chai';
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
    expect(() => check<[string]>(['foo', 1234])).to.throw(NotAMemberError);
    expect(() => check<[string, number]>(['foo'])).to.throw(NotAMemberError);
    expect(() => check<[string, number]>(['foo', 'bar'])).to.throw(
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
