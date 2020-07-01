---
id: "injectingpropstransformer"
title: "InjectingPropsTransformer"
sidebar_label: "InjectingPropsTransformer"
---

## Hierarchy

* **InjectingPropsTransformer**

## Implements

* [TypeTransformer](../interfaces/types.typetransformer.md)
* TypeTransformer

## Index

### Methods

* [canTransform](injectingpropstransformer.md#cantransform)
* [transform](injectingpropstransformer.md#transform)

## Methods

###  canTransform

▸ **canTransform**(`type`: [Type](../modules/types.md#type)): *boolean*

Evaluates whether transformation can be done on type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | [Type](../modules/types.md#type) | Evaluated type to be transformed. |

**Returns:** *boolean*

Returns `true` if type is instance of `Class` pattern that contains a type that has injectable properties metadata assigned, else `false`.

___

###  transform

▸ **transform**(`classType`: [Class](class.md)): *[Class](class.md)*

Transforms class type by injecting additional properties in to type's existing properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`classType` | [Class](class.md) | `Class` pattern instance as a type to be transformed. |

**Returns:** *[Class](class.md)*

Instance of `Class` pattern as a type with injected properties.
