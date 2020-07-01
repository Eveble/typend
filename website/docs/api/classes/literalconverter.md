---
id: "literalconverter"
title: "LiteralConverter"
sidebar_label: "LiteralConverter"
---

## Hierarchy

* **LiteralConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](literalconverter.md#convert)
* [isConvertible](literalconverter.md#isconvertible)
* [reflect](literalconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Equals](equals.md)*

Converts reflected valued literal type for validation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[Equals](equals.md)*

Returns converted reflected value literal type wrapped with `Equals` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is valued literal(has value).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is valued literal, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *string | number | boolean*

Reflects valued literal type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *string | number | boolean*

Returns reflected valued literal type as literal `string`|`number`|`true`|`false`.
