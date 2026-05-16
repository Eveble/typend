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
import { check, voided, validate } from '../../../src/index';

describe('void', () => {
  it('check', () => {
    check<void>(undefined);
  });

  it('validate', () => {
    validate(undefined, voided);
  });
});
