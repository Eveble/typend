import ExtendableError from 'es6-error';

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
