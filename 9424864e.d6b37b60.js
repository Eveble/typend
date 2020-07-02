(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{226:function(e,n,r){"use strict";r.r(n),r.d(n,"frontMatter",(function(){return a})),r.d(n,"metadata",(function(){return s})),r.d(n,"rightToc",(function(){return i})),r.d(n,"default",(function(){return l}));var t=r(2),o=r(9),p=(r(0),r(290)),a={title:"Introduction",sidebar_label:"Introduction"},s={id:"guides/03-patterns/01-introduction",title:"Introduction",description:"Explicit patterns allow for typed validation that skips Typend's evaluation of the most applicable validator.",source:"@site/docs/guides/03-patterns/01-introduction.md",permalink:"/typend/docs/guides/03-patterns/01-introduction",sidebar_label:"Introduction",sidebar:"guides",previous:{title:"Conversion",permalink:"/typend/docs/guides/02-usage/04-conversion"},next:{title:"Any",permalink:"/typend/docs/guides/03-patterns/any"}},i=[{value:"Expectations",id:"expectations",children:[]}],c={rightToc:i};function l(e){var n=e.components,r=Object(o.a)(e,["components"]);return Object(p.b)("wrapper",Object(t.a)({},c,r,{components:n,mdxType:"MDXLayout"}),Object(p.b)("p",null,"Explicit patterns allow for typed validation that skips ",Object(p.b)("strong",{parentName:"p"},"Typend's")," evaluation of the most applicable validator."),Object(p.b)("p",null,"This has significant impact on validation performance and should be used wherever possible."),Object(p.b)("p",null,"Additionally it allows for testing interface/classes declarations on more OOP/DDD friendly environments:"),Object(p.b)("pre",null,Object(p.b)("code",Object(t.a)({parentName:"pre"},{className:"language-ts"}),"import { expect } from 'chai';\nimport { convert, Interface, PropTypes } from 'typend';\n\ninterface Person {\n  firstName: string;\n  lastName: string;\n  height: number;\n  getName(): string;\n}\n\nconst PersonInterface = convert<Person>();\nexpect(PersonInterface).to.be.eql({\n  firstName: PropTypes.instanceOf(String),\n  lastName: PropTypes.instanceOf(String),\n  height: PropTypes.instanceOf(Number),\n  getName: PropTypes.instanceOf(Function),\n});\n")),Object(p.b)("p",null,"For more about classes ",Object(p.b)("a",Object(t.a)({parentName:"p"},{href:"../../guides/04-advanced/01-defining-classes"}),"learn here"),"."),Object(p.b)("h2",{id:"expectations"},"Expectations"),Object(p.b)("p",null,"As introduction, since we believe that simplicity is key to success, we exposed API similar to ",Object(p.b)("a",Object(t.a)({parentName:"p"},{href:"https://reactjs.org/"}),"React's")," ",Object(p.b)("a",Object(t.a)({parentName:"p"},{href:"https://github.com/facebook/prop-types"}),"PropTypes")," so you can familiarize yourself with the the basic validation availability:"),Object(p.b)("pre",null,Object(p.b)("code",Object(t.a)({parentName:"pre"},{className:"language-ts"}),"| PropType               | example                                                    |\n| ---------------------- | ---------------------------------------------------------- |\n| `PropTypes.any`        | PropTypes.any                                              |\n| `PropTypes.array`      | PropTypes.array                                            |\n| `PropTypes.arrayOf`    | PropTypes.arrayOf(PropTypes.string);                       |\n| `PropTypes.bool`       | PropTypes.boolean                                          |\n| `PropTypes.func`       | PropTypes.func                                             |\n| `PropTypes.equal`      | PropTypes.equal('foo');                                    |\n| `PropTypes.instanceOf` | PropTypes.instanceOf(Person);                              |\n| `PropTypes.integer`    | PropTypes.integer;                                         |\n| `PropTypes.interface`  | PropTypes.interface({name: PropTypes.string});             |\n| `PropTypes.maybe`      | PropTypes.maybe('foo');                                    |\n| `PropTypes.never`      | PropTypes.never;                                           |\n| `PropTypes.number`     | PropTypes.number;                                          |\n| `PropTypes.object`     | PropTypes.object;                                          |\n| `PropTypes.objectOf`   | PropTypes.objectOf(PropTypes.number);                      |\n| `PropTypes.oneOf`      | PropTypes.oneOf(['red', 'green']);                         |\n| `PropTypes.oneOfType`  | PropTypes.oneOfType([PropTypes.string, PropTypes.number]); |\n| `PropTypes.shape`      | PropTypes.shape({name: PropTypes.string});                 |\n| `PropTypes.string`     | PropTypes.string;                                          |\n| `PropTypes.symbol`     | PropTypes.symbol;                                          |\n| `PropTypes.tuple`      | PropTypes.tuple(PropTypes.string, PropTypes.number);       |\n| `PropTypes.void`       | PropTypes.void;                                            |\n| `PropTypes.where`      | PropTypes.where((arg) => return arg === 'foo');            |\n")),Object(p.b)("pre",null,Object(p.b)("code",Object(t.a)({parentName:"pre"},{className:"language-ts"}),"// PropTypes.any\nvalidate('foo', PropTypes.any);\n\n// PropTypes.array\nvalidate(['foo'], PropTypes.array);\n\n// PropTypes.arrayOf\nvalidate(['foo'], PropTypes.arrayOf(String));\n\n// PropTypes.bool\nvalidate(true, PropTypes.boolean);\n\n// PropTypes.func\nvalidate(() => {}), PropTypes.func);\n\n// PropTypes.equal\nvalidate('foo'), PropTypes.equal('foo'));\n\n// PropTypes.instanceOf\nvalidate(new Person({name: 'Jane Doe'})), PropTypes.instanceOf(Person));\n\n// PropTypes.integer\nvalidate(10, PropTypes.integer);\n\n// PropTypes.interface\nisInstanceOf(\n  new Person({ name: 'Jane Doe' }),\n  PropTypes.interface({ name: PropTypes.string })\n);\n\n// PropTypes.maybe\nvalidate(null, PropTypes.maybe);\n\n// PropTypes.never\nvalidate(undefined, PropTypes.never);\n\n// PropTypes.number\nvalidate(3.14, PropTypes.number);\n\n// PropTypes.object\nvalidate({}, PropTypes.object);\n\n// PropTypes.objectOf\nvalidate({age: 10}, PropTypes.objectOf(PropTypes.number));\n\n// PropTypes.oneOf\nvalidate('red', PropTypes.oneOf(['red', 'green']));\n\n// PropTypes.oneOfType\nvalidate('foo', PropTypes.oneOfType([PropTypes.string, PropTypes.number]));\n\n// PropTypes.shape\nvalidate({name: 'Jane Doe'}), PropTypes.shape({name: PropTypes.string}));\n\n// PropTypes.string\nvalidate('foo', PropTypes.string);\n\n// PropTypes.symbol\nvalidate(new Symbol(), PropTypes.symbol);\n\n// PropTypes.tuple\nvalidate(['foo', 1337], PropTypes.tuple(PropTypes.string, PropTypes.number));\n\n// PropTypes.void\nvalidate(undefined, PropTypes.void);\n\n// PropTypes.where\nvalidate('foo', PropTypes.where((arg) => return arg === 'foo'));\n\n")),Object(p.b)("p",null,"Primitive types are also included for developers who would like their tests or JavaScript api to remind TypeScript's lowercase notation:"),Object(p.b)("ul",null,Object(p.b)("li",{parentName:"ul"},Object(p.b)("inlineCode",{parentName:"li"},"string")),Object(p.b)("li",{parentName:"ul"},Object(p.b)("inlineCode",{parentName:"li"},"number")),Object(p.b)("li",{parentName:"ul"},Object(p.b)("inlineCode",{parentName:"li"},"boolean")),Object(p.b)("li",{parentName:"ul"},Object(p.b)("inlineCode",{parentName:"li"},"symbol"))),Object(p.b)("p",null,"Under the hood its simple as defining:"),Object(p.b)("pre",null,Object(p.b)("code",Object(t.a)({parentName:"pre"},{className:"language-ts"}),"const string: Function = String;\n")))}l.isMDXComponent=!0},290:function(e,n,r){"use strict";r.d(n,"a",(function(){return y})),r.d(n,"b",(function(){return P}));var t=r(0),o=r.n(t);function p(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){p(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},p=Object.keys(e);for(t=0;t<p.length;t++)r=p[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(t=0;t<p.length;t++)r=p[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=o.a.createContext({}),l=function(e){var n=o.a.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},y=function(e){var n=l(e.components);return o.a.createElement(c.Provider,{value:n},e.children)},b={inlineCode:"code",wrapper:function(e){var n=e.children;return o.a.createElement(o.a.Fragment,{},n)}},u=o.a.forwardRef((function(e,n){var r=e.components,t=e.mdxType,p=e.originalType,a=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),y=l(r),u=t,P=y["".concat(a,".").concat(u)]||y[u]||b[u]||p;return r?o.a.createElement(P,s(s({ref:n},c),{},{components:r})):o.a.createElement(P,s({ref:n},c))}));function P(e,n){var r=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var p=r.length,a=new Array(p);a[0]=u;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s.mdxType="string"==typeof e?e:t,a[1]=s;for(var c=2;c<p;c++)a[c]=r[c];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,r)}u.displayName="MDXCreateElement"}}]);