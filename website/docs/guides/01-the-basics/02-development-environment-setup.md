---
title: Getting Started
sidebar_label: Setting up development environment
---

This page will help you setup your development environment for projects using Typend.

## Apps

If you are using Typend on application that is executed using `ts-node`:

1. Install dependencies:

```bash
npm i --save-dev ts-node ts-node-dev cross-env
```

```json
{
  "scripts": {
    "start": "cross-env TS_NODE_COMPILER=\"ttypescript\" ts-node --project ./tsconfig.json src/index.ts",
    "dev": "cross-env TS_NODE_COMPILER=\"ttypescript\" ts-node-dev --transpileOnly --compiler ttypescript --project ./tsconfig.json --no-notify --respawn ./src/index.ts"
  }
}
```

## Packages

Projects that are published as package(over [npm][npmjs]) require additional bundler that will compile existing code. As example we will use [rollup.js][rollupjs]:

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

[npmjs]: https://www.npmjs.com/
[rollupjs]: https://rollupjs.org/guide/en/
