---
id: "optional"
title: "Optional"
sidebar_label: "Optional"
---

Validates if value is undefined or matches the expectation.

**`example`** 
```ts
import {
  check,
  define,
  Class,
  Optional,
  ValidationError,
  convert,
  validate,
  PropTypes,
} from 'typend';

@define()
class Sandwich {
  pickles?: boolean;
}

expect(convert<Sandwich>()).to.be.eql(
  new Class(Sandwich, {
    pickles: PropTypes.equal(Boolean).isOptional,
  })
);
check<undefined | string>('foo');
check<undefined | string>(undefined);
expect(() => check<undefined | number>('foo')).to.throw(ValidationError);

validate(undefined, PropTypes.equal(String).isOptional);
validate('foo', PropTypes.instanceOf(String).isOptional);
validate('foo', new Optional(String));
expect(() => validate('foo', PropTypes.equal(Number).isOptional)).to.throw(
  ValidationError
);
```

## Type parameters

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

## Hierarchy

* [Array](optional.md#static-array)

* [Array](optional.md#static-array)

  ↳ **Optional**

## Implements

* [Pattern](../interfaces/types.pattern.md)
* Pattern

## Indexable

* \[ **n**: *number*\]: T

Validates if value is undefined or matches the expectation.

**`example`** 
```ts
import {
  check,
  define,
  Class,
  Optional,
  ValidationError,
  convert,
  validate,
  PropTypes,
} from 'typend';

@define()
class Sandwich {
  pickles?: boolean;
}

expect(convert<Sandwich>()).to.be.eql(
  new Class(Sandwich, {
    pickles: PropTypes.equal(Boolean).isOptional,
  })
);
check<undefined | string>('foo');
check<undefined | string>(undefined);
expect(() => check<undefined | number>('foo')).to.throw(ValidationError);

validate(undefined, PropTypes.equal(String).isOptional);
validate('foo', PropTypes.instanceOf(String).isOptional);
validate('foo', new Optional(String));
expect(() => validate('foo', PropTypes.equal(Number).isOptional)).to.throw(
  ValidationError
);
```

## Index

### Constructors

* [constructor](optional.md#constructor)

### Properties

* [length](optional.md#length)
* [Array](optional.md#static-array)
* [describer](optional.md#static-describer)
* [kind](optional.md#static-kind)

### Methods

* [[Symbol.iterator]](optional.md#[symbol.iterator])
* [[Symbol.unscopables]](optional.md#[symbol.unscopables])
* [concat](optional.md#concat)
* [copyWithin](optional.md#copywithin)
* [describe](optional.md#describe)
* [entries](optional.md#entries)
* [every](optional.md#every)
* [fill](optional.md#fill)
* [filter](optional.md#filter)
* [find](optional.md#find)
* [findIndex](optional.md#findindex)
* [forEach](optional.md#foreach)
* [getInitializer](optional.md#getinitializer)
* [getKind](optional.md#getkind)
* [hasInitializer](optional.md#hasinitializer)
* [includes](optional.md#includes)
* [indexOf](optional.md#indexof)
* [join](optional.md#join)
* [keys](optional.md#keys)
* [lastIndexOf](optional.md#lastindexof)
* [map](optional.md#map)
* [pop](optional.md#pop)
* [push](optional.md#push)
* [reduce](optional.md#reduce)
* [reduceRight](optional.md#reduceright)
* [reverse](optional.md#reverse)
* [setInitializer](optional.md#setinitializer)
* [shift](optional.md#shift)
* [slice](optional.md#slice)
* [some](optional.md#some)
* [sort](optional.md#sort)
* [splice](optional.md#splice)
* [toLocaleString](optional.md#tolocalestring)
* [toString](optional.md#tostring)
* [unshift](optional.md#unshift)
* [values](optional.md#values)
* [getDescriber](optional.md#static-getdescriber)
* [setDescriber](optional.md#static-setdescriber)

## Constructors

###  constructor

\+ **new Optional**(...`expectations`: any[]): *[Optional](optional.md)*

Creates an instance of a WrapperPattern.
Creates an instance of a WrapperPattern.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...expectations` | any[] | Expectations that will be assigned to pattern container.  |

**Returns:** *[Optional](optional.md)*

## Properties

###  length

• **length**: *number*

*Inherited from [Optional](optional.md).[length](optional.md#length)*

*Overrides [Optional](optional.md).[length](optional.md#length)*

Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.

___

### `Static` Array

▪ **Array**: *ArrayConstructor*

___

### `Static` describer

▪ **describer**: *Describer*

___

### `Static` kind

▪ **kind**: *KINDS* = KINDS.OPTIONAL

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator‹T›*

*Inherited from [Optional](optional.md).[[Symbol.iterator]](optional.md#[symbol.iterator])*

*Overrides [Optional](optional.md).[[Symbol.iterator]](optional.md#[symbol.iterator])*

Iterator

**Returns:** *IterableIterator‹T›*

___

###  [Symbol.unscopables]

▸ **[Symbol.unscopables]**(): *object*

*Inherited from [Optional](optional.md).[[Symbol.unscopables]](optional.md#[symbol.unscopables])*

*Overrides [Optional](optional.md).[[Symbol.unscopables]](optional.md#[symbol.unscopables])*

Returns an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

**Returns:** *object*

* **copyWithin**: *boolean*

* **entries**: *boolean*

* **fill**: *boolean*

* **find**: *boolean*

* **findIndex**: *boolean*

* **keys**: *boolean*

* **values**: *boolean*

___

###  concat

▸ **concat**(...`items`: ConcatArray‹T›[]): *T[]*

*Inherited from [Optional](optional.md).[concat](optional.md#concat)*

*Overrides [Optional](optional.md).[concat](optional.md#concat)*

Combines two or more arrays.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | ConcatArray‹T›[] | Additional items to add to the end of array1.  |

**Returns:** *T[]*

▸ **concat**(...`items`: T | ConcatArray‹T›[]): *T[]*

*Inherited from [Optional](optional.md).[concat](optional.md#concat)*

*Overrides [Optional](optional.md).[concat](optional.md#concat)*

Combines two or more arrays.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T &#124; ConcatArray‹T›[] | Additional items to add to the end of array1.  |

**Returns:** *T[]*

___

###  copyWithin

▸ **copyWithin**(`target`: number, `start`: number, `end?`: number): *this*

*Inherited from [Optional](optional.md).[copyWithin](optional.md#copywithin)*

*Overrides [Optional](optional.md).[copyWithin](optional.md#copywithin)*

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | number | If target is negative, it is treated as length+target where length is the length of the array. |
`start` | number | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
`end?` | number | If not specified, length of the this object is used as its default value.  |

**Returns:** *this*

___

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

###  entries

▸ **entries**(): *IterableIterator‹[number, T]›*

*Inherited from [Optional](optional.md).[entries](optional.md#entries)*

*Overrides [Optional](optional.md).[entries](optional.md#entries)*

Returns an iterable of key, value pairs for every entry in the array

**Returns:** *IterableIterator‹[number, T]›*

___

###  every

▸ **every**(`callbackfn`: function, `thisArg?`: any): *boolean*

*Inherited from [Optional](optional.md).[every](optional.md#every)*

*Overrides [Optional](optional.md).[every](optional.md#every)*

Determines whether all the members of an array satisfy the specified test.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The every method calls
the callbackfn function for each element in the array until the callbackfn returns a value
which is coercible to the Boolean value false, or until the end of the array.

▸ (`value`: T, `index`: number, `array`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function.
If thisArg is omitted, undefined is used as the this value.

**Returns:** *boolean*

___

###  fill

▸ **fill**(`value`: T, `start?`: number, `end?`: number): *this*

*Inherited from [Optional](optional.md).[fill](optional.md#fill)*

*Overrides [Optional](optional.md).[fill](optional.md#fill)*

Returns the this object after filling the section identified by start and end with value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | T | value to fill array section with |
`start?` | number | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
`end?` | number | index to stop filling the array at. If end is negative, it is treated as length+end.  |

**Returns:** *this*

___

###  filter

▸ **filter**‹**S**›(`callbackfn`: function, `thisArg?`: any): *S[]*

*Inherited from [Optional](optional.md).[filter](optional.md#filter)*

*Overrides [Optional](optional.md).[filter](optional.md#filter)*

Returns the elements of an array that meet the condition specified in a callback function.

**Type parameters:**

▪ **S**: *T*

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *value is S*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *S[]*

▸ **filter**(`callbackfn`: function, `thisArg?`: any): *T[]*

*Inherited from [Optional](optional.md).[filter](optional.md#filter)*

*Overrides [Optional](optional.md).[filter](optional.md#filter)*

Returns the elements of an array that meet the condition specified in a callback function.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *T[]*

___

###  find

▸ **find**‹**S**›(`predicate`: function, `thisArg?`: any): *S | undefined*

*Inherited from [Optional](optional.md).[find](optional.md#find)*

*Overrides [Optional](optional.md).[find](optional.md#find)*

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

**Type parameters:**

▪ **S**: *T*

**Parameters:**

▪ **predicate**: *function*

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found, find
immediately returns that element value. Otherwise, find returns undefined.

▸ (`this`: void, `value`: T, `index`: number, `obj`: T[]): *value is S*

**Parameters:**

Name | Type |
------ | ------ |
`this` | void |
`value` | T |
`index` | number |
`obj` | T[] |

▪`Optional`  **thisArg**: *any*

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

**Returns:** *S | undefined*

▸ **find**(`predicate`: function, `thisArg?`: any): *T | undefined*

*Inherited from [Optional](optional.md).[find](optional.md#find)*

*Overrides [Optional](optional.md).[find](optional.md#find)*

**Parameters:**

▪ **predicate**: *function*

▸ (`value`: T, `index`: number, `obj`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`obj` | T[] |

▪`Optional`  **thisArg**: *any*

**Returns:** *T | undefined*

___

###  findIndex

▸ **findIndex**(`predicate`: function, `thisArg?`: any): *number*

*Inherited from [Optional](optional.md).[findIndex](optional.md#findindex)*

*Overrides [Optional](optional.md).[findIndex](optional.md#findindex)*

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

**Parameters:**

▪ **predicate**: *function*

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found,
findIndex immediately returns that element index. Otherwise, findIndex returns -1.

▸ (`value`: T, `index`: number, `obj`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`obj` | T[] |

▪`Optional`  **thisArg**: *any*

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

**Returns:** *number*

___

###  forEach

▸ **forEach**(`callbackfn`: function, `thisArg?`: any): *void*

*Inherited from [Optional](optional.md).[forEach](optional.md#foreach)*

*Overrides [Optional](optional.md).[forEach](optional.md#foreach)*

Performs the specified action for each element in an array.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *void*

___

###  getInitializer

▸ **getInitializer**(): *any | undefined*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

Returns the initializing value.

**Returns:** *any | undefined*

Initializing value, else undefined.

___

###  getKind

▸ **getKind**(): *string*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

Returns for which kind pattern is created.

**Returns:** *string*

Kind represented as a string.

___

###  hasInitializer

▸ **hasInitializer**(): *boolean*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

Evaluates if initializing value was assigned to type.

**Returns:** *boolean*

Returns `true` if initializing value is set for type, else false.

___

###  includes

▸ **includes**(`searchElement`: T, `fromIndex?`: number): *boolean*

*Inherited from [Optional](optional.md).[includes](optional.md#includes)*

*Overrides [Optional](optional.md).[includes](optional.md#includes)*

Determines whether an array includes a certain element, returning true or false as appropriate.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchElement` | T | The element to search for. |
`fromIndex?` | number | The position in this array at which to begin searching for searchElement.  |

**Returns:** *boolean*

___

###  indexOf

▸ **indexOf**(`searchElement`: T, `fromIndex?`: number): *number*

*Inherited from [Optional](optional.md).[indexOf](optional.md#indexof)*

*Overrides [Optional](optional.md).[indexOf](optional.md#indexof)*

Returns the index of the first occurrence of a value in an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchElement` | T | The value to locate in the array. |
`fromIndex?` | number | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.  |

**Returns:** *number*

___

###  join

▸ **join**(`separator?`: string): *string*

*Inherited from [Optional](optional.md).[join](optional.md#join)*

*Overrides [Optional](optional.md).[join](optional.md#join)*

Adds all the elements of an array separated by the specified separator string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`separator?` | string | A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.  |

**Returns:** *string*

___

###  keys

▸ **keys**(): *IterableIterator‹number›*

*Inherited from [Optional](optional.md).[keys](optional.md#keys)*

*Overrides [Optional](optional.md).[keys](optional.md#keys)*

Returns an iterable of keys in the array

**Returns:** *IterableIterator‹number›*

___

###  lastIndexOf

▸ **lastIndexOf**(`searchElement`: T, `fromIndex?`: number): *number*

*Inherited from [Optional](optional.md).[lastIndexOf](optional.md#lastindexof)*

*Overrides [Optional](optional.md).[lastIndexOf](optional.md#lastindexof)*

Returns the index of the last occurrence of a specified value in an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchElement` | T | The value to locate in the array. |
`fromIndex?` | number | The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.  |

**Returns:** *number*

___

###  map

▸ **map**‹**U**›(`callbackfn`: function, `thisArg?`: any): *U[]*

*Inherited from [Optional](optional.md).[map](optional.md#map)*

*Overrides [Optional](optional.md).[map](optional.md#map)*

Calls a defined callback function on each element of an array, and returns an array that contains the results.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *U*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *U[]*

___

###  pop

▸ **pop**(): *T | undefined*

*Inherited from [Optional](optional.md).[pop](optional.md#pop)*

*Overrides [Optional](optional.md).[pop](optional.md#pop)*

Removes the last element from an array and returns it.

**Returns:** *T | undefined*

___

###  push

▸ **push**(...`items`: T[]): *number*

*Inherited from [Optional](optional.md).[push](optional.md#push)*

*Overrides [Optional](optional.md).[push](optional.md#push)*

Appends new elements to an array, and returns the new length of the array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T[] | New elements of the Array.  |

**Returns:** *number*

___

###  reduce

▸ **reduce**(`callbackfn`: function): *T*

*Inherited from [Optional](optional.md).[reduce](optional.md#reduce)*

*Overrides [Optional](optional.md).[reduce](optional.md#reduce)*

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

**Returns:** *T*

▸ **reduce**(`callbackfn`: function, `initialValue`: T): *T*

*Inherited from [Optional](optional.md).[reduce](optional.md#reduce)*

*Overrides [Optional](optional.md).[reduce](optional.md#reduce)*

**Parameters:**

▪ **callbackfn**: *function*

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *T*

**Returns:** *T*

▸ **reduce**‹**U**›(`callbackfn`: function, `initialValue`: U): *U*

*Inherited from [Optional](optional.md).[reduce](optional.md#reduce)*

*Overrides [Optional](optional.md).[reduce](optional.md#reduce)*

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: U, `currentValue`: T, `currentIndex`: number, `array`: T[]): *U*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | U |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *U*

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

**Returns:** *U*

___

###  reduceRight

▸ **reduceRight**(`callbackfn`: function): *T*

*Inherited from [Optional](optional.md).[reduceRight](optional.md#reduceright)*

*Overrides [Optional](optional.md).[reduceRight](optional.md#reduceright)*

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

**Returns:** *T*

▸ **reduceRight**(`callbackfn`: function, `initialValue`: T): *T*

*Inherited from [Optional](optional.md).[reduceRight](optional.md#reduceright)*

*Overrides [Optional](optional.md).[reduceRight](optional.md#reduceright)*

**Parameters:**

▪ **callbackfn**: *function*

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *T*

**Returns:** *T*

▸ **reduceRight**‹**U**›(`callbackfn`: function, `initialValue`: U): *U*

*Inherited from [Optional](optional.md).[reduceRight](optional.md#reduceright)*

*Overrides [Optional](optional.md).[reduceRight](optional.md#reduceright)*

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: U, `currentValue`: T, `currentIndex`: number, `array`: T[]): *U*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | U |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *U*

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

**Returns:** *U*

___

###  reverse

▸ **reverse**(): *T[]*

*Inherited from [Optional](optional.md).[reverse](optional.md#reverse)*

*Overrides [Optional](optional.md).[reverse](optional.md#reverse)*

Reverses the elements in an Array.

**Returns:** *T[]*

___

###  setInitializer

▸ **setInitializer**(`initializer`: any): *void*

*Implementation of [Pattern](../interfaces/types.pattern.md)*

Sets as non-enumerable the initializing value for type if present on conversion.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initializer` | any | Initializer value provided on conversion.  |

**Returns:** *void*

___

###  shift

▸ **shift**(): *T | undefined*

*Inherited from [Optional](optional.md).[shift](optional.md#shift)*

*Overrides [Optional](optional.md).[shift](optional.md#shift)*

Removes the first element from an array and returns it.

**Returns:** *T | undefined*

___

###  slice

▸ **slice**(`start?`: number, `end?`: number): *T[]*

*Inherited from [Optional](optional.md).[slice](optional.md#slice)*

*Overrides [Optional](optional.md).[slice](optional.md#slice)*

Returns a section of an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start?` | number | The beginning of the specified portion of the array. |
`end?` | number | The end of the specified portion of the array. This is exclusive of the element at the index 'end'.  |

**Returns:** *T[]*

___

###  some

▸ **some**(`callbackfn`: function, `thisArg?`: any): *boolean*

*Inherited from [Optional](optional.md).[some](optional.md#some)*

*Overrides [Optional](optional.md).[some](optional.md#some)*

Determines whether the specified callback function returns true for any element of an array.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The some method calls
the callbackfn function for each element in the array until the callbackfn returns a value
which is coercible to the Boolean value true, or until the end of the array.

▸ (`value`: T, `index`: number, `array`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function.
If thisArg is omitted, undefined is used as the this value.

**Returns:** *boolean*

___

###  sort

▸ **sort**(`compareFn?`: function): *this*

*Inherited from [Optional](optional.md).[sort](optional.md#sort)*

*Overrides [Optional](optional.md).[sort](optional.md#sort)*

Sorts an array.

**Parameters:**

▪`Optional`  **compareFn**: *function*

Function used to determine the order of the elements. It is expected to return
a negative value if first argument is less than second argument, zero if they're equal and a positive
value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
```ts
[11,2,22,1].sort((a, b) => a - b)
```

▸ (`a`: T, `b`: T): *number*

**Parameters:**

Name | Type |
------ | ------ |
`a` | T |
`b` | T |

**Returns:** *this*

___

###  splice

▸ **splice**(`start`: number, `deleteCount?`: number): *T[]*

*Inherited from [Optional](optional.md).[splice](optional.md#splice)*

*Overrides [Optional](optional.md).[splice](optional.md#splice)*

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start` | number | The zero-based location in the array from which to start removing elements. |
`deleteCount?` | number | The number of elements to remove.  |

**Returns:** *T[]*

▸ **splice**(`start`: number, `deleteCount`: number, ...`items`: T[]): *T[]*

*Inherited from [Optional](optional.md).[splice](optional.md#splice)*

*Overrides [Optional](optional.md).[splice](optional.md#splice)*

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start` | number | The zero-based location in the array from which to start removing elements. |
`deleteCount` | number | The number of elements to remove. |
`...items` | T[] | Elements to insert into the array in place of the deleted elements.  |

**Returns:** *T[]*

___

###  toLocaleString

▸ **toLocaleString**(): *string*

*Inherited from [Optional](optional.md).[toLocaleString](optional.md#tolocalestring)*

*Overrides [Optional](optional.md).[toLocaleString](optional.md#tolocalestring)*

Returns a string representation of an array. The elements are converted to string using their toLocalString methods.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Optional](optional.md).[toString](optional.md#tostring)*

*Overrides [Optional](optional.md).[toString](optional.md#tostring)*

Returns a string representation of an array.

**Returns:** *string*

___

###  unshift

▸ **unshift**(...`items`: T[]): *number*

*Inherited from [Optional](optional.md).[unshift](optional.md#unshift)*

*Overrides [Optional](optional.md).[unshift](optional.md#unshift)*

Inserts new elements at the start of an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T[] | Elements to insert at the start of the Array.  |

**Returns:** *number*

___

###  values

▸ **values**(): *IterableIterator‹T›*

*Inherited from [Optional](optional.md).[values](optional.md#values)*

*Overrides [Optional](optional.md).[values](optional.md#values)*

Returns an iterable of values in the array

**Returns:** *IterableIterator‹T›*

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
