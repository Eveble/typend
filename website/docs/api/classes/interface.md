---
id: "interface"
title: "Interface"
sidebar_label: "Interface"
---

## Hierarchy

  ↳ [Pattern](pattern.md)

  ↳ **Interface**

## Implements

* [Pattern](../interfaces/types.pattern.md)

## Index

### Constructors

* [constructor](interface.md#constructor)

### Properties

* [describer](interface.md#static-describer)
* [kind](interface.md#static-kind)

### Accessors

* [isOptional](interface.md#isoptional)
* [isRequired](interface.md#isrequired)

### Methods

* [describe](interface.md#describe)
* [getInitializer](interface.md#getinitializer)
* [getKind](interface.md#getkind)
* [getName](interface.md#getname)
* [hasInitializer](interface.md#hasinitializer)
* [hasOwnProperty](interface.md#hasownproperty)
* [isPrototypeOf](interface.md#isprototypeof)
* [propertyIsEnumerable](interface.md#propertyisenumerable)
* [setInitializer](interface.md#setinitializer)
* [setName](interface.md#setname)
* [toLocaleString](interface.md#tolocalestring)
* [toString](interface.md#tostring)
* [valueOf](interface.md#valueof)
* [getDescriber](interface.md#static-getdescriber)
* [setDescriber](interface.md#static-setdescriber)

## Constructors

###  constructor

\+ **new Interface**(`properties`: Record‹keyof any, any›): *[Interface](interface.md)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

Creates an instance of an Interface(pattern).

**`throws`** {InvalidTypeError}
Thrown if provided properties is not an plain object or instance of `Collection` pattern.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`properties` | Record‹keyof any, any› | Properties that describes interface. |

**Returns:** *[Interface](interface.md)*

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[describer](pattern.md#static-describer)*

___

### `Static` kind

▪ **kind**: *[KINDS](../enums/kinds.md)* = KINDS.INTERFACE

*Overrides [Pattern](pattern.md).[kind](pattern.md#static-kind)*

## Accessors

###  isOptional

• **get isOptional**(): *[Optional](optional.md)*

*Inherited from [Pattern](pattern.md).[isOptional](pattern.md#isoptional)*

Make current pattern optional.

**Returns:** *[Optional](optional.md)*

Pattern wrapped with instance of Optional pattern.

___

###  isRequired

• **get isRequired**(): *any*

*Inherited from [Pattern](pattern.md).[isRequired](pattern.md#isrequired)*

Ensures that current pattern is required.

**Returns:** *any*

Pattern that is unwrapped from Optional pattern.

## Methods

###  describe

▸ **describe**(`value`: any): *string*

*Inherited from [Pattern](pattern.md).[describe](pattern.md#describe)*

Describes value in human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to be described. |

**Returns:** *string*

Human readable value described as a string.

___

###  getInitializer

▸ **getInitializer**(): *any | undefined*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[getInitializer](pattern.md#getinitializer)*

Returns the initializing value.

**Returns:** *any | undefined*

Initializing value, else undefined.

___

###  getKind

▸ **getKind**(): *string*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[getKind](pattern.md#getkind)*

Returns for which kind pattern is created.

**Returns:** *string*

Kind represented as a string.

___

###  getName

▸ **getName**(): *string*

Returns interface name from metadata.

**Returns:** *string*

Interface name as a `string`.

___

###  hasInitializer

▸ **hasInitializer**(): *boolean*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[hasInitializer](pattern.md#hasinitializer)*

Evaluates if initializing value was assigned to type.

**Returns:** *boolean*

Returns `true` if initializing value is set for type, else false.

___

###  hasOwnProperty

▸ **hasOwnProperty**(`v`: PropertyKey): *boolean*

*Inherited from [Pattern](pattern.md).[hasOwnProperty](pattern.md#hasownproperty)*

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

Sets as non-enumerable the initializing value for type if present on conversion.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initializer` | any | Initializer value provided on conversion.  |

**Returns:** *void*

___

###  setName

▸ **setName**(`name`: string): *void*

Sets interface name as type's metadata.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Interface name.  |

**Returns:** *void*

___

###  toLocaleString

▸ **toLocaleString**(): *string*

*Inherited from [Pattern](pattern.md).[toLocaleString](pattern.md#tolocalestring)*

Returns a date converted to a string using the current locale.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Pattern](pattern.md).[toString](pattern.md#tostring)*

Returns a string representation of an object.

**Returns:** *string*

___

###  valueOf

▸ **valueOf**(): *[Object](pattern.md#static-object)*

*Inherited from [Pattern](pattern.md).[valueOf](pattern.md#valueof)*

Returns the primitive value of the specified object.

**Returns:** *[Object](pattern.md#static-object)*

___

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[getDescriber](pattern.md#static-getdescriber)*

Returns describing library.

**Returns:** *[Describer](../interfaces/types.describer.md)*

Describer library instance.

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Inherited from [Pattern](pattern.md).[setDescriber](pattern.md#static-setdescriber)*

Sets describing library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) | Describer library instance.  |

**Returns:** *void*
