import { createReflective, defineReflectMetadata, getClassType } from 'tsruntime';
import 'reflect-metadata';
import ExtendableError from 'es6-error';
import { format, inspect } from 'util';
import { isPlainObject, isArray, isFunction, has, isEmpty, get, capitalize } from 'lodash';
import { isClass, isConstructor, isSinonClockDate, isNativeType, getTypeName, isClassInstance, isErrorInstance, isScalarType, getScalarType, getNativeType, isMultidimensionalArray, isNativeTypeInstance, hasTypeName, isErrorClass } from '@eveble/helpers';
import { getPrototypeListOf } from 'polytype';
import { diff } from 'deep-diff';
import merge from 'deepmerge';

const DEFINABLE_KEY = Symbol('eveble:flags:definable');
const PROPERTIES_KEY = Symbol('eveble:containers:definition');
const REFLECTION_KEY = Symbol('eveble:containers:reflection');
const INJECTABLE_PROPERTIES_KEY = Symbol('eveble:containers:injectable-definition');
const INTERNAL_PROPS_KEY = Symbol('eveble:containers:internal:props');
const INTERNAL_METHODS_KEY = Symbol('eveble:containers:internal:methods');
const PATTERN_KEY = Symbol('eveble:pattern-kind');
const VALIDATION_KEY = Symbol('eveble:flags:validation');
const INTERFACE_NAME_KEY = Symbol('eveble:interface-name');
const INITIALIZER_KEY = Symbol('eveble:initializer');

var metadataKeys = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DEFINABLE_KEY: DEFINABLE_KEY,
  PROPERTIES_KEY: PROPERTIES_KEY,
  REFLECTION_KEY: REFLECTION_KEY,
  INJECTABLE_PROPERTIES_KEY: INJECTABLE_PROPERTIES_KEY,
  INTERNAL_PROPS_KEY: INTERNAL_PROPS_KEY,
  INTERNAL_METHODS_KEY: INTERNAL_METHODS_KEY,
  PATTERN_KEY: PATTERN_KEY,
  VALIDATION_KEY: VALIDATION_KEY,
  INTERFACE_NAME_KEY: INTERFACE_NAME_KEY,
  INITIALIZER_KEY: INITIALIZER_KEY
});

var KINDS;
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
})(KINDS || (KINDS = {}));
const VALIDATION_TYPE_KEY = '__eveble_validation';
const VALIDATION_PAYLOAD_KEY = '__eveble_payload';
const VALIDATION_TYPE_PROPS_OF_KEY = '__eveble_validation_type_props_of';

var literalKeys = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get KINDS () { return KINDS; },
  VALIDATION_TYPE_KEY: VALIDATION_TYPE_KEY,
  VALIDATION_PAYLOAD_KEY: VALIDATION_PAYLOAD_KEY,
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

function validable(isValidable = true) {
    return (target) => {
        Reflect.defineMetadata(VALIDATION_KEY, isValidable, target);
        return target;
    };
}

function define(...args) {
    function reflectiveFn(reflectedType) {
        return (target) => {
            define.beforeDefine(target, reflectedType, ...args);
            defineReflectMetadata(target, reflectedType);
            Reflect.defineMetadata(DEFINABLE_KEY, true, target);
            define.afterDefine(target, reflectedType, ...args);
            return target;
        };
    }
    const reflect = createReflective(reflectiveFn);
    return reflect;
}
define.beforeDefine = function (target, ...args) {
    return target && args ? undefined : undefined;
};
define.afterDefine = function (target, ...args) {
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
        super(`${typeName}: provided argument must be a class that implements '@define()' decorator`);
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
    setInitializer(initializer) {
        Reflect.defineMetadata(INITIALIZER_KEY, initializer, this);
    }
    hasInitializer() {
        return Reflect.hasOwnMetadata(INITIALIZER_KEY, this);
    }
    getInitializer() {
        return Reflect.getOwnMetadata(INITIALIZER_KEY, this);
    }
}
Optional.kind = KINDS.OPTIONAL;

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
    setInitializer(initializer) {
        Reflect.defineMetadata(INITIALIZER_KEY, initializer, this);
    }
    hasInitializer() {
        return Reflect.hasOwnMetadata(INITIALIZER_KEY, this);
    }
    getInitializer() {
        return Reflect.getOwnMetadata(INITIALIZER_KEY, this);
    }
}
Pattern.kind = '';

class Any extends Pattern {
}
Any.kind = KINDS.ANY;

class Collection extends Pattern {
    constructor(properties = {}) {
        super();
        if (!isPlainObject(properties)) {
            throw new InvalidTypeError(`Collection properties are invalid. Expected properties to be a plain object, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
}
Collection.kind = KINDS.OBJECT;

class Class extends Pattern {
    constructor(type, properties) {
        super();
        if (!isClass(type)) {
            throw new InvalidTypeError(`Class type is invalid. Expected type to be a class constructor, got ${this.describe(properties)}`);
        }
        if (!isPlainObject(properties) && !(properties instanceof Collection)) {
            throw new InvalidDefinitionError(`Class properties are invalid. Expected properties to be a plain object or Collection instance describing class properties, got ${this.describe(properties)}`);
        }
        this.type = type;
        this.properties = properties;
    }
}
Class.kind = KINDS.CLASS;

class CollectionIncluding extends Pattern {
    constructor(properties) {
        super();
        if (!isPlainObject(properties)) {
            throw new InvalidTypeError(`CollectionIncluding properties are invalid. Expected properties to be a plain object, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
}
CollectionIncluding.kind = KINDS.OBJECT_INCLUDING;

class CollectionWithin extends Pattern {
    constructor(properties) {
        super();
        if (!isPlainObject(properties)) {
            throw new InvalidDefinitionError(`CollectionWithin properties is invalid. Expected properties to be a plain object, got ${this.describe(properties)}`);
        }
        Object.assign(this, properties);
    }
}
CollectionWithin.kind = KINDS.OBJECT_WITHIN;

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
    setInitializer(initializer) {
        Reflect.defineMetadata(INITIALIZER_KEY, initializer, this);
    }
    hasInitializer() {
        return Reflect.hasOwnMetadata(INITIALIZER_KEY, this);
    }
    getInitializer() {
        return Reflect.getOwnMetadata(INITIALIZER_KEY, this);
    }
}

class Equals extends WrapperPattern {
    onValidation(expectation) {
        if (isArray(expectation) || isPlainObject(expectation)) {
            throw new InvalidTypeError(`Equality pattern expectation is invalid. Expected expectation to not be an plain object nor an array, got ${Pattern.describer.describe(expectation)}`);
        }
        return true;
    }
}
Equals.kind = KINDS.EQUALS;

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
InstanceOf.kind = KINDS.INSTANCE_OF;

class Integer extends Pattern {
}
Integer.kind = KINDS.INTEGER;

class Interface extends Pattern {
    constructor(properties) {
        super();
        if (!isPlainObject(properties) && !(properties instanceof Collection)) {
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
Interface.kind = KINDS.INTERFACE;

class Internal extends WrapperPattern {
}
Internal.kind = KINDS.INTERNAL;

class List extends WrapperPattern {
    onValidation(...expectations) {
        if (expectations.length > 1 && expectations[0] !== Array) {
            throw new InvalidDefinitionError(`List expectation is invalid. Expected expectation to have maximum of one argument, got ${Pattern.describer.describe(expectations)}`);
        }
        return true;
    }
}
List.kind = KINDS.ARRAY;

class Maybe extends WrapperPattern {
}
Maybe.kind = KINDS.MAYBE;

class Never extends Pattern {
}
Never.kind = KINDS.NEVER;

class OneOf extends WrapperPattern {
    onValidation(...expectations) {
        if (Array.isArray(expectations) && expectations.length < 1) {
            throw new InvalidDefinitionError(`OneOf expectation is invalid. Expectation must include at least one element defined like: <oneOf(String, Number, 'value')>, got ${Pattern.describer.describe(expectations)}`);
        }
        return true;
    }
}
OneOf.kind = KINDS.ONE_OF;

class Tuple extends WrapperPattern {
    onValidation(...expectations) {
        if (Array.isArray(expectations) && expectations.length === 0) {
            throw new InvalidDefinitionError(`Tuple expectation is invalid. Expectation must include at least one argument defined like: <tuple(String, Number, 'value')>, got ${Pattern.describer.describe(expectations)}`);
        }
        return true;
    }
}
Tuple.kind = KINDS.TUPLE;

class Unknown extends Pattern {
}
Unknown.kind = KINDS.UNKNOWN;

class Void extends Pattern {
}
Void.kind = KINDS.VOID;

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
Where.kind = KINDS.WHERE;

class Unrecognized extends WrapperPattern {
}
Unrecognized.kind = KINDS.UNRECOGNIZED;

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
function isDefined(ctor) {
    if (ctor === undefined) {
        return false;
    }
    return Reflect.getOwnMetadata(DEFINABLE_KEY, ctor) || false;
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

class TypeOf extends WrapperPattern {
    onValidation(type) {
        if (!isClass(type)) {
            throw new InvalidTypeError(`Type is invalid. Expected type to be a class constructor, got ${Utility.describer.describe(type)}`);
        }
        return true;
    }
    generate(library) {
        const type = this[0];
        if (!isDefined(type)) {
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
            (!isStrict && isPlainObject(expectation)));
    }
    validate(value, collIncOrExpect, validator) {
        if (!isPlainObject(value)) {
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
                const stringifiedValue = this.describe(value);
                if (err.message.includes('Unexpected key') ||
                    err.message.includes('to be a undefined')) {
                    continue;
                }
                else {
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
        if (!isPlainObject(value)) {
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
                const stringifiedValue = this.describe(value);
                if (err.message.includes('Unexpected key') ||
                    err.message.includes('to be a undefined') ||
                    err.message.includes('Expected undefined to be an Object')) {
                    continue;
                }
                else {
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
            (isStrict === true && isPlainObject(expectation)));
    }
    validate(value, collOrExpect, validator) {
        if (!isClassInstance(value) && !isPlainObject(value)) {
            throw new InvalidTypeError('Expected %s to be an Object', this.describe(value));
        }
        if (isEmpty(collOrExpect)) {
            return true;
        }
        const differences = diff(collOrExpect, value);
        if (differences === undefined || isEmpty(differences)) {
            return true;
        }
        for (const difference of differences) {
            if (difference === undefined || difference.path === undefined) {
                continue;
            }
            let diffPath;
            if (get(collOrExpect, difference.path.join('.').replace('.0', '')) instanceof Optional) {
                diffPath = difference.path.join('.').replace('.0', '');
            }
            else {
                diffPath = difference.path.join('.');
            }
            const key = getResolvablePath(diffPath, collOrExpect);
            if (!isResolvablePath(key, collOrExpect)) {
                const stringifiedValue = this.describe(value);
                throw new UnexpectedKeyError(`Unexpected key '%s' in %s`, diffPath, stringifiedValue);
            }
            const valueFromPath = get(value, key);
            const expectationFromPath = get(collOrExpect, key);
            try {
                validator.validate(valueFromPath, expectationFromPath);
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
        return true;
    }
}

class EqualsValidator extends PatternValidator {
    canValidate(expectation) {
        if (expectation instanceof Equals) {
            return true;
        }
        if (isArray(expectation) || isPlainObject(expectation)) {
            return false;
        }
        return true;
    }
    validate(value, equalsOrExpect) {
        if (isArray(value)) {
            throw new InvalidTypeError(`Expected %s to not be an Array`, this.describe(value));
        }
        if (isPlainObject(value)) {
            throw new InvalidTypeError(`Expected %s to not be a plain Object`, this.describe(value));
        }
        const expectation = equalsOrExpect instanceof Equals ? equalsOrExpect[0] : equalsOrExpect;
        let isValid = false;
        let errorMessage = 'Expected %s to be equal to %s';
        if (expectation === value) {
            return true;
        }
        switch (true) {
            case value == null:
                isValid = expectation === value;
                break;
            case expectation instanceof RegExp:
                isValid = expectation.test(value);
                errorMessage = 'Expected %s to match %s';
                break;
            case isErrorInstance(expectation):
                isValid =
                    expectation.message === value.message &&
                        expectation.constructor === value.constructor;
                break;
            case isFunction(expectation.isSame):
                isValid = expectation.isSame(value);
                errorMessage = `Expected %s to pass %s is same evaluation`;
                break;
            case isFunction(expectation.equals):
                isValid = expectation.equals(value);
                errorMessage = `Expected %s to pass %s equality evaluation`;
                break;
            case !['string', 'number', 'boolean', 'symbol'].includes(typeof value) &&
                !(value instanceof Map) &&
                !isNativeType(value) &&
                !isNativeType(expectation) &&
                !isErrorInstance(value):
                isValid = expectation.valueOf() === value.valueOf();
                errorMessage = `Expected %s value to be equal to %s`;
                break;
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
            isValid = typeof value === getScalarType(expectation);
        }
        else if (Object.values(InstanceOfValidator.MAPPINGS).includes(expectation)) {
            const typeofValue = typeof value;
            isValid = InstanceOfValidator.MAPPINGS[typeofValue] === expectation;
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
        if (!isClassInstance(value) && !isPlainObject(value)) {
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
                const stringifiedValue = this.describe(value);
                if (err.message.includes('Unexpected key') ||
                    err.message.includes('to be a undefined')) {
                    continue;
                }
                else {
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
        if (isArray(values) &&
            (listOrExpect === Array || listOrExpect.length === 0)) {
            return true;
        }
        for (let i = 0; i < values.length; i++) {
            const valueItem = values[i];
            const firstExpectation = listOrExpect[0];
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
        if (value.length !== tupleOrExpect.length) {
            let valueElement;
            let expectationItem;
            if (value.length < tupleOrExpect.length) {
                valueElement = value[value.length];
                expectationItem = tupleOrExpect[value.length];
            }
            if (value.length > tupleOrExpect.length) {
                valueElement = value[tupleOrExpect.length];
                expectationItem = tupleOrExpect[tupleOrExpect.length];
            }
            throw new NotAMemberError(`Expected %s to be matching an %s`, this.describe(valueElement), this.describe(expectationItem));
        }
        for (let i = 0; i < tupleOrExpect.length; i++) {
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

class ArrayConverter {
    isConvertible(reflectedType) {
        return (reflectedType.kind === 18 &&
            reflectedType.type === Array);
    }
    convert(reflectedType, converter) {
        const expectations = [];
        for (const argument of reflectedType
            .arguments) {
            const classConverter = converter.getConverter(KINDS.CLASS);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(argument)) {
                expectations.push(new InstanceOf(argument.type));
            }
            else {
                expectations.push(converter.convert(argument));
            }
        }
        const pattern = new List(...expectations);
        if (reflectedType.initializer) {
            pattern.setInitializer(reflectedType.initializer());
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType
            .arguments) {
            const classConverter = converter.getConverter(KINDS.CLASS);
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
        const properties = this.resolveProperties(type, converter, true);
        const classType = new Class(type, properties);
        const transformedClassType = this.transformType(classType);
        const transformedProps = transformedClassType.properties;
        this.cacheProperties(type, transformedProps, true);
        return transformedClassType;
    }
    reflect(reflectedType, converter) {
        const type = this.resolveType(reflectedType);
        const properties = this.resolveProperties(type, converter, false);
        const transformedClassType = this.transformType(new Class(type, properties));
        const transformedProps = transformedClassType.properties;
        this.cacheProperties(type, transformedProps, false);
        return transformedProps;
    }
    resolveProperties(type, converter, isConverted) {
        let properties;
        if (this.isCached(type, isConverted)) {
            properties = this.resolveCached(type, isConverted);
        }
        else {
            const reflectedClass = this.reflectClassType(type);
            const parentProperties = this.resolveParentProperties(type, converter, isConverted);
            const objConverter = converter.getConverter(KINDS.OBJECT);
            const classProperties = isConverted
                ? objConverter.convert(reflectedClass, converter)
                : objConverter.reflect(reflectedClass, converter);
            properties = merge(parentProperties, classProperties, {
                isMergeableObject: isPlainRecord,
            });
            properties = isConverted ? new Collection(properties) : properties;
        }
        return properties;
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
        const matcher = (evaluatedProto) => {
            return isDefined(evaluatedProto.constructor);
        };
        const parentProto = getMatchingParentProto(type.prototype, matcher);
        if (parentProto === undefined)
            return {};
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

class FunctionConverter {
    isConvertible(reflectedType) {
        if (reflectedType.kind === 18) {
            const referenceType = reflectedType;
            return referenceType.type === Function && !isClass(referenceType.type);
        }
        return reflectedType.kind === 21;
    }
    convert(reflectedType) {
        return reflectedType ? new InstanceOf(Function) : new InstanceOf(Function);
    }
    reflect(reflectedType) {
        return reflectedType ? Function : Function;
    }
}

class NativeConverter {
    isConvertible(reflectedType) {
        return [1, 11, 14].includes(reflectedType.kind);
    }
    convert(reflectedType) {
        return this.reflect(reflectedType);
    }
    reflect(reflectedType) {
        return NativeConverter.MAPPINGS[reflectedType.kind];
    }
}
NativeConverter.MAPPINGS = {
    1: new Any(),
    11: new Void(),
    14: new Never(),
};

class NilConverter {
    isConvertible(reflectedType) {
        return [12, 13].includes(reflectedType.kind);
    }
    convert(reflectedType) {
        return this.reflect(reflectedType);
    }
    reflect(reflectedType) {
        return NilConverter.MAPPINGS[reflectedType.kind];
    }
}
NilConverter.MAPPINGS = {
    12: undefined,
    13: null,
};

class ObjectConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === 15 && !isSpecial(reflectedType);
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
        if (reflectedType.initializer) {
            pattern.setInitializer(reflectedType.initializer());
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        return this.resolveProperties(reflectedType, converter, false);
    }
    resolveProperties(reflectedType, converter, isConverting) {
        const { properties } = reflectedType;
        const props = {};
        for (const key of Reflect.ownKeys(properties)) {
            const reflectedProp = properties[key];
            if (!isPlainObject(reflectedProp))
                continue;
            const classConverter = converter.getConverter(KINDS.CLASS);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(reflectedProp)) {
                const reflectedRefType = reflectedProp;
                let expectation;
                if (isConverting) {
                    if (isPatternClass(reflectedRefType.type)) {
                        expectation = reflectedRefType.type;
                    }
                    else {
                        expectation = new InstanceOf(reflectedRefType.type);
                    }
                    if (reflectedProp.initializer) {
                        expectation.setInitializer(reflectedProp.initializer());
                    }
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
        return (reflectedType.kind === 15 &&
            reflectedType.name !== undefined &&
            reflectedType.name !== '__type');
    }
}

class PrimitiveConverter {
    isConvertible(reflectedType) {
        return [2, 3, 4, 10].includes(reflectedType.kind);
    }
    convert(reflectedType) {
        const pattern = new InstanceOf(this.reflect(reflectedType));
        if (reflectedType.initializer) {
            pattern.setInitializer(reflectedType.initializer());
        }
        return pattern;
    }
    reflect(reflectedType) {
        return PrimitiveConverter.MAPPINGS[reflectedType.kind];
    }
}
PrimitiveConverter.MAPPINGS = {
    2: String,
    3: Number,
    4: Boolean,
    10: Symbol,
};

class ReferenceConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === 18;
    }
    convert(reflectedType, converter) {
        if (isPlainObject(reflectedType.type)) {
            return new Collection(reflectedType.type);
        }
        if (reflectedType.type === Array && reflectedType.arguments) {
            const arrayConverter = converter.getConverter(KINDS.ARRAY);
            return arrayConverter.convert(reflectedType);
        }
        let pattern;
        if (isPatternClass(reflectedType.type)) {
            pattern = reflectedType.type;
        }
        else {
            pattern = new InstanceOf(reflectedType.type);
        }
        if (reflectedType.initializer) {
            pattern.setInitializer(reflectedType.initializer());
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        if (isPlainObject(reflectedType.type)) {
            return reflectedType.type;
        }
        if (reflectedType.type === Array && reflectedType.arguments) {
            const arrayConverter = converter.getConverter(KINDS.ARRAY);
            return arrayConverter.reflect(reflectedType);
        }
        return reflectedType.type;
    }
}

class TupleConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === 16;
    }
    convert(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType
            .elementTypes) {
            const classConverter = converter.getConverter(KINDS.CLASS);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(arg)) {
                expectations.push(new InstanceOf(arg.type));
            }
            else {
                expectations.push(converter.convert(arg));
            }
        }
        const pattern = new Tuple(...expectations);
        if (reflectedType.initializer) {
            pattern.setInitializer(reflectedType.initializer());
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType
            .elementTypes) {
            const classConverter = converter.getConverter(KINDS.CLASS);
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

class UnionConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === 17;
    }
    convert(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType.types) {
            const classConverter = converter.getConverter(KINDS.CLASS);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(arg)) {
                expectations.push(new InstanceOf(arg.type));
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
        if (reflectedType.initializer) {
            pattern.setInitializer(reflectedType.initializer());
        }
        return pattern;
    }
    reflect(reflectedType, converter) {
        const expectations = [];
        for (const arg of reflectedType.types) {
            const classConverter = converter.getConverter(KINDS.CLASS);
            if (classConverter === null || classConverter === void 0 ? void 0 : classConverter.isConvertible(arg)) {
                expectations.push(arg.type);
            }
            else {
                expectations.push(converter.reflect(arg));
            }
        }
        return expectations.sort();
    }
}

class UnknownConverter {
    isConvertible(reflectedType) {
        return reflectedType.kind === 20;
    }
    convert(reflectedType) {
        return this.reflect(reflectedType);
    }
    reflect(reflectedType) {
        return reflectedType ? new Unknown() : new Unknown();
    }
}

class UnrecognizedConverter {
    isConvertible(reflectedType) {
        return [999].includes(reflectedType.kind);
    }
    convert(reflectedType) {
        return this.reflect(reflectedType);
    }
    reflect(reflectedType) {
        return reflectedType ? new Unrecognized() : new Unrecognized();
    }
}

class LiteralConverter {
    isConvertible(reflectedType) {
        return [5, 6, 7, 8].includes(reflectedType.kind);
    }
    convert(reflectedType) {
        return new Equals(this.reflect(reflectedType));
    }
    reflect(reflectedType) {
        let value;
        if (reflectedType.kind === 7) {
            value = false;
        }
        else if (reflectedType.kind === 8) {
            value = true;
        }
        else {
            value = reflectedType.value;
        }
        return value;
    }
}

class PropsOfConverter {
    isConvertible(reflectedType, converter) {
        if (reflectedType.kind !== 15) {
            return false;
        }
        const validationType = get(reflectedType, `properties.${VALIDATION_TYPE_KEY.toString()}`);
        if ((validationType === null || validationType === void 0 ? void 0 : validationType.value) !== KINDS.PROPERTIES_OF) {
            return false;
        }
        const validationPayload = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(KINDS.CLASS);
        return classConverter.isConvertible(validationPayload, converter);
    }
    convert(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(KINDS.CLASS);
        const classType = classConverter.convert(nestedReflectedType, converter);
        const properties = classType !== undefined ? classType.properties : {};
        return new Collection({ ...properties });
    }
    reflect(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(KINDS.CLASS);
        return classConverter.reflect(nestedReflectedType, converter);
    }
}

class TypeOfConverter {
    isConvertible(reflectedType, converter) {
        if (reflectedType.kind !== 15) {
            return false;
        }
        const validationType = get(reflectedType, `properties.${VALIDATION_TYPE_KEY.toString()}`);
        const validationPayload = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(KINDS.CLASS);
        return ((validationType === null || validationType === void 0 ? void 0 : validationType.value) === KINDS.TYPE_OF &&
            classConverter.isConvertible(validationPayload, converter));
    }
    convert(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(KINDS.CLASS);
        const classType = classConverter.convert(nestedReflectedType, converter);
        return classType;
    }
    reflect(reflectedType, converter) {
        const nestedReflectedType = get(reflectedType, `properties.${VALIDATION_PAYLOAD_KEY.toString()}`);
        const classConverter = converter.getConverter(KINDS.CLASS);
        return classConverter.reflect(nestedReflectedType, converter);
    }
}

class TSRuntimeConverter {
    constructor(typeConverters) {
        this.typeConverters = typeConverters || new Map();
    }
    convert(reflectedType) {
        for (const typeConverter of this.typeConverters.values()) {
            if (typeConverter.isConvertible(reflectedType, this) === true) {
                return typeConverter.convert(reflectedType, this);
            }
        }
        const unknownConverter = this.getConverter(KINDS.UNKNOWN);
        return unknownConverter === null || unknownConverter === void 0 ? void 0 : unknownConverter.convert(reflectedType);
    }
    reflect(reflectedType) {
        for (const typeConverter of this.typeConverters.values()) {
            if (typeConverter.isConvertible(reflectedType, this) === true) {
                return typeConverter.reflect(reflectedType, this);
            }
        }
        const unknownConverter = this.getConverter(KINDS.UNKNOWN);
        return unknownConverter === null || unknownConverter === void 0 ? void 0 : unknownConverter.reflect(reflectedType);
    }
    registerConverter(kind, typeConverter, shouldOverride = false) {
        if (this.hasConverter(kind) && !shouldOverride) {
            throw new TypeConverterExists(kind);
        }
        this.typeConverters.set(kind, typeConverter);
    }
    overrideConverter(kind, converter) {
        this.registerConverter(kind, converter, true);
    }
    getConverter(type) {
        return this.typeConverters.get(type);
    }
    hasConverter(type) {
        return this.typeConverters.has(type);
    }
    removeConverter(type) {
        this.typeConverters.delete(type);
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
            isMergeableObject: isPlainObject,
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
            let validatedValue = value;
            if (processedExpectation.hasInitializer()) {
                validatedValue = processedExpectation.getInitializer();
            }
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
            const describer = this.getDescriber(KINDS.DESCRIPTION_LIST);
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
        let type = KINDS.UNKNOWN;
        if (isArray(arg)) {
            type = KINDS.ARRAY;
        }
        else if (isPlainObject(arg)) {
            type = KINDS.OBJECT;
        }
        else if ((isNativeType(arg) || isNativeTypeInstance(arg)) &&
            !hasTypeName(arg)) {
            type = KINDS.NATIVE;
        }
        else if (isErrorClass(arg) || isErrorInstance(arg)) {
            type = KINDS.ERROR;
        }
        else if (isClass(arg) || isClassInstance(arg)) {
            type = KINDS.CLASS;
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
    [KINDS.NATIVE]: NativeTypeDescriber,
    [KINDS.ERROR]: ErrorDescriber,
    [KINDS.ARRAY]: ArrayDescriber,
    [KINDS.OBJECT]: ObjectDescriber,
    [KINDS.CLASS]: ClassDescriber,
    [KINDS.UNKNOWN]: FallbackDescriber,
    [KINDS.DESCRIPTION_LIST]: DescriptionListDescriber,
};

const KINDS$1 = KINDS;
const describer = new Describer();
describer.setFormatting('default');
const classTransformers = new Map();
classTransformers.set('internal', new InternalPropsTransformer());
classTransformers.set('inject', new InjectingPropsTransformer());
const converter = new TSRuntimeConverter();
converter.registerConverter(KINDS$1.PROPERTIES_OF, new PropsOfConverter());
converter.registerConverter(KINDS$1.TYPE_OF, new TypeOfConverter());
converter.registerConverter(KINDS$1.CLASS, new ClassConverter(classTransformers));
converter.registerConverter(KINDS$1.TUPLE, new TupleConverter());
converter.registerConverter(KINDS$1.UNION, new UnionConverter());
converter.registerConverter(KINDS$1.NATIVE, new NativeConverter());
converter.registerConverter(KINDS$1.NIL, new NilConverter());
converter.registerConverter(KINDS$1.ARRAY, new ArrayConverter());
converter.registerConverter(KINDS$1.FUNCTION, new FunctionConverter());
converter.registerConverter(KINDS$1.OBJECT, new ObjectConverter());
converter.registerConverter(KINDS$1.PRIMITIVE, new PrimitiveConverter());
converter.registerConverter(KINDS$1.REFERENCE, new ReferenceConverter());
converter.registerConverter(KINDS$1.UNKNOWN, new UnknownConverter());
converter.registerConverter(KINDS$1.UNRECOGNIZED, new UnrecognizedConverter());
converter.registerConverter(KINDS$1.LITERAL, new LiteralConverter());
const validator = new Validator();
validator.registerValidator(KINDS$1.ANY, new AnyValidator());
validator.registerValidator(KINDS$1.ARRAY, new ListValidator());
validator.registerValidator(KINDS$1.CLASS, new ClassValidator());
validator.registerValidator(KINDS$1.EQUALS, new EqualsValidator());
validator.registerValidator(KINDS$1.INSTANCE_OF, new InstanceOfValidator());
validator.registerValidator(KINDS$1.INTEGER, new IntegerValidator());
validator.registerValidator(KINDS$1.INTERNAL, new InternalValidator());
validator.registerValidator(KINDS$1.INTERFACE, new InterfaceValidator());
validator.registerValidator(KINDS$1.MAYBE, new MaybeValidator());
validator.registerValidator(KINDS$1.NEVER, new NeverValidator());
validator.registerValidator(KINDS$1.OBJECT, new CollectionValidator());
validator.registerValidator(KINDS$1.OBJECT_INCLUDING, new CollectionIncludingValidator());
validator.registerValidator(KINDS$1.OBJECT_WITHIN, new CollectionWithinValidator());
validator.registerValidator(KINDS$1.ONE_OF, new OneOfValidator());
validator.registerValidator(KINDS$1.OPTIONAL, new OptionalValidator());
validator.registerValidator(KINDS$1.TUPLE, new TupleValidator());
validator.registerValidator(KINDS$1.UNKNOWN, new UnknownValidator());
validator.registerValidator(KINDS$1.UNRECOGNIZED, new UnrecognizedValidator());
validator.registerValidator(KINDS$1.VOID, new VoidValidator());
validator.registerValidator(KINDS$1.WHERE, new WhereValidator());
validator.setOrder([
    KINDS$1.OBJECT_INCLUDING,
    KINDS$1.OBJECT,
    KINDS$1.ARRAY,
    KINDS$1.TUPLE,
    KINDS$1.INSTANCE_OF,
    KINDS$1.CLASS,
    KINDS$1.EQUALS,
]);
const typend = new Typend(converter, describer, validator);
const validate = typend.validate.bind(typend);
const isValid = typend.isValid.bind(typend);
const isInstanceOf = typend.isInstanceOf.bind(typend);
const check = createReflective((reflectedType) => {
    return (value, isStrict) => {
        const expectation = typend.converter.convert(reflectedType);
        return typend.validate(value, expectation, isStrict);
    };
});
const is = createReflective((reflectedType) => {
    return (value, isStrict) => {
        const expectation = typend.converter.convert(reflectedType);
        return typend.isValid(value, expectation, isStrict);
    };
});
const instanceOf = createReflective((reflectedType) => {
    return (value) => {
        const expectation = typend.converter.convert(reflectedType);
        return typend.isInstanceOf(value, expectation);
    };
});
const convert = createReflective((reflectedType) => {
    return () => {
        return typend.converter.convert(reflectedType);
    };
});
const reflect = createReflective((reflectedType) => {
    return () => {
        return typend.converter.reflect(reflectedType);
    };
});
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
    objectOf: (_props) => {
        return new Collection();
    },
    oneOf: (expectations) => {
        return new OneOf(...expectations);
    },
    oneOfType: (expectations) => {
        return new OneOf(...expectations);
    },
    shape(properties) {
        return new Collection(properties);
    },
    string: String,
    symbol: Symbol,
    tuple,
    void: voided,
    where,
};

export { Any, AnyValidator, ArrayConverter, ArrayDescriber, Class, ClassConverter, ClassDescriber, ClassValidator, Collection, CollectionIncluding, CollectionIncludingValidator, CollectionValidator, CollectionWithin, CollectionWithinValidator, CompactDescriber, DebugDescriber, Describer, Description, DescriptionList, DescriptionListDescriber, Equals, EqualsValidator, ErrorDescriber, FallbackDescriber, FunctionConverter, InjectingPropsTransformer, InstanceOf, InstanceOfValidator, Integer, IntegerValidator, Interface, InterfaceValidator, Internal, InternalPropsTransformer, InternalValidator, InvalidDefinitionError, InvalidTypeError, InvalidValueError, literalKeys as LITERAL_KEYS, List, ListValidator, LiteralConverter, metadataKeys as METADATA_KEYS, Maybe, MaybeValidator, NativeConverter, NativeTypeDescriber, Never, NeverValidator, NilConverter, NotAMemberError, ObjectConverter, ObjectDescriber, OneOf, OneOfValidator, Optional, OptionalValidator, Pattern, PatternValidator, PatternValidatorExistError, PatternValidatorNotFoundError, PrimitiveConverter, PropTypes, PropsOf, PropsOfConverter, ReferenceConverter, TSRuntimeConverter, Tuple, TupleConverter, TupleValidator, TypeConverterExists, TypeDescriberExistsError, TypeDescriberNotFoundError, TypeOf, TypeOfConverter, Typend, UndefinableClassError, UnequalValueError, UnexpectedKeyError, UnionConverter, Unknown, UnknownConverter, UnknownError, UnknownValidator, UnmatchedTypeError, Unrecognized, UnrecognizedConverter, UnrecognizedValidator, ValidationError, Validator, Void, VoidValidator, Where, WhereValidator, any, boolean, check, collection, collectionIncluding, collectionWithin, convert, converter, define, describer, eq, getMatchingParentProto, getResolvablePath, instanceOf, Integer as integer, internal, iof, is, isDefined, isInstanceOf, isInstanceOfExpectation, isPattern, isPatternClass, isResolvablePath, isSpecial, isUtility, isValid, isValidable, list, maybe, never, number, oneOf, optional, propsOf, reflect, string, symbol, tuple, typeOf, typend, unknown, unrecognized, validable, validate, validator, voided, where };
