import { types } from '../types';
import { Collection } from '../patterns/collection';
import { WrapperPattern } from '../wrapper-pattern';
export declare class PropsOf extends WrapperPattern implements types.Utility {
    onValidation(type: any): boolean;
    generate(library: types.Library): Collection;
}
