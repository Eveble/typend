---
id: "tsruntimeconverter"
title: "TSRuntimeConverter"
sidebar_label: "TSRuntimeConverter"
---

## Hierarchy

* **TSRuntimeConverter**

## Implements

* [Converter](../interfaces/types.converter.md)
* Converter

## Index

### Constructors

* [constructor](tsruntimeconverter.md#constructor)

### Properties

* [typeConverters](tsruntimeconverter.md#typeconverters)

### Methods

* [convert](tsruntimeconverter.md#convert)
* [getConverter](tsruntimeconverter.md#getconverter)
* [hasConverter](tsruntimeconverter.md#hasconverter)
* [overrideConverter](tsruntimeconverter.md#overrideconverter)
* [reflect](tsruntimeconverter.md#reflect)
* [registerConverter](tsruntimeconverter.md#registerconverter)
* [removeConverter](tsruntimeconverter.md#removeconverter)

## Constructors

###  constructor

\+ **new TSRuntimeConverter**(`typeConverters?`: Map‹string, [TypeConverter](../interfaces/types.typeconverter.md)›): *[TSRuntimeConverter](tsruntimeconverter.md)*

Creates an instance of TSRuntimeConverter.
Creates an instance of TSRuntimeConverter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeConverters?` | Map‹string, [TypeConverter](../interfaces/types.typeconverter.md)› | Optional mappings of `TypeConverter`(s) as a `Map` instance.  |

**Returns:** *[TSRuntimeConverter](tsruntimeconverter.md)*

## Properties

###  typeConverters

• **typeConverters**: *Map‹string, TypeConverter›*

*Implementation of [Converter](../interfaces/types.converter.md).[typeConverters](../interfaces/types.converter.md#typeconverters)*

## Methods

###  convert

▸ **convert**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Type](../modules/types.md#type)*

Converts reflected by `tsruntime` Typescript's type declaration to native
type or `Pattern` instance for easy runtime-validation.
[!] Prior to conversion:
Classes  must have `@define` decorator applied.

**`link`** https://github.com/goloveychuk/tsruntime|tsruntime

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type that will be converted. |

**Returns:** *[Type](../modules/types.md#type)*

Converted type as native type or `Pattern` instance.

___

###  getConverter

▸ **getConverter**(`type`: string): *[TypeConverter](../interfaces/types.typeconverter.md) | undefined*

*Implementation of [Converter](../interfaces/types.converter.md)*

Returns type converter.

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *[TypeConverter](../interfaces/types.typeconverter.md) | undefined*

`TypeConverter` instance if found, else `undefined`.

___

###  hasConverter

▸ **hasConverter**(`type`: string): *boolean*

*Implementation of [Converter](../interfaces/types.converter.md)*

Evaluates if converter for type is already registered by mapping id.

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *boolean*

Returns `true` if type is registered, else `false`.

___

###  overrideConverter

▸ **overrideConverter**(`kind`: string, `converter`: [TypeConverter](../interfaces/types.typeconverter.md)): *void*

*Implementation of [Converter](../interfaces/types.converter.md)*

Overrides already existing type converter by kind mapping on converter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Kind for which type converter mapping is registered or overridden. |
`converter` | [TypeConverter](../interfaces/types.typeconverter.md) | `TypeConverter` instance for registration.  |

**Returns:** *void*

___

###  reflect

▸ **reflect**(`reflectedType`: tsruntimeTypes.ReflectedType): *[Type](../modules/types.md#type)*

Reflects with `tsruntime` Typescript's type declaration to native type
or `Pattern` instance(when native type representation is unavailable) for easier processing.
[!] Prior to reflection:
Classes  must have `@define` decorator applied.

**`link`** https://github.com/goloveychuk/tsruntime|tsruntime

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | tsruntimeTypes.ReflectedType | Reflected type that will be reflected. |

**Returns:** *[Type](../modules/types.md#type)*

Reflected type as native type or `Pattern` instance.

___

###  registerConverter

▸ **registerConverter**(`kind`: string, `typeConverter`: [TypeConverter](../interfaces/types.typeconverter.md), `shouldOverride?`: boolean): *void*

*Implementation of [Converter](../interfaces/types.converter.md)*

Registers type converter on converter.

**`throws`** {TypeConverterExists}
Thrown if mapping would overridden on existing type converter without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`kind` | string | Kind for which type converter mapping is registered. |
`typeConverter` | [TypeConverter](../interfaces/types.typeconverter.md) | `TypeConverter` instance for registration. |
`shouldOverride?` | boolean | Optional flag indicating that type mapping should be overridden if exist. |

**Returns:** *void*

___

###  removeConverter

▸ **removeConverter**(`type`: string): *void*

*Implementation of [Converter](../interfaces/types.converter.md)*

Removes converter by mapping type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *void*
