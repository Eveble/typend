---
id: "pattern"
title: "Pattern"
sidebar_label: "Pattern"
---

## Hierarchy

* [Object](pattern.md#static-object)

* [Object](pattern.md#static-object)

  ↳ **Pattern**

  ↳ [Any](any.md)

  ↳ [Collection](collection.md)

  ↳ [Class](class.md)

  ↳ [CollectionIncluding](collectionincluding.md)

  ↳ [CollectionWithin](collectionwithin.md)

  ↳ [Integer](integer.md)

  ↳ [Interface](interface.md)

  ↳ [Never](never.md)

  ↳ [Unknown](unknown.md)

  ↳ [Void](void.md)

## Index

### Properties

* [constructor](pattern.md#constructor)
* [should](pattern.md#should)
* [Object](pattern.md#static-object)
* [describer](pattern.md#static-describer)
* [kind](pattern.md#static-kind)

### Accessors

* [isOptional](pattern.md#isoptional)
* [isRequired](pattern.md#isrequired)

### Methods

* [describe](pattern.md#describe)
* [getInitializer](pattern.md#getinitializer)
* [getKind](pattern.md#getkind)
* [hasInitializer](pattern.md#hasinitializer)
* [hasOwnProperty](pattern.md#hasownproperty)
* [isPrototypeOf](pattern.md#isprototypeof)
* [propertyIsEnumerable](pattern.md#propertyisenumerable)
* [setInitializer](pattern.md#setinitializer)
* [toLocaleString](pattern.md#tolocalestring)
* [toString](pattern.md#tostring)
* [valueOf](pattern.md#valueof)
* [getDescriber](pattern.md#static-getdescriber)
* [setDescriber](pattern.md#static-setdescriber)

## Properties

###  constructor

• **constructor**: *Function*

*Inherited from [Pattern](pattern.md).[constructor](pattern.md#constructor)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

The initial value of Object.prototype.constructor is the standard built-in Object constructor.

___

###  should

• **should**: *Assertion*

*Inherited from [Pattern](pattern.md).[should](pattern.md#should)*

*Overrides [Pattern](pattern.md).[should](pattern.md#should)*

___

### `Static` Object

▪ **Object**: *ObjectConstructor*

Provides functionality common to all JavaScript objects.
Provides functionality common to all JavaScript objects.

___

### `Static` describer

▪ **describer**: *Describer*

___

### `Static` kind

▪ **kind**: *string* = ""

## Accessors

###  isOptional

• **get isOptional**(): *Optional*

Make current pattern optional.

**Returns:** *Optional*

Pattern wrapped with instance of Optional pattern.

___

###  isRequired

• **get isRequired**(): *any*

Ensures that current pattern is required.

**Returns:** *any*

Pattern that is unwrapped from Optional pattern.

## Methods

###  describe

▸ **describe**(`value`: any): *string*

Describes value in human readable form.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value that needs to be described. |

**Returns:** *string*

Human readable value described as a string.

___

###  getInitializer

▸ **getInitializer**(): *any | undefined*

Returns the initializing value.

**Returns:** *any | undefined*

Initializing value, else undefined.

___

###  getKind

▸ **getKind**(): *string*

Returns for which kind pattern is created.

**Returns:** *string*

Kind represented as a string.

___

###  hasInitializer

▸ **hasInitializer**(): *boolean*

Evaluates if initializing value was assigned to type.

**Returns:** *boolean*

Returns `true` if initializing value is set for type, else false.

___

###  hasOwnProperty

▸ **hasOwnProperty**(`v`: PropertyKey): *boolean*

*Inherited from [Pattern](pattern.md).[hasOwnProperty](pattern.md#hasownproperty)*

*Overrides [Pattern](pattern.md).[hasOwnProperty](pattern.md#hasownproperty)*

Determines whether an object has a property with the specified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | PropertyKey | A property name.  |

**Returns:** *boolean*

___

###  isPrototypeOf

▸ **isPrototypeOf**(`v`: [Object](pattern.md#static-object)): *boolean*

*Inherited from [Pattern](pattern.md).[isPrototypeOf](pattern.md#isprototypeof)*

*Overrides [Pattern](pattern.md).[isPrototypeOf](pattern.md#isprototypeof)*

Determines whether an object exists in another object's prototype chain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | [Object](pattern.md#static-object) | Another object whose prototype chain is to be checked.  |

**Returns:** *boolean*

___

###  propertyIsEnumerable

▸ **propertyIsEnumerable**(`v`: PropertyKey): *boolean*

*Inherited from [Pattern](pattern.md).[propertyIsEnumerable](pattern.md#propertyisenumerable)*

*Overrides [Pattern](pattern.md).[propertyIsEnumerable](pattern.md#propertyisenumerable)*

Determines whether a specified property is enumerable.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | PropertyKey | A property name.  |

**Returns:** *boolean*

___

###  setInitializer

▸ **setInitializer**(`initializer`: any): *void*

Sets as non-enumerable the initializing value for type if present on conversion.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initializer` | any | Initializer value provided on conversion.  |

**Returns:** *void*

___

###  toLocaleString

▸ **toLocaleString**(): *string*

*Inherited from [Pattern](pattern.md).[toLocaleString](pattern.md#tolocalestring)*

*Overrides [Pattern](pattern.md).[toLocaleString](pattern.md#tolocalestring)*

Returns a date converted to a string using the current locale.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Pattern](pattern.md).[toString](pattern.md#tostring)*

*Overrides [Pattern](pattern.md).[toString](pattern.md#tostring)*

Returns a string representation of an object.

**Returns:** *string*

___

###  valueOf

▸ **valueOf**(): *[Object](pattern.md#static-object)*

*Inherited from [Pattern](pattern.md).[valueOf](pattern.md#valueof)*

*Overrides [Pattern](pattern.md).[valueOf](pattern.md#valueof)*

Returns the primitive value of the specified object.

**Returns:** *[Object](pattern.md#static-object)*

___

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

Returns describing library.

**Returns:** *[Describer](../interfaces/types.describer.md)*

Describer library instance.

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

Sets describing library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) | Describer library instance.  |

**Returns:** *void*
