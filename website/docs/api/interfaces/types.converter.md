---
id: "types.converter"
title: "Converter"
sidebar_label: "Converter"
---

## Hierarchy

* **Converter**

## Implemented by

* [TSRuntimeConverter](../classes/tsruntimeconverter.md)

## Index

### Properties

* [typeConverters](types.converter.md#typeconverters)

### Methods

* [convert](types.converter.md#convert)
* [getConverter](types.converter.md#getconverter)
* [hasConverter](types.converter.md#hasconverter)
* [overrideConverter](types.converter.md#overrideconverter)
* [reflect](types.converter.md#reflect)
* [registerConverter](types.converter.md#registerconverter)
* [removeConverter](types.converter.md#removeconverter)

## Properties

###  typeConverters

• **typeConverters**: *Map‹string, TypeConverter›*

## Methods

###  convert

▸ **convert**(`reflectedType`: any): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | any |

**Returns:** *[Type](../modules/types.md#type)*

▸ **convert**(`reflectedType`: any): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | any |

**Returns:** *[Type](../modules/types.md#type)*

___

###  getConverter

▸ **getConverter**(`kind`: string): *[TypeConverter](types.typeconverter.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *[TypeConverter](types.typeconverter.md) | undefined*

▸ **getConverter**(`kind`: string): *TypeConverter | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *TypeConverter | undefined*

___

###  hasConverter

▸ **hasConverter**(`kind`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *boolean*

▸ **hasConverter**(`kind`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *boolean*

___

###  overrideConverter

▸ **overrideConverter**(`kind`: string, `converter`: [TypeConverter](types.typeconverter.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`converter` | [TypeConverter](types.typeconverter.md) |

**Returns:** *void*

▸ **overrideConverter**(`kind`: string, `converter`: TypeConverter): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`converter` | TypeConverter |

**Returns:** *void*

___

###  reflect

▸ **reflect**(`reflectedType`: any): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | any |

**Returns:** *[Type](../modules/types.md#type)*

▸ **reflect**(`reflectedType`: any): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`reflectedType` | any |

**Returns:** *[Type](../modules/types.md#type)*

___

###  registerConverter

▸ **registerConverter**(`kind`: string, `converter`: [TypeConverter](types.typeconverter.md), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`converter` | [TypeConverter](types.typeconverter.md) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerConverter**(`kind`: string, `converter`: TypeConverter, `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |
`converter` | TypeConverter |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeConverter

▸ **removeConverter**(`kind`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *void*

▸ **removeConverter**(`kind`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`kind` | string |

**Returns:** *void*
