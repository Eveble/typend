---
id: "class"
title: "Class"
sidebar_label: "Class"
---

## Hierarchy

  ↳ [Pattern](pattern.md)

* Pattern

  ↳ **Class**

## Implements

* [Pattern](../interfaces/types.pattern.md)
* Pattern

## Index

### Constructors

* [constructor](class.md#constructor)

### Properties

* [properties](class.md#properties)
* [type](class.md#type)
* [describer](class.md#static-describer)
* [kind](class.md#static-kind)

### Accessors

* [isOptional](class.md#isoptional)
* [isRequired](class.md#isrequired)

### Methods

* [describe](class.md#describe)
* [getInitializer](class.md#getinitializer)
* [getKind](class.md#getkind)
* [hasInitializer](class.md#hasinitializer)
* [hasOwnProperty](class.md#hasownproperty)
* [isPrototypeOf](class.md#isprototypeof)
* [propertyIsEnumerable](class.md#propertyisenumerable)
* [setInitializer](class.md#setinitializer)
* [toLocaleString](class.md#tolocalestring)
* [toString](class.md#tostring)
* [valueOf](class.md#valueof)
* [getDescriber](class.md#static-getdescriber)
* [setDescriber](class.md#static-setdescriber)

## Constructors

###  constructor

\+ **new Class**(`type`: any, `properties`: [Type](../modules/types.md#type)): *[Class](class.md)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

Creates an instance of an Class(pattern).
Creates an instance of an Class(pattern).

**`throws`** {InvalidTypeError}
Thrown if provided type is invalid(is not a class).

**`throws`** {InvalidDefinitionError}
Thrown if provided properties are invalid(is not an plain object or instance of `Collection` pattern).

**`throws`** {InvalidTypeError}
Thrown if provided type is invalid(is not a class).

**`throws`** {InvalidDefinitionError}
Thrown if provided properties are invalid(is not an plain object or instance of `Collection` pattern).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | Type constructor. |
`properties` | [Type](../modules/types.md#type) | Properties that describes class. |

**Returns:** *[Class](class.md)*

## Properties

###  properties

• **properties**: *Record‹keyof any, any› | Collection*

___

###  type

• **type**: *[Class](../modules/types.md#class)*

___

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[describer](pattern.md#static-describer)*

*Overrides void*

___

### `Static` kind

▪ **kind**: *KINDS* = KINDS.CLASS

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
