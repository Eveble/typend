import { check, never, validate, PropTypes } from '../../../src';

describe('never', () => {
  it('check', () => {
    check<never>(undefined);
  });

  it('validate', () => {
    validate(undefined, never);
    validate(undefined, PropTypes.never);
  });
});
