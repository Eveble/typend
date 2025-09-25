import { expect } from 'chai';
import { Type } from '../../src/decorators/type.decorator';

describe('property initializers in child classes', () => {
  class Struct {
    constructor(props: Record<string, any> = {}) {
      Object.assign(this, props);
    }
  }
  it('fails without @Type (TS native behavior)', () => {
    class Child extends Struct {
      foo = 'default-value';
    }

    const inst = new Child({ foo: 'set-value' });

    // Property initializer overwrites Object.assign
    expect(inst.foo).to.equal('default-value');
  });

  it('works with manual constructor override', () => {
    class Child extends Struct {
      foo = 'default-value';

      constructor(props: Partial<Child> = {}) {
        super(props);
        Object.assign(this, props);
      }
    }

    const inst = new Child({ foo: 'set-value' });
    expect(inst.foo).to.equal('set-value');
  });

  it('works with @Type applied', () => {
    @Type()
    class Child extends Struct {
      foo = 'default-value';
    }

    const inst = new Child({ foo: 'set-value' });
    expect(inst.foo).to.equal('set-value');
  });

  it('preserves methods with @Type', () => {
    @Type()
    class User extends Struct {
      name = 'John';

      getName() {
        return this.name;
      }
    }

    const u = new User({ name: 'Alice' });
    expect(u.getName()).to.equal('Alice');
  });

  it('preserves inheritance chain with @Type', () => {
    class Base extends Struct {
      base = true;

      hello() {
        return 'hi';
      }
    }

    @Type()
    class Sub extends Base {
      foo = 'default';
    }

    const inst = new Sub({ foo: 'patched' });
    expect(inst.foo).to.equal('patched');
    expect(inst.base).to.be.true;
    expect(inst.hello()).to.equal('hi');
    expect(inst).to.be.instanceOf(Sub);
    expect(inst).to.be.instanceOf(Base);
  });
});
