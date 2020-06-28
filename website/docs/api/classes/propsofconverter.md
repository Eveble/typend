---
id: "propsofconverter"
title: "PropsOfConverter"
sidebar_label: "PropsOfConverter"
---

## Hierarchy

* **PropsOfConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](propsofconverter.md#convert)
* [isConvertible](propsofconverter.md#isconvertible)
* [reflect](propsofconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *[Collection](collection.md)*

Converts reflected utility type to properties of class.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Instance of converter. |

**Returns:** *[Collection](collection.md)*

Returns converted class properties as instance of `Collection` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *boolean*

Evaluates if provided reflected type uses utility type `$PropsOf`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Instance of converter. |

**Returns:** *boolean*

Returns `true` if reflected type is a utility type `$PropsOf` and has valid class type payload, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *Record‹keyof any, any›*

Reflects utility type to properties of class.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Instance of converter. |

**Returns:** *Record‹keyof any, any›*

Returns reflected class properties as instance of an `Object` pattern.
