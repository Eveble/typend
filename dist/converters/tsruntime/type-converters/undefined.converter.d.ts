import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
export declare class UndefinedConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): undefined;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): undefined;
}
