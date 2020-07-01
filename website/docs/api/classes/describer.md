---
id: "describer"
title: "Describer"
sidebar_label: "Describer"
---

## Hierarchy

* **Describer**

## Implements

* [Describer](../interfaces/types.describer.md)
* Describer

## Index

### Constructors

* [constructor](describer.md#constructor)

### Methods

* [createDescription](describer.md#createdescription)
* [describe](describer.md#describe)
* [getDescriber](describer.md#getdescriber)
* [getDescribers](describer.md#getdescribers)
* [hasDescriber](describer.md#hasdescriber)
* [overrideDescriber](describer.md#overridedescriber)
* [registerDescriber](describer.md#registerdescriber)
* [removeDescriber](describer.md#removedescriber)
* [setFormatting](describer.md#setformatting)

### Object literals

* [describers](describer.md#static-describers)

## Constructors

###  constructor

\+ **new Describer**(`describers?`: Map‹string, [TypeDescriber](../interfaces/types.typedescriber.md)›): *[Describer](describer.md)*

Creates an instance of Describer.
Creates an instance of Describer.

**Parameters:**

Name | Type |
------ | ------ |
`describers?` | Map‹string, [TypeDescriber](../interfaces/types.typedescriber.md)› |

**Returns:** *[Describer](describer.md)*

## Methods

###  createDescription

▸ **createDescription**(`value`: any | any[]): *[Stringifiable](../interfaces/types.stringifiable.md)*

Describes individual value or list of values(as an array).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any &#124; any[] | Any value or list of values. |

**Returns:** *[Stringifiable](../interfaces/types.stringifiable.md)*

Instance of Description for single value or DescriptionList instance as list of values.

___

###  describe

▸ **describe**(`value`: any | any[]): *string*

Describes value or list of values as human readable string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any &#124; any[] | Any value or list of values. |

**Returns:** *string*

String description of provided value(s).

___

###  getDescriber

▸ **getDescriber**(`type`: string): *[TypeDescriber](../interfaces/types.typedescriber.md) | undefined*

Returns describer by mapping.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | Mapping type for describer. |

**Returns:** *[TypeDescriber](../interfaces/types.typedescriber.md) | undefined*

Registered describer instance, else undefined.

___

###  getDescribers

▸ **getDescribers**(): *Map‹string, [TypeDescriber](../interfaces/types.typedescriber.md)›*

Returns all registered describers.

**Returns:** *Map‹string, [TypeDescriber](../interfaces/types.typedescriber.md)›*

Registered describers mappings.

___

###  hasDescriber

▸ **hasDescriber**(`type`: string): *boolean*

Evaluates if describer is already registered by mapping id.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | Mapping type for describer. |

**Returns:** *boolean*

Returns true if describer is registered, else false.

___

###  overrideDescriber

▸ **overrideDescriber**(`type`: string, `describer`: [TypeDescriber](../interfaces/types.typedescriber.md)): *void*

Overrides already existing describer by mapping on describer.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | Type for which mapping will be created or overriden. |
`describer` | [TypeDescriber](../interfaces/types.typedescriber.md) | Describer for registration.  |

**Returns:** *void*

___

###  registerDescriber

▸ **registerDescriber**(`type`: string, `describer`: [TypeDescriber](../interfaces/types.typedescriber.md), `shouldOverride?`: boolean): *void*

Registers describer on describer.

**`throws`** {TypeDescriberExistsError}
Thrown if mapping would overridden on describer without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | Type for which mapping will be created. |
`describer` | [TypeDescriber](../interfaces/types.typedescriber.md) | Describer for registration. |
`shouldOverride?` | boolean | Flag indicating that mapping should be overriden if exist. |

**Returns:** *void*

___

###  removeDescriber

▸ **removeDescriber**(`type`: string): *void*

Removes describer by mapping id.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | Mapping type for describer.  |

**Returns:** *void*

___

###  setFormatting

▸ **setFormatting**(`formatting`: [DescriberFormatting](../modules/types.md#describerformatting)): *void*

*Implementation of [Describer](../interfaces/types.describer.md)*

Describer initializer.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`formatting` | [DescriberFormatting](../modules/types.md#describerformatting) | Formatting for describer as one of values: `compact`, `debug`, `default`.  |

**Returns:** *void*

## Object literals

### `Static` describers

### ▪ **describers**: *object*

###  [KINDS.ARRAY]

• **[KINDS.ARRAY]**: *ArrayDescriber* = ArrayDescriber

###  [KINDS.CLASS]

• **[KINDS.CLASS]**: *ClassDescriber* = ClassDescriber

###  [KINDS.DESCRIPTION_LIST]

• **[KINDS.DESCRIPTION_LIST]**: *DescriptionListDescriber* = DescriptionListDescriber

###  [KINDS.ERROR]

• **[KINDS.ERROR]**: *ErrorDescriber* = ErrorDescriber

###  [KINDS.NATIVE]

• **[KINDS.NATIVE]**: *NativeTypeDescriber* = NativeTypeDescriber

###  [KINDS.OBJECT]

• **[KINDS.OBJECT]**: *ObjectDescriber* = ObjectDescriber

###  [KINDS.UNKNOWN]

• **[KINDS.UNKNOWN]**: *FallbackDescriber* = FallbackDescriber
