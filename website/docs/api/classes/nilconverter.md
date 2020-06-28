---
id: "nilconverter"
title: "NilConverter"
sidebar_label: "NilConverter"
---

## Hierarchy

* **NilConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](nilconverter.md#convert)
* [isConvertible](nilconverter.md#isconvertible)
* [reflect](nilconverter.md#reflect)

### Object literals

* [MAPPINGS](nilconverter.md#static-mappings)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *null | undefined*

Converts reflected type to nil for validation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *null | undefined*

Returns converted reflected type as `null` or `undefined`.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is nil.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is nil, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *null | undefined*

Reflects type to nil.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *null | undefined*

Returns reflected type as `null` or `undefined`.

## Object literals

### `Static` MAPPINGS

### ▪ **MAPPINGS**: *object*

###  12

• **12**: *undefined* = undefined

###  13

• **13**: *null* = null
