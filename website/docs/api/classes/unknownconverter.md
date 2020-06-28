---
id: "unknownconverter"
title: "UnknownConverter"
sidebar_label: "UnknownConverter"
---

## Hierarchy

* **UnknownConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](unknownconverter.md#convert)
* [isConvertible](unknownconverter.md#isconvertible)
* [reflect](unknownconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Unknown](unknown.md)*

Converts unknown definition.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[Unknown](unknown.md)*

Returns `Unknown` pattern instance.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is an unknown.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is unknown, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Unknown](unknown.md)*

Reflects unknown definition.

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType |

**Returns:** *[Unknown](unknown.md)*

Returns `Unknown` pattern instance.
