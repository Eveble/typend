import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { setTypeName } from '@eveble/helpers';
import { CompactDescriber } from '../../src/describers/compact-describer';
import { DebugDescriber } from '../../src/describers/debug-describer';
import { ArrayDescriber } from '../../src/describers/array-describer';
import { ErrorDescriber } from '../../src/describers/error-describer';
import { Describer } from '../../src/describer';
import { DescriptionList, Description } from '../../src/description';
import { NativeTypeDescriber } from '../../src/describers/native-type-describer';
import { ObjectDescriber } from '../../src/describers/object-describer';
import { ClassDescriber } from '../../src/describers/class-describer';
import { FallbackDescriber } from '../../src/describers/fallback-describer';
import { DescriptionListDescriber } from '../../src/describers/description-list-describer';
import { types } from '../../src/types';
import {
  TypeDescriberExistsError,
  TypeDescriberNotFoundError,
} from '../../src/errors';
import { KINDS } from '../../src/constants/literal-keys';

use(sinonChai);

describe(`Identifier`, () => {
  let describer: any;

  before(() => {
    describer = new Describer();
    describer.registerDescriber(KINDS.NATIVE, new NativeTypeDescriber());
    describer.registerDescriber(KINDS.ERROR, new ErrorDescriber());
    describer.registerDescriber(KINDS.ARRAY, new ArrayDescriber());
    describer.registerDescriber(KINDS.OBJECT, new ObjectDescriber());
    describer.registerDescriber(KINDS.CLASS, new ClassDescriber());
    describer.registerDescriber(KINDS.UNKNOWN, new FallbackDescriber());
    describer.registerDescriber(
      KINDS.DESCRIPTION_LIST,
      new DescriptionListDescriber()
    );
  });

  describe('construction', () => {
    it('takes describers map on construction and assigns it', () => {
      const describers = new Map([
        [KINDS.NATIVE, stubInterface<types.TypeDescriber>()],
        [KINDS.ERROR, stubInterface<types.TypeDescriber>()],
        [KINDS.ARRAY, stubInterface<types.TypeDescriber>()],
        [KINDS.OBJECT, stubInterface<types.TypeDescriber>()],
        [KINDS.CLASS, stubInterface<types.TypeDescriber>()],
        [KINDS.UNKNOWN, stubInterface<types.TypeDescriber>()],
        [KINDS.DESCRIPTION_LIST, stubInterface<types.TypeDescriber>()],
      ]);
      const instance = new Describer(describers);
      expect(instance.getDescribers()).to.be.equal(describers);
    });
  });

  describe('managing describers', () => {
    it(`allows to register type describer`, () => {
      const type = 'type';
      const typeDescriber = stubInterface<types.TypeDescriber>();

      const desc = new Describer();
      desc.registerDescriber(type, typeDescriber);
      expect(desc.hasDescriber(type)).to.be.true;
    });

    it(`throws TypeDescriberExistsError when overriding existing type describer`, () => {
      const type = 'type';
      const typeDescriber = stubInterface<types.TypeDescriber>();

      const desc = new Describer();
      desc.registerDescriber(type, typeDescriber);
      expect(() => desc.registerDescriber(type, typeDescriber)).to.throw(
        TypeDescriberExistsError,
        `Describer for type '${type}' would be overwritten. To
    override existing describer use 'Describer::overrideDescriber'`
      );
    });

    it(`allows to override existing type describer`, () => {
      const type = 'type';
      const typeDescriber = stubInterface<types.TypeDescriber>();
      const otherDescriber = stubInterface<types.TypeDescriber>();

      const desc = new Describer();
      desc.registerDescriber(type, typeDescriber);
      desc.overrideDescriber(type, otherDescriber);
      expect(desc.getDescriber(type)).to.be.equal(otherDescriber);
    });

    it(`returns true if type describer is registered`, () => {
      const type = 'type';
      const typeDescriber = stubInterface<types.TypeDescriber>();

      const desc = new Describer();
      desc.registerDescriber(type, typeDescriber);
      expect(desc.hasDescriber(type)).to.be.true;
    });

    it(`returns false if type describer is not registered`, () => {
      const desc = new Describer();
      expect(desc.hasDescriber('my-not-registered-describer')).to.be.false;
    });

    it(`throws TypeDescriberNotFoundError if type describer can't be found for specific type`, () => {
      const desc = new Describer();
      const type = 'native';
      expect(() => desc.createDescription('my-value')).to.throw(
        TypeDescriberNotFoundError,
        `Describer for type '${type}' can't be found`
      );
    });
  });

  describe('formatting', () => {
    it(`sets 'default' formatting of describer`, () => {
      const formatting: types.DescriberFormatting = 'default';
      const describers: Record<string, any> = {
        [KINDS.NATIVE]: NativeTypeDescriber,
        [KINDS.ERROR]: ErrorDescriber,
        [KINDS.ARRAY]: ArrayDescriber,
        [KINDS.OBJECT]: ObjectDescriber,
        [KINDS.CLASS]: ClassDescriber,
        [KINDS.UNKNOWN]: FallbackDescriber,
        [KINDS.DESCRIPTION_LIST]: DescriptionListDescriber,
      };

      const desc = new Describer();
      desc.setFormatting(formatting);
      for (const [type, TypeDescriber] of Object.entries(describers)) {
        expect(desc.getDescriber(type)).to.be.instanceof(TypeDescriber);
      }
    });

    it(`sets 'debug' formatting for all type describers as instance of DebugDescriber`, () => {
      const formatting: types.DescriberFormatting = 'debug';
      const describers: string[] = [
        KINDS.NATIVE,
        KINDS.ERROR,
        KINDS.ARRAY,
        KINDS.OBJECT,
        KINDS.CLASS,
        KINDS.UNKNOWN,
        KINDS.DESCRIPTION_LIST,
      ];

      const desc = new Describer();
      desc.setFormatting(formatting);
      for (const type of describers) {
        expect(desc.getDescriber(type)).to.be.instanceof(DebugDescriber);
      }
    });

    it(`sets 'compact' formatting for all type describers as instance of CompactDescriber`, () => {
      const formatting: types.DescriberFormatting = 'compact';
      const describers: string[] = [
        KINDS.NATIVE,
        KINDS.ERROR,
        KINDS.ARRAY,
        KINDS.OBJECT,
        KINDS.CLASS,
        KINDS.UNKNOWN,
        KINDS.DESCRIPTION_LIST,
      ];

      const desc = new Describer();
      desc.setFormatting(formatting);
      for (const type of describers) {
        expect(desc.getDescriber(type)).to.be.instanceof(CompactDescriber);
      }
    });
  });

  describe('describing a native type', () => {
    it('returns description for undefined', () => {
      const value = undefined;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'undefined';
      expect(description).to.be.eql({
        value: undefined,
        type: 'undefined',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for null', () => {
      const value = null;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'null';
      expect(description).to.be.eql({
        value: 'null',
        type: 'null',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for String', () => {
      const value = String;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'String';
      expect(description).to.be.eql({
        value: undefined,
        type: 'String',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Number', () => {
      const value = Number;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Number';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Number',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Boolean', () => {
      const value = Boolean;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Boolean';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Boolean',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for RegExp', () => {
      const value = RegExp;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'RegExp';
      expect(description).to.be.eql({
        value: undefined,
        type: 'RegExp',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Date', () => {
      const value = Date;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Date';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Date',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Function', () => {
      const value = Function;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Function';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Function',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Array', () => {
      const value = Array;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Array';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Array',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Object', () => {
      const value = Object;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Object';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Object',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });
  });

  describe('describing a native type instance', () => {
    it('returns description for String', () => {
      const value = 'my-string';
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'String("my-string")';
      expect(description).to.be.eql({
        value: '"my-string"',
        type: 'String',
        message,
      });
      expect(describer.describe(value)).to.be.eql('String("my-string")');
    });

    it('returns description for Number', () => {
      const value = 1;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Number(1)';
      expect(description).to.be.eql({
        value: '1',
        type: 'Number',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Boolean(true)', () => {
      const value = true;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Boolean(true)';
      expect(description).to.be.eql({
        value: 'true',
        type: 'Boolean',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Boolean(false)', () => {
      const value = false;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Boolean(false)';
      expect(description).to.be.eql({
        value: 'false',
        type: 'Boolean',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for RegExp', () => {
      const value = /my-regexp/;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'RegExp(/my-regexp/)';
      expect(description).to.be.eql({
        value: '/my-regexp/',
        type: 'RegExp',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Date', () => {
      const value = new Date('2017-02-06T20:43:13.464Z');
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Date("2017-02-06T20:43:13.464Z")';
      expect(description).to.be.eql({
        value: '"2017-02-06T20:43:13.464Z"',
        type: 'Date',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Function', () => {
      const value = (): boolean => true;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Function';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Function',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for an Array', () => {
      const value = [1, 'my-string', true];
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = '[Number(1), String("my-string"), Boolean(true)]';
      expect(description).to.be.eql({
        value: 'Number(1), String("my-string"), Boolean(true)',
        type: 'Array',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for an Object', () => {
      const value = { key: 'value' };
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = '{"key":String("value")}';
      expect(description).to.be.eql({
        value: '"key":String("value")',
        type: 'Object',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });
  });

  describe('describing an error', () => {
    class MyError extends Error {}

    it('returns description for Error', () => {
      const value = Error;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Error';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Error',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for custom MyError class', () => {
      const value = MyError;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'MyError';
      expect(description).to.be.eql({
        value: undefined,
        type: 'MyError',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for Error instance', () => {
      const value = new Error('my-message');
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = `Error('my-message')`;
      expect(description).to.be.eql({
        value: `'my-message'`,
        type: 'Error',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for custom MyError class instance', () => {
      const value = new MyError('my-message');
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = `MyError('my-message')`;
      expect(description).to.be.eql({
        value: `'my-message'`,
        type: 'MyError',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });
  });

  describe('handling of complex structures', () => {
    describe('objects', () => {
      it('returns description for object with nested objects associated to keys', () => {
        const value = {
          'key-1': {
            'key-2': String,
            'key-3': Number,
          },
          'key-4': {
            'key-5': 'my-string',
            'key-6': {
              'key-7': 1,
            },
          },
        };
        const description = describer.createDescription(value);
        expect(description).to.be.instanceof(Description);
        const message =
          '{"key-1":{"key-2":String, "key-3":Number}, "key-4":{"key-5":String("my-string"), "key-6":{"key-7":Number(1)}}}';
        expect(description).to.be.eql({
          value: `"key-1":{"key-2":String, "key-3":Number}, "key-4":{"key-5":String("my-string"), "key-6":{"key-7":Number(1)}}`,
          type: 'Object',
          message,
        });
        expect(describer.describe(value)).to.be.eql(message);
      });

      it('returns description for object with multidimensional array', () => {
        const value = {
          'key-1': {
            'key-2': [1, 'my-string', true, [4]],
            'key-3': Number,
          },
          'key-4': {
            'key-5': 'my-string',
            'key-6': {
              'key-7': 1,
            },
          },
        };
        const description = describer.createDescription(value);
        expect(description).to.be.instanceof(Description);
        const message =
          '{"key-1":{"key-2":[Number(1), String("my-string"), Boolean(true), [Number(4)]], "key-3":Number}, "key-4":{"key-5":String("my-string"), "key-6":{"key-7":Number(1)}}}';
        expect(description).to.be.eql({
          value:
            '"key-1":{"key-2":[Number(1), String("my-string"), Boolean(true), [Number(4)]], "key-3":Number}, "key-4":{"key-5":String("my-string"), "key-6":{"key-7":Number(1)}}',
          type: 'Object',
          message,
        });
        expect(describer.describe(value)).to.be.eql(message);
      });
    });

    describe('arrays', () => {
      it('returns list description for multidimensional array', () => {
        const value = [[1, 'my-string', true, [4]], 'my-other-string'];
        const description = describer.createDescription(value);
        expect(description).to.be.instanceof(DescriptionList);
        expect(description).to.be.eql(
          new DescriptionList([
            new Description({
              value:
                'Number(1), String("my-string"), Boolean(true), [Number(4)]',
              type: 'Array',
              message:
                '[Number(1), String("my-string"), Boolean(true), [Number(4)]]',
            }),
            new Description({
              value: '"my-other-string"',
              type: 'String',
              message: 'String("my-other-string")',
            }),
          ])
        );
        expect(describer.describe(value)).to.be.equal(
          `[[Number(1), String("my-string"), Boolean(true), [Number(4)]], String("my-other-string")]`
        );
      });
    });
  });

  describe('describing classes', () => {
    class Dependency {
      public value: any;

      constructor(value: any) {
        this.value = value;
      }
    }
    class MyDependingClass {
      public dep: any;

      constructor(dep: any) {
        this.dep = dep;
      }
    }

    it('returns description for class', () => {
      const value = new Dependency('my-value');
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Dependency({"value":"my-value"})';
      expect(description).to.be.eql({
        value: '{"value":"my-value"}',
        type: 'Dependency',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for class dependant on other class', () => {
      const dependency = new Dependency('my-value');
      const value = new MyDependingClass(dependency);
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'MyDependingClass({"dep":{"value":"my-value"}})';
      expect(description).to.be.eql({
        value: '{"dep":{"value":"my-value"}}',
        type: 'MyDependingClass',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });
  });

  describe('describing serializable classes', () => {
    const typeName = 'Namespace.MyClass';

    class MyClass {
      public value: any;

      constructor(value: any) {
        this.value = value;
      }
    }
    setTypeName(MyClass, typeName);

    it('returns description for serializable class constructor', () => {
      const value = MyClass;
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Namespace.MyClass';
      expect(description).to.be.eql({
        value: undefined,
        type: 'Namespace.MyClass',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });

    it('returns description for serializable class instance', () => {
      const value = new MyClass('my-value');
      const description = describer.createDescription(value);
      expect(description).to.be.instanceof(Description);
      const message = 'Namespace.MyClass({"value":"my-value"})';
      expect(description).to.be.eql({
        value: '{"value":"my-value"}',
        type: 'Namespace.MyClass',
        message,
      });
      expect(describer.describe(value)).to.be.eql(message);
    });
  });
});
