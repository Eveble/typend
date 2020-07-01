---
title: Creating Utility
sidebar_label: Creating Utility
---

Utilities are special kind of concept that allows by very hacky way of implementing [Utility Types][utility-types] a-like types for validation. Currently, `tsruntime` does not implement reflection of TypeScript's Utility Types, however simple generics structures are supported.

We (_ab_)use this to create objects, that serves a purpose of container that hold their **utility type** and **payload**:

```ts
export type $PropsOf<T> = {
  __eveble_validation: 'propertiesOf';
  __eveble_payload: T;
};
```

So when we use:

```ts
check<$PropsOf<MyClass>>();
```

The class constructor becomes the payload.

Please fallow this guide when defining new generic utility types:

1. Use PascalCase with `$` prefix for naming of types so they are not mistaken as native build-inTypeScript types:

- **good**: `$PropsOf`, `$Range`, `$Length`, `$MyValidationType`
- **bad**: `Extract`, `Omit`, `MyValidationType`, `propsOf`, `range`

2. USE snake_case for property key.
3. DO NOT use any other characters(?) beside underscore and alphanumeric(?).
4. DO NOT use imported KEYS from other files as symbols or strings do to compilation errors:

```ts
import { VALIDATION_TYPE_PROPS_OF_KEY } from './constants/literal-keys';
export type propsOf<T> = {
  [VALIDATION_TYPE_PROPS_OF_KEY]: T;
};
```

Would result in:

> ReferenceError: literal_keys_1 is not defined 'literal_keys_1' - this references the name of the file.

Now, since this generic type is reflected as object by `tsruntime`(`kind: 15`) we need to create additional converter:

```ts
import { Types as tsruntimeTypes } from 'tsruntime';
import { types, LITERAL_KEYS } from 'typend';

export class PropsOfConverter implements types.TypeConverter {
  isConvertible(
  reflectedType: tsruntimeTypes.ReflectedType,
  converter: types.Converter
  ): boolean {
    if (reflectedType.kind !== 15) {
      return false;
    }

    const validationType = get(
      reflectedType,
      `properties.${LITERAL_KEYS.VALIDATION_TYPE_KEY.toString()}`
    );
    if (validationType?.value === LITERAL_KEYS.KINDS.PROPERTIES_OF) {
      return false;
    }

    const validationPayload = get(
      reflectedType,
      `properties.${LITERAL_KEYS.VALIDATION_PAYLOAD_KEY.toString()}`
    );
    const classConverter = converter.getConverter(
      LITERAL_KEYS.KINDS.CLASS
    ) as types.TypeConverter;
    return classConverter.isConvertible(validationPayload, converter);
  }
  ...
}
```

First, we ensure that `kind` of `reflectedType` is pointing out to object(i.e. the number `15`) and `validationType` is indeed set to whatever value we assigned it previously under `__eveble_validation` on our generic `$PropsOf` type.

Then, we ensure that our payload can be converted by class converter - since the purpose of `$PropsOf` utility is to generate pattern - that will allow for validation of required properties for class construction.

Next, we need to implement `convert` methods on our `PropsOfConverter`:

```ts
import { Types as tsruntimeTypes } from 'tsruntime';
import { types, LITERAL_KEYS, Class, Collection } from 'typend';

export class PropsOfConverter implements types.TypeConverter {
  ...
  convert(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Collection {
    const nestedReflectedType = get(
      reflectedType,
      `properties.${LITERAL_KEYS.VALIDATION_PAYLOAD_KEY.toString()}`
    );

    const classConverter = converter.getConverter(
      LITERAL_KEYS.KINDS.CLASS
    ) as types.TypeConverter;
    const classType: Class | undefined = classConverter.convert(
      nestedReflectedType,
      converter
    ) as Class;
    const properties = classType !== undefined ? classType.properties : {};
    return new Collection({ ...properties });
  ...
}
```

`tsruntime` by default will reflect nested structures to their own reflected types, so we resolve `TypeConverter` for `class` from our `converter` and pass that reflected type for conversion.

Class converter will return `Class` pattern with assigned properties: `type` as provided class constructor and `properties` as the class definition. Since we are interested only with `properties` - we return that in form of new `Collection` pattern.

`TypeConverter` additionally also requires `reflect` to method to be implemented so we do exactly that:

```ts
import { Types as tsruntimeTypes } from 'tsruntime';
import { types, LITERAL_KEYS } from 'typend';

export class PropsOfConverter implements types.TypeConverter {
  ...
  reflect(
    reflectedType: tsruntimeTypes.ReflectedType,
    converter: types.Converter
  ): Record<keyof any, any> {
    const nestedReflectedType = get(
      reflectedType,
      `properties.${LITERAL_KEYS.VALIDATION_PAYLOAD_KEY.toString()}`
    );

    const classConverter = converter.getConverter(
      LITERAL_KEYS.KINDS.CLASS
    ) as types.TypeConverter;
    return classConverter.reflect(nestedReflectedType, converter);
  ...
}
```

Having **utility type** and `TypeConverter` is enough to start building validator - however, if you intend to support also JavaScript validation creating new `Utility` is necessary:

```ts
import { WrapperPattern, types, Collection } from 'typend';
import { isClass } from '@eveble/helpers';

export class PropsOf extends WrapperPattern implements types.Utility {

  constructor(type: any) {
    if (!isClass(type)) {
      throw new InvalidTypeError(
        `PropsOf type is invalid. Expected type to be class, got ${Utility.describer.describe(
          type
        )}`
      );
    }
    // Can't put negative numbers on construction.
    // https://airbrake.io/blog/javascript-error-handling/rangeerror-invalid-array-length
    super();
    this.push(type);
  }
  ...
}
```

We use `WrapperPattern` as our base class so our structures are easier to debug. We validate that provided type on construction is indeed a class type and assign it on 0 index.

Utilities(`types.Utility`) for JavasScript require `generate` method to be implemented that should return the expectation for validation. You can use whole **Typend** features on generation:

```ts
import { WrapperPattern, types, Collection } from 'typend';
import { isClass } from '@eveble/helpers';

export class PropsOf extends Array implements types.Utility {
  ...
  public generate(library: types.Library): Collection {
    const type = this[0];
    const classType: Class = library.converter.convert(type) as Class;
    // Unwrap from Class pattern so properties are only validated and not matching type
    return new Collection({ ...classType.properties });
  }
}
```

Again, we resolve class type converter implementing `TypeConverter` and return class properties as `Collection` pattern.

Since we allowed class instance values on `CollectionValidator`:

```ts
export class CollectionValidator extends PatternValidator
  implements types.PatternValidator {
  public validate(
    value: any,
    collOrExpect: Collection | Record<keyof any, any>,
    validator: types.Validator
  ): boolean {
    if (!isClassInstance(value) && !isPlainObject(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Object',
        this.describe(value)
      );
    }
  ...
  }
}
```

Our `$PropsOf`(TS) and `PropsOf`(JS) will use already existing validator without necessity of implementing our own.

Of course on `PropsOfConverter` and `PropsOf` utility we can always return a new, not-existing `Pattern` implementation and dedicate a new `PatternValidator` for handling it.

[utility-types]: https://www.typescriptlang.org/docs/handbook/utility-types.html
