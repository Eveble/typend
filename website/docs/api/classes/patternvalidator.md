---
id: "patternvalidator"
title: "PatternValidator"
sidebar_label: "PatternValidator"
---

## Hierarchy

* **PatternValidator**

  ↳ [AnyValidator](anyvalidator.md)

  ↳ [ClassValidator](classvalidator.md)

  ↳ [CollectionIncludingValidator](collectionincludingvalidator.md)

  ↳ [CollectionWithinValidator](collectionwithinvalidator.md)

  ↳ [CollectionValidator](collectionvalidator.md)

  ↳ [EqualsValidator](equalsvalidator.md)

  ↳ [InstanceOfValidator](instanceofvalidator.md)

  ↳ [IntegerValidator](integervalidator.md)

  ↳ [InterfaceValidator](interfacevalidator.md)

  ↳ [ListValidator](listvalidator.md)

  ↳ [MaybeValidator](maybevalidator.md)

  ↳ [NeverValidator](nevervalidator.md)

  ↳ [OneOfValidator](oneofvalidator.md)

  ↳ [OptionalValidator](optionalvalidator.md)

  ↳ [TupleValidator](tuplevalidator.md)

  ↳ [UnknownValidator](unknownvalidator.md)

  ↳ [VoidValidator](voidvalidator.md)

  ↳ [WhereValidator](wherevalidator.md)

  ↳ [UnrecognizedValidator](unrecognizedvalidator.md)

## Index

### Properties

* [describer](patternvalidator.md#static-describer)

### Methods

* [describe](patternvalidator.md#describe)
* [getDescriber](patternvalidator.md#static-getdescriber)
* [setDescriber](patternvalidator.md#static-setdescriber)

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
