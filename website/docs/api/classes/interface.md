---
id: "interface"
title: "Interface"
sidebar_label: "Interface"
---

Validates value against `Interface` pattern requiring it to match
expected properties and available methods(compared only by name - and not by with
method parameters).
The value may also contain other keys with arbitrary values not defined in
pattern(equivalent of Meteor's `Match.ObjectIncluding`).

**`returns`** Returns `true` if value is matching `Interface` pattern
expectation, else throws.

**`example`** 
```ts
import { check, ValidationError } from 'typend';

interface PersonInterface {
  firstName: string;
  lastName: string;
  getFullName(): string;
}

class Person implements PersonInterface {
  firstName: string;

  lastName: string;

  age: number; // Arbitrary key not listed on PersonInterface

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(firstName: string, lastName: string, age: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}

check<PersonInterface>(new Person('Jane', 'Doe', 175));
expect(
() => check<PersonInterface>({ firstName: 'Jane', lastName: 'Don' }) // Missing getFullName method
).to.throw(ValidationError);
```

## Hierarchy

  ↳ [Pattern](pattern.md)

* Pattern

  ↳ **Interface**

## Implements

* [Pattern](../interfaces/types.pattern.md)
* Pattern

## Index

### Constructors

* [constructor](interface.md#constructor)

### Properties

* [describer](interface.md#static-describer)
* [kind](interface.md#static-kind)

### Accessors

* [isOptional](interface.md#isoptional)
* [isRequired](interface.md#isrequired)

### Methods

* [describe](interface.md#describe)
* [getInitializer](interface.md#getinitializer)
* [getKind](interface.md#getkind)
* [getName](interface.md#getname)
* [hasInitializer](interface.md#hasinitializer)
* [hasOwnProperty](interface.md#hasownproperty)
* [isPrototypeOf](interface.md#isprototypeof)
* [propertyIsEnumerable](interface.md#propertyisenumerable)
* [setInitializer](interface.md#setinitializer)
* [setName](interface.md#setname)
* [toLocaleString](interface.md#tolocalestring)
* [toString](interface.md#tostring)
* [valueOf](interface.md#valueof)
* [getDescriber](interface.md#static-getdescriber)
* [setDescriber](interface.md#static-setdescriber)

## Constructors

###  constructor

\+ **new Interface**(`properties`: Record‹keyof any, any›): *[Interface](interface.md)*

*Overrides [Pattern](pattern.md).[constructor](pattern.md#constructor)*

Creates an instance of an Interface(pattern).
Creates an instance of an Interface(pattern).

**`throws`** {InvalidTypeError}
Thrown if provided properties is not an plain object or instance of `Collection` pattern.

**`throws`** {InvalidTypeError}
Thrown if provided properties is not an plain object or instance of `Collection` pattern.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`properties` | Record‹keyof any, any› | Properties that describes interface. |

**Returns:** *[Interface](interface.md)*

## Properties

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [Pattern](pattern.md).[describer](pattern.md#static-describer)*

*Overrides void*

___

### `Static` kind

▪ **kind**: *KINDS* = KINDS.INTERFACE

*Overrides [Pattern](pattern.md).[kind](pattern.md#static-kind)*

## Accessors

###  isOptional

• **get isOptional**(): *[Optional](optional.md)*

*Inherited from [Pattern](pattern.md).[isOptional](pattern.md#isoptional)*

*Overrides void*

**Returns:** *[Optional](optional.md)*

___

###  isRequired

• **get isRequired**(): *any*

*Inherited from [Pattern](pattern.md).[isRequired](pattern.md#isrequired)*

*Overrides void*

**Returns:** *any*

## Methods

###  describe

▸ **describe**(`value`: any): *string*

*Inherited from [Pattern](pattern.md).[describe](pattern.md#describe)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *string*

___

###  getInitializer

▸ **getInitializer**(): *any | undefined*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[getInitializer](pattern.md#getinitializer)*

*Overrides void*

**Returns:** *any | undefined*

___

###  getKind

▸ **getKind**(): *string*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[getKind](pattern.md#getkind)*

*Overrides void*

**Returns:** *string*

___

###  getName

▸ **getName**(): *string*

Returns interface name from metadata.

**Returns:** *string*

Interface name as a `string`.

___

###  hasInitializer

▸ **hasInitializer**(): *boolean*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[hasInitializer](pattern.md#hasinitializer)*

*Overrides void*

**Returns:** *boolean*

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

*Implementation of [Pattern](../interfaces/types.pattern.md)*

*Inherited from [Pattern](pattern.md).[setInitializer](pattern.md#setinitializer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`initializer` | any |

**Returns:** *void*

___

###  setName

▸ **setName**(`name`: string): *void*

Sets interface name as type's metadata.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Interface name.  |

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

*Inherited from [Pattern](pattern.md).[getDescriber](pattern.md#static-getdescriber)*

*Overrides void*

**Returns:** *[Describer](../interfaces/types.describer.md)*

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Inherited from [Pattern](pattern.md).[setDescriber](pattern.md#static-setdescriber)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) |

**Returns:** *void*
