---
id: "oneofvalidator"
title: "OneOfValidator"
sidebar_label: "OneOfValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **OneOfValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](oneofvalidator.md#static-describer)

### Methods

* [canValidate](oneofvalidator.md#canvalidate)
* [describe](oneofvalidator.md#describe)
* [validate](oneofvalidator.md#validate)
* [getDescriber](oneofvalidator.md#static-getdescriber)
* [setDescriber](oneofvalidator.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[describer](patternvalidator.md#static-describer)*

*Overrides void*

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

Evaluates if validator can handle provided expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` instance or implicit expectation. |

**Returns:** *boolean*

Returns `true` if pattern is instance of `OneOf`, else `false`.

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

▸ **validate**(`value`: any, `oneOf`: [OneOf](oneof.md), `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

*Implementation of [PatternValidator](../interfaces/types.patternvalidator.md)*

Validates if value matches one of the provided expectations.

**`throws`** {NotAMemberError}
Thrown if the value does not match any provided expectations.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`oneOf` | [OneOf](oneof.md) | Explicit pattern as `OneOf` instance. |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching one of expectation, else throws.

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
