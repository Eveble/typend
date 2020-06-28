---
id: "types.typeconverter"
title: "TypeConverter"
sidebar_label: "TypeConverter"
---

## Hierarchy

* **TypeConverter**

## Implemented by

* [ArrayConverter](../classes/arrayconverter.md)
* [ClassConverter](../classes/classconverter.md)
* [FunctionConverter](../classes/functionconverter.md)
* [LiteralConverter](../classes/literalconverter.md)
* [NativeConverter](../classes/nativeconverter.md)
* [NilConverter](../classes/nilconverter.md)
* [ObjectConverter](../classes/objectconverter.md)
* [PrimitiveConverter](../classes/primitiveconverter.md)
* [PropsOfConverter](../classes/propsofconverter.md)
* [ReferenceConverter](../classes/referenceconverter.md)
* [TupleConverter](../classes/tupleconverter.md)
* [TypeOfConverter](../classes/typeofconverter.md)
* [UnionConverter](../classes/unionconverter.md)
* [UnknownConverter](../classes/unknownconverter.md)
* [UnrecognizedConverter](../classes/unrecognizedconverter.md)

## Index

### Methods

* [convert](types.typeconverter.md#convert)
* [isConvertible](types.typeconverter.md#isconvertible)
* [reflect](types.typeconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType?`: any, `converter?`: [Converter](types.converter.md)): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType?` | any |
`converter?` | [Converter](types.converter.md) |

**Returns:** *[Type](../modules/types.md#type)*

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: any, `converter?`: [Converter](types.converter.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | any |
`converter?` | [Converter](types.converter.md) |

**Returns:** *boolean*

___

###  reflect

▸ **reflect**(`reflectedType?`: any, `converter?`: [Converter](types.converter.md)): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType?` | any |
`converter?` | [Converter](types.converter.md) |

**Returns:** *[Type](../modules/types.md#type)*
