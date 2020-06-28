import { KINDS } from './constants/literal-keys';

/* eslint-disable camelcase */
/*
UTILITY TYPES
*/
/*
Custom utility types for... validation! This is experimental and quirky solution for now that mimics notation of native TypeScript's Utility Types.

FALLOW the rules:
1. Use PascalCase with $ prefix for naming of types so they are not mistaken as native build-inTypeScript types:
  Good: $PropsOf, $Range, $Length, $MyValidationType
  Bad: Extract, Omit, MyValidationType, propsOf, range
2. MUST use snake_case for property key.
3. CANNOT use any other characters(?) beside underscore and alphanumeric(?).
4. CANNOT use imported KEYS from other files as symbols or strings do to compilation errors:

import { VALIDATION_TYPE_PROPS_OF_KEY } from './constants/literal-keys';
import { SPECIAL_KEY } from './constants/special_keys';
export type propsOf<T> = {
  [VALIDATION_TYPE_PROPS_OF_KEY]: T;
};

Would result in: ReferenceError: literal_keys_1 is not defined
^ 'literal_keys_1' - this references the name of the file.
*/
export type $PropsOf<T> = {
  __eveble_validation: KINDS.PROPERTIES_OF;
  __eveble_payload: T;
};

export type $TypeOf<T> = {
  __eveble_validation: KINDS.TYPE_OF;
  __eveble_payload: T;
};
