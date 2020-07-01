import { expect } from 'chai';
import {
  maybe,
  Maybe,
  PropTypes,
  ValidationError,
  validate,
} from '../../../src/index';

describe('maybe', () => {
  it('validate', () => {
    validate(undefined, PropTypes.maybe(String));
    validate(null, PropTypes.maybe(String));
    validate('foo', PropTypes.maybe(String));
    validate('foo', new Maybe(String));
    expect(() => validate('foo', maybe('baz'))).to.throw(ValidationError);
  });
});
