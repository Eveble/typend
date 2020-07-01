---
id: "unrecognizedvalidator"
title: "UnrecognizedValidator"
sidebar_label: "UnrecognizedValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

* PatternValidator

  ↳ **UnrecognizedValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)
* PatternValidator

## Index

### Constructors

* [constructor](unrecognizedvalidator.md#constructor)

### Properties

* [describer](unrecognizedvalidator.md#static-describer)

### Methods

* [canValidate](unrecognizedvalidator.md#canvalidate)
* [describe](unrecognizedvalidator.md#describe)
* [getDefaultBehavior](unrecognizedvalidator.md#getdefaultbehavior)
* [validate](unrecognizedvalidator.md#validate)
* [getDescriber](unrecognizedvalidator.md#static-getdescriber)
* [setDescriber](unrecognizedvalidator.md#static-setdescriber)

## Constructors

###  constructor

\+ **new UnrecognizedValidator**(`isValid?`: boolean): *[UnrecognizedValidator](unrecognizedvalidator.md)*

Creates an instance of UnrecognizedValidator.
Creates an instance of UnrecognizedValidator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`isValid?` | boolean | Default behavior for unrecognized arguments.  |

**Returns:** *[UnrecognizedValidator](unrecognizedvalidator.md)*

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

Returns `true` if pattern is instance of `Unrecognized`, else `false`.

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

###  getDefaultBehavior

▸ **getDefaultBehavior**(): *boolean*

Returns default behavior(result) that is returned upon validating unrecognized value.

**Returns:** *boolean*

Returns `true` if default behavior is set to that behavior, else `false`.

___

###  validate

▸ **validate**(`value`: any, `unrecognized`: [Unrecognized](unrecognized.md)): *boolean*

Validates if value matches pattern expectation(undefined).

**`throws`** {UnknownError}
Thrown as default behavior of unrecognized arguments.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that is validated against expectation. |
`unrecognized` | [Unrecognized](unrecognized.md) | Explicit pattern as `Unrecognized` instance. |

**Returns:** *boolean*

Returns the default behavior for validation of unrecognized arguments.

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
