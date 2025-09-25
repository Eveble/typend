import { KINDS } from './constants/literal-keys';
export type $PropsOf<T> = {
    __eveble_validation: KINDS.PROPERTIES_OF;
    __eveble_payload: T;
};
export type $TypeOf<T> = {
    __eveble_validation: KINDS.TYPE_OF;
    __eveble_payload: T;
};
