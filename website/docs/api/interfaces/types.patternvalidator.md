---
id: "types.patternvalidator"
title: "PatternValidator"
sidebar_label: "PatternValidator"
---

## Hierarchy

* **PatternValidator**

## Implemented by

* [AnyValidator](../classes/anyvalidator.md)
* [ClassValidator](../classes/classvalidator.md)
* [CollectionIncludingValidator](../classes/collectionincludingvalidator.md)
* [CollectionValidator](../classes/collectionvalidator.md)
* [CollectionWithinValidator](../classes/collectionwithinvalidator.md)
* [EqualsValidator](../classes/equalsvalidator.md)
* [InstanceOfValidator](../classes/instanceofvalidator.md)
* [IntegerValidator](../classes/integervalidator.md)
* [InterfaceValidator](../classes/interfacevalidator.md)
* [InternalValidator](../classes/internalvalidator.md)
* [InternalValidator](../classes/internalvalidator.md)
* [ListValidator](../classes/listvalidator.md)
* [MaybeValidator](../classes/maybevalidator.md)
* [NeverValidator](../classes/nevervalidator.md)
* [OneOfValidator](../classes/oneofvalidator.md)
* [OptionalValidator](../classes/optionalvalidator.md)
* [TupleValidator](../classes/tuplevalidator.md)
* [UnknownValidator](../classes/unknownvalidator.md)
* [UnrecognizedValidator](../classes/unrecognizedvalidator.md)
* [VoidValidator](../classes/voidvalidator.md)
* [WhereValidator](../classes/wherevalidator.md)

## Index

### Methods

* [canValidate](types.patternvalidator.md#canvalidate)
* [validate](types.patternvalidator.md#validate)

## Methods

###  canValidate

▸ **canValidate**(`expectation`: [Expectation](../modules/types.md#expectation), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`expectation` | [Expectation](../modules/types.md#expectation) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

###  validate

▸ **validate**(`value?`: any, `expectation?`: [Expectation](../modules/types.md#expectation), `validator?`: [Validator](types.validator.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | any |
`expectation?` | [Expectation](../modules/types.md#expectation) |
`validator?` | [Validator](types.validator.md) |

**Returns:** *boolean*
