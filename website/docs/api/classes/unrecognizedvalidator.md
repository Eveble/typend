---
id: "unrecognizedvalidator"
title: "UnrecognizedValidator"
sidebar_label: "UnrecognizedValidator"
---

## Hierarchy

* [PatternValidator](patternvalidator.md)

  ↳ **UnrecognizedValidator**

## Implements

* [PatternValidator](../interfaces/types.patternvalidator.md)

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

\+ **new UnrecognizedValidator**(`isValid`: boolean): *[UnrecognizedValidator](unrecognizedvalidator.md)*

Creates an instance of UnrecognizedValidator.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`isValid` | boolean | false | Default behavior for unrecognized arguments.  |

**Returns:** *[UnrecognizedValidator](unrecognizedvalidator.md)*

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

Returns `true` if pattern is instance of `Unrecognized`, else `false`.

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
