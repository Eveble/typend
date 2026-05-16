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
import { isValid, is, instanceOf, isInstanceOf, convert } from '../../../src';

describe('02-evaluation', () => {
  describe('TypeScript', () => {
    it('is', () => {
      expect(is<string>('im-a-string')).toBe(true);
      expect(is<number>('im-not-a-number')).toBe(false);
    });

    it('instanceOf', () => {
      interface Person {
        firstName: string;
        lastName: string;
        height: number;
        getName(): string;
      }

      expect(
        instanceOf<Person>({
          firstName: 'Jane',
          lastName: 'Doe',
          height: 175,
          getName(): string {
            return `${this.firstName} ${this.lastName}`;
          },
        })
      ).toBe(true);

      expect(
        instanceOf<Person>({
          firstName: 'Jane',
          lastName: 'Doe',
          height: 175,
        })
      ).toBe(false);
    });
  });

  describe('JavaScript', () => {
    it('isValid', () => {
      expect(isValid('im-a-string', String)).toBe(true);
      expect(isValid('im-not-a-number', Number)).toBe(false);
    });

    it('isInstanceOf', () => {
      interface Person {
        firstName: string;
        lastName: string;
        height: number;
        getName(): string;
      }

      expect(
        isInstanceOf(
          {
            firstName: 'Jane',
            lastName: 'Doe',
            height: 175,
            getName(): string {
              return `${this.firstName} ${this.lastName}`;
            },
          },
          convert<Person>()
        )
      ).toBe(true);

      expect(
        isInstanceOf(
          {
            firstName: 'Jane',
            lastName: 'Doe',
            height: 175,
          },
          convert<Person>()
        )
      ).toBe(false);
    });
  });
});
