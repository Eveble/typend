---
title: Any
sidebar_label: Any
---

#### any > `Any`

Any value will be matching expectation.

```ts
import { check, validate, any } from 'typend';

check<any>('foo');

validate('foo', any);
```