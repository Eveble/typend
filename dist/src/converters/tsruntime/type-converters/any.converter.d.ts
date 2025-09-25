import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Any } from '../../../patterns/any';
export declare class AnyConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Any;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): Any;
}
