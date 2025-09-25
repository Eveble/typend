import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { OneOf } from '../../../patterns/one-of';
import { Optional } from '../../../patterns/optional';
export declare class UnionConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): Optional | OneOf;
    reflect(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): any[];
}
