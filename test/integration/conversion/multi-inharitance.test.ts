import { expect } from 'chai';
import { Type } from '../../../src/decorators/type.decorator';

describe('complex inheritance chains with @Type decorator', () => {
  // Base classes that simulate the inheritance chain that was causing issues
  class BaseEntity {
    metadata: Record<string, any> = {};

    timestamp?: Date;

    processProps(props: any): any {
      // Simulate property processing logic
      return props;
    }
  }

  @Type('Message')
  class Message extends BaseEntity {
    id: string = '';

    constructor(props: any) {
      super();
    }
  }

  it('test', () => {
    expect(true).to.be.true;
  });

  it('handles classes with custom constructors in deep inheritance chains', () => {
    @Type('MyCustomMessage', { isRegistrable: false })
    class MyCustomMessage extends Message {
      key: string = '';

      default: string = 'default';

      constructor(props: Partial<MyCustomMessage>) {
        super(props);
        Object.assign(this, this.processProps(props));
      }
    }

    const now = new Date();
    const message = new MyCustomMessage({
      key: 'my-key',
      timestamp: now,
    });

    expect(message).to.be.eql({
      key: 'my-key',
      default: 'default',
      metadata: {},
      timestamp: now,
      id: '',
    });

    expect(message).to.be.instanceOf(MyCustomMessage);
    expect(message).to.be.instanceOf(Message);
    expect(message).to.be.instanceOf(BaseEntity);
  });

  it('handles classes without custom constructors in deep inheritance chains', () => {
    @Type('MySimpleMessage')
    class MySimpleMessage extends Message {
      key: string = 'default-key';

      value: number = 42;
    }

    const message = new MySimpleMessage({
      key: 'set-key',
      value: 100,
    } as any);

    expect(message.key).to.equal('set-key');
    expect(message.value).to.equal(100);
    expect(message.id).to.equal('');
    expect(message).to.be.instanceOf(MySimpleMessage);
    expect(message).to.be.instanceOf(Message);
    expect(message).to.be.instanceOf(BaseEntity);
  });

  it('handles mixed scenarios - some classes with constructors, some without', () => {
    @Type('MiddleClass')
    class MiddleClass extends Message {
      middleProperty: string = 'middle-default';
    }

    @Type('LeafClass')
    class LeafClass extends MiddleClass {
      leafProperty: string = 'leaf-default';

      constructor(props: Partial<LeafClass>) {
        super(props);
        // Custom validation or processing
        if (props.leafProperty && props.leafProperty.length < 3) {
          throw new Error('leafProperty must be at least 3 characters');
        }
        Object.assign(this, props);
      }
    }

    // Test successful creation
    const instance = new LeafClass({
      middleProperty: 'middle-set',
      leafProperty: 'leaf-set',
    });

    expect(instance.middleProperty).to.equal('middle-set');
    expect(instance.leafProperty).to.equal('leaf-set');
    expect(instance.id).to.equal('');

    // Test validation in custom constructor
    expect(() => {
      new LeafClass({
        leafProperty: 'ab', // Too short, should trigger validation
      });
    }).to.throw('leafProperty must be at least 3 characters');
  });

  it('preserves method inheritance across wrapped and unwrapped classes', () => {
    @Type('BaseWithMethods')
    class BaseWithMethods extends BaseEntity {
      name: string = 'base';

      getName(): string {
        return this.name;
      }

      getProcessedName(): string {
        return `processed-${this.getName()}`;
      }
    }

    @Type('DerivedWithConstructor')
    class DerivedWithConstructor extends BaseWithMethods {
      suffix: string = 'default';

      constructor(props: Partial<DerivedWithConstructor>) {
        super();
        Object.assign(this, props);
      }

      getFullName(): string {
        return `${this.getName()}-${this.suffix}`;
      }
    }

    const instance = new DerivedWithConstructor({
      name: 'test',
      suffix: 'custom',
    });

    expect(instance.getName()).to.equal('test');
    expect(instance.getProcessedName()).to.equal('processed-test');
    expect(instance.getFullName()).to.equal('test-custom');
    expect(instance).to.be.instanceOf(DerivedWithConstructor);
    expect(instance).to.be.instanceOf(BaseWithMethods);
    expect(instance).to.be.instanceOf(BaseEntity);
  });

  it('handles property initializers in deep inheritance with and without constructors', () => {
    @Type('Level1')
    class Level1 extends BaseEntity {
      level1Prop: string = 'level1-default';
    }

    @Type('Level2')
    class Level2 extends Level1 {
      level2Prop: string = 'level2-default';

      constructor(props: Partial<Level2>) {
        super();
        Object.assign(this, props);
      }
    }

    @Type('Level3')
    class Level3 extends Level2 {
      level3Prop: string = 'level3-default';

      constructor(props: Partial<Level3>) {
        super(props);
        Object.assign(this, props);
      }
    }

    const instance = new Level3({
      level1Prop: 'level1-set',
      level2Prop: 'level2-set',
      level3Prop: 'level3-set',
    });

    expect(instance.level1Prop).to.equal('level1-set');
    expect(instance.level2Prop).to.equal('level2-set');
    expect(instance.level3Prop).to.equal('level3-set');
    expect(instance).to.be.instanceOf(Level3);
    expect(instance).to.be.instanceOf(Level2);
    expect(instance).to.be.instanceOf(Level1);
    expect(instance).to.be.instanceOf(BaseEntity);
  });

  it('works with complex parameter types that caused tsruntime issues', () => {
    interface ComplexProps {
      stringProp: string;
      numberProp: number;
      optionalProp?: string;
      nestedProp: {
        inner: string;
        count: number;
      };
    }

    @Type('ComplexClass')
    class ComplexClass extends BaseEntity {
      stringProp: string = 'default';

      numberProp: number = 0;

      optionalProp?: string;

      nestedProp: { inner: string; count: number } = {
        inner: 'default',
        count: 0,
      };

      constructor(props: ComplexProps) {
        super();
        // This complex parameter type was causing tsruntime analysis issues
        Object.assign(this, this.processProps(props));
      }
    }

    const instance = new ComplexClass({
      stringProp: 'test',
      numberProp: 42,
      optionalProp: 'optional',
      nestedProp: { inner: 'nested', count: 10 },
    });

    expect(instance.stringProp).to.equal('test');
    expect(instance.numberProp).to.equal(42);
    expect(instance.optionalProp).to.equal('optional');
    expect(instance.nestedProp).to.deep.equal({ inner: 'nested', count: 10 });
  });
});
