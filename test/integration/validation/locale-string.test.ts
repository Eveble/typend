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
import { stubInterface } from '../../vitest-helper';
import { $PropsOf, check } from '../../../src';
import { LocaleString } from '../../../src/patterns/locale-string';
import { ValidationError } from '../../../src/errors';
import { Type } from '../../../src/decorators/type.decorator';

describe('LocaleString validation on classes', () => {
  @Type()
  class MyLocaleClass {
    public value: LocaleString;

    constructor(props: Record<string, any>) {
      check<$PropsOf<MyLocaleClass>>(props);
    }
  }

  it('ensures that error is not thrown upon undefined value', () => {
    expect(() => new MyLocaleClass({})).not.toThrow(Error);
  });

  it('ensures that error is not thrown upon string value', () => {
    expect(() => new MyLocaleClass({ value: 'localized string' })).not.toThrow(
      Error
    );
  });

  it('ensures that error is thrown if value is not undefined or string', () => {
    expect(() => new MyLocaleClass({ value: 123 })).toThrow(ValidationError);
  });
});
