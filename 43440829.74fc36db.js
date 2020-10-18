(window.webpackJsonp=window.webpackJsonp||[]).push([[47],{182:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return u}));var r=n(2),o=n(9),i=(n(0),n(292)),a={title:"CollectionWithin",sidebar_label:"CollectionWithin"},c={id:"guides/03-patterns/collection-within",title:"CollectionWithin",description:"CollectionWithin",source:"@site/docs/guides/03-patterns/collection-within.md",permalink:"/typend/docs/guides/03-patterns/collection-within",sidebar_label:"CollectionWithin",sidebar:"guides",previous:{title:"CollectionIncluding",permalink:"/typend/docs/guides/03-patterns/collection-including"},next:{title:"Collection",permalink:"/typend/docs/guides/03-patterns/collection"}},l=[],p={rightToc:l};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h4",{id:"collectionwithin"},Object(i.b)("inlineCode",{parentName:"h4"},"CollectionWithin")),Object(i.b)("p",null,"Validates if value matches an Object with expected keys and values matching the given expectations. The value may also contain other keys with arbitrary values not defined in pattern(equivalent of Meteor's ",Object(i.b)("inlineCode",{parentName:"p"},"Match.ObjectIncluding"),")."),Object(i.b)("p",null,"It also can omit nested Object properties(useful for building up configuration a like objects)."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Returns:")," true if value is matching explicit ",Object(i.b)("inlineCode",{parentName:"p"},"CollectionWithin")," pattern even on nested missing object properties, else throws."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { expect } from 'chai';\nimport { validate, CollectionWithin, ValidationError } from 'typend';\n\nconst expectation = {\n  included: {\n    foo: 'foo',\n  },\n  omitted: {\n    bar: 'bar',\n  },\n};\n\nexpect(\n  validate(\n    { included: { foo: 'foo' }, omitted: { bar: 'bar' } },\n    new CollectionWithin(expectation)\n  )\n).to.be.true;\n\nexpect(\n  validate({ included: { foo: 'foo' } }, new CollectionWithin(expectation))\n).to.be.true;\n\nexpect(() =>\n  validate({ included: { foo: 'NOT_foo' } }, new CollectionWithin(expectation))\n).to.throw(ValidationError);\n")))}u.isMDXComponent=!0},292:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return f}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),u=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=u(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=u(n),b=r,f=s["".concat(a,".").concat(b)]||s[b]||d[b]||i;return n?o.a.createElement(f,c(c({ref:t},p),{},{components:n})):o.a.createElement(f,c({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=b;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var p=2;p<i;p++)a[p]=n[p];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);