import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
export declare class NilConverter implements types.TypeConverter {
    static MAPPINGS: Record<number, any>;
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): null | undefined;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): null | undefined;
}
