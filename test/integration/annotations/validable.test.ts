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
import { Validable } from '../../../src/annotations/validable';
import { isValidable } from '../../../src/helpers';

describe(`validable`, () => {
  @Validable(false)
  class Parent {}

  @Validable(true)
  class Child extends Parent {}

  @Validable()
  class ExplicitValidable {}

  @Validable(true)
  class ExplicitTrueValidable {}

  class ImplicitValidable {}

  it('returns false on annotated parent class that is not validable', () => {
    expect(isValidable(Parent)).toBe(false);
  });

  it('ensures that child class annotation does not leak to parent class', () => {
    expect(isValidable(Child)).toBe(true);
  });

  it('returns true on explicit annotated class as validable', () => {
    expect(isValidable(ExplicitValidable)).toBe(true);
  });

  it('returns true on explicit annotated class with passed true argument as validable', () => {
    expect(isValidable(ExplicitTrueValidable)).toBe(true);
  });

  it('returns true on classes without annotation that are always validable', () => {
    expect(isValidable(ImplicitValidable)).toBe(true);
  });
});
