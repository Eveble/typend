---
id: "collection"
title: "Collection"
sidebar_label: "Collection"
---

Validates an Object with the given keys and with values matching the given pattern.
The value must not contain any arbitrary keys(not listed in the pattern).
The value must be a plain Object or class instance.

**`returns`** Returns `true` if value is matching explicit `Collection` pattern or implicit
expectation as plain object, else throws.

**`example`** 
```ts
import { expect } from 'chai';
import {
  check,
  validate,
  PropTypes,
  UnexpectedKeyError,
} from 'typend';

check<Record<any, any>>({ foo: 'foo' });
check<Record<keyof any, any>>({ foo: 'foo' });
check<{}>({});
check<{ name: string; age: number }>({ name: 'Jane Doe', age: 28 });
check<Car>({ brand: 'Tesla' });

// Explicit:
validate({}, PropTypes.object);
validate({ foo: 'foo' }, PropTypes.shape({ foo: 'foo' }));
validate(
  { name: 'Jane Doe', age: 28 },
  PropTypes.shape({
    name: String,
    age: Number,
  })
);
expect(() =>
  validate({ foo: 'foo', bar: 'bar' }, PropTypes.shape({ foo: 'foo' }))
).to.throw(UnexpectedKeyError);

// Implicit: you can omit defining explicit pattern(`Collection`) by passing plain object:
validate({ foo: 'foo' }, { foo: 'foo' });

// By default, validator will run in strict mode - so its equivalent of:
validate({ foo: 'foo' }, { foo: 'foo' }, true);
```

## Hierarchy

  ↳ [Pattern](pattern.md)

* Pattern

  ↳ **Collection**

## Implements

* [Pattern](../interfaces/types.pattern.md)
* Pattern

## Index

### Constructors

* [constructor](collection.md#constructor)

### Properties

* [describer](collection.md#static-describer)
* [kind](collection.md#static-kind)

### Accessors

* [isOptional](collection.md#isoptional)
* [isRequired](collection.md#isrequired)

### Methods

* [describe](collection.md#describe)
* [getInitializer](collection.md#getinitializer)
* [getKind](collection.md#getkind)
* [hasInitializer](collection.md#hasinitializer)
* [hasOwnProperty](collection.md#hasownproperty)
* [isPrototypeOf](collection.md#isprototypeof)
* [propertyIsEnumerable](collection.md#propertyisenumerable)
* [setInitializer](collection.md#setinitializer)
* [toLocaleString](collection.md#tolocalestring)
* [toString](collection.md#tostring)
* [valueOf](collection.md#valueof)
* [getDescriber](collection.md#static-getdescriber)
* [setDescriber](collection.md#static-setdescriber)

## Constructors

###  constructor

\+ **new Collection**(`properties?`: Record‹keyof any, any›): *[Collection](collection.md)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

Creates an instance of an Collection.
Creates an instance of an Collection.

**`throws`** {InvalidTypeError}
Thrown if provided properties is not an object.

**`throws`** {InvalidTypeError}
Thrown if provided properties is not an object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`properties?` | Record‹keyof any, any› | Properties that will be used to validate value. |

**Returns:** *[Collection](collection.md)*

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[describer](pattern.md#static-describer)*

*Overrides void*

___

### `Static` kind

▪ **kind**: *KINDS* = KINDS.OBJECT

*Overrides [Pattern](pattern.md).[kind](pattern.md#static-kind)*

## Accessors

###  isOptional

• **get isOptional**(): *[Optional](optional.md)*

*Inherited from [Pattern](pattern.md).[isOptional](pattern.md#isoptional)*

*Overrides void*

**Returns:** *[Optional](optional.md)*

___

###  isRequired

• **get isRequired**(): *any*

*Inherited from [Pattern](pattern.md).[isRequired](pattern.md#isrequired)*

*Overrides void*

**Returns:** *any*

## Methods

###  describe

▸ **describe**(`value`: any): *string*

*Inherited from [Pattern](pattern.md).[describe](pattern.md#describe)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *string*

___

###  getInitializer

▸ **getInitializer**(): *any | undefined*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[getInitializer](pattern.md#getinitializer)*

*Overrides void*

**Returns:** *any | undefined*

___

###  getKind

▸ **getKind**(): *string*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[getKind](pattern.md#getkind)*

*Overrides void*

**Returns:** *string*

___

###  hasInitializer

▸ **hasInitializer**(): *boolean*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[hasInitializer](pattern.md#hasinitializer)*

*Overrides void*

**Returns:** *boolean*

___

###  hasOwnProperty

▸ **hasOwnProperty**(`v`: PropertyKey): *boolean*

*Inherited from [Pattern](pattern.md).[hasOwnProperty](pattern.md#hasownproperty)*

*Overrides [Pattern](pattern.md).[hasOwnProperty](pattern.md#hasownproperty)*

Determines whether an object has a property with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | PropertyKey | A property name.  |

**Returns:** *boolean*

___

###  isPrototypeOf

▸ **isPrototypeOf**(`v`: [Object](pattern.md#static-object)): *boolean*

*Inherited from [Pattern](pattern.md).[isPrototypeOf](pattern.md#isprototypeof)*

*Overrides [Pattern](pattern.md).[isPrototypeOf](pattern.md#isprototypeof)*

Determines whether an object exists in another object's prototype chain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | [Object](pattern.md#static-object) | Another object whose prototype chain is to be checked.  |

**Returns:** *boolean*

___

###  propertyIsEnumerable

▸ **propertyIsEnumerable**(`v`: PropertyKey): *boolean*

*Inherited from [Pattern](pattern.md).[propertyIsEnumerable](pattern.md#propertyisenumerable)*

*Overrides [Pattern](pattern.md).[propertyIsEnumerable](pattern.md#propertyisenumerable)*

Determines whether a specified property is enumerable.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | PropertyKey | A property name.  |

**Returns:** *boolean*

___

###  setInitializer

▸ **setInitializer**(`initializer`: any): *void*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[setInitializer](pattern.md#setinitializer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`initializer` | any |

**Returns:** *void*

___

###  toLocaleString

▸ **toLocaleString**(): *string*

*Inherited from [Pattern](pattern.md).[toLocaleString](pattern.md#tolocalestring)*

*Overrides [Pattern](pattern.md).[toLocaleString](pattern.md#tolocalestring)*

Returns a date converted to a string using the current locale.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Pattern](pattern.md).[toString](pattern.md#tostring)*

*Overrides [Pattern](pattern.md).[toString](pattern.md#tostring)*

Returns a string representation of an object.

**Returns:** *string*

___

###  valueOf

▸ **valueOf**(): *[Object](pattern.md#static-object)*

*Inherited from [Pattern](pattern.md).[valueOf](pattern.md#valueof)*

*Overrides [Pattern](pattern.md).[valueOf](pattern.md#valueof)*

Returns the primitive value of the specified object.

**Returns:** *[Object](pattern.md#static-object)*

___

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[getDescriber](pattern.md#static-getdescriber)*

*Overrides void*

**Returns:** *[Describer](../interfaces/types.describer.md)*

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Inherited from [Pattern](pattern.md).[setDescriber](pattern.md#static-setdescriber)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) |

**Returns:** *void*
