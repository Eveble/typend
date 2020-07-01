import { expect } from 'chai';
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
    expect(() => check<number>(['foo'])).to.throw(ValidationError);
  });
  it('validate', () => {
    validate(['foo'], [String]);
    validate(['foo'], PropTypes.arrayOf(String));
    validate(['foo'], new List(String));
  });
});
