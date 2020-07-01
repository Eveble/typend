import { expect } from 'chai';
import { isValid, is, instanceOf, isInstanceOf, convert } from '../../../src';

describe('02-evaluation', () => {
  describe('TypeScript', () => {
    it('is', () => {
      expect(is<string>('im-a-string')).to.be.true;
      expect(is<number>('im-not-a-number')).to.be.false;
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
      ).to.be.true;

      expect(
        instanceOf<Person>({
          firstName: 'Jane',
          lastName: 'Doe',
          height: 175,
        })
      ).to.be.false;
    });
  });

  describe('JavaScript', () => {
    it('isValid', () => {
      expect(isValid('im-a-string', String)).to.be.true;
      expect(isValid('im-not-a-number', Number)).to.be.false;
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
      ).to.be.true;

      expect(
        isInstanceOf(
          {
            firstName: 'Jane',
            lastName: 'Doe',
            height: 175,
          },
          convert<Person>()
        )
      ).to.be.false;
    });
  });
});
