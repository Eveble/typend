---
id: "debugdescriber"
title: "DebugDescriber"
sidebar_label: "DebugDescriber"
---

## Hierarchy

* **DebugDescriber**

## Implements

* [TypeDescriber](../interfaces/types.typedescriber.md)
* TypeDescriber

## Index

### Constructors

* [constructor](debugdescriber.md#constructor)

### Methods

* [describe](debugdescriber.md#describe)

## Constructors

###  constructor

\+ **new DebugDescriber**(`options?`: object): *[DebugDescriber](debugdescriber.md)*

Creates an instance of DebugDescriber.
Creates an instance of DebugDescriber.

**Parameters:**

▪`Optional`  **options**: *object*

Options object that can be passed to Node's inspect util.

Name | Type |
------ | ------ |
`colors` | boolean |
`compact` | boolean |

**Returns:** *[DebugDescriber](debugdescriber.md)*

## Methods

###  describe

▸ **describe**(`arg`: any): *[Stringifiable](../interfaces/types.stringifiable.md)*

Describes argument to human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | Argument to describe. |

**Returns:** *[Stringifiable](../interfaces/types.stringifiable.md)*

Description instance.
