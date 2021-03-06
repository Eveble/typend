---
id: "classvalidator"
title: "ClassValidator"
sidebar_label: "ClassValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **ClassValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](classvalidator.md#static-describer)

### Methods

* [canValidate](classvalidator.md#canvalidate)
* [describe](classvalidator.md#describe)
* [validate](classvalidator.md#validate)
* [getDescriber](classvalidator.md#static-getdescriber)
* [setDescriber](classvalidator.md#static-setdescriber)

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

Returns `true` if pattern is instance of `Class` pattern, else `false`.

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

▸ **validate**(`value`: any, `pattern`: [Class](class.md), `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

*Implementation of [PatternValidator](../interfaces/types.patternvalidator.md)*

Validates value against `Class` with the given type and properties.
Properties must not contain any keys not listed in the pattern.
Properties argument must be an instance of plain `Object` with no special
prototype or instance of `Collection`.

**`throws`** {InvalidTypeError}
Thrown if the value is not an class instance.

**`throws`** {UnexpectedKeyError}
Thrown if the value has unexpected key.

**`throws`** {ValidationError}
Thrown if the value does not match expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`pattern` | [Class](class.md) | Explicit pattern as `Class` instance. |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching exactly `Class` pattern expectation.

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
