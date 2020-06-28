---
id: "internalpropstransformer"
title: "InternalPropsTransformer"
sidebar_label: "InternalPropsTransformer"
---

## Hierarchy

* **InternalPropsTransformer**

## Implements

* [TypeTransformer](../interfaces/types.typetransformer.md)

## Index

### Methods

* [canTransform](internalpropstransformer.md#cantransform)
* [transform](internalpropstransformer.md#transform)

## Methods

###  canTransform

▸ **canTransform**(`type`: [Type](../modules/types.md#type)): *boolean*

Evaluates whether transformation can be done on type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | [Type](../modules/types.md#type) | Evaluated type to be transformed. |

**Returns:** *boolean*

Returns `true` if type is instance of `Class` pattern that contains a type that has internal properties metadata assigned, else `false`.

___

###  transform

▸ **transform**(`classType`: [Class](class.md)): *[Class](class.md)*

Transforms class type's internal properties by wrapping their values with `Internal` pattern.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`classType` | [Class](class.md) | `Class` pattern instance as a type to be transformed. |

**Returns:** *[Class](class.md)*

Instance of `Class` pattern as a type with internal
properties wrapped with `Internal` pattern.
