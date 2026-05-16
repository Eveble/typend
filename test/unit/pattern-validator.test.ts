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
import { stubInterface } from '../vitest-helper';
import { types } from '../../src/types';
import { PatternValidator } from '../../src/pattern-validator';

describe(`PatternValidator`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
  });

  it('allows to set describer on Validator', () => {
    PatternValidator.setDescriber(describer);
    expect(PatternValidator.getDescriber()).toBe(describer);
  });

  it('describes provided value to string', () => {
    class MyValidator extends PatternValidator {}
    MyValidator.setDescriber(describer);

    const validator = new MyValidator();
    const val = 'my-value';
    const valStr = `String('my-value'`;
    describer.describe.withArgs(val).returns(valStr);

    expect(validator.describe(val)).toBe(valStr);
    expect(describer.describe).toHaveBeenCalledTimes(1);
    expect(describer.describe).toHaveBeenCalledWith(val);
  });
});
