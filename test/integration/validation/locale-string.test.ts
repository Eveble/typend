import { expect } from 'chai';
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
    expect(() => new MyLocaleClass({})).to.not.throw(Error);
  });

  it('ensures that error is not thrown upon string value', () => {
    expect(() => new MyLocaleClass({ value: 'localized string' })).to.not.throw(
      Error
    );
  });

  it('ensures that error is thrown if value is not undefined or string', () => {
    expect(() => new MyLocaleClass({ value: 123 })).to.throw(ValidationError);
  });
});
