---
id: "interfacevalidator"
title: "InterfaceValidator"
sidebar_label: "InterfaceValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

  ↳ **InterfaceValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)

## Index

### Properties

* [describer](interfacevalidator.md#static-describer)

### Methods

* [canValidate](interfacevalidator.md#canvalidate)
* [describe](interfacevalidator.md#describe)
* [validate](interfacevalidator.md#validate)
* [getDescriber](interfacevalidator.md#static-getdescriber)
* [setDescriber](interfacevalidator.md#static-setdescriber)

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
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` instance or implicit expectation. |

**Returns:** *boolean*

Returns `true` if pattern is instance of `Interface` pattern, else `false`.

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

▸ **validate**(`value`: any, `pattern`: [Interface](interface.md), `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

Validates value against `Interface` pattern requiring it to match expected
properties and available methods(compared only by name - and not by with method parameters).
The value may also contain other keys with arbitrary values not defined in
pattern(equivalent of Meteor's `Match.ObjectIncluding`).

**`throws`** {InvalidTypeError}
Thrown if the value is not an class instance.

**`throws`** {ValidationError}
Thrown if the value does not match expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`pattern` | [Interface](interface.md) | - |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching exactly `Interface` pattern expectation, else throws.

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
