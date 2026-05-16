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
import {
  check,
  Type,
  Class,
  Optional,
  ValidationError,
  convert,
  validate,
  PropTypes,
} from '../../../src/index';

describe('optional', () => {
  @Type()
  class Sandwich {
    pickles?: boolean;
  }

  it('check', () => {
    expect(convert<Sandwich>()).toEqual(
      new Class(Sandwich, {
        pickles: PropTypes.equal(Boolean).isOptional,
      })
    );
    check<undefined | string>('foo');
    check<undefined | string>(undefined);
    expect(() => check<undefined | number>('foo')).toThrow(ValidationError);
  });

  it('validate', () => {
    validate(undefined, PropTypes.equal(String).isOptional);
    validate('foo', PropTypes.instanceOf(String).isOptional);
    validate('foo', new Optional(String));

    expect(() => validate('foo', PropTypes.equal(Number).isOptional)).toThrow(
      ValidationError
    );
  });
});
