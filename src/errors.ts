import ExtendableError from 'es6-error';
import { format } from 'util';

export class TypeDescriberExistsError extends ExtendableError {
  constructor(type: string) {
    super(`Describer for type '${type}' would be overwritten. To
    override existing describer use 'Describer::overrideDescriber'`);
  }
}

export class TypeDescriberNotFoundError extends ExtendableError {
  constructor(type: string) {
    super(`Describer for type '${type}' can't be found`);
  }
}

export class InvalidDefinitionError extends ExtendableError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class InvalidTypeError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class TypeConverterExists extends TypeError {
  constructor(type: string) {
    super(`Converter for type '${type}' is already registered`);
  }
}

export class ValidationError extends ExtendableError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class InvalidValueError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class UnequalValueError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class UnmatchedTypeError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class NotAMemberError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class UnexpectedKeyError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}

export class UnknownError extends ValidationError {
  constructor(message: string, ...args: string[]) {
    super(format(message, ...args));
  }
}
export class UndefinableClassError extends ExtendableError {
  constructor(typeName) {
    super(
      `${typeName}: provided argument must be a class that implements '@define()' decorator`
    );
  }
}

