import { validate, PropTypes, isInstanceOf } from '../../../src';

describe('introduction', () => {
  it('prop types', () => {
    class Person {
      name: string;

      constructor(name) {
        this.name = name;
      }
    }
    // PropTypes.any
    validate('foo', PropTypes.any);

    // PropTypes.array
    validate(['foo'], PropTypes.array);

    // PropTypes.arrayOf
    validate(['foo'], PropTypes.arrayOf(String));

    // PropTypes.bool
    validate(true, PropTypes.bool);

    // PropTypes.func
    validate((): boolean => true, PropTypes.func);

    // PropTypes.equal
    validate('foo', PropTypes.equal('foo'));

    // PropTypes.instanceOf
    validate(new Person({ name: 'Jane Doe' }), PropTypes.instanceOf(Person));

    // PropTypes.integer
    validate(10, PropTypes.integer);

    // PropTypes.interface
    isInstanceOf(
      new Person({ name: 'Jane Doe' }),
      PropTypes.interface({ name: PropTypes.string })
    );

    // PropTypes.maybe
    validate(null, PropTypes.maybe('foo'));

    // PropTypes.never
    validate(undefined, PropTypes.never);

    // PropTypes.number
    validate(3.14, PropTypes.number);

    // PropTypes.object
    validate({}, PropTypes.object);

    // PropTypes.objectOf
    validate({ age: 10 }, PropTypes.objectOf(PropTypes.number));

    // PropTypes.oneOf
    validate('red', PropTypes.oneOf(['red', 'green']));

    // PropTypes.oneOfType
    validate('foo', PropTypes.oneOfType([PropTypes.string, PropTypes.number]));

    // PropTypes.shape
    validate({ name: 'Jane Doe' }, PropTypes.shape({ name: PropTypes.string }));

    // PropTypes.string
    validate('foo', PropTypes.string);

    // PropTypes.symbol
    validate(Symbol('foo'), PropTypes.symbol);

    // PropTypes.tuple
    validate(
      ['foo', 1337],
      PropTypes.tuple(PropTypes.string, PropTypes.number)
    );

    // PropTypes.void
    validate(undefined, PropTypes.void);

    // PropTypes.where
    validate(
      'foo',
      PropTypes.where((arg) => arg === 'foo')
    );
  });
});
