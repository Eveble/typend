---
title: Getting Started
sidebar_label: Getting Started
---

## Requirements

- [Node.js][nodejs] MUST be v14.0 or later.

## Installation

1. To use typend with your app:

```bash
npm install typend tsruntime ttypescript reflect-metadata
```

or

```bash
yarn add typend tsruntime ttypescript reflect-metadata
```

2. Add new `tsconfig.json`:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./dist",
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "lib": ["esnext"],
    "module": "ESNext",
    "moduleResolution": "node",
    "noImplicitAny": false,
    "noResolve": false,
    "noUnusedLocals": true,
    "noUnusedParameters": false,
    "outDir": "./dist",
    "plugins": [
      {
        "transform": "tsruntime/dist/transform/transformer.js",
        "type": "program"
      }
    ],
    "preserveConstEnums": true,
    "removeComments": true,
    "sourceMap": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": false,
    "suppressImplicitAnyIndexErrors": false,
    "target": "es2018",
    "useDefineForClassFields": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

or change existing one:

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

[package-homepage]: https://eveble.github.io/typend/
[nodejs]: https://nodejs.org/
