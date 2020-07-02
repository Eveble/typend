import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Equals } from '../../../patterns/equals';
export declare class LiteralConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Equals;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): string | number | boolean;
}
