import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Unrecognized } from '../../../patterns/unrecognized';
export declare class UnrecognizedConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Unrecognized;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): Unrecognized;
}
