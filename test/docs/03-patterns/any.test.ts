import { check, validate, PropTypes, any } from '../../../src/index';

describe('any', () => {
  it('check', () => {
    check<any>('foo');
  });

  it('validate', () => {
    validate('foo', any);
    validate('foo', PropTypes.any);
  });
});
