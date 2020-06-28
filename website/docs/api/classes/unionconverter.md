---
id: "unionconverter"
title: "UnionConverter"
sidebar_label: "UnionConverter"
---

## Hierarchy

* **UnionConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](unionconverter.md#convert)
* [isConvertible](unionconverter.md#isconvertible)
* [reflect](unionconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *[Optional](optional.md) | [OneOf](oneof.md)*

Converts union.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *[Optional](optional.md) | [OneOf](oneof.md)*

Returns converted union as an instance of `OneOf` pattern or instance of `Optional` pattern(for class properties defined with question mark symbol or matching pattern`[undefined, any]`).

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is an union.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is an union, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *any[]*

Reflects union.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *any[]*

Returns reflected union as an `Array`.
