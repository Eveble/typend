---
id: "collectionincludingvalidator"
title: "CollectionIncludingValidator"
sidebar_label: "CollectionIncludingValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **CollectionIncludingValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](collectionincludingvalidator.md#static-describer)

### Methods

* [canValidate](collectionincludingvalidator.md#canvalidate)
* [describe](collectionincludingvalidator.md#describe)
* [validate](collectionincludingvalidator.md#validate)
* [getDescriber](collectionincludingvalidator.md#static-getdescriber)
* [setDescriber](collectionincludingvalidator.md#static-setdescriber)

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

Returns `true` if pattern is instance of `CollectionIncluding` or is plain `Object` validated in loose mode, else `false`.

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

▸ **validate**(`value`: any, `collIncOrExpect`: [CollectionIncluding](collectionincluding.md) | Record‹keyof any, any›, `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

Validates if value matches an `Object` with expected keys and values matching
the given expectations.
The value may also contain other keys with arbitrary values not defined in
pattern(equivalent of Meteor's `Match.ObjectIncluding`).

**`throws`** {InvalidTypeError}
Thrown if the value is not an object.

**`throws`** {ValidationError}
Thrown if the value does not match properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`collIncOrExpect` | [CollectionIncluding](collectionincluding.md) &#124; Record‹keyof any, any› | Explicit pattern as `CollectionIncluding` instance or implicit expectation as plain `Object` against which value is validated. |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching explicit `CollectionIncluding` pattern or implicit expectation as plain object even with arbitrary keys, else throws.

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
