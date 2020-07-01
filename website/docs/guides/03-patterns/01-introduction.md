---
title: Introduction
sidebar_label: Introduction
---

Explicit patterns allow for typed validation that skips **Typend's** evaluation of the most applicable validator.

This has significant impact on validation performance and should be used wherever possible.

Additionally it allows for testing interface/classes declarations on more OOP/DDD friendly environments:

```ts
import { expect } from 'chai';
import { convert, Interface, PropTypes } from 'typend';

interface Person {
  firstName: string;
  lastName: string;
  height: number;
  getName(): string;
}

const PersonInterface = convert<Person>();
expect(PersonInterface).to.be.eql({
  firstName: PropTypes.instanceOf(String),
  lastName: PropTypes.instanceOf(String),
  height: PropTypes.instanceOf(Number),
  getName: PropTypes.instanceOf(Function),
});
```

for [more learn about classes][classes]

## Expectations

As introduction, since we believe that simplicity is key to success, we exposed API similar to [React's][react] [PropTypes][prop-types] so you can familiarize yourself with the the basic validation availability:

```ts
| PropType               | example                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `PropTypes.any`        | PropTypes.any                                              |
| `PropTypes.array`      | PropTypes.array                                            |
| `PropTypes.arrayOf`    | PropTypes.arrayOf(PropTypes.string);                       |
| `PropTypes.bool`       | PropTypes.boolean                                          |
| `PropTypes.func`       | PropTypes.func                                             |
| `PropTypes.equal`      | PropTypes.equal('foo');                                    |
| `PropTypes.instanceOf` | PropTypes.instanceOf(Person);                              |
| `PropTypes.integer`    | PropTypes.integer;                                         |
| `PropTypes.interface`  | PropTypes.interface({name: PropTypes.string});             |
| `PropTypes.maybe`      | PropTypes.maybe('foo');                                    |
| `PropTypes.never`      | PropTypes.never;                                           |
| `PropTypes.number`     | PropTypes.number;                                          |
| `PropTypes.object`     | PropTypes.object;                                          |
| `PropTypes.objectOf`   | PropTypes.objectOf(PropTypes.number);                      |
| `PropTypes.oneOf`      | PropTypes.oneOf('red', 'green');                           |
| `PropTypes.oneOfType`  | PropTypes.oneOfType(PropTypes.string, PropTypes.number);   |
| `PropTypes.shape`      | PropTypes.shape({name: PropTypes.string});                 |
| `PropTypes.string`     | PropTypes.string;                                          |
| `PropTypes.symbol`     | PropTypes.symbol;                                          |
| `PropTypes.tuple`      | PropTypes.tuple(PropTypes.string, PropTypes.number);       |
| `PropTypes.void`       | PropTypes.void;                                            |
| `PropTypes.where`      | PropTypes.where((arg) => return arg === 'foo');            |
```

```ts
// PropTypes.any
validate('foo', PropTypes.any);

// PropTypes.array
validate(['foo'], PropTypes.array);

// PropTypes.arrayOf
validate(['foo'], PropTypes.arrayOf(String));

// PropTypes.bool
validate(true, PropTypes.boolean);

// PropTypes.func
validate(() => {}), PropTypes.func);

// PropTypes.equal
validate('foo'), PropTypes.equal('foo'));

// PropTypes.instanceOf
validate(new Person({name: 'Jane Doe'})), PropTypes.instanceOf(Person));

// PropTypes.integer
validate(10, PropTypes.integer);

// PropTypes.interface
isInstanceOf(
  new Person({ name: 'Jane Doe' }),
  PropTypes.interface({ name: PropTypes.string })
);

// PropTypes.maybe
validate(null, PropTypes.maybe);

// PropTypes.never
validate(undefined, PropTypes.never);

// PropTypes.number
validate(3.14, PropTypes.number);

// PropTypes.object
validate({}, PropTypes.object);

// PropTypes.objectOf
validate({age: 10}, PropTypes.objectOf(PropTypes.number));

// PropTypes.oneOf
validate('red', PropTypes.oneOf('red', 'green'));

// PropTypes.oneOfType
validate('foo', PropTypes.oneOfType([PropTypes.string, PropTypes.number]));

// PropTypes.shape
validate({name: 'Jane Doe'}), PropTypes.shape({name: PropTypes.string}));

// PropTypes.string
validate('foo', PropTypes.string);

// PropTypes.symbol
validate(new Symbol(), PropTypes.symbol);

// PropTypes.tuple
validate(['foo', 1337], PropTypes.tuple(PropTypes.string, PropTypes.number));

// PropTypes.void
validate(undefined, PropTypes.void);

// PropTypes.where
validate('foo', PropTypes.where((arg) => return arg === 'foo'));

```

Primitive types are also included for developers who would like their tests or JavaScript api to remind TypeScript's lowercase notation:

- `string`
- `number`
- `boolean`
- `symbol`

Under the hood its simple as defining:

```ts
const string: Function = String;
```

[patterns]: TODO:
[react]: https://reactjs.org/
[prop-types]: https://github.com/facebook/prop-types
[classes]: TODO:
