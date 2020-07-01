import { expect } from 'chai';
import {
  check,
  integer,
  Integer,
  InvalidValueError,
  validate,
} from '../../../src';

describe('integer', () => {
  it('check', () => {
    check<integer>(10);
    expect(() => check<integer>(Math.PI)).to.throw(InvalidValueError);
  });

  it('validate', () => {
    validate(10, Integer);
    validate(10, integer);
  });
});
