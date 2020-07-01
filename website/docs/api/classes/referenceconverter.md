---
id: "referenceconverter"
title: "ReferenceConverter"
sidebar_label: "ReferenceConverter"
---

## Hierarchy

* **ReferenceConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](referenceconverter.md#convert)
* [isConvertible](referenceconverter.md#isconvertible)
* [reflect](referenceconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: ReferenceType, `converter`: [Converter](../interfaces/types.converter.md)): *any*

Converts reflected type reference.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | ReferenceType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *any*

Returns converted reflected type reference as the referenced value, constructor function wrapped in `InstanceOf` pattern, array wrapped in `List` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is referenced(examples: reference to Class, constructor Function(RegExp))

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if type is referenced, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: ReferenceType, `converter`: [Converter](../interfaces/types.converter.md)): *any*

Reflects reference type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | ReferenceType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *any*

Returns reflected reference type as any referenced value.
