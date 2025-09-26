import { createReflective, defineReflectMetadata, getClassType } from 'tsruntime';
import 'reflect-metadata';
import ExtendableError from 'es6-error';
import { format, inspect } from 'util';
import { isClass, isConstructor, isSinonClockDate, isNativeType, getTypeName, isClassInstance, isErrorInstance, isScalarType, getScalarType, getNativeType, isMultidimensionalArray, isNativeTypeInstance, hasTypeName, isErrorClass } from '@eveble/helpers';
import { isArray, has, isPlainObject, isFunction, isEmpty, get, capitalize, last } from 'lodash';
import { getPrototypeListOf } from 'polytype';
import { diff } from 'deep-diff';
import merge from 'deepmerge';
import 'chai';

const TYPE_KEY = Symbol('eveble:flags:type');
const PROPERTIES_KEY = Symbol('eveble:containers:definition');
const REFLECTION_KEY = Symbol('eveble:containers:reflection');
const INJECTABLE_PROPERTIES_KEY = Symbol('eveble:containers:injectable-definition');
const INTERNAL_PROPS_KEY = Symbol('eveble:containers:internal:props');
const INTERNAL_METHODS_KEY = Symbol('eveble:containers:internal:methods');
const PATTERN_KEY = Symbol('eveble:pattern-kind');
const VALIDATION_KEY = Symbol('eveble:flags:validation');
const INTERFACE_NAME_KEY = Symbol('eveble:interface-name');

var metadataKeys = /*#__PURE__*/Object.freeze({
  __proto__: null,
  INJECTABLE_PROPERTIES_KEY: INJECTABLE_PROPERTIES_KEY,
  INTERFACE_NAME_KEY: INTERFACE_NAME_KEY,
  INTERNAL_METHODS_KEY: INTERNAL_METHODS_KEY,
  INTERNAL_PROPS_KEY: INTERNAL_PROPS_KEY,
  PATTERN_KEY: PATTERN_KEY,
  PROPERTIES_KEY: PROPERTIES_KEY,
  REFLECTION_KEY: REFLECTION_KEY,
  TYPE_KEY: TYPE_KEY,
  VALIDATION_KEY: VALIDATION_KEY
});

var KINDS$1;
(function (KINDS) {
    KINDS["ANY"] = "any";
    KINDS["ARRAY"] = "array";
    KINDS["CLASS"] = "class";
    KINDS["DESCRIPTION_LIST"] = "descriptionList";
    KINDS["EQUALS"] = "equals";
    KINDS["ERROR"] = "error";
    KINDS["FUNCTION"] = "function";
    KINDS["INCLUDE"] = "include";
    KINDS["INSTANCE_OF"] = "instanceOf";
    KINDS["INTEGER"] = "integer";
    KINDS["INTERFACE"] = "interface";
    KINDS["INTERNAL"] = "internal";
    KINDS["LITERAL"] = "literal";
    KINDS["LOCALE_STRING"] = "localeString";
    KINDS["MAYBE"] = "maybe";
    KINDS["NATIVE"] = "native";
    KINDS["NEVER"] = "never";
    KINDS["NIL"] = "nil";
    KINDS["OBJECT"] = "object";
    KINDS["OBJECT_INCLUDING"] = "objectIncluding";
    KINDS["OBJECT_WITHIN"] = "objectMaybe";
    KINDS["ONE_OF"] = "oneOf";
    KINDS["OPTIONAL"] = "optional";
    KINDS["PRIMITIVE"] = "primitive";
    KINDS["PROPERTIES_OF"] = "propsOf";
    KINDS["REFERENCE"] = "reference";
    KINDS["TUPLE"] = "tuple";
    KINDS["TYPE_OF"] = "typeOf";
    KINDS["UNION"] = "union";
    KINDS["UNKNOWN"] = "unknown";
    KINDS["UNRECOGNIZED"] = "unrecognized";
    KINDS["VOID"] = "void";
    KINDS["WITHIN"] = "within";
    KINDS["WHERE"] = "where";
})(KINDS$1 || (KINDS$1 = {}));
const VALIDATION_TYPE_KEY = '__eveble_validation';
const VALIDATION_PAYLOAD_KEY = '__eveble_payload';
const VALIDATION_TYPE_PROPS_OF_KEY = '__eveble_validation_type_props_of';

var literalKeys = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get KINDS () { return KINDS$1; },
  VALIDATION_PAYLOAD_KEY: VALIDATION_PAYLOAD_KEY,
  VALIDATION_TYPE_KEY: VALIDATION_TYPE_KEY,
  VALIDATION_TYPE_PROPS_OF_KEY: VALIDATION_TYPE_PROPS_OF_KEY
});

function internal(proto, propertyKey) {
    const target = proto.constructor;
    const descriptor = Object.getOwnPropertyDescriptor(proto, propertyKey);
    const type = descriptor === undefined ? 'property' : 'method';
    const typeKey = type === 'property' ? INTERNAL_PROPS_KEY : INTERNAL_METHODS_KEY;
    if (!Reflect.hasOwnMetadata(typeKey, target)) {
        const internals = {};
        Reflect.defineMetadata(typeKey, internals, target);
    }
    const internals = Reflect.getOwnMetadata(typeKey, target);
    internals[propertyKey] = true;
    Reflect.defineMetadata(typeKey, internals, target);
}

function Validable(isValidable = true) {
    return (target) => {
        Reflect.defineMetadata(VALIDATION_KEY, isValidable, target);
        return target;
    };
}

const REFLECTED_TYPE_PROPS_KEY = 'REFLECTED_TYPE_PROPS_KEY';
const CONVERTED_TYPE_PROPS_KEY = 'CONVERTED_TYPE_PROPS_KEY';
const REFLECTED_TYPE_KEY = 'REFLECTED_TYPE_KEY';

function Type(...args) {
    function reflectiveFn(reflectedType) {
        return (target) => {
            Type.beforeHook(target, reflectedType, ...args);
            Reflect.defineMetadata(REFLECTED_TYPE_KEY, reflectedType, target);
            Reflect.defineMetadata(TYPE_KEY, true, target);
            defineReflectMetadata(target, reflectedType);
            Type.afterHook(target, reflectedType, ...args);
            const classSource = target.toString();
            const hasExplicitConstructor = /constructor\s*\([^)]*\)\s*\{[\s\S]*?\}/m.test(classSource);
            const isCompilerGenerated = hasExplicitConstructor &&
                /constructor\s*\(\s*\)\s*\{\s*super\s*\(\s*\.\.\.arguments\s*\)\s*;/.test(classSource);
            const hasCustomLogic = hasExplicitConstructor &&
                !isCompilerGenerated &&
                (/constructor\s*\([^)]+\)/.test(classSource) ||
                    /this\.\w+\([^)]*\)/.test(classSource) ||
                    /console\.log/.test(classSource) ||
                    /throw\s+/.test(classSource) ||
                    /if\s*\(/.test(classSource) ||
                    /for\s*\(/.test(classSource) ||
                    /while\s*\(/.test(classSource));
            let Wrapped;
            if (hasCustomLogic) {
                Wrapped = target;
            }
            else {
                Wrapped = new Function('target', `return class ${target.name} extends target {
             constructor(...ctorArgs) {
               super(...ctorArgs);
              //  console.log('After super() call, this:', Object.keys(this), this);

               // If no properties were set by super() call, it means property initializers
               // from the original class weren't applied. We need to apply them manually.
               if (Object.keys(this).length === 0) {
                 // Create a temporary instance of the original class to get default values
                 const tempInstance = new target();
                //  console.log('Temp instance with initializers:', Object.keys(tempInstance), tempInstance);
                 // Copy the property initializers
                 Object.assign(this, tempInstance);
                //  console.log('After copying initializers, this:', Object.keys(this), this);
               }

               const props = ctorArgs[0];
               if (props && typeof props === "object") {
                //  console.log('Applying props:', props);
                 Object.assign(this, props);
                //  console.log('After Object.assign, this:', Object.keys(this), this);
               }
             }
           }`)(target);
                const originalPrototype = Object.getPrototypeOf(target);
                const originalInstancePrototype = Object.getPrototypeOf(target.prototype);
                if (originalPrototype && originalPrototype !== Function.prototype) {
                    Object.setPrototypeOf(Wrapped, originalPrototype);
                }
                if (originalInstancePrototype) {
                    Object.setPrototypeOf(Wrapped.prototype, originalInstancePrototype);
                }
                for (const key of Reflect.ownKeys(target.prototype)) {
                    if (key !== 'constructor' && !Wrapped.prototype.hasOwnProperty(key)) {
                        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
                        if (descriptor) {
                            Object.defineProperty(Wrapped.prototype, key, descriptor);
                        }
                    }
                }
                for (const key of Reflect.ownKeys(target)) {
                    if (key !== 'prototype' && key !== 'name' && key !== 'length') {
                        const descriptor = Object.getOwnPropertyDescriptor(target, key);
                        if (descriptor) {
                            Object.defineProperty(Wrapped, key, descriptor);
                        }
                    }
                }
                const metadataKeys = Reflect.getMetadataKeys(target);
                for (const key of metadataKeys) {
                    const value = Reflect.getMetadata(key, target);
                    Reflect.defineMetadata(key, value, Wrapped);
                }
                const prototypeMetadataKeys = Reflect.getMetadataKeys(target.prototype);
                for (const key of prototypeMetadataKeys) {
                    const value = Reflect.getMetadata(key, target.prototype);
                    Reflect.defineMetadata(key, value, Wrapped.prototype);
                }
                Object.defineProperty(Wrapped, 'name', { value: target.name });
            }
            Reflect.defineMetadata(REFLECTED_TYPE_KEY, reflectedType, Wrapped);
            Reflect.defineMetadata(TYPE_KEY, true, Wrapped);
            defineReflectMetadata(Wrapped, reflectedType);
            return Wrapped;
        };
    }
    const reflect = createReflective(reflectiveFn);
    return reflect;
}
Type.beforeHook = function (target, ...args) {
    return target && args ? undefined : undefined;
};
Type.afterHook = function (target, ...args) {
    return target && args ? undefined : undefined;
};

class TypeDescriberExistsError extends ExtendableError {
    constructor(type) {
        super(`Describer for type '${type}' would be overwritten. To
    override existing describer use 'Describer::overrideDescriber'`);
    }
}
class TypeDescriberNotFoundError extends ExtendableError {
    constructor(type) {
        super(`Describer for type '${type}' can't be found`);
    }
}
class InvalidDefinitionError extends ExtendableError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class TypeConverterExists extends TypeError {
    constructor(type) {
        super(`Converter for type '${type}' is already registered`);
    }
}
class ValidationError extends ExtendableError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class InvalidTypeError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class InvalidValueError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class UnequalValueError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class UnmatchedTypeError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class NotAMemberError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class UnexpectedKeyError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class UnknownError extends ValidationError {
    constructor(message, ...args) {
        super(format(message, ...args));
    }
}
class PatternValidatorExistError extends ExtendableError {
    constructor(type) {
        super(`Validator for type '${type}' would be overwritten. To
    override existing validator use 'Validator::overrideValidator'`);
    }
}
class PatternValidatorNotFoundError extends ExtendableError {
    constructor(type) {
        super(`Validator for type '${type}' can't be found`);
    }
}
class UndefinableClassError extends ExtendableError {
    constructor(typeName) {
        super(`${typeName}: provided argument must be a class that implements '@Type()' decorator`);
    }
}

class Optional extends Array {
    constructor(...expectations) {
        super();
        this.push(...expectations);
    }
    static setDescriber(describer) {
        this.describer = describer;
    }
    static getDescriber() {
        return this.describer;
    }
    describe(value) {
        return this.constructor.getDescriber().describe(value);
    }
    getKind() {
        return this.constructor.kind;
    }
}
Optional.kind = KINDS$1.OPTIONAL;

class Pattern extends Object {
    get isOptional() {
        return new Optional(this);
    }
    get isRequired() {
        if (this instanceof Optional) {
            return this[0];
        }
        return this;
    }
    getKind() {
        return this.constructor.kind;
    }
    static setDescriber(describer) {
        this.describer = describer;
    }
    static getDescriber() {
        return this.describer;
    }
    describe(value) {
        return this.constructor.getDescriber().describe(value);
    }
}
Pattern.kind = '';

class Any extends Pattern {
}
Any.kind = KINDS$1.ANY;

class WrapperPattern extends Array {
    constructor(...expectations) {
        super();
        this.onValidation(...expectations);
        this.push(...expectations);
    }
    get isOptional() {
        return new Optional(this);
    }
    get isRequired() {
        if (this instanceof Optional) {
            return this[0];
        }
        return this;
    }
    static setDescriber(describer) {
        this.describer = describer;
    }
    static getDescriber() {
        return this.describer;
    }
    describe(value) {
        return this.constructor.getDescriber().describe(value);
    }
    getKind() {
        return this.constructor.kind;
    }
    onValidation(...expectations) {
        return true;
    }
}

class InstanceOf extends WrapperPattern {
    onValidation(type) {
        if (!this.isValid(type)) {
            throw new InvalidTypeError(`InstanceOf type is invalid. Expected type to be nil, a native type constructor, class, got ${Pattern.describer.describe(type)}`);
        }
        return true;
    }
    isValid(type) {
        if (isArray(type)) {
            return false;
        }
        return (type == null ||
            isClass(type) ||
            isConstructor(type) ||
            isSinonClockDate(type) ||
            [Symbol].includes(type));
    }
}
InstanceOf.kind = KINDS$1.INSTANCE_OF;

class Interface extends Pattern {
    constructor(properties) {
        super();
        if (!isPlainObjectFast(properties) && !(properties instanceof Collection)) {
            throw new InvalidTypeError(`Interface properties are invalid. Expected properties to be a plain object or Collection instance describing interface properties, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
    setName(name) {
        Reflect.defineMetadata(INTERFACE_NAME_KEY, name, this);
    }
    getName() {
        return Reflect.getOwnMetadata(INTERFACE_NAME_KEY, this);
    }
}
Interface.kind = KINDS$1.INTERFACE;

function getResolvablePath(path, properties) {
    const pathParts = path.split('.');
    const nearestPathParts = [].concat(pathParts);
    for (const pathPart of pathParts.reverse()) {
        const nearestPath = nearestPathParts.join('.');
        const isNested = !has(properties, nearestPath);
        if (isNested || pathPart === 'properties') {
            nearestPathParts.pop();
        }
        else {
            return nearestPath;
        }
    }
    return path;
}
function isResolvablePath(key, properties) {
    return has(properties, key);
}
function getMatchingParentProto(childProto, matcher) {
    const parentProtos = getPrototypeListOf(childProto);
    for (const evaluatedProto of parentProtos) {
        if (matcher(evaluatedProto)) {
            return evaluatedProto;
        }
    }
    return undefined;
}
function isPatternClass(arg) {
    var _a;
    return ((_a = arg === null || arg === void 0 ? void 0 : arg.prototype) === null || _a === void 0 ? void 0 : _a.getKind) !== undefined;
}
function isPattern(arg) {
    return (arg === null || arg === void 0 ? void 0 : arg.getKind) !== undefined;
}
function isInstanceOfExpectation(arg) {
    return (arg instanceof Class ||
        arg instanceof InstanceOf ||
        arg instanceof Interface ||
        isClass(arg) ||
        isConstructor(arg));
}
function isUtility(arg) {
    return (arg === null || arg === void 0 ? void 0 : arg.generate) !== undefined;
}
function isType(ctor) {
    if (ctor === undefined) {
        return false;
    }
    return Reflect.getOwnMetadata(TYPE_KEY, ctor) || false;
}
function isValidable(ctor) {
    if (Reflect.hasOwnMetadata(VALIDATION_KEY, ctor)) {
        return Reflect.getOwnMetadata(VALIDATION_KEY, ctor);
    }
    return true;
}
function isSpecial(reflectedType) {
    if (reflectedType.kind !== 15) {
        return false;
    }
    const props = reflectedType.properties;
    return (props === null || props === void 0 ? void 0 : props[VALIDATION_TYPE_KEY]) !== undefined;
}
function isPlainRecord(arg) {
    return isPlainObject(arg) || arg instanceof Collection;
}
function isPlainObjectFast(obj) {
    if (obj === null || typeof obj !== 'object')
        return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
}

class Collection extends Pattern {
    constructor(properties = {}) {
        super();
        if (!isPlainObjectFast(properties)) {
            throw new InvalidTypeError(`Collection properties are invalid. Expected properties to be a plain object, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
}
Collection.kind = KINDS$1.OBJECT;

class Class extends Pattern {
    constructor(type, properties) {
        super();
        if (!isClass(type)) {
            throw new InvalidTypeError(`Class type is invalid. Expected type to be a class constructor, got ${this.describe(properties)}`);
        }
        if (!isPlainObjectFast(properties) && !(properties instanceof Collection)) {
            throw new InvalidDefinitionError(`Class properties are invalid. Expected properties to be a plain object or Collection instance describing class properties, got ${this.describe(properties)}`);
        }
        this.type = type;
        this.properties = properties;
    }
}
Class.kind = KINDS$1.CLASS;

class CollectionIncluding extends Pattern {
    constructor(properties) {
        super();
        if (!isPlainObjectFast(properties)) {
            throw new InvalidTypeError(`CollectionIncluding properties are invalid. Expected properties to be a plain object, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
}
CollectionIncluding.kind = KINDS$1.OBJECT_INCLUDING;

class CollectionWithin extends Pattern {
    constructor(properties) {
        super();
        if (!isPlainObjectFast(properties)) {
            throw new InvalidDefinitionError(`CollectionWithin properties is invalid. Expected properties to be a plain object, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
}
CollectionWithin.kind = KINDS$1.OBJECT_WITHIN;

class Equals extends WrapperPattern {
    onValidation(expectation) {
        if (isArray(expectation) || isPlainObjectFast(expectation)) {
            throw new InvalidTypeError(`Equality pattern expectation is invalid. Expected expectation to not be an plain object nor an array, got ${Pattern.describer.describe(expectation)}`);
        }
        return true;
    }
}
Equals.kind = KINDS$1.EQUALS;

class Integer extends Pattern {
}
Integer.kind = KINDS$1.INTEGER;

class Internal extends WrapperPattern {
}
Internal.kind = KINDS$1.INTERNAL;

class List extends WrapperPattern {
    onValidation(...expectations) {
        if (expectations.length > 1 && expectations[0] !== Array) {
            throw new InvalidDefinitionError(`List expectation is invalid. Expected expectation to have maximum of one argument, got ${Pattern.describer.describe(expectations)}`);
        }
        return true;
    }
}
List.kind = KINDS$1.ARRAY;

class LocaleString extends Pattern {
}
LocaleString.kind = KINDS$1.LOCALE_STRING;

class Maybe extends WrapperPattern {
}
Maybe.kind = KINDS$1.MAYBE;

class Never extends Pattern {
}
Never.kind = KINDS$1.NEVER;

class OneOf extends WrapperPattern {
    onValidation(...expectations) {
        if (Array.isArray(expectations) && expectations.length < 1) {
            throw new InvalidDefinitionError(`OneOf expectation is invalid. Expectation must include at least one element defined like: <oneOf(String, Number, 'value')>, got ${Pattern.describer.describe(expectations)}`);
        }
        return true;
    }
}
OneOf.kind = KINDS$1.ONE_OF;

class Tuple extends WrapperPattern {
    onValidation(...expectations) {
        if (Array.isArray(expectations) && expectations.length === 0) {
            throw new InvalidDefinitionError(`Tuple expectation is invalid. Expectation must include at least one argument defined like: <tuple(String, Number, 'value')>, got ${Pattern.describer.describe(expectations)}`);
        }
        return true;
    }
}
Tuple.kind = KINDS$1.TUPLE;

class Unknown extends Pattern {
}
Unknown.kind = KINDS$1.UNKNOWN;

class Void extends Pattern {
}
Void.kind = KINDS$1.VOID;

class Where extends WrapperPattern {
    onValidation(expectation) {
        if (!isFunction(expectation) ||
            isNativeType(expectation) ||
            [Symbol].includes(expectation)) {
            throw new InvalidTypeError(`Where expectation is invalid. Expected expectation to be a Function, got ${Pattern.describer.describe(expectation)}`);
        }
        return true;
    }
}
Where.kind = KINDS$1.WHERE;

class Unrecognized extends WrapperPattern {
}
Unrecognized.kind = KINDS$1.UNRECOGNIZED;

class Utility {
    static setDescriber(describer) {
        this.describer = describer;
    }
    static getDescriber() {
        return this.describer;
    }
    describe(value) {
        return this.constructor.getDescriber().describe(value);
    }
}

class PropsOf extends WrapperPattern {
    onValidation(type) {
        if (!isClass(type)) {
            throw new InvalidTypeError(`PropsOf type is invalid. Expected type to be class, got ${Utility.describer.describe(type)}`);
        }
        return true;
    }
    generate(library) {
        const type = this[0];
        const classType = library.converter.convert(type);
        return new Collection({ ...classType.properties });
    }
}

class TypeOf extends WrapperPattern {
    onValidation(type) {
        if (!isClass(type)) {
            throw new InvalidTypeError(`Type is invalid. Expected type to be a class constructor, got ${Utility.describer.describe(type)}`);
        }
        return true;
    }
    generate(library) {
        const type = this[0];
        if (!isType(type)) {
            throw new UndefinableClassError(getTypeName(type));
        }
        if (!isValidable(type)) {
            return new Any();
        }
        return library.converter.convert(type);
    }
}

class PatternValidator {
    static setDescriber(describer) {
        this.describer = describer;
    }
    static getDescriber() {
        return this.describer;
    }
    describe(value) {
        return this.constructor.getDescriber().describe(value);
    }
}

class AnyValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Any;
    }
    validate() {
        return true;
    }
}

class ClassValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Class;
    }
    validate(value, pattern, validator) {
        if (!isClassInstance(value)) {
            throw new InvalidTypeError('Expected %s to be an instance of %s', this.describe(value), getTypeName(pattern.type));
        }
        const properties = pattern.properties;
        const differences = diff(properties, value);
        if (differences === undefined || isEmpty(differences)) {
            return true;
        }
        for (const difference of differences) {
            if (difference === undefined || difference.path === undefined) {
                continue;
            }
            const diffPath = difference.path.join('.');
            const key = getResolvablePath(diffPath, properties);
            if (!isResolvablePath(key, properties)) {
                const stringifiedValue = this.describe(value);
                throw new UnexpectedKeyError(`Unexpected key '%s' in %s`, diffPath, stringifiedValue);
            }
            const valueFromPath = get(value, key);
            const propertiesFromPath = get(properties, key);
            try {
                validator.validate(valueFromPath, propertiesFromPath);
            }
            catch (err) {
                const stringifiedValue = this.describe(value);
                if (err.message.includes('to be a undefined')) {
                    throw new UnexpectedKeyError(`Unexpected key '%s' in %s`, key, stringifiedValue);
                }
                else {
                    throw new err.constructor(`(Key '${key}': ${err.message} in ${stringifiedValue})`);
                }
            }
        }
        if (!(value instanceof pattern.type)) {
            throw new UnmatchedTypeError(`Expected %s to be a instance of %s`, this.describe(value), getTypeName(pattern.type));
        }
        return true;
    }
}

class CollectionIncludingValidator extends PatternValidator {
    canValidate(expectation, isStrict) {
        return (expectation instanceof CollectionIncluding ||
            (!isStrict && isPlainObjectFast(expectation)));
    }
    validate(value, collIncOrExpect, validator) {
        if (!isPlainObjectFast(value)) {
            throw new InvalidTypeError('Expected %s to be an Object', this.describe(value));
        }
        const differences = diff(collIncOrExpect, value);
        if (differences === undefined || isEmpty(differences)) {
            return true;
        }
        for (const difference of differences) {
            if (difference === undefined ||
                difference.kind === 'N' ||
                difference.path === undefined) {
                continue;
            }
            const diffPath = difference.path.join('.');
            const key = getResolvablePath(diffPath, collIncOrExpect);
            const valueFromPath = get(value, key);
            const expectationFromPath = get(collIncOrExpect, key);
            try {
                validator.validate(valueFromPath, expectationFromPath);
            }
            catch (err) {
                if (err.message.includes('Unexpected key') ||
                    err.message.includes('to be a undefined')) {
                    continue;
                }
                else {
                    const stringifiedValue = this.describe(value);
                    throw new err.constructor(`(Key '${key}': ${err.message} in ${stringifiedValue})`);
                }
            }
        }
        return true;
    }
}

class CollectionWithinValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof CollectionWithin;
    }
    validate(value, collectionWithin, validator) {
        if (!isPlainObjectFast(value)) {
            throw new InvalidTypeError('Expected %s to be an Object', this.describe(value));
        }
        const differences = diff(collectionWithin, value);
        if (differences === undefined || isEmpty(differences)) {
            return true;
        }
        for (const difference of differences) {
            if (difference === undefined || difference.path === undefined) {
                continue;
            }
            const diffPath = difference.path.join('.');
            const key = getResolvablePath(diffPath, collectionWithin);
            const valueFromPath = get(value, key);
            const expectationFromPath = get(collectionWithin, key);
            try {
                validator.validate(valueFromPath, expectationFromPath);
            }
            catch (err) {
                if (err.message.includes('Unexpected key') ||
                    err.message.includes('to be a undefined') ||
                    err.message.includes('Expected undefined to be an Object')) {
                    continue;
                }
                else {
                    const stringifiedValue = this.describe(value);
                    throw new err.constructor(`(Key '${key}': ${err.message} in ${stringifiedValue})`);
                }
            }
        }
        return true;
    }
}

class CollectionValidator extends PatternValidator {
    canValidate(expectation, isStrict) {
        return (expectation instanceof Collection ||
            (isStrict === true && isPlainObjectFast(expectation)));
    }
    validate(value, collOrExpected, validator) {
        if (!isClassInstance(value) && !isPlainObjectFast(value)) {
            throw new InvalidTypeError('Expected %s to be an Object', this.describe(value));
        }
        if (isEmpty(collOrExpected)) {
            return true;
        }
        const differences = diff(collOrExpected, value);
        if (differences === undefined || isEmpty(differences)) {
            return true;
        }
        let stringifiedValue;
        const getStringifiedValue = () => {
            if (stringifiedValue === undefined) {
                stringifiedValue = this.describe(value);
            }
            return stringifiedValue;
        };
        for (const difference of differences) {
            if (difference === undefined || difference.path === undefined) {
                continue;
            }
            let diffPath;
            const joinedPath = difference.path.join('.');
            const optionalPath = joinedPath.replace('.0', '');
            if (get(collOrExpected, optionalPath) instanceof Optional) {
                diffPath = optionalPath;
            }
            else {
                diffPath = joinedPath;
            }
            const key = getResolvablePath(diffPath, collOrExpected);
            if (!isResolvablePath(key, collOrExpected)) {
                throw new UnexpectedKeyError(`Unexpected key '%s' in %s`, diffPath, getStringifiedValue());
            }
            const valueFromPath = get(value, key);
            const expectationFromPath = get(collOrExpected, key);
            try {
                validator.validate(valueFromPath, expectationFromPath);
            }
            catch (err) {
                if (err.message.includes('to be a undefined')) {
                    throw new UnexpectedKeyError(`Unexpected key '%s' in %s`, key, getStringifiedValue());
                }
                else {
                    throw new err.constructor(`(Key '${key}': ${err.message} in ${getStringifiedValue()})`);
                }
            }
        }
        return true;
    }
}

class EqualsValidator extends PatternValidator {
    canValidate(expectation) {
        if (expectation instanceof Equals) {
            return true;
        }
        if (isArray(expectation) || isPlainObjectFast(expectation)) {
            return false;
        }
        return true;
    }
    validate(value, equalsOrExpect) {
        if (isArray(value)) {
            throw new InvalidTypeError(`Expected %s to not be an Array`, this.describe(value));
        }
        if (isPlainObjectFast(value)) {
            throw new InvalidTypeError(`Expected %s to not be a plain Object`, this.describe(value));
        }
        const expectation = equalsOrExpect instanceof Equals ? equalsOrExpect[0] : equalsOrExpect;
        if (expectation === value) {
            return true;
        }
        let isValid = false;
        let errorMessage = 'Expected %s to be equal to %s';
        if (value == null) {
            isValid = expectation === value;
        }
        else if (expectation instanceof RegExp) {
            isValid = expectation.test(value);
            errorMessage = 'Expected %s to match %s';
        }
        else if (isErrorInstance(expectation)) {
            isValid =
                expectation.message === value.message &&
                    expectation.constructor === value.constructor;
        }
        else if (isFunction(expectation === null || expectation === void 0 ? void 0 : expectation.isSame)) {
            isValid = expectation.isSame(value);
            errorMessage = `Expected %s to pass %s is same evaluation`;
        }
        else if (isFunction(expectation === null || expectation === void 0 ? void 0 : expectation.equals)) {
            isValid = expectation.equals(value);
            errorMessage = `Expected %s to pass %s equality evaluation`;
        }
        else if (!['string', 'number', 'boolean', 'symbol'].includes(typeof value) &&
            !(value instanceof Map) &&
            !isNativeType(value) &&
            !isNativeType(expectation) &&
            !isErrorInstance(value)) {
            isValid = expectation.valueOf() === value.valueOf();
            errorMessage = `Expected %s value to be equal to %s`;
        }
        if (!isValid) {
            throw new UnequalValueError(errorMessage, this.describe(value), this.describe(expectation));
        }
        return isValid;
    }
}

class InstanceOfValidator extends PatternValidator {
    canValidate(expectation) {
        if (expectation instanceof InstanceOf) {
            return true;
        }
        if (isArray(expectation)) {
            return false;
        }
        return (expectation == null ||
            isClass(expectation) ||
            isConstructor(expectation) ||
            isSinonClockDate(expectation) ||
            [Symbol].includes(expectation));
    }
    validate(value, instanceOfOrExpect) {
        if (isArray(value)) {
            throw new InvalidTypeError(`InstanceOfValidator can't handle Array values, got %s`, this.describe(value));
        }
        const expectation = instanceOfOrExpect instanceof InstanceOf
            ? instanceOfOrExpect[0]
            : instanceOfOrExpect;
        if (value != null && expectation != null && value instanceof expectation) {
            return true;
        }
        let isValid = false;
        if (expectation == null) {
            isValid = value === expectation;
        }
        else if (isSinonClockDate(expectation)) {
            isValid = true;
        }
        else if (isScalarType(expectation)) {
            const valueType = typeof value;
            isValid = valueType === getScalarType(expectation);
        }
        else if (expectation === Symbol) {
            isValid = typeof value === 'symbol';
        }
        if (!isValid) {
            throw new UnmatchedTypeError(`Expected %s to be a %s`, this.describe(value), this.describe(expectation));
        }
        return true;
    }
}
InstanceOfValidator.MAPPINGS = {
    symbol: Symbol,
};

class IntegerValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Integer;
    }
    validate(value) {
        if (!(typeof value === 'number')) {
            throw new InvalidTypeError(`Expected Number, got %s`, this.describe(value));
        }
        if (!Number.isInteger(value)) {
            throw new InvalidValueError(`Expected Integer, got %s`, this.describe(value));
        }
        return true;
    }
}

class InterfaceValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Interface;
    }
    validate(value, pattern, validator) {
        if (!isClassInstance(value) && !isPlainObjectFast(value)) {
            throw new InvalidTypeError('Expected %s to be an Object or class instance', this.describe(value));
        }
        if (isEmpty(pattern)) {
            return true;
        }
        const differences = diff(pattern, value);
        if (differences === undefined || isEmpty(differences)) {
            return true;
        }
        for (const difference of differences) {
            if (difference === undefined ||
                difference.kind === 'N' ||
                difference.path === undefined) {
                continue;
            }
            const diffPath = difference.path.join('.');
            const key = getResolvablePath(diffPath, pattern);
            const valueFromPath = get(value, key);
            const expectationFromPath = get(pattern, key);
            try {
                validator.validate(valueFromPath, expectationFromPath);
            }
            catch (err) {
                if (err.message.includes('Unexpected key') ||
                    err.message.includes('to be a undefined')) {
                    continue;
                }
                else {
                    const stringifiedValue = this.describe(value);
                    throw new err.constructor(`(Key '${key}': ${err.message} in ${stringifiedValue})`);
                }
            }
        }
        return true;
    }
}

class InternalValidator extends AnyValidator {
    canValidate(expectation) {
        return expectation instanceof Internal;
    }
    validate() {
        return true;
    }
}

class ListValidator extends PatternValidator {
    canValidate(expectation) {
        return (expectation instanceof List ||
            expectation === Array ||
            (isArray(expectation) &&
                (expectation.length === 0 || expectation.length === 1)));
    }
    validate(value, listOrExpect, validator) {
        const values = value;
        if (!isArray(values)) {
            throw new InvalidTypeError('Expected %s to be an Array', this.describe(values));
        }
        if (listOrExpect === Array ||
            listOrExpect.length === 0) {
            return true;
        }
        const firstExpectation = listOrExpect[0];
        for (let i = 0; i < values.length; i++) {
            const valueItem = values[i];
            try {
                validator.validate(valueItem, firstExpectation);
            }
            catch (err) {
                if (err.message !== 'Cannot call a class as a function') {
                    throw new err.constructor(`Expected %s to be matching an %s`, this.describe(values), this.describe(listOrExpect));
                }
            }
        }
        return true;
    }
}

class LocaleStringValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof LocaleString;
    }
    validate(value) {
        if (value === undefined || typeof value === 'string') {
            return true;
        }
        throw new ValidationError('Expected value to never be assigned, got %s', this.describe(value));
    }
}

class MaybeValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Maybe;
    }
    validate(value, maybe, validator) {
        if (value == null) {
            return true;
        }
        const expectation = maybe instanceof Maybe ? maybe[0] : maybe;
        return validator.validate(value, expectation);
    }
}

class NeverValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Never;
    }
    validate(value) {
        if (value === undefined) {
            return true;
        }
        throw new ValidationError('Expected value to never be assigned, got %s', this.describe(value));
    }
}

class OneOfValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof OneOf;
    }
    validate(value, oneOf, validator) {
        for (const expectation of oneOf) {
            try {
                if (validator.validate(value, expectation)) {
                    return true;
                }
            }
            catch (err) { }
        }
        let readableDef = this.describe(oneOf);
        if (!isArray(oneOf[0])) {
            readableDef = readableDef
                .replace(/^OneOf\([\d+]\) /, '')
                .replace(/^\[/, '')
                .replace(/\]$/, '')
                .trim();
        }
        throw new NotAMemberError('Expected %s to be one of: %s', this.describe(value), readableDef);
    }
}

class OptionalValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Optional;
    }
    validate(value, optional, validator) {
        if (value === undefined) {
            return true;
        }
        const expectation = optional instanceof Optional ? optional[0] : optional;
        return validator.validate(value, expectation);
    }
}

class TupleValidator extends PatternValidator {
    canValidate(expectation) {
        return (expectation instanceof Tuple ||
            (isArray(expectation) && expectation.length > 0));
    }
    validate(value, tupleOrExpect, validator) {
        if (!isArray(value)) {
            throw new InvalidTypeError('Expected %s to be an Array', this.describe(value));
        }
        let source = tupleOrExpect;
        if (value.length > tupleOrExpect.length) {
            source = value;
        }
        for (let i = 0; i < source.length; i++) {
            const valueElement = value[i];
            const expectationItem = tupleOrExpect[i];
            try {
                validator.validate(valueElement, expectationItem);
            }
            catch (err) {
                if (err.message !== 'Cannot call a class as a function') {
                    throw new NotAMemberError(`Expected %s to be matching an %s`, this.describe(value), this.describe(tupleOrExpect));
                }
            }
        }
        return true;
    }
}

class UnknownValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Unknown;
    }
    validate() {
        return true;
    }
}

class VoidValidator extends PatternValidator {
    canValidate(expectation) {
        return expectation instanceof Void;
    }
    validate(value) {
        if (value === undefined) {
            return true;
        }
        throw new ValidationError('Expected no value, got %s', this.describe(value));
    }
}

class WhereValidator extends PatternValidator {
    canValidate(expectation) {
        return (expectation instanceof Where ||
            (isFunction(expectation) &&
                !isNativeType(expectation) &&
                ![Symbol].includes(expectation)));
    }
    validate(value, whereOrExpect) {
        const expectation = whereOrExpect instanceof Where ? whereOrExpect[0] : whereOrExpect;
        if (!expectation(value)) {
            throw new ValidationError('Failed Where validation');
        }
        return true;
    }
}

class UnrecognizedValidator extends PatternValidator {
    constructor(isValid = false) {
        super();
        this._isValid = isValid;
    }
    canValidate(expectation) {
        return expectation instanceof Unrecognized;
    }
    getDefaultBehavior() {
        return this._isValid;
    }
    validate(value, unrecognized) {
        const expectation = unrecognized instanceof Unrecognized ? unrecognized[0] : unrecognized;
        if (!this._isValid) {
            throw new UnknownError(`Unrecognized expectation %s that cannot handle %s value`, this.describe(expectation), this.describe(value));
        }
        return true;
    }
}

class Description {
    constructor(props) {
        Object.assign(this, props);
    }
    toString() {
        return this.message;
    }
}
class DescriptionList {
    constructor(descriptions = []) {
        this.descriptions = descriptions || [];
    }
    toString() {
        const parts = [];
        for (const description of this.descriptions) {
            parts.push(description.toString());
        }
        return parts.join(', ');
    }
}

class ArrayDescriber {
    describe(arg, describer) {
        const args = this.describeArguments(arg, describer);
        const type = 'Array';
        const message = this.generateMessage(args);
        return new Description({
            value: args,
            type,
            message,
        });
    }
    describeArguments(arg, describer) {
        const readableArgs = [];
        for (const element of arg) {
            const message = describer.describe(element);
            readableArgs.push(message);
        }
        return readableArgs.join(', ');
    }
    generateMessage(args) {
        return `[${args}]`;
    }
}

class ErrorDescriber {
    describe(arg) {
        let errorMessage;
        let type;
        if (isErrorInstance(arg)) {
            errorMessage = `'${arg.message}'`;
            type = getTypeName(arg.constructor);
        }
        else {
            type = getTypeName(arg);
        }
        const message = this.generateMessage(errorMessage, type);
        return new Description({
            value: errorMessage,
            type,
            message,
        });
    }
    generateMessage(value, type) {
        let msg;
        if (type && value) {
            msg = `${type || ''}(${value})`;
        }
        else {
            msg = type;
        }
        return msg;
    }
}

class NativeTypeDescriber {
    describe(arg) {
        const value = this.describeValue(arg);
        const type = this.describeType(arg);
        const message = this.generateMessage(value, type);
        return new Description({
            value,
            type,
            message,
        });
    }
    describeValue(arg) {
        let readableValue;
        if (arg instanceof RegExp) {
            readableValue = arg.toString();
        }
        else {
            readableValue = JSON.stringify(arg);
        }
        return readableValue;
    }
    describeType(arg) {
        let type;
        if (arg === undefined) {
            type = 'undefined';
        }
        else if (arg === null) {
            type = 'null';
        }
        else if (arg instanceof RegExp) {
            type = 'RegExp';
        }
        else if (arg instanceof Array) {
            type = 'Array';
        }
        else if (arg instanceof Date) {
            type = 'Date';
        }
        else {
            type = getNativeType(arg).name;
        }
        return type;
    }
    generateMessage(value, type) {
        let msg;
        if (!['undefined', 'null'].includes(type) && type && value) {
            msg = `${type || ''}(${value})`;
        }
        else {
            msg = type;
        }
        return msg;
    }
}

class ObjectDescriber {
    describe(arg, describer) {
        const properties = this.describeProperties(arg, describer);
        const type = 'Object';
        const message = this.generateMessage(properties);
        return new Description({
            value: properties,
            type,
            message,
        });
    }
    describeProperties(arg, describer) {
        const values = [];
        for (const [k, v] of Object.entries(arg)) {
            const message = describer.describe(v);
            values.push(`"${k}":${message}`);
        }
        return values.join(', ');
    }
    generateMessage(properties) {
        return `{${properties}}`;
    }
}

class CompactDescriber {
    constructor(options = { compact: true, colors: false }) {
        this.options = options;
    }
    describe(arg) {
        const message = inspect(arg, this.options);
        return new Description({
            message,
        });
    }
}

class ClassDescriber {
    describe(arg) {
        const properties = this.describeProperties(arg);
        const type = this.describeType(arg);
        const message = this.generateMessage(properties, type);
        return new Description({
            value: properties,
            type,
            message,
        });
    }
    describeProperties(arg) {
        return JSON.stringify(arg);
    }
    describeType(arg) {
        if (isClass(arg)) {
            return getTypeName(arg);
        }
        return getTypeName(arg.constructor);
    }
    generateMessage(properties, type) {
        let msg;
        if (type && properties) {
            msg = `${type || ''}(${properties})`;
        }
        else {
            msg = type;
        }
        return msg;
    }
}

class FallbackDescriber {
    describe(arg) {
        const value = this.describeValue(arg);
        const type = this.describeType(arg);
        const message = this.generateMessage(value, type);
        return new Description({
            value,
            type,
            message,
        });
    }
    describeValue(arg) {
        return JSON.stringify(arg);
    }
    describeType(arg) {
        return capitalize(typeof arg);
    }
    generateMessage(value, type) {
        let msg;
        if (type && value) {
            msg = `${type || ''}(${value})`;
        }
        else {
            msg = type;
        }
        return msg;
    }
}

class DescriptionListDescriber {
    describe(arg) {
        const value = arg.toString();
        const type = 'DescriptionList';
        const message = `[${arg.toString()}]`;
        return new Description({
            value,
            type,
            message,
        });
    }
}

class DebugDescriber {
    constructor(options = { compact: false, colors: true }) {
        this.options = options;
    }
    describe(arg) {
        const message = inspect(arg, this.options);
        return new Description({
            message,
        });
    }
}

var TypeKind$1;
(function (TypeKind) {
    TypeKind[TypeKind["Any"] = 1] = "Any";
    TypeKind[TypeKind["String"] = 2] = "String";
    TypeKind[TypeKind["Number"] = 3] = "Number";
    TypeKind[TypeKind["Boolean"] = 4] = "Boolean";
    TypeKind[TypeKind["StringLiteral"] = 5] = "StringLiteral";
    TypeKind[TypeKind["NumberLiteral"] = 6] = "NumberLiteral";
    TypeKind[TypeKind["FalseLiteral"] = 7] = "FalseLiteral";
    TypeKind[TypeKind["TrueLiteral"] = 8] = "TrueLiteral";
    TypeKind[TypeKind["EnumLiteral"] = 9] = "EnumLiteral";
    TypeKind[TypeKind["ESSymbol"] = 10] = "ESSymbol";
    TypeKind[TypeKind["Void"] = 11] = "Void";
    TypeKind[TypeKind["Undefined"] = 12] = "Undefined";
    TypeKind[TypeKind["Null"] = 13] = "Null";
    TypeKind[TypeKind["Never"] = 14] = "Never";
    TypeKind[TypeKind["Object"] = 15] = "Object";
    TypeKind[TypeKind["Tuple"] = 16] = "Tuple";
    TypeKind[TypeKind["Union"] = 17] = "Union";
    TypeKind[TypeKind["Reference"] = 18] = "Reference";
    TypeKind[TypeKind["Class"] = 19] = "Class";
    TypeKind[TypeKind["Unknown"] = 20] = "Unknown";
    TypeKind[TypeKind["Function"] = 21] = "Function";
    TypeKind[TypeKind["Unknown2"] = 999] = "Unknown2";
    TypeKind[TypeKind["Array"] = 1000] = "Array";
})(TypeKind$1 || (TypeKind$1 = {}));

class PropsOfConverter {
    isConvertible(reflectedType, converter) {
        if (reflectedType.kind !== 15) {
            return false;
        }
        const validationType = get(reflectedType, `properties.${VALIDATION_TYPE_KEY.toString()}`);
        if ((validationType === null || validationType === void 0 ? void 0 : validationType.value) !== KINDS$1.PROPERTIES_OF) {
            return false;
        }
        const validationPayload = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(TypeKind$1.Class);
        return classConverter.isConvertible(validationPayload, converter);
    }
    convert(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(TypeKind$1.Class);
        const classType = classConverter.convert(nestedReflectedType, converter);
        const properties = classType !== undefined ? classType.properties : {};
        return new Collection({ ...properties });
    }
    reflect(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(TypeKind$1.Class);
        return classConverter.reflect(nestedReflectedType, converter);
    }
}

var publicTypes = {};

Object.defineProperty(publicTypes, "__esModule", { value: true });
var TypeKind_1 = publicTypes.TypeKind = publicTypes.ModifierFlags = void 0;
var ModifierFlags;
(function (ModifierFlags) {
    ModifierFlags[ModifierFlags["None"] = 0] = "None";
    ModifierFlags[ModifierFlags["Public"] = 1] = "Public";
    ModifierFlags[ModifierFlags["Private"] = 2] = "Private";
    ModifierFlags[ModifierFlags["Protected"] = 4] = "Protected";
    ModifierFlags[ModifierFlags["Readonly"] = 8] = "Readonly";
    ModifierFlags[ModifierFlags["Override"] = 16] = "Override";
    ModifierFlags[ModifierFlags["Export"] = 32] = "Export";
    ModifierFlags[ModifierFlags["Abstract"] = 64] = "Abstract";
    ModifierFlags[ModifierFlags["Ambient"] = 128] = "Ambient";
    ModifierFlags[ModifierFlags["Static"] = 256] = "Static";
    ModifierFlags[ModifierFlags["Accessor"] = 512] = "Accessor";
    ModifierFlags[ModifierFlags["Async"] = 1024] = "Async";
    ModifierFlags[ModifierFlags["Default"] = 2048] = "Default";
    ModifierFlags[ModifierFlags["Const"] = 4096] = "Const";
    ModifierFlags[ModifierFlags["In"] = 8192] = "In";
    ModifierFlags[ModifierFlags["Out"] = 16384] = "Out";
    ModifierFlags[ModifierFlags["Decorator"] = 32768] = "Decorator";
    ModifierFlags[ModifierFlags["Deprecated"] = 65536] = "Deprecated";
    ModifierFlags[ModifierFlags["HasComputedJSDocModifiers"] = 268435456] = "HasComputedJSDocModifiers";
    ModifierFlags[ModifierFlags["HasComputedFlags"] = 536870912] = "HasComputedFlags";
    ModifierFlags[ModifierFlags["AccessibilityModifier"] = 7] = "AccessibilityModifier";
    ModifierFlags[ModifierFlags["ParameterPropertyModifier"] = 31] = "ParameterPropertyModifier";
    ModifierFlags[ModifierFlags["NonPublicAccessibilityModifier"] = 6] = "NonPublicAccessibilityModifier";
    ModifierFlags[ModifierFlags["TypeScriptModifier"] = 28895] = "TypeScriptModifier";
    ModifierFlags[ModifierFlags["ExportDefault"] = 2080] = "ExportDefault";
    ModifierFlags[ModifierFlags["All"] = 131071] = "All";
    ModifierFlags[ModifierFlags["Modifier"] = 98303] = "Modifier";
})(ModifierFlags || (publicTypes.ModifierFlags = ModifierFlags = {}));
var TypeKind;
(function (TypeKind) {
    TypeKind[TypeKind["Any"] = 1] = "Any";
    TypeKind[TypeKind["String"] = 2] = "String";
    TypeKind[TypeKind["Number"] = 3] = "Number";
    TypeKind[TypeKind["Boolean"] = 4] = "Boolean";
    TypeKind[TypeKind["StringLiteral"] = 5] = "StringLiteral";
    TypeKind[TypeKind["NumberLiteral"] = 6] = "NumberLiteral";
    TypeKind[TypeKind["FalseLiteral"] = 7] = "FalseLiteral";
    TypeKind[TypeKind["TrueLiteral"] = 8] = "TrueLiteral";
    TypeKind[TypeKind["EnumLiteral"] = 9] = "EnumLiteral";
    TypeKind[TypeKind["ESSymbol"] = 10] = "ESSymbol";
    TypeKind[TypeKind["Void"] = 11] = "Void";
    TypeKind[TypeKind["Undefined"] = 12] = "Undefined";
    TypeKind[TypeKind["Null"] = 13] = "Null";
    TypeKind[TypeKind["Never"] = 14] = "Never";
    TypeKind[TypeKind["Object"] = 15] = "Object";
    TypeKind[TypeKind["Tuple"] = 16] = "Tuple";
    TypeKind[TypeKind["Union"] = 17] = "Union";
    TypeKind[TypeKind["Reference"] = 18] = "Reference";
    TypeKind[TypeKind["Class"] = 19] = "Class";
    TypeKind[TypeKind["Unknown"] = 20] = "Unknown";
    TypeKind[TypeKind["Function"] = 21] = "Function";
    TypeKind[TypeKind["Unknown2"] = 999] = "Unknown2";
})(TypeKind || (TypeKind_1 = publicTypes.TypeKind = TypeKind = {}));

class TypeOfConverter {
    isConvertible(reflectedType, converter) {
        if (reflectedType.kind !== 15) {
            return false;
        }
        const validationType = get(reflectedType, `properties.${VALIDATION_TYPE_KEY.toString()}`);
        const validationPayload = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(TypeKind_1.Class);
        return ((validationType === null || validationType === void 0 ? void 0 : validationType.value) === KINDS$1.TYPE_OF &&
            classConverter.isConvertible(validationPayload, converter));
    }
    convert(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(TypeKind_1.Class);
        const classType = classConverter.convert(nestedReflectedType, converter);
        return classType;
    }
    reflect(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(TypeKind_1.Class);
        return classConverter.reflect(nestedReflectedType, converter);
    }
}

class CompositeTypeConverter {
    constructor(converters = []) {
        this.converters = [];
        this.converters = [...converters];
        this.sortByPriority();
    }
    isConvertible(reflectedType) {
        return reflectedType.kind === 15;
    }
    add(converter, atIndex) {
        if (atIndex !== undefined) {
            this.converters.splice(atIndex, 0, converter);
        }
        else {
            this.converters.push(converter);
        }
        this.sortByPriority();
    }
    remove(converter) {
        const index = this.converters.indexOf(converter);
        if (index > -1) {
            this.converters.splice(index, 1);
            return true;
        }
        return false;
    }
    removeAt(index) {
        if (index >= 0 && index < this.converters.length) {
            return this.converters.splice(index, 1)[0];
        }
        return undefined;
    }
    sortByPriority() {
        this.converters.sort((a, b) => {
            var _a, _b;
            const priorityA = (_a = a.priority) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
            const priorityB = (_b = b.priority) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
            return priorityA - priorityB;
        });
    }
    convert(reflectedType, converter) {
        const applicableConverter = this.findApplicableConverter(reflectedType, converter);
        if (!applicableConverter) {
            throw new Error(`No applicable converter found for type: ${JSON.stringify(reflectedType)}`);
        }
        return applicableConverter.convert(reflectedType, converter);
    }
    reflect(reflectedType, converter) {
        const applicableConverter = this.findApplicableConverter(reflectedType, converter);
        if (!applicableConverter) {
            throw new Error(`No applicable converter found for type: ${JSON.stringify(reflectedType)}`);
        }
        return applicableConverter.reflect(reflectedType, converter);
    }
    findApplicableConverter(reflectedType, tsRuntimeConverter) {
        const result = this.converters.find((converter) => {
            if (converter.isConvertible) {
                return converter.isConvertible(reflectedType, tsRuntimeConverter);
            }
            return true;
        });
        if (result === undefined) {
            return last(this.converters);
        }
        return result;
    }
    getConverters() {
        return [...this.converters];
    }
    size() {
        return this.converters.length;
    }
}

class ObjectConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind$1.Object;
    }
    convert(reflectedType, converter) {
        const properties = this.resolveProperties(reflectedType, converter, true);
        let pattern;
        if (this.isInterface(reflectedType)) {
            const intf = new Interface(properties);
            intf.setName(reflectedType.name);
            pattern = intf;
        }
        else {
            pattern = new Collection(properties);
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        return this.resolveProperties(reflectedType, converter, false);
    }
    resolveProperties(reflectedType, converter, isConverting) {
        const props = {};
        for (const key of Reflect.ownKeys(reflectedType.properties)) {
            const reflectedProp = reflectedType.properties[key];
            if (!isPlainObjectFast(reflectedProp))
                continue;
            if (reflectedProp.kind === TypeKind$1.Reference) {
                const reflectedRefType = reflectedProp;
                let expectation;
                if (isConverting) {
                    if (reflectedRefType.type === Array && reflectedRefType.arguments) {
                        expectation = converter
                            .getConverter(TypeKind$1.Array)
                            .convert(reflectedProp, converter);
                    }
                    else if (isPatternClass(reflectedProp.type)) {
                        expectation = reflectedProp.type;
                    }
                    else if (isClass(reflectedRefType.type) === false &&
                        isPlainObjectFast(reflectedRefType.type) === true) {
                        expectation = new Collection(reflectedRefType.type);
                    }
                    else {
                        expectation = new InstanceOf(reflectedRefType.type);
                    }
                }
                else if (reflectedRefType.type === Array &&
                    reflectedRefType.arguments) {
                    const expectations = [];
                    for (const argument of reflectedRefType.arguments) {
                        if (argument.kind === TypeKind$1.Reference) {
                            expectations.push(argument.type);
                        }
                        else {
                            expectations.push(converter.reflect(argument));
                        }
                    }
                    expectation = expectations;
                }
                else {
                    expectation = reflectedRefType.type;
                }
                props[key] = expectation;
                continue;
            }
            props[key] = isConverting
                ? converter.convert(reflectedProp)
                : converter.reflect(reflectedProp);
        }
        return props;
    }
    isInterface(reflectedType) {
        return (reflectedType.kind === TypeKind$1.Object &&
            reflectedType.name !== undefined &&
            reflectedType.name !== '__type');
    }
}

class AnyConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Any;
    }
    convert(reflectedType) {
        return new Any();
    }
    reflect(reflectedType) {
        return new Any();
    }
}

class StringConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.String;
    }
    convert(reflectedType) {
        return new InstanceOf(String);
    }
    reflect(reflectedType) {
        return String;
    }
}

class NumberConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Number;
    }
    convert(reflectedType) {
        return new InstanceOf(Number);
    }
    reflect(reflectedType) {
        return Number;
    }
}

class BooleanConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Boolean;
    }
    convert(reflectedType) {
        return new InstanceOf(Boolean);
    }
    reflect(reflectedType) {
        return Boolean;
    }
}

class StringLiteralConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.StringLiteral;
    }
    convert(reflectedType) {
        return new Equals(reflectedType.value);
    }
    reflect(reflectedType) {
        return reflectedType.value;
    }
}

class NumberLiteralConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.NumberLiteral;
    }
    convert(reflectedType) {
        return new Equals(reflectedType.value);
    }
    reflect(reflectedType) {
        return reflectedType.value;
    }
}

class FalseLiteralConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.FalseLiteral;
    }
    convert(reflectedType) {
        return new Equals(false);
    }
    reflect(reflectedType) {
        return false;
    }
}

class TrueLiteralConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.TrueLiteral;
    }
    convert(reflectedType) {
        return new Equals(true);
    }
    reflect(reflectedType) {
        return true;
    }
}

class EnumLiteralConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.EnumLiteral;
    }
    convert(reflectedType) {
        return new Equals(reflectedType.value);
    }
    reflect(reflectedType) {
        return reflectedType.value;
    }
}

class ESSymbolConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.ESSymbol;
    }
    convert(reflectedType) {
        return new InstanceOf(Symbol);
    }
    reflect(reflectedType) {
        return Symbol;
    }
}

class VoidConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Void;
    }
    convert(reflectedType) {
        return new Void();
    }
    reflect(reflectedType) {
        return new Void();
    }
}

class NullConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Null;
    }
    convert(reflectedType) {
        return null;
    }
    reflect(reflectedType) {
        return null;
    }
}

class UndefinedConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Undefined;
    }
    convert(reflectedType) {
        return undefined;
    }
    reflect(reflectedType) {
        return undefined;
    }
}

class NeverConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Never;
    }
    convert(reflectedType) {
        return new Never();
    }
    reflect(reflectedType) {
        return new Never();
    }
}

class TupleConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Tuple;
    }
    convert(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType
            .elementTypes) {
            if (arg.kind === TypeKind_1.Reference) {
                expectations.push(new InstanceOf(arg.type));
            }
            else {
                expectations.push(converter.convert(arg));
            }
        }
        return new Tuple(...expectations);
    }
    reflect(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType
            .elementTypes) {
            if (arg.kind === TypeKind_1.Reference) {
                expectations.push(arg.type);
            }
            else {
                expectations.push(converter.reflect(arg));
            }
        }
        return expectations;
    }
}

class UnionConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind_1.Union;
    }
    convert(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType.types) {
            if (arg.kind === TypeKind_1.Reference) {
                if (arg.type !== Array) {
                    expectations.push(new InstanceOf(arg.type));
                }
                else {
                    for (const argument of arg.arguments) {
                        expectations.push(new List(converter.convert(argument)));
                    }
                }
            }
            else {
                expectations.push(converter.convert(arg));
            }
        }
        let pattern;
        if (expectations.length === 2 && expectations.includes(undefined)) {
            const expectation = expectations[0] !== undefined ? expectations[0] : expectations[1];
            pattern = new Optional(expectation);
        }
        else {
            pattern = new OneOf(...expectations);
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType.types) {
            if (arg.kind === TypeKind_1.Reference) {
                expectations.push(arg.type);
            }
            else {
                expectations.push(converter.reflect(arg));
            }
        }
        return expectations.sort();
    }
}

class ReferenceConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === TypeKind$1.Reference;
    }
    convert(reflectedType, converter) {
        if (converter.getConverter(TypeKind$1.Array).isConvertible(reflectedType)) {
            return converter
                .getConverter(TypeKind$1.Array)
                .convert(reflectedType, converter);
        }
        if (converter.getConverter(TypeKind$1.Class).isConvertible(reflectedType)) {
            return converter
                .getConverter(TypeKind$1.Class)
                .convert(reflectedType, converter);
        }
        if (reflectedType.type === Array && reflectedType.arguments) {
            const expectations = [];
            for (const argument of reflectedType.arguments) {
                if (argument.kind === TypeKind$1.Reference) {
                    expectations.push(new InstanceOf(argument.type));
                }
                else {
                    expectations.push(converter.convert(argument));
                }
            }
            return new List(...expectations);
        }
        if (isPlainObjectFast(reflectedType.type)) {
            return new Collection(reflectedType.type);
        }
        return new InstanceOf(reflectedType.type);
    }
    reflect(reflectedType, converter) {
        if (converter.getConverter(TypeKind$1.Array).isConvertible(reflectedType)) {
            return converter
                .getConverter(TypeKind$1.Array)
                .reflect(reflectedType, converter);
        }
        if (converter.getConverter(TypeKind$1.Class).isConvertible(reflectedType)) {
            return converter
                .getConverter(TypeKind$1.Class)
                .reflect(reflectedType, converter);
        }
        if (reflectedType.type === Array && reflectedType.arguments) {
            const expectations = [];
            for (const arg of reflectedType.arguments) {
                if (arg.kind === TypeKind$1.Reference) {
                    expectations.push(arg.type);
                }
                else {
                    expectations.push(converter.reflect(arg));
                }
            }
            return expectations;
        }
        if (isPlainObjectFast(reflectedType.type)) {
            return reflectedType.type;
        }
        return reflectedType.type;
    }
}

class ClassConverter {
    constructor(transformers) {
        this.transformers = transformers || new Map();
    }
    isConvertible(reflectedTypeOrClass) {
        return (this.isReflectedReference(reflectedTypeOrClass) ||
            this.isReflectedClass(reflectedTypeOrClass) ||
            isClass(reflectedTypeOrClass));
    }
    convert(reflectedType, converter) {
        const type = this.resolveType(reflectedType);
        if (isPatternClass(type)) {
            return type;
        }
        let properties;
        const cacheKey = this.getClassSpecificCacheKey(type, true);
        const cachedProperties = Reflect.getOwnMetadata(cacheKey, type);
        if (cachedProperties !== undefined) {
            properties = cachedProperties;
        }
        else {
            properties = this.resolveProperties(type, converter, true);
            Reflect.defineMetadata(cacheKey, properties, type);
        }
        const classType = new Class(type, properties);
        const transformedClassType = this.transformType(classType);
        const transformedProps = transformedClassType.properties;
        this.cacheProperties(type, transformedProps, true);
        return transformedClassType;
    }
    reflect(reflectedType, converter) {
        const type = this.resolveType(reflectedType);
        let properties;
        const cacheKey = this.getClassSpecificCacheKey(type, false);
        const cachedProperties = Reflect.getOwnMetadata(cacheKey, type);
        if (cachedProperties !== undefined) {
            properties = cachedProperties;
        }
        else {
            properties = this.resolveProperties(type, converter, false);
            Reflect.defineMetadata(cacheKey, properties, type);
        }
        const transformedClassType = this.transformType(new Class(type, properties));
        const transformedProps = transformedClassType.properties;
        this.cacheProperties(type, transformedProps, false);
        return transformedProps;
    }
    resolveProperties(type, converter, isConverted) {
        const storedReflectedType = Reflect.getMetadata(REFLECTED_TYPE_PROPS_KEY, type);
        let reflectedClass;
        if (storedReflectedType !== undefined) {
            reflectedClass = storedReflectedType;
        }
        else {
            reflectedClass = this.reflectClassType(type);
        }
        const parentProperties = this.resolveParentProperties(type, converter, isConverted);
        const objConverter = converter.getConverter(TypeKind$1.Object);
        const classProperties = isConverted
            ? objConverter.convert(reflectedClass, converter)
            : objConverter.reflect(reflectedClass, converter);
        const properties = merge(parentProperties, classProperties, {
            isMergeableObject: isPlainRecord,
        });
        const finalProperties = isConverted
            ? new Collection(properties)
            : properties;
        return finalProperties;
    }
    getClassSpecificCacheKey(type, isConverted) {
        const baseKey = isConverted
            ? CONVERTED_TYPE_PROPS_KEY
            : REFLECTED_TYPE_PROPS_KEY;
        const className = type.name || 'Anonymous';
        return `${baseKey}_${className}_${type.toString().slice(0, 50)}`;
    }
    resolveType(reflectedType) {
        return isClass(reflectedType)
            ? reflectedType
            : reflectedType.type;
    }
    isCached(type, isConverted) {
        return Reflect.hasOwnMetadata(this.getCacheMetadataKey(isConverted), type);
    }
    resolveCached(type, isConverted) {
        return Reflect.getOwnMetadata(this.getCacheMetadataKey(isConverted), type);
    }
    reflectClassType(type) {
        const reflectedClass = getClassType(type);
        if (reflectedClass === undefined) {
            throw new UndefinableClassError(getTypeName(type));
        }
        return reflectedClass;
    }
    isReflectedReference(reflectedType) {
        if ((reflectedType === null || reflectedType === void 0 ? void 0 : reflectedType.kind) !== 18) {
            return false;
        }
        const referenceType = reflectedType;
        return referenceType.type !== undefined && isClass(referenceType.type);
    }
    isReflectedClass(reflectedType) {
        return (reflectedType === null || reflectedType === void 0 ? void 0 : reflectedType.kind) === 19;
    }
    resolveParentProperties(type, converter, isConverted) {
        const matcher = (evaluatedProto) => isType(evaluatedProto.constructor);
        const parentProto = getMatchingParentProto(type.prototype, matcher);
        if (parentProto === undefined) {
            return {};
        }
        const parentCtor = parentProto.constructor;
        const parentProperties = isConverted
            ? this.convert(parentCtor, converter)
            : this.reflect(parentCtor, converter);
        if (parentProperties instanceof Class) {
            return parentProperties.properties;
        }
        return parentProperties;
    }
    transformType(classType) {
        let transformedClassType = classType;
        for (const transformer of this.transformers.values()) {
            if (transformer.canTransform(transformedClassType)) {
                transformedClassType = transformer.transform(transformedClassType);
            }
        }
        return transformedClassType;
    }
    cacheProperties(type, properties, isConverted) {
        Reflect.defineMetadata(this.getCacheMetadataKey(isConverted), properties, type);
    }
    getCacheMetadataKey(isConverted) {
        return isConverted ? PROPERTIES_KEY : REFLECTION_KEY;
    }
}

class UnknownConverter {
    isConvertible(reflectedType) {
        return (reflectedType.kind === TypeKind_1.Unknown ||
            reflectedType.kind === TypeKind_1.Unknown2);
    }
    convert(reflectedType) {
        return new Unknown();
    }
    reflect(reflectedType) {
        return new Unknown();
    }
}

class FunctionConverter {
    isConvertible(reflectedType) {
        if (reflectedType.kind === TypeKind_1.Function) {
            return true;
        }
        const referenceType = reflectedType;
        return referenceType.type === Function && !isClass(referenceType.type);
    }
    convert(reflectedType) {
        return new InstanceOf(Function);
    }
    reflect(reflectedType) {
        return Function;
    }
}

class ArrayConverter {
    isConvertible(reflectedType) {
        return (reflectedType.kind === 18 &&
            reflectedType.type === Array);
    }
    convert(reflectedType, converter) {
        const expectations = [];
        for (const argument of reflectedType
            .arguments) {
            const classConverter = converter.getConverter(TypeKind$1.Class);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(argument)) {
                expectations.push(new InstanceOf(argument.type));
            }
            else {
                expectations.push(converter.convert(argument));
            }
        }
        const pattern = new List(...expectations);
        return pattern;
    }
    reflect(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType
            .arguments) {
            const classConverter = converter.getConverter(TypeKind$1.Class);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(arg)) {
                expectations.push(arg.type);
            }
            else {
                expectations.push(converter.reflect(arg));
            }
        }
        return expectations;
    }
}

class TSRuntimeConverter {
    constructor(typeConverters) {
        this.typeConverters = [];
        this.definitionCache = new Map();
        this.patternCache = new Map();
        this.typeConverters = typeConverters || [];
    }
    findConverter(reflectedType) {
        return this.typeConverters[reflectedType.kind];
    }
    convert(reflectedType) {
        const cacheKey = this.createCacheKey(reflectedType);
        const converter = this.findConverter(reflectedType);
        if (converter) {
            const pattern = converter.convert(reflectedType, this);
            this.patternCache.set(cacheKey, pattern);
            return pattern;
        }
        if (isClass(reflectedType)) {
            const classConverter = this.getConverter(TypeKind$1.Class);
            const pattern = classConverter.convert(reflectedType, this);
            this.patternCache.set(cacheKey, pattern);
            return pattern;
        }
        const unknownConverter = this.typeConverters[TypeKind$1.Unknown];
        const pattern = unknownConverter === null || unknownConverter === void 0 ? void 0 : unknownConverter.convert(reflectedType, this);
        if (pattern) {
            this.patternCache.set(cacheKey, pattern);
        }
        return pattern;
    }
    createCacheKey(reflectedType) {
        var _a, _b;
        if (reflectedType.kind === TypeKind$1.Reference) {
            const parts = [
                `kind:${reflectedType.kind}`,
                `type:${((_a = reflectedType.type) === null || _a === void 0 ? void 0 : _a.name) || 'unknown'}`,
                `args:${((_b = reflectedType.arguments) === null || _b === void 0 ? void 0 : _b.length) || 0}`,
            ];
            if (reflectedType.arguments) {
                reflectedType.arguments.forEach((arg, index) => {
                    parts.push(`arg${index}:${this.createCacheKey(arg)}`);
                });
            }
            return parts.join('|');
        }
        return JSON.stringify(reflectedType);
    }
    reflect(reflectedType) {
        const converter = this.findConverter(reflectedType);
        if (converter) {
            return converter.reflect(reflectedType, this);
        }
        const unknownConverter = this.typeConverters[TypeKind$1.Unknown];
        return unknownConverter === null || unknownConverter === void 0 ? void 0 : unknownConverter.reflect(reflectedType, this);
    }
    registerConverter(kind, typeConverter, shouldOverride = false) {
        if (this.hasConverter(kind) && !shouldOverride) {
            throw new TypeConverterExists(kind);
        }
        this.typeConverters[kind] = typeConverter;
    }
    overrideConverter(kind, converter) {
        this.registerConverter(kind, converter, true);
    }
    getConverter(type) {
        if (this.typeConverters[type] === undefined) {
            throw new Error(`Type converter for kind '${type}' is not registered.`);
        }
        return this.typeConverters[type];
    }
    hasConverter(type) {
        return this.typeConverters[type] !== undefined;
    }
    removeConverter(type) {
        this.typeConverters[type] = undefined;
    }
}

class InjectingPropsTransformer {
    canTransform(type) {
        return (type instanceof Class &&
            Reflect.hasOwnMetadata(INJECTABLE_PROPERTIES_KEY, type.type));
    }
    transform(classType) {
        const injectableProps = Reflect.getOwnMetadata(INJECTABLE_PROPERTIES_KEY, classType.type) || {};
        classType.properties = merge(classType.properties, injectableProps, {
            isMergeableObject: isPlainObjectFast,
        });
        return classType;
    }
}

class InternalPropsTransformer {
    canTransform(type) {
        return (type instanceof Class &&
            Reflect.hasOwnMetadata(INTERNAL_PROPS_KEY, type.type));
    }
    transform(classType) {
        const internalKeys = Object.keys(Reflect.getOwnMetadata(INTERNAL_PROPS_KEY, classType.type) || {});
        for (const key of internalKeys) {
            classType.properties[key] = new Internal(classType.properties[key]);
        }
        return classType;
    }
}

class Typend {
    constructor(converter, describer, validator) {
        this.converter = converter;
        this.setDescriber(describer);
        this.validator = validator;
    }
    validate(value, expectation, isStrict = true) {
        return this.validator.validate(value, this.processExpectation(expectation), isStrict);
    }
    isValid(value, expectation, isStrict = true) {
        return this.validator.isValid(value, this.processExpectation(expectation), isStrict);
    }
    isInstanceOf(value, expectation) {
        if (!isInstanceOfExpectation(expectation)) {
            throw new InvalidTypeError(`Provided expectation to instanceOf is invalid. Expected type or interface, got ${this.describer.describe(expectation)}`);
        }
        return this.validator.isInstanceOf(value, this.processExpectation(expectation));
    }
    debug(isDebugging = true) {
        if (this.describer !== undefined) {
            const formatting = isDebugging ? 'debug' : 'default';
            this.describer.setFormatting(formatting);
        }
    }
    setDescriber(describer) {
        this.describer = describer;
        Pattern.setDescriber(describer);
        PatternValidator.setDescriber(describer);
        Utility.setDescriber(describer);
    }
    getDescriber() {
        return this.describer;
    }
    setConverter(converter) {
        this.converter = converter;
    }
    getConverter() {
        return this.converter;
    }
    setValidator(validator) {
        this.validator = validator;
    }
    getValidator() {
        return this.validator;
    }
    processExpectation(expectation) {
        if (isUtility(expectation)) {
            const utility = expectation;
            return utility.generate(this);
        }
        if (isPatternClass(expectation)) {
            const PatternCtor = expectation;
            return new PatternCtor();
        }
        return expectation;
    }
}

class Validator {
    constructor(validators) {
        this.validators = validators || new Map();
        this.order = [];
    }
    validate(value, expectation, isStrict = true) {
        let processedExpectation = expectation;
        if (isPatternClass(expectation)) {
            const PatternCtor = expectation;
            processedExpectation = new PatternCtor();
        }
        let result;
        if (isPattern(processedExpectation)) {
            const validatedValue = value;
            result = this.handleExplicitPattern(validatedValue, processedExpectation);
        }
        if (result === undefined) {
            result = this.handleImplicitExpectation(value, processedExpectation, isStrict);
        }
        if (result === undefined) {
            throw new UnknownError(`Unknown expectation that can't be handled`);
        }
        return result;
    }
    isValid(value, expectation, isStrict = true) {
        try {
            return this.validate(value, expectation, isStrict);
        }
        catch (e) {
            return false;
        }
    }
    isInstanceOf(value, expectation) {
        try {
            return this.validate(value, expectation);
        }
        catch (e) {
            return false;
        }
    }
    registerValidator(kind, validator, shouldOverride = false) {
        if (this.hasValidator(kind) && !shouldOverride) {
            throw new PatternValidatorExistError(kind);
        }
        this.validators.set(kind, validator);
    }
    overrideValidator(kind, validator) {
        this.registerValidator(kind, validator, true);
    }
    getValidator(kind) {
        return this.validators.get(kind);
    }
    getValidatorOrThrow(kind) {
        if (!this.hasValidator(kind)) {
            throw new PatternValidatorNotFoundError(kind);
        }
        return this.validators.get(kind);
    }
    hasValidator(kind) {
        return this.validators.has(kind);
    }
    removeValidator(kind) {
        this.validators.delete(kind);
    }
    getValidators() {
        if (this.order === undefined || this.order.length === 0) {
            return Array.from(this.validators.values());
        }
        const orderedValidators = [];
        for (const kind of this.order) {
            const validator = this.getValidator(kind);
            if (validator !== undefined)
                orderedValidators.push(validator);
        }
        return orderedValidators;
    }
    getAllValidators() {
        return this.validators;
    }
    setValidators(validators) {
        this.validators = validators;
    }
    setOrder(order) {
        this.order = order;
    }
    getOrder() {
        return this.order;
    }
    handleExplicitPattern(value, pattern) {
        const validatorKind = pattern.getKind();
        const validator = this.getValidator(validatorKind);
        if (validator === undefined) {
            throw new PatternValidatorNotFoundError(validatorKind);
        }
        return validator.validate(value, pattern, this);
    }
    handleImplicitExpectation(value, expectation, isStrict) {
        for (const validator of this.getValidators()) {
            if (validator.canValidate(expectation, isStrict)) {
                return validator.validate(value, expectation, this);
            }
        }
        return undefined;
    }
}

class Describer {
    constructor(describers) {
        this.describers = describers || new Map();
    }
    describe(value) {
        const description = this.createDescription(value);
        if (description instanceof DescriptionList) {
            const describer = this.getDescriber(KINDS$1.DESCRIPTION_LIST);
            if (describer === undefined) {
                return `[${description.toString()}]`;
            }
            return describer.describe(description).toString();
        }
        return description.toString();
    }
    createDescription(value) {
        if (isMultidimensionalArray(value)) {
            return this.createDescriptionList(value);
        }
        return this.createIndividualDescription(value);
    }
    createIndividualDescription(arg) {
        let type = KINDS$1.UNKNOWN;
        if (isArray(arg)) {
            type = KINDS$1.ARRAY;
        }
        else if (isPlainObjectFast(arg)) {
            type = KINDS$1.OBJECT;
        }
        else if ((isNativeType(arg) || isNativeTypeInstance(arg)) &&
            !hasTypeName(arg)) {
            type = KINDS$1.NATIVE;
        }
        else if (isErrorClass(arg) || isErrorInstance(arg)) {
            type = KINDS$1.ERROR;
        }
        else if (isClass(arg) || isClassInstance(arg)) {
            type = KINDS$1.CLASS;
        }
        const describer = this.getDescriber(type);
        if (describer === undefined) {
            throw new TypeDescriberNotFoundError(type);
        }
        return describer.describe(arg, this);
    }
    createDescriptionList(values) {
        const descriptions = [];
        for (const value of values) {
            descriptions.push(this.createIndividualDescription(value));
        }
        return new DescriptionList(descriptions);
    }
    registerDescriber(type, describer, shouldOverride = false) {
        if (this.hasDescriber(type) && !shouldOverride) {
            throw new TypeDescriberExistsError(type);
        }
        this.describers.set(type, describer);
    }
    overrideDescriber(type, describer) {
        this.registerDescriber(type, describer, true);
    }
    getDescriber(type) {
        return this.describers.get(type);
    }
    hasDescriber(type) {
        return this.describers.has(type);
    }
    removeDescriber(type) {
        this.describers.delete(type);
    }
    getDescribers() {
        return this.describers;
    }
    setFormatting(formatting) {
        switch (formatting) {
            case 'compact':
                for (const type of Object.keys(Describer.describers)) {
                    this.overrideDescriber(type, new CompactDescriber());
                }
                break;
            case 'debug':
                for (const type of Object.keys(Describer.describers)) {
                    this.overrideDescriber(type, new DebugDescriber());
                }
                break;
            default:
                for (const [type, TypeDescriber] of Object.entries(Describer.describers)) {
                    this.overrideDescriber(type, new TypeDescriber());
                }
                break;
        }
    }
}
Describer.describers = {
    [KINDS$1.NATIVE]: NativeTypeDescriber,
    [KINDS$1.ERROR]: ErrorDescriber,
    [KINDS$1.ARRAY]: ArrayDescriber,
    [KINDS$1.OBJECT]: ObjectDescriber,
    [KINDS$1.CLASS]: ClassDescriber,
    [KINDS$1.UNKNOWN]: FallbackDescriber,
    [KINDS$1.DESCRIPTION_LIST]: DescriptionListDescriber,
};

const defaultOptions = {
    checkName: true,
    checkPrototypeChain: true,
    checkInstantiation: true,
    checkStaticProperties: false,
    checkInstanceMethods: false,
    instantiationArgs: [],
};
function equivalentClassChai(chai, utils) {
    utils.addMethod(chai.Assertion.prototype, 'equivalentClass', function (expected, options = {}) {
        const actual = this._obj;
        const opts = { ...defaultOptions, ...options };
        if (typeof actual !== 'function') {
            throw new Error('Expected actual value to be a constructor function');
        }
        if (typeof expected !== 'function') {
            throw new Error('Expected expected value to be a constructor function');
        }
        const failures = [];
        if (opts.checkName) {
            const nameMatches = actual.name === expected.name;
            if (!nameMatches) {
                failures.push(`names don't match: actual="${actual.name}", expected="${expected.name}"`);
            }
        }
        if (opts.checkPrototypeChain) {
            const actualParentProto = Object.getPrototypeOf(actual.prototype);
            const expectedParentProto = Object.getPrototypeOf(expected.prototype);
            const prototypeMatches = actualParentProto === expectedParentProto;
            if (!prototypeMatches) {
                failures.push("prototype chains don't match");
            }
        }
        if (opts.checkStaticProperties) {
            const actualStaticKeys = Reflect.ownKeys(actual).filter((key) => key !== 'prototype' && key !== 'name' && key !== 'length');
            const expectedStaticKeys = Reflect.ownKeys(expected).filter((key) => key !== 'prototype' && key !== 'name' && key !== 'length');
            const staticPropsMatch = actualStaticKeys.length === expectedStaticKeys.length &&
                actualStaticKeys.every((key) => expectedStaticKeys.includes(key));
            if (!staticPropsMatch) {
                failures.push("static properties don't match");
            }
        }
        if (opts.checkInstanceMethods) {
            const actualMethods = Reflect.ownKeys(actual.prototype).filter((key) => key !== 'constructor');
            const expectedMethods = Reflect.ownKeys(expected.prototype).filter((key) => key !== 'constructor');
            const methodsMatch = actualMethods.length === expectedMethods.length &&
                actualMethods.every((method) => expectedMethods.includes(method));
            if (!methodsMatch) {
                failures.push("instance methods don't match");
            }
        }
        if (opts.checkInstantiation) {
            try {
                const actualInstance = new actual(...(opts.instantiationArgs || []));
                const expectedInstance = new expected(...(opts.instantiationArgs || []));
                const actualInstanceProto = Object.getPrototypeOf(actualInstance);
                const expectedInstanceProto = Object.getPrototypeOf(expectedInstance);
                let instanceBehaviorMatches = false;
                if (actualInstanceProto === expectedInstanceProto) {
                    instanceBehaviorMatches = true;
                }
                else {
                    const actualParent = Object.getPrototypeOf(actualInstanceProto);
                    const expectedParent = Object.getPrototypeOf(expectedInstanceProto);
                    if (actualParent === expectedParent) {
                        instanceBehaviorMatches = true;
                    }
                    else {
                        const actualChain = [];
                        let current = actualInstance;
                        while (current && current.constructor !== Object) {
                            actualChain.push(current.constructor);
                            current = Object.getPrototypeOf(current);
                        }
                        const expectedChain = [];
                        current = expectedInstance;
                        while (current && current.constructor !== Object) {
                            expectedChain.push(current.constructor);
                            current = Object.getPrototypeOf(current);
                        }
                        instanceBehaviorMatches = actualChain.some((ctor) => expectedChain.includes(ctor));
                    }
                }
                if (!instanceBehaviorMatches) {
                    failures.push("instance behavior doesn't match (different prototype chains)");
                }
                try {
                    if (typeof actualInstance !== typeof expectedInstance) {
                        failures.push(`instance types differ: actual=${typeof actualInstance}, expected=${typeof expectedInstance}`);
                    }
                }
                catch (e) {
                }
            }
            catch (actualError) {
                try {
                    new expected(...(opts.instantiationArgs || []));
                    failures.push(`actual constructor throws error: ${actualError.message}`);
                }
                catch (expectedError) {
                    if (actualError.constructor !== expectedError.constructor) {
                        failures.push(`constructors throw different error types: actual=${actualError.constructor.name}, expected=${expectedError.constructor.name}`);
                    }
                }
            }
        }
        const isEquivalent = failures.length === 0;
        const failureMessage = failures.length > 0
            ? `Classes are not equivalent:\n  - ${failures.join('\n  - ')}`
            : '';
        this.assert(isEquivalent, `expected #{this} to be equivalent to #{exp}${failureMessage ? `\n${failureMessage}` : ''}`, `expected #{this} to not be equivalent to #{exp}`, expected, actual);
    });
}

const KINDS = KINDS$1;
const describer = new Describer();
describer.setFormatting('default');
const classTransformers = new Map();
classTransformers.set('internal', new InternalPropsTransformer());
classTransformers.set('inject', new InjectingPropsTransformer());
const converter = new TSRuntimeConverter();
const compositeObjectConverter = new CompositeTypeConverter();
converter.registerConverter(TypeKind$1.Object, compositeObjectConverter);
compositeObjectConverter.add(new PropsOfConverter(), 0);
compositeObjectConverter.add(new TypeOfConverter(), 1);
compositeObjectConverter.add(new ObjectConverter(), 2);
converter.registerConverter(TypeKind$1.Any, new AnyConverter());
converter.registerConverter(TypeKind$1.String, new StringConverter());
converter.registerConverter(TypeKind$1.Number, new NumberConverter());
converter.registerConverter(TypeKind$1.Boolean, new BooleanConverter());
converter.registerConverter(TypeKind$1.StringLiteral, new StringLiteralConverter());
converter.registerConverter(TypeKind$1.NumberLiteral, new NumberLiteralConverter());
converter.registerConverter(TypeKind$1.FalseLiteral, new FalseLiteralConverter());
converter.registerConverter(TypeKind$1.TrueLiteral, new TrueLiteralConverter());
converter.registerConverter(TypeKind$1.EnumLiteral, new EnumLiteralConverter());
converter.registerConverter(TypeKind$1.ESSymbol, new ESSymbolConverter());
converter.registerConverter(TypeKind$1.Void, new VoidConverter());
converter.registerConverter(TypeKind$1.Undefined, new UndefinedConverter());
converter.registerConverter(TypeKind$1.Null, new NullConverter());
converter.registerConverter(TypeKind$1.Never, new NeverConverter());
converter.registerConverter(TypeKind$1.Tuple, new TupleConverter());
converter.registerConverter(TypeKind$1.Union, new UnionConverter());
converter.registerConverter(TypeKind$1.Reference, new ReferenceConverter());
converter.registerConverter(TypeKind$1.Class, new ClassConverter());
converter.registerConverter(TypeKind$1.Unknown, new UnknownConverter());
converter.registerConverter(TypeKind$1.Function, new FunctionConverter());
converter.registerConverter(TypeKind$1.Array, new ArrayConverter());
const validator = new Validator();
validator.registerValidator(KINDS.ANY, new AnyValidator());
validator.registerValidator(KINDS.ARRAY, new ListValidator());
validator.registerValidator(KINDS.CLASS, new ClassValidator());
validator.registerValidator(KINDS.EQUALS, new EqualsValidator());
validator.registerValidator(KINDS.LOCALE_STRING, new LocaleStringValidator());
validator.registerValidator(KINDS.INSTANCE_OF, new InstanceOfValidator());
validator.registerValidator(KINDS.INTEGER, new IntegerValidator());
validator.registerValidator(KINDS.INTERNAL, new InternalValidator());
validator.registerValidator(KINDS.INTERFACE, new InterfaceValidator());
validator.registerValidator(KINDS.MAYBE, new MaybeValidator());
validator.registerValidator(KINDS.NEVER, new NeverValidator());
validator.registerValidator(KINDS.OBJECT, new CollectionValidator());
validator.registerValidator(KINDS.OBJECT_INCLUDING, new CollectionIncludingValidator());
validator.registerValidator(KINDS.OBJECT_WITHIN, new CollectionWithinValidator());
validator.registerValidator(KINDS.ONE_OF, new OneOfValidator());
validator.registerValidator(KINDS.OPTIONAL, new OptionalValidator());
validator.registerValidator(KINDS.TUPLE, new TupleValidator());
validator.registerValidator(KINDS.UNKNOWN, new UnknownValidator());
validator.registerValidator(KINDS.UNRECOGNIZED, new UnrecognizedValidator());
validator.registerValidator(KINDS.VOID, new VoidValidator());
validator.registerValidator(KINDS.WHERE, new WhereValidator());
validator.setOrder([
    KINDS.OBJECT_INCLUDING,
    KINDS.OBJECT,
    KINDS.ARRAY,
    KINDS.TUPLE,
    KINDS.LOCALE_STRING,
    KINDS.INSTANCE_OF,
    KINDS.CLASS,
    KINDS.EQUALS,
]);
const typend = new Typend(converter, describer, validator);
const validate = typend.validate.bind(typend);
const isValid = typend.isValid.bind(typend);
const isInstanceOf = typend.isInstanceOf.bind(typend);
const check = createReflective((reflectedType) => (value, isStrict) => {
    const expectation = typend.converter.convert(reflectedType);
    return typend.validate(value, expectation, isStrict);
});
const is = createReflective((reflectedType) => (value, isStrict) => {
    const expectation = typend.converter.convert(reflectedType);
    return typend.isValid(value, expectation, isStrict);
});
const instanceOf = createReflective((reflectedType) => (value) => {
    const expectation = typend.converter.convert(reflectedType);
    return typend.isInstanceOf(value, expectation);
});
const convert = createReflective((reflectedType) => () => typend.converter.convert(reflectedType));
const reflect = createReflective((reflectedType) => () => typend.converter.reflect(reflectedType));
const any = new Any();
const never = new Never();
const voided = new Void();
const unknown = new Unknown();
const integer = Integer;
function collection(properties) {
    return new Collection(properties);
}
function collectionIncluding(properties) {
    return new CollectionIncluding(properties);
}
function collectionWithin(properties) {
    return new CollectionWithin(properties);
}
function list(...expectations) {
    return new List(...expectations);
}
function maybe(expectation) {
    return new Maybe(expectation);
}
function oneOf(...expectations) {
    return new OneOf(...expectations);
}
function optional(expectation) {
    return new Optional(expectation);
}
function tuple(...expectations) {
    return new Tuple(...expectations);
}
function unrecognized(expectation) {
    return new Unrecognized(expectation);
}
function where(fn) {
    return new Where(fn);
}
function eq(expectation) {
    return new Equals(expectation);
}
function iof(type) {
    return new InstanceOf(type);
}
function propsOf(type) {
    return new PropsOf(type);
}
function typeOf(type) {
    return new TypeOf(type);
}
const string = String;
const number = Number;
const boolean = Boolean;
const symbol = Symbol;
describer.setFormatting('default');
const PropTypes = {
    any,
    array: Array,
    arrayOf: list,
    bool: Boolean,
    func: Function,
    equal: eq,
    instanceOf: iof,
    integer,
    interface(properties) {
        return new Interface(properties);
    },
    maybe,
    never,
    number: Number,
    object: new Collection({}),
    objectOf: (_props) => new Collection(),
    oneOf: (expectations) => new OneOf(...expectations),
    oneOfType: (expectations) => new OneOf(...expectations),
    shape(properties) {
        return new Collection(properties);
    },
    string: String,
    symbol: Symbol,
    tuple,
    void: voided,
    where,
};

export { Any, AnyConverter, AnyValidator, ArrayConverter, ArrayDescriber, BooleanConverter, Class, ClassConverter, ClassDescriber, ClassValidator, Collection, CollectionIncluding, CollectionIncludingValidator, CollectionValidator, CollectionWithin, CollectionWithinValidator, CompactDescriber, DebugDescriber, Describer, Description, DescriptionList, DescriptionListDescriber, ESSymbolConverter, EnumLiteralConverter, Equals, EqualsValidator, ErrorDescriber, FallbackDescriber, FalseLiteralConverter, FunctionConverter, InjectingPropsTransformer, InstanceOf, InstanceOfValidator, Integer, IntegerValidator, Interface, InterfaceValidator, Internal, InternalPropsTransformer, InternalValidator, InvalidDefinitionError, InvalidTypeError, InvalidValueError, literalKeys as LITERAL_KEYS, List, ListValidator, LocaleString, LocaleStringValidator, metadataKeys as METADATA_KEYS, Maybe, MaybeValidator, NativeTypeDescriber, Never, NeverConverter, NeverValidator, NotAMemberError, NullConverter, NumberConverter, NumberLiteralConverter, ObjectDescriber, OneOf, OneOfValidator, Optional, OptionalValidator, Pattern, PatternValidator, PatternValidatorExistError, PatternValidatorNotFoundError, PropTypes, PropsOf, PropsOfConverter, ReferenceConverter, StringConverter, StringLiteralConverter, TSRuntimeConverter, TrueLiteralConverter, Tuple, TupleConverter, TupleValidator, Type, TypeConverterExists, TypeDescriberExistsError, TypeDescriberNotFoundError, TypeOf, TypeOfConverter, Typend, UndefinableClassError, UndefinedConverter, UnequalValueError, UnexpectedKeyError, UnionConverter, Unknown, UnknownConverter, UnknownError, UnknownValidator, UnmatchedTypeError, Unrecognized, UnrecognizedValidator, Validable, ValidationError, Validator, Void, VoidConverter, VoidValidator, Where, WhereValidator, WrapperPattern, any, boolean, check, collection, collectionIncluding, collectionWithin, convert, converter, describer, eq, equivalentClassChai, getMatchingParentProto, getResolvablePath, instanceOf, Integer as integer, internal, iof, is, isInstanceOf, isInstanceOfExpectation, isPattern, isPatternClass, isResolvablePath, isSpecial, isType, isUtility, isValid, isValidable, list, maybe, never, number, oneOf, optional, propsOf, reflect, string, symbol, tuple, typeOf, typend, unknown, unrecognized, validate, validator, voided, where };
