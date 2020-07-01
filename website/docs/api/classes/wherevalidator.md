---
id: "wherevalidator"
title: "WhereValidator"
sidebar_label: "WhereValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **WhereValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](wherevalidator.md#static-describer)

### Methods

* [canValidate](wherevalidator.md#canvalidate)
* [describe](wherevalidator.md#describe)
* [validate](wherevalidator.md#validate)
* [getDescriber](wherevalidator.md#static-getdescriber)
* [setDescriber](wherevalidator.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[describer](patternvalidator.md#static-describer)*

*Overrides void*

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

Evaluates if validator can handle provided explicit pattern or implicit expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` instance or implicit expectation. |

**Returns:** *boolean*

Returns `true` if pattern: is instance of `Where` or is a function that is not class constructor; else `false`.

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

▸ **validate**(`value`: any, `whereOrExpect`: [Expectation](../modules/types.md#expectation)): *boolean*

Validates if value matches pattern expectation.

**`throws`** {ValidationError|Error}
Thrown if the value does not match expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`whereOrExpect` | [Expectation](../modules/types.md#expectation) | -Explicit pattern as `Where` instance or implicit expectation against which value is validated. |

**Returns:** *boolean*

Returns `true` if expectation function returns z for value, else throws.

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
