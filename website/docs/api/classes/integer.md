---
id: "integer"
title: "Integer"
sidebar_label: "Integer"
---

Validates if value(number) is an integer.

**`returns`** Returns `true` if value is an integer, else throws.

**`example`** 
```ts
import { expect } from 'chai';
import {
  check,
  integer,
  Integer,
  InvalidValueError,
  validate,
} from 'typend';

check<integer>(10);
expect(() => check<integer>(Math.PI)).to.throw(InvalidValueError);

validate(10, Integer);
validate(10, integer);
```

## Hierarchy

  ↳ [Pattern](pattern.md)

* Pattern

  ↳ **Integer**

## Implements

* [Pattern](../interfaces/types.pattern.md)
* Pattern

## Index

### Properties

* [constructor](integer.md#constructor)
* [describer](integer.md#static-describer)
* [kind](integer.md#static-kind)

### Accessors

* [isOptional](integer.md#isoptional)
* [isRequired](integer.md#isrequired)

### Methods

* [describe](integer.md#describe)
* [getInitializer](integer.md#getinitializer)
* [getKind](integer.md#getkind)
* [hasInitializer](integer.md#hasinitializer)
* [hasOwnProperty](integer.md#hasownproperty)
* [isPrototypeOf](integer.md#isprototypeof)
* [propertyIsEnumerable](integer.md#propertyisenumerable)
* [setInitializer](integer.md#setinitializer)
* [toLocaleString](integer.md#tolocalestring)
* [toString](integer.md#tostring)
* [valueOf](integer.md#valueof)
* [getDescriber](integer.md#static-getdescriber)
* [setDescriber](integer.md#static-setdescriber)

## Properties

###  constructor

• **constructor**: *Function*

*Inherited from [Pattern](pattern.md).[constructor](pattern.md#constructor)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

The initial value of Object.prototype.constructor is the standard built-in Object constructor.

___

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[describer](pattern.md#static-describer)*

*Overrides void*

___

### `Static` kind

▪ **kind**: *KINDS* = KINDS.INTEGER

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
