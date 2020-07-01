import { expect } from 'chai';
import {
  check,
  PropTypes,
  NotAMemberError,
  validate,
  OneOf,
} from '../../../src';

describe('oneOf', () => {
  it('check', () => {
    check<string | number>('foo');
    check<string | number>(1337);
    expect(() => check<string | number>(true)).to.throw(NotAMemberError);
  });

  it('validate', () => {
    validate('foo', PropTypes.oneOf(String, Number));
    validate(1337, PropTypes.oneOf(String, Number));
    validate('foo', new OneOf(String, Number));
    validate(1337, new OneOf(String, Number));
  });
});
