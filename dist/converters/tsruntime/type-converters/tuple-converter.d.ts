import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Tuple } from '../../../patterns/tuple';
export declare class TupleConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): Tuple;
    reflect(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): any[];
}
