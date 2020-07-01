---
id: "unrecognizedconverter"
title: "UnrecognizedConverter"
sidebar_label: "UnrecognizedConverter"
---

## Hierarchy

* **UnrecognizedConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](unrecognizedconverter.md#convert)
* [isConvertible](unrecognizedconverter.md#isconvertible)
* [reflect](unrecognizedconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Unrecognized](unrecognized.md)*

Converts unrecognized definition.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[Unrecognized](unrecognized.md)*

Returns `Unrecognized` pattern instance.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is an unrecognized.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is unrecognized, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Unrecognized](unrecognized.md)*

Reflects unrecognized definition.

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType |

**Returns:** *[Unrecognized](unrecognized.md)*

Returns `Unrecognized` pattern instance.
