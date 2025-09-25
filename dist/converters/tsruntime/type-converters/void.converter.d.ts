import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Void } from '../../../patterns/void';
export declare class VoidConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Void;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): Void;
}
