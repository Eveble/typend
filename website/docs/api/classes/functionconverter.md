---
id: "functionconverter"
title: "FunctionConverter"
sidebar_label: "FunctionConverter"
---

## Hierarchy

* **FunctionConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Methods

* [convert](functionconverter.md#convert)
* [isConvertible](functionconverter.md#isconvertible)
* [reflect](functionconverter.md#reflect)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[InstanceOf](instanceof.md)*

Converts to function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[InstanceOf](instanceof.md)*

Returns `Function` constructor wrapped in `InstanceOf` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is a function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is a function, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *Function*

Reflects function.

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType |

**Returns:** *Function*

Returns `Function` constructor.
