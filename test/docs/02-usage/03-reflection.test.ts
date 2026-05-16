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
import { any, voided, never, reflect } from '../../../src';

describe('03-reflection', () => {
  it('interface', () => {
    interface Person {
      firstName: string;
      lastName: string;
      height: number;
      getName(): string;
    }

    const PersonInterface = reflect<Person>();
    expect(PersonInterface).toBeInstanceOf(Object);
    expect(PersonInterface).toEqual({
      firstName: String,
      lastName: String,
      height: Number,
      getName: Function,
    });
  });

  it('constructors', () => {
    expect(reflect<any>()).toEqual(any);
    expect(reflect<string>()).toEqual(String);
    expect(reflect<number>()).toEqual(Number);
    expect(reflect<boolean>()).toEqual(Boolean);
    expect(reflect<null>()).toBe(null);
    expect(reflect<undefined>()).toBe(undefined);
    expect(reflect<void>()).toEqual(voided);
    expect(reflect<never>()).toEqual(never);
    expect(reflect<Record<any, any>>()).toEqual({});
    expect(reflect<string[]>()).toEqual([String]);
    expect(reflect<[string, number]>()).toEqual([String, Number]);
    expect(reflect<Date>()).toEqual(Date);
  });

  it('literals', () => {
    expect(reflect<'foo'>()).toEqual('foo');
    expect(reflect<1337>()).toEqual(1337);
    expect(reflect<true>()).toEqual(true);
    expect(reflect<false>()).toEqual(false);
    expect(reflect<{ key: string }>()).toEqual({ key: String });
    expect(reflect<['foo', 1337]>()).toEqual(['foo', 1337]);
  });
});
