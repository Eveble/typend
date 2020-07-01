---
title: Integer
sidebar_label: Integer
---

#### `Integer`

Validates if value(number) is an integer.

**Returns:** `true` if value is an integer, else throws

```ts
import { expect } from 'chai';
import { check, integer, Integer, InvalidValueError, validate } from 'typend';

check<integer>(10);
expect(() => check<integer>(Math.PI)).to.throw(InvalidValueError);

validate(10, Integer);
validate(10, integer);
```
