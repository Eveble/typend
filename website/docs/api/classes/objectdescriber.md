---
id: "objectdescriber"
title: "ObjectDescriber"
sidebar_label: "ObjectDescriber"
---

## Hierarchy

* **ObjectDescriber**

## Implements

* [TypeDescriber](../interfaces/types.typedescriber.md)
* TypeDescriber

## Index

### Methods

* [describe](objectdescriber.md#describe)

## Methods

###  describe

▸ **describe**(`arg`: any, `describer`: [Describer](../interfaces/types.describer.md)): *[Stringifiable](../interfaces/types.stringifiable.md)*

*Implementation of [TypeDescriber](../interfaces/types.typedescriber.md)*

Describes object to human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | Argument as an object. |
`describer` | [Describer](../interfaces/types.describer.md) | Instance of describer. |

**Returns:** *[Stringifiable](../interfaces/types.stringifiable.md)*

Description instance.
