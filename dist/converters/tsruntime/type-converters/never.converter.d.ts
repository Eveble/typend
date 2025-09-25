import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Never } from '../../../patterns/never';
export declare class NeverConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Never;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): Never;
}
