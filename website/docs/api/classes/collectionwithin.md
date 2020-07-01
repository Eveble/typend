---
id: "collectionwithin"
title: "CollectionWithin"
sidebar_label: "CollectionWithin"
---

Validates if value matches an Object with expected keys and values matching the
given expectations. The value may also contain other keys with arbitrary values not
defined in pattern(equivalent of Meteor's `Match.ObjectIncluding`).

It also can omit nested  Object properties(useful for building up configuration a
like objects).

**`returns`** Returns true if value is matching explicit `CollectionWithin` pattern even
on nested missing object properties, else throws.

**`example`** 
```ts
import { expect } from 'chai';
import {
 validate,
 CollectionWithin,
 ValidationError,
} from 'typend';

const expectation = {
  included: {
    foo: 'foo',
  },
  omitted: {
    bar: 'bar',
  },
};

expect(
  validate(
    { included: { foo: 'foo' }, omitted: { bar: 'bar' } },
    new CollectionWithin(expectation)
  )
).to.be.true;

expect(
  validate({ included: { foo: 'foo' } }, new CollectionWithin(expectation))
).to.be.true;

expect(() =>
  validate(
    { included: { foo: 'NOT_foo' } },
    new CollectionWithin(expectation)
  )
).to.throw(ValidationError);
```

## Hierarchy

  ↳ [Pattern](pattern.md)

* Pattern

  ↳ **CollectionWithin**

## Implements

* [Pattern](../interfaces/types.pattern.md)
* Pattern

## Index

### Constructors

* [constructor](collectionwithin.md#constructor)

### Properties

* [describer](collectionwithin.md#static-describer)
* [kind](collectionwithin.md#static-kind)

### Accessors

* [isOptional](collectionwithin.md#isoptional)
* [isRequired](collectionwithin.md#isrequired)

### Methods

* [describe](collectionwithin.md#describe)
* [getInitializer](collectionwithin.md#getinitializer)
* [getKind](collectionwithin.md#getkind)
* [hasInitializer](collectionwithin.md#hasinitializer)
* [hasOwnProperty](collectionwithin.md#hasownproperty)
* [isPrototypeOf](collectionwithin.md#isprototypeof)
* [propertyIsEnumerable](collectionwithin.md#propertyisenumerable)
* [setInitializer](collectionwithin.md#setinitializer)
* [toLocaleString](collectionwithin.md#tolocalestring)
* [toString](collectionwithin.md#tostring)
* [valueOf](collectionwithin.md#valueof)
* [getDescriber](collectionwithin.md#static-getdescriber)
* [setDescriber](collectionwithin.md#static-setdescriber)

## Constructors

###  constructor

\+ **new CollectionWithin**(`properties`: Record‹keyof any, any›): *[CollectionWithin](collectionwithin.md)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

Creates an instance of an CollectionWithin.
Creates an instance of an CollectionWithin.

**`throws`** {InvalidDefinitionError}
Thrown if provided properties is invalid(is not an object).

**`throws`** {InvalidDefinitionError}
Thrown if provided properties is invalid(is not an object).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`properties` | Record‹keyof any, any› | Properties that will be used to validate value. |

**Returns:** *[CollectionWithin](collectionwithin.md)*

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[describer](pattern.md#static-describer)*

*Overrides void*

___

### `Static` kind

▪ **kind**: *KINDS* = KINDS.OBJECT_WITHIN

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
