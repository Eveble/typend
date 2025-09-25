import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
export declare class NullConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): null;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): null;
}
