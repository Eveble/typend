---
id: "typeofconverter"
title: "TypeOfConverter"
sidebar_label: "TypeOfConverter"
---

## Hierarchy

* **TypeOfConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](typeofconverter.md#convert)
* [isConvertible](typeofconverter.md#isconvertible)
* [reflect](typeofconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *[Class](class.md)*

Converts reflected utility type to type of class.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Instance of converter. |

**Returns:** *[Class](class.md)*

Returns converted class type as instance of `Class` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType, `converter`: [Converter](../interfaces/types.converter.md)): *boolean*

Evaluates if provided reflected type uses utility type `$TypeOf`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Instance of converter. |

**Returns:** *boolean*

Returns `true` if reflected type is a utility type `$TypeOf` and has valid class type payload, else `false`.

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
