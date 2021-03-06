---
id: "equalsvalidator"
title: "EqualsValidator"
sidebar_label: "EqualsValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **EqualsValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](equalsvalidator.md#static-describer)

### Methods

* [canValidate](equalsvalidator.md#canvalidate)
* [describe](equalsvalidator.md#describe)
* [validate](equalsvalidator.md#validate)
* [getDescriber](equalsvalidator.md#static-getdescriber)
* [setDescriber](equalsvalidator.md#static-setdescriber)

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

Returns true if pattern is: instance of Equals, definition is Error instance, is not array or plain object; else false.

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

▸ **validate**(`value`: any, `equalsOrExpect`: [Expectation](../modules/types.md#expectation)): *boolean*

Validates if value is equal to expectation.

**`throws`** {InvalidTypeError}
Thrown if the value is an array(use `List`, `Tuple`, `OneOf` patterns for array values).

**`throws`** {InvalidTypeError}
Thrown if the value is a plain object(use `Collection` pattern for object values).

**`throws`** {UnequalValueError}
Thrown if the value is not equal to the expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`equalsOrExpect` | [Expectation](../modules/types.md#expectation) | Explicit pattern as `Equals` instance or implicit expectation against which value is validated. |

**Returns:** *boolean*

Returns `true` if value is equal to expectation, else throws.

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
