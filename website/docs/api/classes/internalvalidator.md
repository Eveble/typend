---
id: "internalvalidator"
title: "InternalValidator"
sidebar_label: "InternalValidator"
---

## Hierarchy

  ↳ [AnyValidator](anyvalidator.md)

* AnyValidator

  ↳ **InternalValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator
* PatternValidator

## Index

### Properties

* [describer](internalvalidator.md#static-describer)

### Methods

* [canValidate](internalvalidator.md#canvalidate)
* [describe](internalvalidator.md#describe)
* [validate](internalvalidator.md#validate)
* [getDescriber](internalvalidator.md#static-getdescriber)
* [setDescriber](internalvalidator.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[describer](patternvalidator.md#static-describer)*

*Overrides void*

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

*Overrides [AnyValidator](anyvalidator.md).[canValidate](anyvalidator.md#canvalidate)*

Evaluates if validator can handle provided explicit pattern or implicit expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` instance or implicit expectation. |

**Returns:** *boolean*

Returns `true` if pattern is instance of `Internal`, else `false`.

___

###  describe

▸ **describe**(`value`: any): *string*

*Inherited from [PatternValidator](patternvalidator.md).[describe](patternvalidator.md#describe)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *string*

___

###  validate

▸ **validate**(): *boolean*

*Overrides [AnyValidator](anyvalidator.md).[validate](anyvalidator.md#validate)*

Validates if value matches expectation(any internal value can be valid).

**Returns:** *boolean*

Returns always `true` for any value.

___

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[getDescriber](patternvalidator.md#static-getdescriber)*

*Overrides void*

**Returns:** *[Describer](../interfaces/types.describer.md)*

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Inherited from [PatternValidator](patternvalidator.md).[setDescriber](patternvalidator.md#static-setdescriber)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) |

**Returns:** *void*
