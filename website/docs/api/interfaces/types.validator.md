---
id: "types.validator"
title: "Validator"
sidebar_label: "Validator"
---

## Hierarchy

* **Validator**

## Implemented by

* [Validator](../classes/validator.md)

## Index

### Methods

* [getAllValidators](types.validator.md#getallvalidators)
* [getOrder](types.validator.md#getorder)
* [getValidator](types.validator.md#getvalidator)
* [getValidatorOrThrow](types.validator.md#getvalidatororthrow)
* [getValidators](types.validator.md#getvalidators)
* [hasValidator](types.validator.md#hasvalidator)
* [isInstanceOf](types.validator.md#isinstanceof)
* [isValid](types.validator.md#isvalid)
* [overrideValidator](types.validator.md#overridevalidator)
* [registerValidator](types.validator.md#registervalidator)
* [removeValidator](types.validator.md#removevalidator)
* [setOrder](types.validator.md#setorder)
* [setValidators](types.validator.md#setvalidators)
* [validate](types.validator.md#validate)

## Methods

###  getAllValidators

▸ **getAllValidators**(): *Map‹string, [PatternValidator](types.patternvalidator.md)›*

**Returns:** *Map‹string, [PatternValidator](types.patternvalidator.md)›*

▸ **getAllValidators**(): *Map‹string, PatternValidator›*

**Returns:** *Map‹string, PatternValidator›*

___

###  getOrder

▸ **getOrder**(): *string[]*

**Returns:** *string[]*

▸ **getOrder**(): *string[]*

**Returns:** *string[]*

___

###  getValidator

▸ **getValidator**(`kind`: string): *[PatternValidator](types.patternvalidator.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *[PatternValidator](types.patternvalidator.md) | undefined*

▸ **getValidator**(`kind`: string): *PatternValidator | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *PatternValidator | undefined*

___

###  getValidatorOrThrow

▸ **getValidatorOrThrow**(`kind`: string): *[PatternValidator](types.patternvalidator.md)*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *[PatternValidator](types.patternvalidator.md)*

▸ **getValidatorOrThrow**(`kind`: string): *PatternValidator*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *PatternValidator*

___

###  getValidators

▸ **getValidators**(): *[PatternValidator](types.patternvalidator.md)[]*

**Returns:** *[PatternValidator](types.patternvalidator.md)[]*

▸ **getValidators**(): *PatternValidator[]*

**Returns:** *PatternValidator[]*

___

###  hasValidator

▸ **hasValidator**(`kind`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *boolean*

▸ **hasValidator**(`kind`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *boolean*

___

###  isInstanceOf

▸ **isInstanceOf**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |

**Returns:** *boolean*

▸ **isInstanceOf**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |

**Returns:** *boolean*

___

###  isValid

▸ **isValid**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |
`isStrict?` | boolean |

**Returns:** *boolean*

▸ **isValid**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

###  overrideValidator

▸ **overrideValidator**(`kind`: string, `validator`: [PatternValidator](types.patternvalidator.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`validator` | [PatternValidator](types.patternvalidator.md) |

**Returns:** *void*

▸ **overrideValidator**(`kind`: string, `validator`: PatternValidator): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`validator` | PatternValidator |

**Returns:** *void*

___

###  registerValidator

▸ **registerValidator**(`kind`: string, `validator`: [PatternValidator](types.patternvalidator.md), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`validator` | [PatternValidator](types.patternvalidator.md) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerValidator**(`kind`: string, `validator`: PatternValidator, `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`validator` | PatternValidator |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeValidator

▸ **removeValidator**(`kind`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *void*

▸ **removeValidator**(`kind`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *void*

___

###  setOrder

▸ **setOrder**(`order`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`order` | string[] |

**Returns:** *void*

▸ **setOrder**(`order`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`order` | string[] |

**Returns:** *void*

___

###  setValidators

▸ **setValidators**(`validators`: Map‹string, [PatternValidator](types.patternvalidator.md)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`validators` | Map‹string, [PatternValidator](types.patternvalidator.md)› |

**Returns:** *void*

▸ **setValidators**(`validators`: Map‹string, PatternValidator›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`validators` | Map‹string, PatternValidator› |

**Returns:** *void*

___

###  validate

▸ **validate**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |
`isStrict?` | boolean |

**Returns:** *boolean*

▸ **validate**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |
`isStrict?` | boolean |

**Returns:** *boolean*
