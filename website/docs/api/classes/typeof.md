---
id: "typeof"
title: "TypeOf"
sidebar_label: "TypeOf"
---

## Type parameters

▪ **T**

▪ **T**

## Hierarchy

  ↳ [WrapperPattern](wrapperpattern.md)

* WrapperPattern

  ↳ **TypeOf**

## Implements

* [Utility](../interfaces/types.utility.md)
* Utility

## Indexable

* \[ **n**: *number*\]: T

## Index

### Constructors

* [constructor](typeof.md#constructor)

### Properties

* [length](typeof.md#length)
* [describer](typeof.md#static-describer)
* [kind](typeof.md#static-kind)

### Accessors

* [isOptional](typeof.md#isoptional)
* [isRequired](typeof.md#isrequired)

### Methods

* [concat](typeof.md#concat)
* [describe](typeof.md#describe)
* [every](typeof.md#every)
* [filter](typeof.md#filter)
* [forEach](typeof.md#foreach)
* [generate](typeof.md#generate)
* [getInitializer](typeof.md#getinitializer)
* [getKind](typeof.md#getkind)
* [hasInitializer](typeof.md#hasinitializer)
* [indexOf](typeof.md#indexof)
* [join](typeof.md#join)
* [lastIndexOf](typeof.md#lastindexof)
* [map](typeof.md#map)
* [onValidation](typeof.md#onvalidation)
* [pop](typeof.md#pop)
* [push](typeof.md#push)
* [reduce](typeof.md#reduce)
* [reduceRight](typeof.md#reduceright)
* [reverse](typeof.md#reverse)
* [setInitializer](typeof.md#setinitializer)
* [shift](typeof.md#shift)
* [slice](typeof.md#slice)
* [some](typeof.md#some)
* [sort](typeof.md#sort)
* [splice](typeof.md#splice)
* [toLocaleString](typeof.md#tolocalestring)
* [toString](typeof.md#tostring)
* [unshift](typeof.md#unshift)
* [getDescriber](typeof.md#static-getdescriber)
* [setDescriber](typeof.md#static-setdescriber)

## Constructors

###  constructor

\+ **new TypeOf**(...`expectations`: any[]): *[TypeOf](typeof.md)*

*Inherited from [WrapperPattern](wrapperpattern.md).[constructor](wrapperpattern.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`...expectations` | any[] |

**Returns:** *[TypeOf](typeof.md)*

## Properties

###  length

• **length**: *number*

*Inherited from [Optional](optional.md).[length](optional.md#length)*

*Overrides [Optional](optional.md).[length](optional.md#length)*

Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.

___

### `Static` describer

▪ **describer**: *[Describer](../interfaces/types.describer.md)*

*Inherited from [WrapperPattern](wrapperpattern.md).[describer](wrapperpattern.md#static-describer)*

*Overrides void*

___

### `Static` kind

▪ **kind**: *string | undefined*

*Inherited from [WrapperPattern](wrapperpattern.md).[kind](wrapperpattern.md#static-kind)*

*Overrides void*

## Accessors

###  isOptional

• **get isOptional**(): *[Optional](optional.md)*

*Inherited from [WrapperPattern](wrapperpattern.md).[isOptional](wrapperpattern.md#isoptional)*

*Overrides void*

**Returns:** *[Optional](optional.md)*

___

###  isRequired

• **get isRequired**(): *any*

*Inherited from [WrapperPattern](wrapperpattern.md).[isRequired](wrapperpattern.md#isrequired)*

*Overrides void*

**Returns:** *any*

## Methods

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

###  describe

▸ **describe**(`value`: any): *string*

*Inherited from [WrapperPattern](wrapperpattern.md).[describe](wrapperpattern.md#describe)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *string*

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

###  generate

▸ **generate**(`library`: [Library](../interfaces/types.library.md)): *[Class](class.md) | [Any](any.md)*

*Implementation of [Utility](../interfaces/types.utility.md)*

Generates explicit `Type` pattern for type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`library` | [Library](../interfaces/types.library.md) | `Library` instance. |

**Returns:** *[Class](class.md) | [Any](any.md)*

Instance of `Type` pattern or instance of `Any` pattern if type is not validable.

___

###  getInitializer

▸ **getInitializer**(): *any | undefined*

*Inherited from [WrapperPattern](wrapperpattern.md).[getInitializer](wrapperpattern.md#getinitializer)*

*Overrides void*

**Returns:** *any | undefined*

___

###  getKind

▸ **getKind**(): *string*

*Inherited from [WrapperPattern](wrapperpattern.md).[getKind](wrapperpattern.md#getkind)*

*Overrides void*

**Returns:** *string*

___

###  hasInitializer

▸ **hasInitializer**(): *boolean*

*Inherited from [WrapperPattern](wrapperpattern.md).[hasInitializer](wrapperpattern.md#hasinitializer)*

*Overrides void*

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

###  onValidation

▸ **onValidation**(`type`: any): *boolean*

*Overrides [WrapperPattern](wrapperpattern.md).[onValidation](wrapperpattern.md#onvalidation)*

Ensures that provided expectations can be set on utility.

**`throws`** {InvalidTypeError}
Thrown if provided type is invalid(is not an class).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | Type constructor. |

**Returns:** *boolean*

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

*Inherited from [WrapperPattern](wrapperpattern.md).[setInitializer](wrapperpattern.md#setinitializer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`initializer` | any |

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

### `Static` getDescriber

▸ **getDescriber**(): *[Describer](../interfaces/types.describer.md)*

*Inherited from [WrapperPattern](wrapperpattern.md).[getDescriber](wrapperpattern.md#static-getdescriber)*

*Overrides void*

**Returns:** *[Describer](../interfaces/types.describer.md)*

___

### `Static` setDescriber

▸ **setDescriber**(`describer`: [Describer](../interfaces/types.describer.md)): *void*

*Inherited from [WrapperPattern](wrapperpattern.md).[setDescriber](wrapperpattern.md#static-setdescriber)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`describer` | [Describer](../interfaces/types.describer.md) |

**Returns:** *void*
