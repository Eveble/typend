import { expect } from 'chai';
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
    expect(PersonInterface).to.be.instanceof(Object);
    expect(PersonInterface).to.be.eql({
      firstName: String,
      lastName: String,
      height: Number,
      getName: Function,
    });
  });

  it('constructors', () => {
    expect(reflect<any>()).to.be.eql(any);
    expect(reflect<string>()).to.be.eql(String);
    expect(reflect<number>()).to.be.eql(Number);
    expect(reflect<boolean>()).to.be.eql(Boolean);
    expect(reflect<null>()).to.be.equal(null);
    expect(reflect<undefined>()).to.be.equal(undefined);
    expect(reflect<void>()).to.be.eql(voided);
    expect(reflect<never>()).to.be.eql(never);
    expect(reflect<Record<any, any>>()).to.be.eql({});
    expect(reflect<string[]>()).to.be.eql([String]);
    expect(reflect<[string, number]>()).to.be.eql([String, Number]);
    expect(reflect<Date>()).to.be.eql(Date);
  });

  it('literals', () => {
    expect(reflect<'foo'>()).to.be.eql('foo');
    expect(reflect<1337>()).to.be.eql(1337);
    expect(reflect<true>()).to.be.eql(true);
    expect(reflect<false>()).to.be.eql(false);
    expect(reflect<{ key: string }>()).to.be.eql({ key: String });
    expect(reflect<['foo', 1337]>()).to.be.eql(['foo', 1337]);
  });
});
