---
id: "utility"
title: "Utility"
sidebar_label: "Utility"
---

## Hierarchy

* **Utility**

## Index

### Properties

* [describer](utility.md#static-describer)

### Methods

* [describe](utility.md#describe)
* [getDescriber](utility.md#static-getdescriber)
* [setDescriber](utility.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

## Methods

###  describe

▸ **describe**(`value`: any): *string*

Describes value in human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to be described. |

**Returns:** *string*

Human readable value described as a string.

___

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

Returns describing library.

**Returns:** *[Describer](../interfaces/types.describer.md)*

Describer library instance.

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

Sets describing library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) | Describer library instance.  |

**Returns:** *void*
