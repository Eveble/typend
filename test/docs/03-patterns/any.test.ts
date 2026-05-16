import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
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
