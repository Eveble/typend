import { types } from '../types';
import { Class } from '../patterns/class';
import { Any } from '../patterns/any';
import { WrapperPattern } from '../wrapper-pattern';
export declare class TypeOf extends WrapperPattern implements types.Utility {
    onValidation(type: any): boolean;
    generate(library: types.Library): Class | Any;
}
