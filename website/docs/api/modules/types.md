---
id: "types"
title: "typend"
sidebar_label: "README"
---

## Index

### Interfaces

* [Converter](../interfaces/types.converter.md)
* [Describer](../interfaces/types.describer.md)
* [Library](../interfaces/types.library.md)
* [Pattern](../interfaces/types.pattern.md)
* [PatternType](../interfaces/types.patterntype.md)
* [PatternValidator](../interfaces/types.patternvalidator.md)
* [PatternValidatorType](../interfaces/types.patternvalidatortype.md)
* [Stringifiable](../interfaces/types.stringifiable.md)
* [Transformer](../interfaces/types.transformer.md)
* [TypeConverter](../interfaces/types.typeconverter.md)
* [TypeDescriber](../interfaces/types.typedescriber.md)
* [TypeTransformer](../interfaces/types.typetransformer.md)
* [Utility](../interfaces/types.utility.md)
* [UtilityType](../interfaces/types.utilitytype.md)
* [Validator](../interfaces/types.validator.md)

### Type aliases

* [Class](types.md#class)
* [ClassDecorator](types.md#classdecorator)
* [DescriberFormatting](types.md#describerformatting)
* [Expectation](types.md#expectation)
* [InternalCollection](types.md#internalcollection)
* [Native](types.md#native)
* [Primitive](types.md#primitive)
* [PropertyDescriptor](types.md#propertydescriptor)
* [Prototype](types.md#prototype)
* [Type](types.md#type)

## Type aliases

###  Class

Ƭ **Class**: *object*

#### Type declaration:

___

###  ClassDecorator

Ƭ **ClassDecorator**: *function*

#### Type declaration:

▸ ‹**TFunction**›(`target`: TFunction): *TFunction | void*

**Type parameters:**

▪ **TFunction**: *Function*

**Parameters:**

Name | Type |
------ | ------ |
`target` | TFunction |

___

###  DescriberFormatting

Ƭ **DescriberFormatting**: *"compact" | "debug" | "default"*

___

###  Expectation

Ƭ **Expectation**: *[Pattern](../interfaces/types.pattern.md) | any*

___

###  InternalCollection

Ƭ **InternalCollection**: *Record‹keyof any, boolean›*

___

###  Native

Ƭ **Native**: *any | string | number | boolean | symbol | void | undefined | null | never | unknown*

___

###  Primitive

Ƭ **Primitive**: *null | undefined | string | number | boolean | symbol | bigint*

___

###  PropertyDescriptor

Ƭ **PropertyDescriptor**: *object*

#### Type declaration:

* **configurable**: *boolean*

* **enumerable**: *boolean*

* **value**: *any*

* **writable**: *boolean*

___

###  Prototype

Ƭ **Prototype**: *Record‹keyof any, any›*

___

###  Type

Ƭ **Type**: *any*
