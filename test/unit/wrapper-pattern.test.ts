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
import { WrapperPattern } from '../../src/wrapper-pattern';

describe(`WrapperPattern`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
  });

  it('wraps provided expectation as array', () => {
    class MyPattern extends WrapperPattern {}
    expect(new MyPattern('my-expectation')).toEqual(['my-expectation']);
  });

  it('runs onValidation hook before assigning expectation', () => {
    const onValidation = vi.fn();
    class MyPattern extends WrapperPattern {
      onValidation(...expectations: any[]): boolean {
        onValidation(expectations);
        return true;
      }
    }

    const expectation = 'my-expectation';
    const instance = new MyPattern(expectation);
    expect(instance).toEqual([expectation]);
    expect(onValidation).toHaveBeenCalledTimes(1);
    expect(onValidation).toHaveBeenCalledWith([expectation]);
  });

  it('returns patterns type kind', () => {
    class MyPattern extends WrapperPattern {
      static kind = 'my-kind';
    }
    expect(new MyPattern().getKind()).toBe('my-kind');
  });

  it('allows to set describer on WrapperPattern', () => {
    WrapperPattern.setDescriber(describer);
    expect(WrapperPattern.getDescriber()).toBe(describer);
  });

  it('describes provided value to string', () => {
    class MyPattern extends WrapperPattern {}
    MyPattern.setDescriber(describer);

    const pattern = new MyPattern();
    const val = 'my-value';
    const valStr = `String('my-value'`;
    describer.describe.withArgs(val).returns(valStr);

    expect(pattern.describe(val)).toBe(valStr);
    expect(describer.describe).toHaveBeenCalledTimes(1);
    expect(describer.describe).toHaveBeenCalledWith(val);
  });

  describe('property initializers', () => {
    class MyPattern extends WrapperPattern {}

    describe('evaluation', () => {
      it('returns true if property initializer is set on pattern', () => {
        const pattern = new MyPattern();
        pattern.setInitializer('my-initializer-value');
        expect(pattern.hasInitializer()).toBe(true);
      });
      it('returns false if property initializer is missing from pattern', () => {
        const pattern = new MyPattern();
        expect(pattern.hasInitializer()).toBe(false);
      });
    });
    it('sets the property initializer on pattern', () => {
      const pattern = new MyPattern();
      const initializer = 'my-initializer-value';
      pattern.setInitializer(initializer);
      expect(pattern.getInitializer()).toBe(initializer);
    });
  });
});
