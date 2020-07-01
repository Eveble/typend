---
id: "compactdescriber"
title: "CompactDescriber"
sidebar_label: "CompactDescriber"
---

## Hierarchy

* **CompactDescriber**

## Implements

* [TypeDescriber](../interfaces/types.typedescriber.md)
* TypeDescriber

## Index

### Constructors

* [constructor](compactdescriber.md#constructor)

### Methods

* [describe](compactdescriber.md#describe)

## Constructors

###  constructor

\+ **new CompactDescriber**(`options?`: object): *[CompactDescriber](compactdescriber.md)*

Creates an instance of CompactDescriber.
Creates an instance of CompactDescriber.

**Parameters:**

▪`Optional`  **options**: *object*

Options object that can be passed to Node's inspect util.

Name | Type |
------ | ------ |
`colors` | boolean |
`compact` | boolean |

**Returns:** *[CompactDescriber](compactdescriber.md)*

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
