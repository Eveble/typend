---
id: "tupleconverter"
title: "TupleConverter"
sidebar_label: "TupleConverter"
---

## Hierarchy

* **TupleConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](tupleconverter.md#convert)
* [isConvertible](tupleconverter.md#isconvertible)
* [reflect](tupleconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *[Tuple](tuple.md)*

Converts tuple.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *[Tuple](tuple.md)*

Returns converted tuple as an instance of `Tuple` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is a tuple.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is tuple, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *any[]*

Reflects tuple.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *any[]*

Returns reflected tuple as an `Array`.
