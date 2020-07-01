---
title: Conversion
sidebar_label: Conversion
---

### convert

▸ **convert≤T≥**(): _any_

Converts TypeScript declaration to validable form. Each expectation is wrapped as appropriate and applicable `Pattern` instance, that allows validator for use of explicit validator instead of relying on multiple if-else statements that just generates unnecessary performance impacts.

**Returns:** _any_

Converted type as validable form.

```ts
import { expect } from 'chai';
import { convert, Interface, PropTypes } from 'typend';

interface Person {
  firstName: string;
  lastName: string;
  height: number;
  getName(): string;
}

const PersonInterface = convert<Person>();
expect(PersonInterface).to.be.instanceof(Interface);
expect(PersonInterface).to.be.eql({
  firstName: PropTypes.instanceOf(String),
  lastName: PropTypes.instanceOf(String),
  height: PropTypes.instanceOf(Number),
  getName: PropTypes.instanceOf(Function),
});
```

Other examples:

```ts
import { expect } from 'chai';
import { convert, PropTypes, any, voided, never } from 'typend';

// Constructors
expect(convert<any>()).to.be.eql(any);
expect(convert<string>()).to.be.eql(PropTypes.instanceOf(String));
expect(convert<number>()).to.be.eql(PropTypes.instanceOf(Number));
expect(convert<boolean>()).to.be.eql(PropTypes.instanceOf(Boolean));
expect(convert<null>()).to.be.equal(null);
expect(convert<undefined>()).to.be.equal(undefined);
expect(convert<void>()).to.be.eql(voided);
expect(convert<never>()).to.be.eql(never);
expect(convert<Record<any, any>>()).to.be.eql(PropTypes.object);
expect(convert<string[]>()).to.be.eql(
  PropTypes.arrayOf(PropTypes.instanceOf(String))
);
expect(convert<[string, number]>()).to.be.eql(
  PropTypes.tuple(PropTypes.instanceOf(String), PropTypes.instanceOf(Number))
);
expect(convert<Date>()).to.be.eql(PropTypes.instanceOf(Date));
// Literals
expect(convert<'foo'>()).to.be.eql(PropTypes.equal('foo'));
expect(convert<'foo' | 'bar'>()).to.be.eql(
  PropTypes.oneOf([PropTypes.equal('foo'), PropTypes.equal('bar')])
);
expect(convert<1337>()).to.be.eql(PropTypes.equal(1337));
expect(convert<true>()).to.be.eql(PropTypes.equal(true));
expect(convert<false>()).to.be.eql(PropTypes.equal(false));
expect(convert<{ key: string }>()).to.be.eql(
  PropTypes.shape({ key: PropTypes.instanceOf(String) })
);
expect(convert<['foo', 1337]>()).to.be.eql(
  PropTypes.tuple(PropTypes.equal('foo'), PropTypes.equal(1337))
);
```

> We use here `chai's` expect `eql` method to compare expectations, however please keep in mind that this does not ensure that expectation is in wrapped in correct `Pattern`. There are many patterns that share similar-but-different structure or are extensions of `Array` class.
