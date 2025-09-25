import { expect } from 'chai';
import {
  validate,
  any,
  Integer,
  collectionIncluding,
  collectionWithin,
  maybe,
  optional,
  oneOf,
  where,
  ValidationError,
  propsOf,
  typeOf,
  iof,
  list,
  tuple,
} from '../../src/index';
import { Type } from '../../src/decorators/type.decorator';

@Type()
class MyClass {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }
}
@Type()
class MyOtherClass {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }
}
class MyError extends Error {}
class MyOtherError extends Error {}

// prettier-ignore
describe(`matching`, () => {
  const date = new Date('2017-02-06T20:43:13.464Z');

  const values: [any, any, string][] = [
    // Anything
    [Infinity, any, `Expected anything, got Number(null)`],
    [-Infinity, any, `Expected anything, got Number(null)`],
    [NaN, any, `Expected anything, got Number(null)`],
    [Math.PI, any, `Expected anything, got Number(3.141592653589793)`],
    [-Math.PI, any, `Expected anything, got Number(-3.141592653589793)`],
    [
      Number.MAX_VALUE,
      any,
      `Expected anything, got Number(1.7976931348623157e+308)`,
    ],
    [
      -Number.MAX_VALUE,
      any,
      `Expected anything, got Number(-1.7976931348623157e+308)`,
    ],
    ['abcd', any, `Expected anything, got String("abcd")`],
    [
      {
        my: 'object',
      },
      any,
      `Expected anything, got {"my":"object"}`,
    ],
    [
      new MyClass('test'),
      any,
      `Expected anything, got MyClass({"value":"test"})`,
    ],
    [date, any, `Expected anything, got Date("2017-02-06T20:43:13.464Z")`],
    [true, any, `Expected anything, got Boolean(true)`],
    [false, any, `Expected anything, got Boolean(false)`],
    [undefined, any, `Expected anything, got undefined`],
    [null, any, `Expected anything, got null`],
    [
      new RegExp(/fail/),
      any,
      `Expected anything, got regular expression(/fail/)`,
    ],
    [/fail/, any, `Expected anything, got regular expression(/fail/)`],
    [
      (): boolean => {
        return true;
      },
      any,
      `Expected anything, got Function`,
    ],
    [[1], any, `Expected anything, got [Number(1)]`],
    [[-1], any, `Expected anything, got [Number(-1)]`],
    [
      [Number.MAX_VALUE],
      any,
      `Expected anything, got [Number(1.7976931348623157e+308)]`,
    ],
    [
      [-Number.MAX_VALUE],
      any,
      `Expected anything, got [Number(-1.7976931348623157e+308)]`,
    ],
    [['abcd'], any, `Expected anything, got [String("abcd")]`],
    [
      [
        {
          my: 'object',
        },
      ],
      any,
      `Expected anything, got [{"my":"object")]`,
    ],
    [
      [new MyClass('test')],
      any,
      `Expected anything, got [MyClass({"value":"test"})]`,
    ],
    [[date], any, `Expected anything, got [Date("2017-02-06T20:43:13.464Z")]`],
    [[true], any, `Expected anything, got [Boolean(true)]`],
    [[false], any, `Expected anything, got [Boolean(false)]`],
    [[undefined], any, `Expected anything, got [undefined]`],
    [[null], any, `Expected anything, got [null]`],
    [
      [new RegExp(/fail/)],
      any,
      `Expected anything, got [regular expression(/fail/)]`,
    ],
    [[/fail/], any, `Expected anything, got [regular expression(/fail/)]`],
    [
      [
        (): boolean => {
          return true;
        },
      ],
      any,
      `Expected anything, got [Function]`,
    ],
    // Error
    [
      new MyError('my-message'),
      Error,
      `Expected Error, got MyError('my-message')`,
    ],
    [
      new MyError('my-message'),
      new MyError('my-message'),
      `Expected MyError('my-message'), got MyError('my-message')`,
    ],
    // Integer
    [1, Integer, `Expected Integer, got Number(1)`],
    [0, Integer, `Expected Integer, got Number(0)`],
    [-1, Integer, `Expected Integer, got Number(-1)`],
    [-1, Integer, `Expected Integer, got Number(-1)`],
    [-2147483648, Integer, `Expected Integer, got Number(-2147483648)`], // INT_MIN
    [2147483647, Integer, `Expected Integer, got Number(2147483647)`], // INT_MAX
    // OneOf
    [
      10,
      oneOf(String, Number),
      'Expected Number(10) to be one of: String, Number',
    ],
    [
      [1, 2, 3],
      oneOf([String], [Number]),
      'Expected [Number(1), Number(2), Number(3)] to be one of: Array(String), Array(Number)',
    ],
    [
      'abcd',
      oneOf(String, Number),
      'Expected String("abcd") to be one of: String, Number',
    ],
    [1, oneOf(1, 2), 'Expected Number(1) to be one of: 1, 2'],
    [
      Math.PI,
      oneOf(3.14, Math.PI),
      'Expected Number(3.141592653589793) to be one of: 3.14, 3.141592653589793',
    ],
    [
      date,
      oneOf(String, Date),
      'Expected Date("2017-02-06T20:43:13.464Z") to be one of: String, Date',
    ],
    [
      'abcd',
      oneOf('abcd', 'xyz'),
      'Expected String("abcd") to be one of: "abcd", "xyz"',
    ],
    [
      null,
      oneOf(null, undefined),
      'Expected null to be one of: null, undefined',
    ],
    [
      undefined,
      oneOf(null, undefined),
      'Expected undefined to be one of: null, undefined',
    ],
    [true, oneOf(true, false), 'Expected true to be one of: true, false'],
    [false, oneOf(true, false), 'Expected false to be one of: true, false'],
    [
      new MyClass('my-value'),
      oneOf(String, MyClass),
      'Expected MyClass({}) to be one of: String, MyClass',
    ],
    [
      'fail',
      oneOf('fail', 'win'),
      'Expected String("fail") to be one of: "fail", "win"',
    ],
    [
      'fail',
      oneOf('win', /^fail$/g),
      'Expected String("fail") to be one of: "win", /^fail$/g',
    ],
    [
      'fail',
      oneOf('win', /fai/g),
      'Expected String("fail") to be one of: "win", /fai/g',
    ],
    // Tuple
    [
      [1, 2, 3],
      tuple(Number, Number, optional(Number)),
      'Expected String("fail") to be one of: "fail", "win"',
    ],
    [
      [1, 2],
      tuple(Number, Number, optional(Number)),
      'Expected String("fail") to be one of: "fail", "win"',
    ],
    // Maybe
    [undefined, maybe(String), 'Expected undefined to be a String'],
    [null, maybe(String), 'Expected null to be a String'],
    [
      {
        required: 'value',
      },
      {
        required: String,
        maybe: maybe(String),
      },
      '(Key maybe in {"required":"value"}) - Expected undefined to be a String',
    ],
    [
      {
        required: 'value',
        maybe: undefined,
      },
      {
        required: String,
        maybe: maybe(String),
      },
      '(Key maybe in {"required":"value","maybe":undefined}) - Expected undefined to be a String',
    ],
    [
      {
        required: 'value',
        maybe: null,
      },
      {
        required: String,
        maybe: maybe(String),
      },
      '(Key maybe in {"required":"value","maybe":null}) - Expected null to be a String',
    ],
    // Optional
    [undefined, optional(String), 'Expected undefined to be a String'],
    [
      {
        required: 'value',
      },
      {
        required: String,
        optional: optional(String),
      },
      '(Key optional in {"required":"value"}) - Expected undefined to be a String',
    ],
    [
      {
        required: 'value',
        optional: undefined,
      },
      {
        required: String,
        optional: optional(String),
      },
      '(Key optional in {"required":"value","optional":undefined}) - Expected undefined to be a String',
    ],
    [
      {
        required: 'value',
        optional: 'other-value',
      },
      {
        required: String,
        optional: optional(String),
      },
      '(Key optional in {"required":"value","optional":"other-value"}) - Expected String("other-value") to be a String',
    ],
    // Where
    [
      'yes',
      where((value) => {
        return value === 'yes';
      }),
      'Failed Where validation',
    ],
    // Array
    [
      ['first-value', 'second-value'],
      [String],
      'Expected ["first-value", "second-value"] to be matching an [String]',
    ],
    [
      ['first-value', 2],
      [String, Number],
      'Expected [String("first-value"), Number(2)] to be matching an [String, Number]',
    ],
    // Array as property in record
    [
      // Case "optional array property on collection":
      { elements: [new MyClass('first'), new MyClass('second')] },
      { elements: optional(list(iof(MyClass))) },
      `(Key 'elements': Expected [MyClass({}), MyClass({})] to be matching an [[MyClass]] in MyList({"elements":[{},{}]}))`,
    ],
    [
      // Case "optional array property on collection"(non-optional):
      { elements: [new MyClass('first'), new MyClass('second')] },
      { elements: list(iof(MyClass)) },
      `Key 'elements': Expected [MyClass({}), MyClass({})] to be matching an [[MyClass]] in MyList({"elements":[{},{}]}))`,
    ],
    // Object
    [
      {
        first: 'first-value',
      },
      {
        first: String,
      },
      '(Key first in {"first":"first-value"}) - Expected String("first-value") to be a String',
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
          baz: {
            c: 'value',
          },
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      },
      `(Key foo.bar.b in {"foo":{"bar":{"a":"some-value","b":2},"baz":{"c":"value"}}}) - Expected Number(2) to be a Number`,
    ],
    [
      {
        elements: ['a', 'b'],
      },
      {
        elements: [String],
      },
      '(Key elements in {"elements":["a","b"]}) - Expected ["a", "b"] to be matching an [String]',
    ],
    // ObjectIncluding
    [
      {
        first: 'first-value',
        second: 'second-value',
      },
      collectionIncluding({
        first: String,
      }),
      'Unexpected key second in {"first":"first-value"}',
    ],
    [
      {
        first: 'first-value',
        second: 'second-value',
        third: 2,
      },
      collectionIncluding({
        first: String,
        third: Number,
      }),
      'Unexpected key second in {"first":"first-value"}',
    ],
    // Since whole object uses CollectionIncluding, we expected all properties with expected type like in definition - but we allow any other arbitrary values
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
          baz: {
            c: 'value',
            x:
              'value-assigned-to-key-that-is-arbitrary-since-whole-object-uses-object-including',
          },
        },
      },
      collectionIncluding({
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      }),
      `(Key 'foo.baz': Unexpected key 'x' in {"c":String("value"), "x":String("value-assigned-to-key-that-is-arbitrary-since-whole-object-uses-object-including")} in {"foo":{"bar":{"a":String("some-value"), "b":Number(2)}, "baz":{"c":String("value"), "x":String("value-assigned-to-key-that-is-arbitrary-since-whole-object-uses-object-including")}}})`,
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
          baz: {
            c: 'value',
          },
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: collectionIncluding({
            c: 'value',
          }),
        },
      },
      `Unexpected key foo.baz.c in {"foo":{"bar":{"a":"some-value","b":2},"baz":{"c":"value"}}}`,
    ],
    // ObjectMaybe
    [
      {
        first: 'first-value',
      },
      collectionWithin({
        first: String,
        second: {},
      }),
      '(Key second in {"first":"first-value"}) - Expected undefined to be an Object',
    ],
    [
      {
        first: 'first-value',
        second: {},
      },
      collectionWithin({
        first: String,
        second: {
          third: {},
        },
      }),
      '(Key second.third in {"first":"first-value","second":{}}) - Expected undefined to be an Object',
    ],
    // PropsOf
    [
      new MyClass('my-string'),
      propsOf(MyClass),
      `(Key 'value': Expected String("my-string") to be a String in MyClass({"value":"my-string"}))`,
    ],
    // TypeOf
    [
      new MyClass('my-string'),
      typeOf(MyClass),
      `(Key 'value': Expected MyClass({"value":"my-string"})) to be a String in MyClass({"value":"my-string"}))`,
    ],
  ];

  for (const value of values) {
    it(`returns true for ${value[2].replace('Expected', 'expected')}`, () => {
      expect(validate(value[0], value[1]), value[2]).to.true;
    });
  }
});

// prettier-ignore
describe(`not matching`, () => {
  const date = new Date('2017-02-06T20:43:13.464Z');

  const values: [any, any, string][] = [
    // Integer
    [Infinity, Integer, `Expected Integer, got Number(null)`],
    [-Infinity, Integer, `Expected Integer, got Number(null)`],
    [NaN, Integer, `Expected Integer, got Number(null)`],
    [Math.PI, Integer, `Expected Integer, got Number(3.141592653589793)`],
    [-Math.PI, Integer, `Expected Integer, got Number(-3.141592653589793)`],
    ['abcd', Integer, `Expected Number, got String("abcd")`],
    [
      {
        key: 'my-string',
      },
      Integer,
      `Expected Number, got {"key":String("my-string")}`,
    ],
    [
      new MyClass('test'),
      Integer,
      `Expected Number, got MyClass({"value":"test"})`,
    ],
    [date, Integer, `Expected Number, got Date("2017-02-06T20:43:13.464Z")`],
    [true, Integer, `Expected Number, got Boolean(true)`],
    [false, Integer, `Expected Number, got Boolean(false)`],
    [undefined, Integer, `Expected Number, got undefined`],
    [null, Integer, `Expected Number, got null`],
    [new RegExp(/fail/), Integer, `Expected Number, got RegExp(/fail/)`],
    [/fail/, Integer, `Expected Number, got RegExp(/fail/)`],
    [(): boolean => { return true }, Integer, `Expected Number, got Function`],
    [[1], Integer, `Expected Number, got [Number(1)]`],
    [[-1], Integer, `Expected Number, got [Number(-1)]`],
    [
      [Number.MAX_VALUE],
      Integer,
      `Expected Number, got [Number(1.7976931348623157e+308)]`,
    ],
    [
      [-Number.MAX_VALUE],
      Integer,
      `Expected Number, got [Number(-1.7976931348623157e+308)]`,
    ],
    [['abcd'], Integer, `Expected Number, got [String("abcd")]`],
    [
      [
        {
          key: 'my-string',
        },
      ],
      Integer,
      `Expected Number, got [{"key":String("my-string")}]`,
    ],
    [
      [new MyClass('test')],
      Integer,
      `Expected Number, got [MyClass({"value":"test"})]`,
    ],
    [
      [date],
      Integer,
      `Expected Number, got [Date("2017-02-06T20:43:13.464Z")]`,
    ],
    [[true], Integer, `Expected Number, got [Boolean(true)]`],
    [[false], Integer, `Expected Number, got [Boolean(false)]`],
    [[undefined], Integer, `Expected Number, got [undefined]`],
    [[null], Integer, `Expected Number, got [null]`],
    [[new RegExp(/fail/)], Integer, `Expected Number, got [RegExp(/fail/)]`],
    [[/fail/], Integer, `Expected Number, got [RegExp(/fail/)]`],
    [[(): boolean => { return true },], Integer, `Expected Number, got [Function]`],
    [
      new MyOtherError('my-other-error'),
      MyError,
      `Expected MyOtherError('my-other-error') to be a MyError`,
    ],
    [MyOtherError, MyError, `Expected MyOtherError to be a MyError`],
    [
      new MyError('my-message'),
      new Error('my-message'),
      `Expected MyError('my-message') to be equal to Error('my-message')`,
    ],
    [
      new MyError('my-message'),
      new MyError('my-other-message'),
      `Expected MyError('my-message') to be equal to MyError('my-other-message')`,
    ],
    // OneOf
    [
      'foo',
      oneOf('bar', 'baz'),
      'Expected String("foo") to be one of: String("bar"), String("baz")',
    ],
    [
      'foo',
      oneOf('bar', /^asdf$/g),
      'Expected String("foo") to be one of: String("bar"), RegExp(/^asdf$/g)',
    ],
    [
      10,
      oneOf(String, Boolean),
      'Expected Number(10) to be one of: String, Boolean',
    ],
    [
      true,
      oneOf(null, undefined),
      'Expected Boolean(true) to be one of: null, undefined',
    ],
    [
      false,
      oneOf(null, undefined),
      'Expected Boolean(false) to be one of: null, undefined',
    ],
    [null, oneOf(undefined), 'Expected null to be one of: undefined'],
    [undefined, oneOf(null), 'Expected undefined to be one of: null'],
    [
      new MyClass('my-value'),
      oneOf(String, MyOtherClass),
      'Expected MyClass({"value":"my-value"}) to be one of: String, MyOtherClass',
    ],
    // Optional
    [null, optional(String), 'Expected null to be a String'],
    [
      {
        required: 'value',
        optional: null,
      },
      {
        required: String,
        optional: optional(String),
      },
      `Key 'optional': Expected null to be a String in {"required":String("value"), "optional":null})`,
    ],
    // Where
    [
      'no',
      where(value => {
        return value === 'yes';
      }),
      'Failed Where validation',
    ],
    [
      `Luke I'm your father!`,
      where(value => {
        if (value === `Luke I'm your father!`) {
          throw new ValidationError(`nooooooooo!`);
        }
      }),
      `nooooooooo!`,
    ],
    // Array
    [
      ['first-value', 2],
      [String],
      'Expected [String("first-value"), Number(2)] to be matching an [String]',
    ],
    [
      ['first-value', 'second-value'],
      [String, Number],
      'Expected [String("first-value"), String("second-value")] to be matching an [String, Number]',
    ],
    // Object
    [
      {
        first: 'first-value',
        second: 'second-value',
      },
      {
        first: String,
      },
      `Unexpected key 'second' in {"first":String("first-value"), "second":String("second-value")}`,
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 'invalid-should-be-number',
          },
          baz: {
            c: 'value',
          },
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      },
      `(Key 'foo.bar.b': Expected String("invalid-should-be-number") to be a Number in {"foo":{"bar":{"a":String("some-value"), "b":String("invalid-should-be-number")}, "baz":{"c":String("value")}}})`,
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
          baz: {
            c: 'value',
            x: 'value-assigned-to-key-that-should-not-exist',
          },
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      },
      `(Key 'foo.baz': Unexpected key 'x' in {"c":String("value"), "x":String("value-assigned-to-key-that-should-not-exist")} in {"foo":{"bar":{"a":String("some-value"), "b":Number(2)}, "baz":{"c":String("value"), "x":String("value-assigned-to-key-that-should-not-exist")}}})`,
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
          baz: {
            c: 'invalid-value',
          },
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: collectionIncluding({
            c: 'value',
          }),
        },
      },
      `(Key 'foo.baz.c': Expected String("invalid-value") to be equal to String("value") in {"foo":{"bar":{"a":String("some-value"), "b":Number(2)}, "baz":{"c":String("invalid-value")}}})`,
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: collectionIncluding({
            c: 'value',
          }),
        },
      },
      `(Key 'foo.baz': Expected undefined to be an Object in {"foo":{"bar":{"a":String("some-value"), "b":Number(2)}}})`,
    ],
    [
      {
        foo: {
          bar: {
            a: 'some-value',
            b: 2,
          },
          baz: {},
        },
      },
      {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: collectionIncluding({
            c: 'value',
          }),
        },
      },
      `(Key 'foo.baz.c': Expected undefined to be equal to String("value") in {"foo":{"bar":{"a":String("some-value"), "b":Number(2)}, "baz":{}}})`,
    ],
    // PropsOf
    [
      new MyClass(2 as any),
      propsOf(MyClass),
      `(Key 'value': Expected Number(2) to be a String in MyClass({"value":2}))`,
    ],
    // TypeOf
    [
      new MyClass(2 as any),
      typeOf(MyClass),
      `(Key 'value': Expected Number(2) to be a String in MyClass({"value":2}))`,
    ],
    [
      { value: 'my-string' },
      typeOf(MyClass),
      `Expected {"value":String("my-string")} to be an instance of MyClass`,
    ],
  ];

  for (const value of values) {
    it(`throws ValidationError for ${value[2].replace('Expected', 'expected')}`, () => {
      expect(() => validate(value[0], value[1]), value[2]).to.throw(ValidationError, value[2]);
    });
  }
});
