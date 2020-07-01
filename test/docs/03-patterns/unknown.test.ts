import { check, unknown, validate } from '../../../src/index';

describe('unknown', () => {
  it('check', () => {
    check<unknown>(undefined);
    check<unknown>(null);
    check<unknown>('foo');
  });

  it('validate', () => {
    validate(undefined, unknown);
    validate(null, unknown);
    validate('foo', unknown);
  });
});
