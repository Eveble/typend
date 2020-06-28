---
id: "anyvalidator"
title: "AnyValidator"
sidebar_label: "AnyValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

  ↳ **AnyValidator**

  ↳ [InternalValidator](internalvalidator.md)

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)

## Index

### Properties

* [describer](anyvalidator.md#static-describer)

### Methods

* [canValidate](anyvalidator.md#canvalidate)
* [describe](anyvalidator.md#describe)
* [validate](anyvalidator.md#validate)
* [getDescriber](anyvalidator.md#static-getdescriber)
* [setDescriber](anyvalidator.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[describer](patternvalidator.md#static-describer)*

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

Evaluates if validator can handle provided expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` or implicit expectation. |

**Returns:** *boolean*

Returns true if pattern is instance of `Any`, else false.

___

###  describe

▸ **describe**(`value`: any): *string*

*Inherited from [PatternValidator](patternvalidator.md).[describe](patternvalidator.md#describe)*

Describes value in human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to be described. |

**Returns:** *string*

Human readable value described as a string.

___

###  validate

▸ **validate**(): *boolean*

Any value will be matching expectation.

**Returns:** *boolean*

Returns always `true` for any value.

___

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[getDescriber](patternvalidator.md#static-getdescriber)*

Returns describing library.

**Returns:** *[Describer](../interfaces/types.describer.md)*

Describer library instance.

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Inherited from [PatternValidator](patternvalidator.md).[setDescriber](patternvalidator.md#static-setdescriber)*

Sets describing library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) | Describer library instance.  |

**Returns:** *void*
