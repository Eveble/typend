<img src="https://dummyimage.com/1116x324/000/fff&text=Banner" alt="banner" align="center" />

<br />
<br />

<div align="center"><strong>Runtime validation for TypeScript</strong></div>
<br />

<div align="center">
<strong>Typend</strong> allows for runtime validation, conversion & reflection of TypeScript declarations and is can be used as building block for any <strong>DDD</strong>(<strong>D</strong>omain <strong>D</strong>riven <strong>D</strong>esign) focused framework or similar architectures.
</div>

<br />
<div align="center">It was built for as part of CQRS framework <a href="http://eveble.com">Eveble</a> - check it out!</div>

<br />

---

[Always wanted a **runtime validation** that implements TypeScript's declarations as expectations?](#intro)

```ts
import { check } from 'typend';
// Constructors
check<any>('anything');
check<string>('foo');
check<number>(1337);
check<boolean>(true);
check<null>(null);
check<undefined>(undefined);
check<void>(undefined);
check<never>(undefined);
check<Record<any, any>>({});
check<string[]>(['foo']);
check<[string, number]>(['foo', 1337]);
check<Date>(new Date('December 17, 1995 03:24:00'));
// Literals
check<'foo'>('foo');
check<1337>(1337);
check<true>(true);
check<false>(false);
check<{ key: string }>({ key: 'foo' });
check<['foo', 1337]>(['foo', 1337]);
```

[Interfaces?](#interfaces)

```ts
import { check } from 'typend';

interface Person {
  firstName: string;
  lastName: string;
  height: number;
}

check<Person>({ firstName: 'Jane', lastName: 'Don', height: 175 });
```

[Runtime on-construction class validation?](#on-construction-validation)

```ts
import { expect } from 'chai';
import { define, check, UnequalValueError, PropsOf } from 'typend';

@define()
class Unicorn {
  sentence: 'sparkle';

  constructor(sentence: 'sparkle') {
    check<PropsOf<Unicorn>>({sentence});
    this.sentence = sentence;
  }
}
expect(() => new Unicorn('🦄🦄 Charrlieee! 🍌👑').to.throw(
  UnequalValueError
);
```

[Existing classes?](#class-validation)

```ts
import { define, check } from 'typend';

@define()
class MyClass {
  key: string;

  constructor(key: string) {
    this.key = key;
  }
}
const myClass = new MyClass('my-string');

expect(check<MyClass>(myClass)).to.be.true;
expect(check<$TypeOf<MyClass>>(myClass)).to.be.true;
```

[Custom _types_ not provided by TypeScript:](#custom-types)

```ts
import { check, integer } from 'typend';

check<integer>(10);
```

[Reflecting interfaces or other types(classes included!) to native-a-like forms?](#reflection-to-native)

```ts
import { expect } from 'chai';

interface Person {
  firstName: string;
  lastName: string;
  height: number;
  getName(): string;
}

const PersonInterface = reflect<Person>();
expect(PersonInterface).to.be.instanceof(Object);
expect(PersonInterface).to.be.eql({
  firstName: String,
  lastName: String,
  height: Number,
  getName: Function,
});
```

[Converting interfaces or other types(classes included!) to validable forms?](#reflection-to-prop-types)

```ts
import { expect } from 'chai';
import { convert, PropTypes, Interface } from 'typend';

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

## HTW?(How the f\*\*\*?)

This package uses [tsruntime][tsruntime] done by [Vadym Holoveichuk@goloveychuk][goloveychuk] as a base to evaluate kind's of types.

**Typend** is an **experimental** package that should be used as toolbox. Package exposes all internal components so most of them can be replaced or be used as part of building blocks for creating frameworks or other packages.

## Requirements

- [Node.js][nodejs] MUST be v14.0 or later

## Installation

1. To use typend with your app:

```bash
npm install typend
```

or

```bash
yarn add typend
```

2. Add [new `tsconfig.json`](tsconfig.json) or change existing one:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "plugins": [
      {
        "transform": "tsruntime/dist/transform/transformer.js",
        "type": "program"
      }
    ]
  }
}
```

3. Run `ttypescript` with compiler:

##### [ts-node][ts-node]

Use arguments:

```
ts-node --compiler=ttypescript src/index.ts
```

or

```
cross-env TS_NODE_COMPILER=\"ttypescript\" ts-node --project ./tsconfig.json src/index.ts
```

##### [rollup.js][rollupjs]

1. Install dependencies:

```bash
npm i --save-dev rollup rollup-plugin-commonjs rollup-plugin-filesize rollup-plugin-json rollup-plugin-node-resolve rollup-plugin-sourcemaps rollup-plugin-typescript2 rimraf cross-env
```

2. Add/change `rollup.config.js` to resemble:

```js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

import sourceMaps from 'rollup-plugin-sourcemaps';

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: {
    file: {
      es: pkg.module,
      cjs: pkg.main,
    }[env],
    format: env,
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    resolve(),
    json(),
    commonjs(),
    filesize(),
    typescript({
      typescript: require('typescript'),
    }),
    sourceMaps(),
  ],
};
```

3. Add scripts to `package.json`:

```json
{
  "scripts": {
    "build:cjs": "./node_modules/.bin/cross-env NODE_ENV=cjs rollup -c",
    "build:es": "./node_modules/.bin/cross-env NODE_ENV=es rollup -c",
    "build": "npm run clean && npm run build:es && npm run build:cjs",
    "clean": "./node_modules/.bin/rimraf dist"
  }
}
```

> If you have problems with setting up compilation environment - try using our [eveble-boilerplate][eveble-boilerplate] as a template.

## Documentation

Learn more about **typend** at **[https://eveble.github.io/typend/][package-homepage]** .

## Caveats

Please be aware that this is experimental module and using it has some drawbacks:

1. Compilation time will be increased(its less visible on more modern computer builds).
2. **Making changes to referenced types will be not reflected real-time in testing environment in watch mode.** Tests need to be rerunned again(this includes types defined in separate, dedicated file also).
3. Not every declaration of TypeScript generic type will work for validation.
4. We did our best to flush out most applicable architecture for this concept, however AP can be subjected to change upon valid reasons.

## Under the hood

**Typend** uses `tsruntime` for type reflection on validation with TypeScript declaration.

End-user API functions like: `check`, `is`, `instanceOf`, `validate`, `isValid`, `isInstanceOf` use exposed `Typend` class instance.

With this in mind - as developer you are able to replace or extend parts of the **Typend** that implements [Library interface][library].

## Testing

Using yarn:

```
yarn test
```

## License

[MIT](LICENSE)

[package-homepage]: https://eveble.github.io/typend/
[nodejs]: https://nodejs.org/
[eveble]: http://eveble.com
[ts-node]: https://github.com/TypeStrong/ts-node
[rollupjs]: https://rollupjs.org/
[mocha]: https://mochajs.org/
[eveble-boilerplate]: http://github.com/eveble/eveble-boilerplate
[tsruntime]: https://github.com/goloveychuk/tsruntime
[goloveychuk]: https://github.com/goloveychuk
[ddd]: https://eveble.github.io/typend/docs/guides/04-advanced/02-ddd
[library]: https://eveble.github.io/typend/docs/api/interfaces/types.library
