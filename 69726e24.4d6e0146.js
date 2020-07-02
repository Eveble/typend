(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{203:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return c})),t.d(n,"metadata",(function(){return p})),t.d(n,"rightToc",(function(){return i})),t.d(n,"default",(function(){return l}));var r=t(2),o=t(9),a=(t(0),t(290)),c={title:"Conversion",sidebar_label:"Conversion"},p={id:"guides/02-usage/04-conversion",title:"Conversion",description:"convert",source:"@site/docs/guides/02-usage/04-conversion.md",permalink:"/typend/docs/guides/02-usage/04-conversion",sidebar_label:"Conversion",sidebar:"guides",previous:{title:"Reflection",permalink:"/typend/docs/guides/02-usage/03-reflection"},next:{title:"Introduction",permalink:"/typend/docs/guides/03-patterns/01-introduction"}},i=[{value:"convert",id:"convert",children:[]}],s={rightToc:i};function l(e){var n=e.components,t=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},s,t,{components:n,mdxType:"MDXLayout"}),Object(a.b)("h3",{id:"convert"},"convert"),Object(a.b)("p",null,"\u25b8 ",Object(a.b)("strong",{parentName:"p"},"convert\u2264T\u2265"),"(): ",Object(a.b)("em",{parentName:"p"},"any")),Object(a.b)("p",null,"Converts TypeScript declaration to validable form. Each expectation is wrapped as appropriate and applicable ",Object(a.b)("inlineCode",{parentName:"p"},"Pattern")," instance, that allows validator for use of explicit validator instead of relying on multiple if-else statements that just generates unnecessary performance impacts."),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Returns:")," ",Object(a.b)("em",{parentName:"p"},"any")),Object(a.b)("p",null,"Converted type as validable form."),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { expect } from 'chai';\nimport { convert, Interface, PropTypes } from 'typend';\n\ninterface Person {\n  firstName: string;\n  lastName: string;\n  height: number;\n  getName(): string;\n}\n\nconst PersonInterface = convert<Person>();\nexpect(PersonInterface).to.be.instanceof(Interface);\nexpect(PersonInterface).to.be.eql({\n  firstName: PropTypes.instanceOf(String),\n  lastName: PropTypes.instanceOf(String),\n  height: PropTypes.instanceOf(Number),\n  getName: PropTypes.instanceOf(Function),\n});\n")),Object(a.b)("p",null,"Other examples:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { expect } from 'chai';\nimport { convert, PropTypes, any, voided, never } from 'typend';\n\n// Constructors\nexpect(convert<any>()).to.be.eql(any);\nexpect(convert<string>()).to.be.eql(PropTypes.instanceOf(String));\nexpect(convert<number>()).to.be.eql(PropTypes.instanceOf(Number));\nexpect(convert<boolean>()).to.be.eql(PropTypes.instanceOf(Boolean));\nexpect(convert<null>()).to.be.equal(null);\nexpect(convert<undefined>()).to.be.equal(undefined);\nexpect(convert<void>()).to.be.eql(voided);\nexpect(convert<never>()).to.be.eql(never);\nexpect(convert<Record<any, any>>()).to.be.eql(PropTypes.object);\nexpect(convert<string[]>()).to.be.eql(\n  PropTypes.arrayOf(PropTypes.instanceOf(String))\n);\nexpect(convert<[string, number]>()).to.be.eql(\n  PropTypes.tuple(PropTypes.instanceOf(String), PropTypes.instanceOf(Number))\n);\nexpect(convert<Date>()).to.be.eql(PropTypes.instanceOf(Date));\n// Literals\nexpect(convert<'foo'>()).to.be.eql(PropTypes.equal('foo'));\nexpect(convert<'foo' | 'bar'>()).to.be.eql(\n  PropTypes.oneOf([PropTypes.equal('foo'), PropTypes.equal('bar')])\n);\nexpect(convert<1337>()).to.be.eql(PropTypes.equal(1337));\nexpect(convert<true>()).to.be.eql(PropTypes.equal(true));\nexpect(convert<false>()).to.be.eql(PropTypes.equal(false));\nexpect(convert<{ key: string }>()).to.be.eql(\n  PropTypes.shape({ key: PropTypes.instanceOf(String) })\n);\nexpect(convert<['foo', 1337]>()).to.be.eql(\n  PropTypes.tuple(PropTypes.equal('foo'), PropTypes.equal(1337))\n);\n")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"We use here ",Object(a.b)("inlineCode",{parentName:"p"},"chai's")," expect ",Object(a.b)("inlineCode",{parentName:"p"},"eql")," method to compare expectations, however please keep in mind that this does not ensure that expectation is in wrapped in correct ",Object(a.b)("inlineCode",{parentName:"p"},"Pattern"),". There are many patterns that share similar-but-different structure or are extensions of ",Object(a.b)("inlineCode",{parentName:"p"},"Array")," class.")))}l.isMDXComponent=!0},290:function(e,n,t){"use strict";t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return y}));var r=t(0),o=t.n(r);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function c(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?c(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=o.a.createContext({}),l=function(e){var n=o.a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):p(p({},n),e)),t},u=function(e){var n=l(e.components);return o.a.createElement(s.Provider,{value:n},e.children)},b={inlineCode:"code",wrapper:function(e){var n=e.children;return o.a.createElement(o.a.Fragment,{},n)}},f=o.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=l(t),f=r,y=u["".concat(c,".").concat(f)]||u[f]||b[f]||a;return t?o.a.createElement(y,p(p({ref:n},s),{},{components:t})):o.a.createElement(y,p({ref:n},s))}));function y(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,c=new Array(a);c[0]=f;var p={};for(var i in n)hasOwnProperty.call(n,i)&&(p[i]=n[i]);p.originalType=e,p.mdxType="string"==typeof e?e:r,c[1]=p;for(var s=2;s<a;s++)c[s]=t[s];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,t)}f.displayName="MDXCreateElement"}}]);