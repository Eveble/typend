---
id: "types.library"
title: "Library"
sidebar_label: "Library"
---

## Hierarchy

* **Library**

## Implemented by

* [Typend](../classes/typend.md)

## Index

### Properties

* [converter](types.library.md#converter)
* [describer](types.library.md#describer)
* [validator](types.library.md#validator)

### Methods

* [debug](types.library.md#debug)
* [getConverter](types.library.md#getconverter)
* [getDescriber](types.library.md#getdescriber)
* [getValidator](types.library.md#getvalidator)
* [isInstanceOf](types.library.md#isinstanceof)
* [isValid](types.library.md#isvalid)
* [setConverter](types.library.md#setconverter)
* [setDescriber](types.library.md#setdescriber)
* [setValidator](types.library.md#setvalidator)
* [validate](types.library.md#validate)

## Properties

###  converter

• **converter**: *[Converter](types.converter.md)*

___

###  describer

• **describer**: *[Describer](types.describer.md)*

___

###  validator

• **validator**: *[Validator](types.validator.md)*

## Methods

###  debug

▸ **debug**(`isDebugging?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`isDebugging?` | boolean |

**Returns:** *void*

___

###  getConverter

▸ **getConverter**(): *[Converter](types.converter.md)*

**Returns:** *[Converter](types.converter.md)*

___

###  getDescriber

▸ **getDescriber**(): *[Describer](types.describer.md)*

**Returns:** *[Describer](types.describer.md)*

___

###  getValidator

▸ **getValidator**(): *[Validator](types.validator.md)*

**Returns:** *[Validator](types.validator.md)*

___

###  isInstanceOf

▸ **isInstanceOf**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) |

**Returns:** *boolean*

___

###  isValid

▸ **isValid**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation) | [Utility](types.utility.md), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) &#124; [Utility](types.utility.md) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

###  setConverter

▸ **setConverter**(`converter`: [Converter](types.converter.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`converter` | [Converter](types.converter.md) |

**Returns:** *void*

___

###  setDescriber

▸ **setDescriber**(`describer`: [Describer](types.describer.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`describer` | [Describer](types.describer.md) |

**Returns:** *void*

___

###  setValidator

▸ **setValidator**(`validator`: [Validator](types.validator.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [Validator](types.validator.md) |

**Returns:** *void*

___

###  validate

▸ **validate**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation) | [Utility](types.utility.md), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`expectation` | [Expectation](../modules/types.md#expectation) &#124; [Utility](types.utility.md) |
`isStrict?` | boolean |

**Returns:** *boolean*
