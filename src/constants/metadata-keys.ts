export const DEFINABLE_KEY: unique symbol = Symbol('eveble:flags:definable');

export const PROPERTIES_KEY: unique symbol = Symbol(
  'eveble:containers:definition'
);

export const REFLECTION_KEY: unique symbol = Symbol(
  'eveble:containers:reflection'
);

export const INJECTABLE_PROPERTIES_KEY: unique symbol = Symbol(
  'eveble:containers:injectable-definition'
);

export const INTERNAL_PROPS_KEY: unique symbol = Symbol(
  'eveble:containers:internal:props'
);

export const INTERNAL_METHODS_KEY: unique symbol = Symbol(
  'eveble:containers:internal:methods'
);

export const PATTERN_KEY: unique symbol = Symbol('eveble:pattern-kind');

export const VALIDATION_KEY: unique symbol = Symbol('eveble:flags:validation');

export const VALIDATION_TYPE_PROPS_OF_KEY: '__eveble_validation_type_props_of' =
  '__eveble_validation_type_props_of';

export const INTERFACE_NAME_KEY: unique symbol = Symbol(
  'eveble:interface-name'
);

export const INITIALIZER_KEY: unique symbol = Symbol('eveble:initializer');
