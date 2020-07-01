import { expect } from 'chai';
import {
  any,
  voided,
  never,
  convert,
  Interface,
  PropTypes,
} from '../../../src';

describe('03-reflection', () => {
  it('interface', () => {
    interface Person {
      firstName: string;
      lastName: string;
      height: number;
      getName(): string;
    }

    const PersonInterface = convert<Person>();
    expect(PersonInterface).to.be.instanceof(Interface);
    expect(PersonInterface).to.be.eql({
      firstName: PropTypes.instanceOf(String),
      lastName: PropTypes.instanceOf(String),
      height: PropTypes.instanceOf(Number),
      getName: PropTypes.instanceOf(Function),
    });

    expect(convert<'foo'>()).to.be.eql(PropTypes.equal('foo'));
  });

  it('constructors', () => {
    expect(convert<any>()).to.be.eql(any);
    expect(convert<string>()).to.be.eql(PropTypes.instanceOf(String));
    expect(convert<number>()).to.be.eql(PropTypes.instanceOf(Number));
    expect(convert<boolean>()).to.be.eql(PropTypes.instanceOf(Boolean));
    expect(convert<null>()).to.be.equal(null);
    expect(convert<undefined>()).to.be.equal(undefined);
    expect(convert<void>()).to.be.eql(voided);
    expect(convert<never>()).to.be.eql(never);
    expect(convert<Record<any, any>>()).to.be.eql(PropTypes.object);
    expect(convert<string[]>()).to.be.eql(
      PropTypes.arrayOf(PropTypes.instanceOf(String))
    );
    expect(convert<[string, number]>()).to.be.eql(
      PropTypes.tuple(
        PropTypes.instanceOf(String),
        PropTypes.instanceOf(Number)
      )
    );
    expect(convert<Date>()).to.be.eql(PropTypes.instanceOf(Date));
  });

  it('literals', () => {
    expect(convert<'foo'>()).to.be.eql(PropTypes.equal('foo'));
    expect(convert<'foo' | 'bar'>()).to.be.eql(
      PropTypes.oneOf(PropTypes.equal('foo'), PropTypes.equal('bar'))
    );
    expect(convert<1337>()).to.be.eql(PropTypes.equal(1337));
    expect(convert<true>()).to.be.eql(PropTypes.equal(true));
    expect(convert<false>()).to.be.eql(PropTypes.equal(false));
    expect(convert<{ key: string }>()).to.be.eql(
      PropTypes.shape({ key: PropTypes.instanceOf(String) })
    );
    expect(convert<['foo', 1337]>()).to.be.eql(
      PropTypes.tuple(PropTypes.equal('foo'), PropTypes.equal(1337))
    );
  });
});
