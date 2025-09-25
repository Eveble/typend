import ExtendableError from 'es6-error';
import { TypeKind } from './enums/type-kind.enum';
export declare class TypeDescriberExistsError extends ExtendableError {
    constructor(type: string);
}
export declare class TypeDescriberNotFoundError extends ExtendableError {
    constructor(type: string);
}
export declare class InvalidDefinitionError extends ExtendableError {
    constructor(message: string, ...args: string[]);
}
export declare class TypeConverterExists extends TypeError {
    constructor(type: TypeKind);
}
export declare class ValidationError extends ExtendableError {
    constructor(message: string, ...args: string[]);
}
export declare class InvalidTypeError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class InvalidValueError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class UnequalValueError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class UnmatchedTypeError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class NotAMemberError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class UnexpectedKeyError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class UnknownError extends ValidationError {
    constructor(message: string, ...args: string[]);
}
export declare class PatternValidatorExistError extends ExtendableError {
    constructor(type: string);
}
export declare class PatternValidatorNotFoundError extends ExtendableError {
    constructor(type: string);
}
export declare class UndefinableClassError extends ExtendableError {
    constructor(typeName: string);
}
