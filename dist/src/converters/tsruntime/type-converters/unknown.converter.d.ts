import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Unknown } from '../../../patterns/unknown';
export declare class UnknownConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Unknown;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): Unknown;
}
