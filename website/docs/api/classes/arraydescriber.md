---
id: "arraydescriber"
title: "ArrayDescriber"
sidebar_label: "ArrayDescriber"
---

## Hierarchy

* **ArrayDescriber**

## Implements

* [TypeDescriber](../interfaces/types.typedescriber.md)
* TypeDescriber

## Index

### Methods

* [describe](arraydescriber.md#describe)

## Methods

###  describe

▸ **describe**(`arg`: any, `describer`: [Describer](../interfaces/types.describer.md)): *[Stringifiable](../interfaces/types.stringifiable.md)*

*Implementation of [TypeDescriber](../interfaces/types.typedescriber.md)*

Describes array to human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | Argument as an array. |
`describer` | [Describer](../interfaces/types.describer.md) | Instance of describer. |

**Returns:** *[Stringifiable](../interfaces/types.stringifiable.md)*

Description instance.
