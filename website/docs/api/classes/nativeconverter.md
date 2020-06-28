---
id: "nativeconverter"
title: "NativeConverter"
sidebar_label: "NativeConverter"
---

## Hierarchy

* **NativeConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)

## Index

### Methods

* [convert](nativeconverter.md#convert)
* [isConvertible](nativeconverter.md#isconvertible)
* [reflect](nativeconverter.md#reflect)

### Object literals

* [MAPPINGS](nativeconverter.md#static-mappings)

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Any](any.md) | [Void](void.md) | [Never](never.md)*

Converts type to native type for validation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[Any](any.md) | [Void](void.md) | [Never](never.md)*

Returns converted reflected type as instance of pattern `Any` for `any` | `Void` for `void` | `Never` for `never`.

___

###  isConvertible

▸ **isConvertible**(`reflectedType`: tsruntimeTypes.ReflectedType): *boolean*

Evaluates if provided reflected type is a native type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *boolean*

Returns `true` if reflected type is a native type, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Any](any.md) | [Void](void.md) | [Never](never.md)*

Reflects type to Pattern based equivalent of native type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type. |

**Returns:** *[Any](any.md) | [Void](void.md) | [Never](never.md)*

Returns reflected type as instance of pattern `Any` for `any` | `Void` for `void` | `Never` for `never`.

## Object literals

### `Static` MAPPINGS

### ▪ **MAPPINGS**: *object*

###  1

• **1**: *[Any](any.md)‹›* = new Any()

###  11

• **11**: *[Void](void.md)‹›* = new Void()

###  14

• **14**: *[Never](never.md)‹›* = new Never()
