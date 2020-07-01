---
id: "collectionvalidator"
title: "CollectionValidator"
sidebar_label: "CollectionValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **CollectionValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](collectionvalidator.md#static-describer)

### Methods

* [canValidate](collectionvalidator.md#canvalidate)
* [describe](collectionvalidator.md#describe)
* [validate](collectionvalidator.md#validate)
* [getDescriber](collectionvalidator.md#static-getdescriber)
* [setDescriber](collectionvalidator.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[describer](patternvalidator.md#static-describer)*

*Overrides void*

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

*Implementation of [PatternValidator](../interfaces/types.patternvalidator.md)*

Evaluates if validator can handle provided explicit pattern or implicit expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` instance or implicit expectation. |
`isStrict?` | boolean | - |

**Returns:** *boolean*

Returns `true` if pattern is instance of `Collection` or is plain `Object` validated in strict mode, else `false`.

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

▸ **validate**(`value`: any, `collOrExpect`: [Collection](collection.md) | Record‹keyof any, any›, `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

Validates an `Object` with the given keys and with values matching the given
patterns. The value must not contain any arbitrary keys(not listed in the pattern).
The value must be a plain `Object` or class instance.

**`throws`** {InvalidTypeError}
Thrown if the value is not an object, instance of Collection or class.

**`throws`** {UnexpectedKeyError}
Thrown if the value has unexpected key.

**`throws`** {ValidationError}
Thrown if the value does not match expected properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation.. |
`collOrExpect` | [Collection](collection.md) &#124; Record‹keyof any, any› | Explicit pattern as `Collection` instance or implicit expectation as plain object against which value is validated. |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching explicit `Collection` pattern or implicit expectation as plain object, else throws.

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
