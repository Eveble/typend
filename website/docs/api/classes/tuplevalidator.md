---
id: "tuplevalidator"
title: "TupleValidator"
sidebar_label: "TupleValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **TupleValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](tuplevalidator.md#static-describer)

### Methods

* [canValidate](tuplevalidator.md#canvalidate)
* [describe](tuplevalidator.md#describe)
* [validate](tuplevalidator.md#validate)
* [getDescriber](tuplevalidator.md#static-getdescriber)
* [setDescriber](tuplevalidator.md#static-setdescriber)

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

Returns `true` if pattern is instance of `Tuple` or expectation matches array with value or its `Array` constructor, else `false`.

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

▸ **validate**(`value`: any, `tupleOrExpect`: [Tuple](tuple.md) | [], `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

Validates if value matches pattern expectation.

**`throws`** {InvalidTypeError}
Thrown if the value is not an array.

**`throws`** {NotAMemberError}
Thrown if the value does not match provided pattern expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`tupleOrExpect` | [Tuple](tuple.md) &#124; [] | Explicit pattern as `Tuple` instance or implicit expectation against which value is validated. |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching tuple expectation, else throws.

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
