---
id: "objectconverter"
title: "ObjectConverter"
sidebar_label: "ObjectConverter"
---

## Hierarchy

* **ObjectConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](objectconverter.md#convert)
* [isConvertible](objectconverter.md#isconvertible)
* [isInterface](objectconverter.md#isinterface)
* [reflect](objectconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: ObjectType, `converter`: [Converter](../interfaces/types.converter.md)): *[Collection](collection.md) | [Interface](interface.md)*

Converts reflected type object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | ObjectType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *[Collection](collection.md) | [Interface](interface.md)*

Returns converted object properties as instance of `Collection` pattern for object or instance of `Interface` for interfaces.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsrTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is an object(or interface - they are
reflected as same kind).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsrTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is an `Object` or interface, else `false`.

___

###  isInterface

▸ **isInterface**(`reflectedType`: tsrTypes.ReflectedType): *boolean*

Determines whether reflected type is an interface.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsrTypes.ReflectedType | Reflected type that will be converted. |

**Returns:** *boolean*

Returns `true` if reflected type is interface, `else` false.

___

###  reflect

▸ **reflect**(`reflectedType`: ObjectType, `converter`: [Converter](../interfaces/types.converter.md)): *Record‹keyof any, any›*

Reflect object type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | ObjectType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *Record‹keyof any, any›*

Returns reflected object properties as instance of an `Object`.
