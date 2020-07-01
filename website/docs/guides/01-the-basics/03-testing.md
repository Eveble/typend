---
title: Testing
sidebar_label: Testing
---

##### [Mocha][mocha]

1 . Add script to `package.json`:

```json
"test": "TS_NODE_PROJECT=./test/tsconfig.json TS_NODE_COMPILER=\"ttypescript\" ./node_modules/.bin/mocha --require ts-node/register --watch-extensions ts --opts ./mocha.opts --project ./test/tsconfig.json",
```

2. Ensure that your default `tsconfig.json` exists in root folder that was set during [second step of installation][installation].

3. Add new one over `./test/tsconfig.json`:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

[mocha]: https://mochajs.org/
[installation]: 01-getting-started.md
