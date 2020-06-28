---
id: "collectionwithinvalidator"
title: "CollectionWithinValidator"
sidebar_label: "CollectionWithinValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

  ↳ **CollectionWithinValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)

## Index

### Properties

* [describer](collectionwithinvalidator.md#static-describer)

### Methods

* [canValidate](collectionwithinvalidator.md#canvalidate)
* [describe](collectionwithinvalidator.md#describe)
* [validate](collectionwithinvalidator.md#validate)
* [getDescriber](collectionwithinvalidator.md#static-getdescriber)
* [setDescriber](collectionwithinvalidator.md#static-setdescriber)

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [PatternValidator](patternvalidator.md).[describer](patternvalidator.md#static-describer)*

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

Evaluates if validator can handle provided explicit pattern or implicit expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) | Evaluated explicit `Pattern` instance or implicit expectation. |

**Returns:** *boolean*

Returns true if pattern is instance of `CollectionWithin`, else `false`.

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

▸ **validate**(`value`: any, `collectionWithin`: [CollectionWithin](collectionwithin.md), `validator`: [Validator](../interfaces/types.validator.md)): *boolean*

Validates if value matches an `Object` with expected keys and values matching
the given expectations.
The value may also contain other keys with arbitrary values not defined in
pattern(equivalent of Meteor's `Match.ObjectIncluding`).
It also can omit nested `Object` properties(useful for building up
configuration a like objects).

**`throws`** {InvalidTypeError}
Thrown if the value is not an object.

**`throws`** {ValidationError}
Thrown if the value does not match properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`collectionWithin` | [CollectionWithin](collectionwithin.md) | Explicit pattern as `CollectionWithin` instance. |
`validator` | [Validator](../interfaces/types.validator.md) | Validator matching `Validator` interface. |

**Returns:** *boolean*

Returns `true` if value is matching explicit `CollectionWithin` pattern even on nested missing object properties, else throws.

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
