import { expect } from 'chai';
import {
  check,
  UnequalValueError,
  validate,
  PropTypes,
} from '../../../src/index';

describe('equals', () => {
  it('check', () => {
    check<'foo'>('foo');
    check<1337>(1337);
    expect(() => check<1337>('foo')).to.throw(UnequalValueError);
  });

  it('validate', () => {
    validate('foo', 'foo');
    validate(1337, PropTypes.equal(1337));
  });
});
