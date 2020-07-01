---
id: "typend"
title: "Typend"
sidebar_label: "Typend"
---

## Hierarchy

* **Typend**

## Implements

* [Library](../interfaces/types.library.md)
* Library

## Index

### Constructors

* [constructor](typend.md#constructor)

### Properties

* [converter](typend.md#converter)
* [describer](typend.md#describer)
* [validator](typend.md#validator)

### Methods

* [debug](typend.md#debug)
* [getConverter](typend.md#getconverter)
* [getDescriber](typend.md#getdescriber)
* [getValidator](typend.md#getvalidator)
* [isInstanceOf](typend.md#isinstanceof)
* [isValid](typend.md#isvalid)
* [setConverter](typend.md#setconverter)
* [setDescriber](typend.md#setdescriber)
* [setValidator](typend.md#setvalidator)
* [validate](typend.md#validate)

## Constructors

###  constructor

\+ **new Typend**(`converter`: [Converter](../interfaces/types.converter.md), `describer`: [Describer](../interfaces/types.describer.md), `validator`: [Validator](../interfaces/types.validator.md)): *[Typend](typend.md)*

Creates an instance of Typend.
Creates an instance of Typend.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`converter` | [Converter](../interfaces/types.converter.md) | Conversion library matching `Converter` interface. |
`describer` | [Describer](../interfaces/types.describer.md) | Description library matching `Describer` interface. |
`validator` | [Validator](../interfaces/types.validator.md) | Validation library matching `Validator` interface.  |

**Returns:** *[Typend](typend.md)*

## Properties

###  converter

• **converter**: *Converter*

*Implementation of [Library](../interfaces/types.library.md).[converter](../interfaces/types.library.md#converter)*

___

###  describer

• **describer**: *Describer*

*Implementation of [Library](../interfaces/types.library.md).[describer](../interfaces/types.library.md#describer)*

___

###  validator

• **validator**: *Validator*

*Implementation of [Library](../interfaces/types.library.md).[validator](../interfaces/types.library.md#validator)*

## Methods

###  debug

▸ **debug**(`isDebugging?`: boolean): *void*

*Implementation of [Library](../interfaces/types.library.md)*

Setup debugging mode on Typend.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`isDebugging?` | boolean | `Boolean` flags indicating that debugging should be enabled.  |

**Returns:** *void*

___

###  getConverter

▸ **getConverter**(): *[Converter](../interfaces/types.converter.md)*

*Implementation of [Library](../interfaces/types.library.md)*

Returns converting library.

**Returns:** *[Converter](../interfaces/types.converter.md)*

Converter library instance.

___

###  getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

*Implementation of [Library](../interfaces/types.library.md)*

Returns describing library.

**Returns:** *[Describer](../interfaces/types.describer.md)*

Describer library instance.

___

###  getValidator

▸ **getValidator**(): *[Validator](../interfaces/types.validator.md)*

*Implementation of [Library](../interfaces/types.library.md)*

Returns validator library.

**Returns:** *[Validator](../interfaces/types.validator.md)*

Validator library instance.

___

###  isInstanceOf

▸ **isInstanceOf**(`value`: any, `expectation`: any): *boolean*

Validates if a value is instance of expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to validated. |
`expectation` | any | Expectation as explicit `Class`, `InstanceOf`, `Interface` pattern instance against which value will be validated. |

**Returns:** *boolean*

Returns `true` if validation is successful, else `false`.

___

###  isValid

▸ **isValid**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation) | [Utility](utility.md), `isStrict?`: boolean): *boolean*

*Implementation of [Library](../interfaces/types.library.md)*

Validates if a value matches an expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to validated. |
`expectation` | [Expectation](../modules/types.md#expectation) &#124; [Utility](utility.md) | Expectation as explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated. |
`isStrict?` | boolean | Flag indicating that evaluation should be done in strict mode. |

**Returns:** *boolean*

Returns `true` if validation is successful, else `false`.

___

###  setConverter

▸ **setConverter**(`converter`: [Converter](../interfaces/types.converter.md)): *void*

*Implementation of [Library](../interfaces/types.library.md)*

Sets converting library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`converter` | [Converter](../interfaces/types.converter.md) | Description library matching `Describer` interface.  |

**Returns:** *void*

___

###  setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Implementation of [Library](../interfaces/types.library.md)*

Sets describing library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) | Conversion library matching `Converter` interface.  |

**Returns:** *void*

___

###  setValidator

▸ **setValidator**(`validator`: [Validator](../interfaces/types.validator.md)): *void*

*Implementation of [Library](../interfaces/types.library.md)*

Sets validator library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validator` | [Validator](../interfaces/types.validator.md) | Validation library matching `Validator` interface.  |

**Returns:** *void*

___

###  validate

▸ **validate**(`value`: any, `expectation`: [Expectation](../modules/types.md#expectation) | [Utility](utility.md), `isStrict?`: boolean): *boolean*

*Implementation of [Library](../interfaces/types.library.md)*

Validates if a value matches an expectation or throws.

**`throws`** {ValidationError}
Thrown if the value does not match provided expectation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to validated. |
`expectation` | [Expectation](../modules/types.md#expectation) &#124; [Utility](utility.md) | Expectation as explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated. |
`isStrict?` | boolean | Flag indicating that evaluation should be done in strict mode. |

**Returns:** *boolean*

Returns `true` if validation is successful, else throws.
