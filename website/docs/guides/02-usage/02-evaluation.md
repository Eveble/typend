---
title: Evaluation
sidebar_label: Evaluation
---

Evaluation API allows for evaluating value against expectation as `boolean` - without throwing errors.

## TypeScript API

Evaluates if provided value is instance of ≤T≥:

### is

▸ **is≤T≥**(`value`: any, `isStrict`?: boolean): _boolean_

Evaluates if a value matches an expectation.

**Parameters:**

| Name       | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| `value`    | any     | Value that needs to evaluated.                                 |
| `isStrict` | boolean | Flag indicating that evaluation should be done in strict mode. |

**Returns:** _boolean_

Returns `true` if evaluation is successful, else `false`.

---

```ts
import { expect } from 'chai';
import { is } from 'typend';

expect(is<string>('im-a-string')).to.be.true;
expect(is<number>('im-not-a-number')).to.be.false;
```

---

### instanceOf

▸ **instanceOf≤T≥**(`value`: any): _boolean_

Evaluates if provided value is an instance of a specific type or interface.

**Parameters:**

| Name    | Type | Description                    |
| ------- | ---- | ------------------------------ |
| `value` | any  | Value that needs to evaluated. |

**Returns:** _boolean_

Returns `true` if evaluation is successful, else `false`.

```ts
import { expect } from 'chai';
import { instanceOf } from 'typend';

interface Person {
  firstName: string;
  lastName: string;
  height: number;
  getName(): string;
}

expect(
  instanceOf<Person>({
    firstName: 'Jane',
    lastName: 'Doe',
    height: 175,
    getName(): string {
      return `${this.firstName} ${this.lastName}`;
    },
  })
).to.be.true;

expect(
  instanceOf<Person>({
    firstName: 'Jane',
    lastName: 'Doe',
    height: 175,
  })
).to.be.false;
```

## JavaScript API

### isInstanceOf

▸ **isInstanceOf**(`value`: any, `expectation`: [Expectation](../../modules/types.md#expectation) | [Utility](utility.md), `isStrict`?: boolean): _boolean_

Evaluates if provided value is an instance of a specific type or interface :

**Parameters:**

| Name          | Type                                                                                               | Description                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `value`       | any                                                                                                | Value that needs to evaluated.                                                                                               |
| `expectation` | [Expectation](../../modules/types.md#expectation) &#124; [Utility](../../api/classes/..utility.md) | Expectation as explicit Pattern instance, instance of Utility or implicit expectation against which value will be validated. |

**Returns:** _boolean_

Returns `true` if evaluation is successful, else `false`.

```ts
import { expect } from 'chai';
import { isInstanceOf, convert } from 'typend';

interface Person {
  firstName: string;
  lastName: string;
  height: number;
  getName(): string;
}

expect(
  isInstanceOf(
    {
      firstName: 'Jane',
      lastName: 'Doe',
      height: 175,
      getName(): string {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    convert<Person>()
  )
).to.be.true;

expect(
  isInstanceOf(
    {
      firstName: 'Jane',
      lastName: 'Doe',
      height: 175,
    },
    convert<Person>()
  )
).to.be.false;
```
