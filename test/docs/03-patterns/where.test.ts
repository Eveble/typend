import { expect } from 'chai';
import { validate, ValidationError, PropTypes } from '../../../src/index';

describe('where', () => {
  function validateFoo(value: string): boolean {
    if (value !== 'foo') {
      throw new ValidationError('my-error');
    }
    return true;
  }

  it('validate', () => {
    validate('foo', PropTypes.where(validateFoo));

    expect(() => {
      validate('bar', PropTypes.where(validateFoo));
    }).to.throw(ValidationError);
  });
});
