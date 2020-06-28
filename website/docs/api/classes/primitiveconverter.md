---
id: "primitiveconverter"
title: "PrimitiveConverter"
sidebar_label: "PrimitiveConverter"
---

## Hierarchy

* **PrimitiveConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](primitiveconverter.md#convert)
* [isConvertible](primitiveconverter.md#isconvertible)
* [reflect](primitiveconverter.md#reflect)

### Object literals

* [MAPPINGS](primitiveconverter.md#static-mappings)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[InstanceOf](instanceof.md)*

Converts reflected type to primitive type constructor or value wrapped in pattern for validation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[InstanceOf](instanceof.md)*

Returns converted reflected type as primitive constructor wrapped in `InstanceOf` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is a primitive type constructor.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is a primitive type constructor, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *string | number | boolean | symbol*

Reflects type to primitive type constructor.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *string | number | boolean | symbol*

Returns primitive type constructor.

## Object literals

### `Static` MAPPINGS

### ▪ **MAPPINGS**: *object*

###  10

• **10**: *SymbolConstructor* = Symbol

###  2

• **2**: *StringConstructor* = String

###  3

• **3**: *NumberConstructor* = Number

###  4

• **4**: *BooleanConstructor* = Boolean
