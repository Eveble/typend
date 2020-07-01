---
id: "description"
title: "Description"
sidebar_label: "Description"
---

## Hierarchy

* **Description**

## Implements

* [Stringifiable](../interfaces/types.stringifiable.md)
* Stringifiable

## Index

### Constructors

* [constructor](description.md#constructor)

### Properties

* [message](description.md#message)
* [type](description.md#optional-type)
* [value](description.md#optional-value)

### Methods

* [toString](description.md#tostring)

## Constructors

###  constructor

\+ **new Description**(`props`: object): *[Description](description.md)*

Creates an instance of Description.
Creates an instance of Description.

**Parameters:**

▪ **props**: *object*

Available descriptions for value as properties object.

Name | Type |
------ | ------ |
`message` | string |
`type?` | string |
`value?` | string |

**Returns:** *[Description](description.md)*

## Properties

###  message

• **message**: *string*

___

### `Optional` type

• **type**? : *string*

___

### `Optional` value

• **value**? : *string*

## Methods

###  toString

▸ **toString**(): *string*

*Implementation of [Stringifiable](../interfaces/types.stringifiable.md)*

Converts description in to string.

**Returns:** *string*

Returns message as a string.
