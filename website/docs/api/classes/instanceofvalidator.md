---
id: "instanceofvalidator"
title: "InstanceOfValidator"
sidebar_label: "InstanceOfValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **InstanceOfValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Properties

* [describer](instanceofvalidator.md#static-describer)

### Methods

* [canValidate](instanceofvalidator.md#canvalidate)
* [describe](instanceofvalidator.md#describe)
* [validate](instanceofvalidator.md#validate)
* [getDescriber](instanceofvalidator.md#static-getdescriber)
* [setDescriber](instanceofvalidator.md#static-setdescriber)

### Object literals

* [MAPPINGS](instanceofvalidator.md#static-mappings)

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

Returns `true` if pattern is instance of `InstanceOf` or is a native type class, nil, class constructor, error constructor, else `false`.

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

▸ **validate**(`value`: any, `instanceOfOrExpect`: [Expectation](../modules/types.md#expectation)): *boolean*

Validates if value is instance of an expectation type.

**`throws`** {InvalidTypeError}
Thrown if the value is an array(use ArrayPattern for array values).

**`throws`** {UnmatchedTypeError}
Thrown if the value is not same type as expectation require.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`instanceOfOrExpect` | [Expectation](../modules/types.md#expectation) | Explicit pattern as `InstanceOf` instance or a native type class, nil, class constructor, error constructor against which value is validated. |

**Returns:** *boolean*

Returns `true` if value has same type as expectation, else throws.

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

## Object literals

### `Static` MAPPINGS

### ▪ **MAPPINGS**: *object*

###  symbol

• **symbol**: *SymbolConstructor* = Symbol
