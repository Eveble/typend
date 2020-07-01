---
id: "validator"
title: "Validator"
sidebar_label: "Validator"
---

## Hierarchy

* **Validator**

## Implements

* [Validator](../interfaces/types.validator.md)
* Validator

## Index

### Constructors

* [constructor](validator.md#constructor)

### Methods

* [getAllValidators](validator.md#getallvalidators)
* [getOrder](validator.md#getorder)
* [getValidator](validator.md#getvalidator)
* [getValidatorOrThrow](validator.md#getvalidatororthrow)
* [getValidators](validator.md#getvalidators)
* [hasValidator](validator.md#hasvalidator)
* [isInstanceOf](validator.md#isinstanceof)
* [isValid](validator.md#isvalid)
* [overrideValidator](validator.md#overridevalidator)
* [registerValidator](validator.md#registervalidator)
* [removeValidator](validator.md#removevalidator)
* [setOrder](validator.md#setorder)
* [setValidators](validator.md#setvalidators)
* [validate](validator.md#validate)

## Constructors

###  constructor

\+ **new Validator**(`validators?`: Map‹string, [PatternValidator](../interfaces/types.patternvalidator.md)›): *[Validator](validator.md)*

Creates an instance of Validator.
Creates an instance of Validator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validators?` | Map‹string, [PatternValidator](../interfaces/types.patternvalidator.md)› | Optional mappings of `PatternValidator`(s) as a `Map` instance.  |

**Returns:** *[Validator](validator.md)*

## Methods

###  getAllValidators

▸ **getAllValidators**(): *Map‹string, [PatternValidator](../interfaces/types.patternvalidator.md)›*

*Implementation of [Validator](../interfaces/types.validator.md)*

Returns all registered validators.

**Returns:** *Map‹string, [PatternValidator](../interfaces/types.patternvalidator.md)›*

Instance of a `Map` of all registered validators implementing `PatternValidator`.

___

###  getOrder

▸ **getOrder**(): *string[]*

*Implementation of [Validator](../interfaces/types.validator.md)*

Returns validators order.

**Returns:** *string[]*

List with registered validator id's in sorted order.

___

###  getValidator

▸ **getValidator**(`kind`: string): *[PatternValidator](../interfaces/types.patternvalidator.md) | undefined*

*Implementation of [Validator](../interfaces/types.validator.md)*

Returns validator by mapping.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Identifier for which type, `PatternValidator` instance is mapped. |

**Returns:** *[PatternValidator](../interfaces/types.patternvalidator.md) | undefined*

Registered validator instance, else undefined.

___

###  getValidatorOrThrow

▸ **getValidatorOrThrow**(`kind`: string): *[PatternValidator](../interfaces/types.patternvalidator.md)*

*Implementation of [Validator](../interfaces/types.validator.md)*

Returns validator by mapping or throws.

**`throws`** {PatternValidatorNotFoundError}
Thrown if pattern validator for kind does not existing on validator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Identifier for which type, `PatternValidator` instance is mapped. |

**Returns:** *[PatternValidator](../interfaces/types.patternvalidator.md)*

Registered validator instance, else throws.

___

###  getValidators

▸ **getValidators**(): *[PatternValidator](../interfaces/types.patternvalidator.md)[]*

*Implementation of [Validator](../interfaces/types.validator.md)*

Returns ordered validators.

**Returns:** *[PatternValidator](../interfaces/types.patternvalidator.md)[]*

Ordered(if order is provided) list of validators.

___

###  hasValidator

▸ **hasValidator**(`kind`: string): *boolean*

*Implementation of [Validator](../interfaces/types.validator.md)*

Evaluates if validator is already registered by mapping id.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Identifier for which type, `PatternValidator` instance is mapped. |

**Returns:** *boolean*

Returns true if validator is registered, else false.

___

###  isInstanceOf

▸ **isInstanceOf**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

*Implementation of [Validator](../interfaces/types.validator.md)*

Validates if a value is instance of expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to validated. |
`expectation` | [Expectation](../modules/types.md#expectation) | Expectation as explicit `Class`, `InstanceOf`, `Interface` pattern instance against which value will be validated. |

**Returns:** *boolean*

Returns `true` if validation is successful, else `false`.

___

###  isValid

▸ **isValid**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

*Implementation of [Validator](../interfaces/types.validator.md)*

Validates if a value matches an expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to validated. |
`expectation` | [Expectation](../modules/types.md#expectation) | Explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated. |
`isStrict?` | boolean | Optional flag indicating that evaluation should be done in strict mode. |

**Returns:** *boolean*

Returns `true` if validation is successful, else `false`.

___

###  overrideValidator

▸ **overrideValidator**(`kind`: string, `validator`: [PatternValidator](../interfaces/types.patternvalidator.md)): *void*

*Implementation of [Validator](../interfaces/types.validator.md)*

Overrides already existing validator by mapping on delegator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Identifier for which type, `PatternValidator` instance is mapped. |
`validator` | [PatternValidator](../interfaces/types.patternvalidator.md) | Validator for registration.  |

**Returns:** *void*

___

###  registerValidator

▸ **registerValidator**(`kind`: string, `validator`: [PatternValidator](../interfaces/types.patternvalidator.md), `shouldOverride?`: boolean): *void*

*Implementation of [Validator](../interfaces/types.validator.md)*

Registers validator on delegator.

**`throws`** {PatternValidatorExistError}
Thrown if mapping would overridden on delegator without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Id for which mapping will be created. |
`validator` | [PatternValidator](../interfaces/types.patternvalidator.md) | Validator for registration. |
`shouldOverride?` | boolean | Optional flag indicating that mapping should be overridden if exist. |

**Returns:** *void*

___

###  removeValidator

▸ **removeValidator**(`kind`: string): *void*

*Implementation of [Validator](../interfaces/types.validator.md)*

Removes validator by mapping id.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Identifier for which type, `PatternValidator` instance is mapped.  |

**Returns:** *void*

___

###  setOrder

▸ **setOrder**(`order`: string[]): *void*

*Implementation of [Validator](../interfaces/types.validator.md)*

Set validators order by list with sorted ids.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`order` | string[] | List with registered validator id's in sorted order.  |

**Returns:** *void*

___

###  setValidators

▸ **setValidators**(`validators`: Map‹string, [PatternValidator](../interfaces/types.patternvalidator.md)›): *void*

*Implementation of [Validator](../interfaces/types.validator.md)*

Sets map of validators.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validators` | Map‹string, [PatternValidator](../interfaces/types.patternvalidator.md)› | `Map` instance with of validators implementing `PatternValidator`.  |

**Returns:** *void*

___

###  validate

▸ **validate**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

*Implementation of [Validator](../interfaces/types.validator.md)*

Validates if a value matches an expectation or throws.

**`remarks`** 
Current implementation uses isStrict to differentiate strict validator from the loose one
(Collection vs CollectionIncluding) to evaluate if implicit expectation of pattern
should use deep strict comparison pattern `Collection` or allow arbitrary(loose) values by
using `CollectionIncluding` for objects.
However, developers can create their own pattern that could use isStrict flag on
validation level(simplest example: different implementation of EqualsValidator
that could behave more like == in js).

**`throws`** {ValidationError}
Thrown if the value does not match provided pattern.

**`throws`** {UnknownError}
Thrown if the value can't be validated by any of registered validators.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to validated. |
`expectation` | [Expectation](../modules/types.md#expectation) | Explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated. |
`isStrict?` | boolean | Flag indicating that evaluation should be done in strict mode. |

**Returns:** *boolean*

Returns `true` if validation is successful, else throws.
