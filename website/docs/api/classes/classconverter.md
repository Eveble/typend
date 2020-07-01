---
id: "classconverter"
title: "ClassConverter"
sidebar_label: "ClassConverter"
---

## Hierarchy

* **ClassConverter**

## Implements

* [TypeConverter](../interfaces/types.typeconverter.md)
* TypeConverter

## Index

### Constructors

* [constructor](classconverter.md#constructor)

### Properties

* [transformers](classconverter.md#transformers)

### Methods

* [convert](classconverter.md#convert)
* [isConvertible](classconverter.md#isconvertible)
* [reflect](classconverter.md#reflect)

## Constructors

###  constructor

\+ **new ClassConverter**(`transformers?`: Map‹string, [TypeTransformer](../interfaces/types.typetransformer.md)›): *[ClassConverter](classconverter.md)*

Creates an instance of ClassConverter.
Creates an instance of ClassConverter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`transformers?` | Map‹string, [TypeTransformer](../interfaces/types.typetransformer.md)› | Optional transformer mappings implementing `TypeTransformer` interface.  |

**Returns:** *[ClassConverter](classconverter.md)*

## Properties

###  transformers

• **transformers**: *Map‹string, TypeTransformer›*

## Methods

###  convert

▸ **convert**(`reflectedType`: ObjectType‹› | TupleType‹› | ClassType‹› | ReferenceType‹› | UnionType‹› | StringLiteralType‹› | FunctionType‹› | NumberLiteralType‹› | BaseType‹String, string› | BaseType‹Number, number› | BaseType‹Boolean, boolean› | BaseType‹Null, null› | BaseType‹Undefined, undefined› | BaseType‹ESSymbol, Symbol› | BaseType‹Void, void› | BaseType‹Never, never› | BaseType‹Any, any› | BaseType‹FalseLiteral, false› | BaseType‹TrueLiteral, true› | BaseType‹Unknown, unknown› | BaseType‹Unknown2, unknown› | [Class](../modules/types.md#class), `converter`: [Converter](../interfaces/types.converter.md)): *[Class](class.md)*

Converts class.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | ObjectType‹› &#124; TupleType‹› &#124; ClassType‹› &#124; ReferenceType‹› &#124; UnionType‹› &#124; StringLiteralType‹› &#124; FunctionType‹› &#124; NumberLiteralType‹› &#124; BaseType‹String, string› &#124; BaseType‹Number, number› &#124; BaseType‹Boolean, boolean› &#124; BaseType‹Null, null› &#124; BaseType‹Undefined, undefined› &#124; BaseType‹ESSymbol, Symbol› &#124; BaseType‹Void, void› &#124; BaseType‹Never, never› &#124; BaseType‹Any, any› &#124; BaseType‹FalseLiteral, false› &#124; BaseType‹TrueLiteral, true› &#124; BaseType‹Unknown, unknown› &#124; BaseType‹Unknown2, unknown› &#124; [Class](../modules/types.md#class) | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *[Class](class.md)*

Returns converted class properties as instance of `Class` pattern.

___

###  isConvertible

▸ **isConvertible**(`reflectedTypeOrClass`: tsrTypes.ReflectedType | any): *boolean*

Evaluates if provided reflected type or argument is a class.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedTypeOrClass` | tsrTypes.ReflectedType &#124; any | Reflected type or argument as a class. |

**Returns:** *boolean*

Returns `true` if reflected type or argument is class type, else `false`.

___

###  reflect

▸ **reflect**(`reflectedType`: ObjectType‹› | TupleType‹› | ClassType‹› | ReferenceType‹› | UnionType‹› | StringLiteralType‹› | FunctionType‹› | NumberLiteralType‹› | BaseType‹String, string› | BaseType‹Number, number› | BaseType‹Boolean, boolean› | BaseType‹Null, null› | BaseType‹Undefined, undefined› | BaseType‹ESSymbol, Symbol› | BaseType‹Void, void› | BaseType‹Never, never› | BaseType‹Any, any› | BaseType‹FalseLiteral, false› | BaseType‹TrueLiteral, true› | BaseType‹Unknown, unknown› | BaseType‹Unknown2, unknown› | [Class](../modules/types.md#class), `converter`: [Converter](../interfaces/types.converter.md)): *Record‹keyof any, any›*

Reflect class properties and their matching expectations.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`reflectedType` | ObjectType‹› &#124; TupleType‹› &#124; ClassType‹› &#124; ReferenceType‹› &#124; UnionType‹› &#124; StringLiteralType‹› &#124; FunctionType‹› &#124; NumberLiteralType‹› &#124; BaseType‹String, string› &#124; BaseType‹Number, number› &#124; BaseType‹Boolean, boolean› &#124; BaseType‹Null, null› &#124; BaseType‹Undefined, undefined› &#124; BaseType‹ESSymbol, Symbol› &#124; BaseType‹Void, void› &#124; BaseType‹Never, never› &#124; BaseType‹Any, any› &#124; BaseType‹FalseLiteral, false› &#124; BaseType‹TrueLiteral, true› &#124; BaseType‹Unknown, unknown› &#124; BaseType‹Unknown2, unknown› &#124; [Class](../modules/types.md#class) | Reflected type. |
`converter` | [Converter](../interfaces/types.converter.md) | Converter instance. |

**Returns:** *Record‹keyof any, any›*

Returns reflected class properties as an `Object`.
