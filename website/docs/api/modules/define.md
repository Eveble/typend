---
id: "define"
title: "typend"
sidebar_label: "README"
---

Defines a type by enabling declaration reflection so it can be converted later on for runtime validation.

**`example`** 
```ts
define()
class MyType {}
```

## Callable

▸ **define**(...`args`: any[]): *MarkReflective‹[ClassDecorator](types.md#classdecorator)›*

Defines a type by enabling declaration reflection so it can be converted later on for runtime validation.

**`example`** 
```ts
define()
class MyType {}
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...args` | any[] | Optional arguments that will be passed back to before/after hooks. |

**Returns:** *MarkReflective‹[ClassDecorator](types.md#classdecorator)›*

Marked class as reflective.

## Index

### Variables

* [afterDefine](define.md#afterdefine)
* [beforeDefine](define.md#beforedefine)

## Variables

###  afterDefine

• **afterDefine**: *function*

#### Type declaration:

▸ (`target`: any, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`...args` | any[] |

___

###  beforeDefine

• **beforeDefine**: *function*

#### Type declaration:

▸ (`target`: any, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`...args` | any[] |
