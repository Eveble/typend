---
id: "arrayconverter"
title: "ArrayConverter"
sidebar_label: "ArrayConverter"
---

## Hierarchy

* **ArrayConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](arrayconverter.md#convert)
* [isConvertible](arrayconverter.md#isconvertible)
* [reflect](arrayconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *[List](list.md)*

Converts reflected type to array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *[List](list.md)*

Returns converted reflected type as array wrapped in `List` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is an reference to array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is an reference to an array, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *any[]*

Reflects array type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *any[]*

Returns reflected type as an `Array`.
