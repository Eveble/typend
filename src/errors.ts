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
