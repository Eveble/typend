import { expect } from 'chai';
import {
  check,
  validate,
  PropTypes,
  UnexpectedKeyError,
} from '../../../src/index';

describe('Collection', () => {
  type Car = {
    brand: string;
  };

  it('check', () => {
    check<Record<any, any>>({ foo: 'foo' });
    check<Record<keyof any, any>>({ foo: 'foo' });
    check<{}>({});
    check<{ name: string; age: number }>({ name: 'Jane Doe', age: 28 });
    check<Car>({ brand: 'Tesla' });
  });

  it('validate explicit', () => {
    validate({}, PropTypes.object);
    validate({ foo: 'foo' }, PropTypes.shape({ foo: 'foo' }));
    validate(
      { name: 'Jane Doe', age: 28 },
      PropTypes.shape({
        name: String,
        age: Number,
      })
    );
    expect(() =>
      validate({ foo: 'foo', bar: 'bar' }, PropTypes.shape({ foo: 'foo' }))
    ).to.throw(UnexpectedKeyError);
  });

  it('validate implicit', () => {
    // Implicit: you can omit defining explicit pattern(`Collection`) by passing plain object:
    validate({ foo: 'foo' }, { foo: 'foo' });

    // By default, validator will run in strict mode - so its equivalent of:
    validate({ foo: 'foo' }, { foo: 'foo' }, true);
  });
});
